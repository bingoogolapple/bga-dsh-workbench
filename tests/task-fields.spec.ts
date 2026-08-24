// ============================================================
// task-fields.spec.ts —— 任务新字段（kind/category/dueDate/reportDate/priority）
// ============================================================
// 覆盖：createTask 规范化、applyUpdateTask 新字段更新与合法性回退。
import { describe, expect, it } from 'vitest'
import { createTask, isDateString, isTaskRecord, normalizeCategory, normalizeDate, normalizePriority, type NewTaskInput } from '../src/core/tasks.ts'
import { applyUpdateTask } from '../src/core/use-cases/task-update.ts'

function make(id: string, input: Partial<NewTaskInput> = {}) {
  const task = createTask({ title: `t-${id}`, description: '', prompt: '', ...input }, 100, id)
  expect(task).toBeDefined()
  return task!
}

describe('createTask 新字段', () => {
  it('写入合法字段并 trim 文本', () => {
    const task = make('a', {
      title: ' 需求A ',
      kind: 'todo',
      category: 'business',
      dueDate: '2018-08-20',
      reportDate: '2018-08-21',
      priority: 'high',
    })
    expect(task.title).toBe('需求A')
    expect(task.kind).toBe('todo')
    expect(task.category).toBe('business')
    expect(task.dueDate).toBe('2018-08-20')
    expect(task.reportDate).toBe('2018-08-21')
    expect(task.priority).toBe('high')
  })

  it('非法字段回落 undefined（缺省不写坏数据）；分类为自由 id 时合法保留', () => {
    const task = make('b', {
      kind: 'bogus' as never,
      category: 'custom-collab', // 分类自定义：任意非空字符串 id 合法
      dueDate: '2018-13-99',
      reportDate: 'not-a-date',
      priority: 'bogus' as never,
    })
    expect(task.kind).toBeUndefined()
    expect(task.category).toBe('custom-collab')
    expect(task.dueDate).toBeUndefined()
    expect(task.reportDate).toBeUndefined()
    expect(task.priority).toBeUndefined()
  })

  it('未提供字段时值为 undefined（字段存在，值为空）', () => {
    const task = make('c')
    expect(task.kind).toBeUndefined()
    expect(task.category).toBeUndefined()
    expect(task.priority).toBeUndefined()
    expect(task.dueDate).toBeUndefined()
    expect(task.reportDate).toBeUndefined()
  })
})

describe('applyUpdateTask 新字段', () => {
  it('合法更新', () => {
    const tasks = [make('a')]
    const next = applyUpdateTask(tasks, 'a', { category: 'ops', priority: 'low', reportDate: '2018-08-20' }, 200)
    expect(next[0]!.category).toBe('ops')
    expect(next[0]!.priority).toBe('low')
    expect(next[0]!.reportDate).toBe('2018-08-20')
    expect(next[0]!.updatedAt).toBe(200)
  })

  it('非法值回退默认（kind 保留原值、文字类回落 undefined）', () => {
    const tasks = [make('a', { kind: 'task' })]
    const next = applyUpdateTask(tasks, 'a', {
      kind: 'bogus' as never,
      category: 'bogus' as never,
      priority: 'bogus' as never,
    }, 200)
    expect(next[0]!.kind).toBe('task') // 保留原值
    expect(next[0]!.category).toBe('bogus') // 分类是自由 id，任意非空字符串合法
    expect(next[0]!.priority).toBeUndefined()
  })

  it('文案字段 trim，标题 trim 后为空则保留原值', () => {
    const tasks = [make('a', { title: '原标题', description: ' 原描述 ', prompt: ' 原prompt ' })]
    const next = applyUpdateTask(tasks, 'a', {
      title: '  新标题  ',
      description: '  新描述  ',
      prompt: '  新prompt  ',
    }, 200)
    expect(next[0]!.title).toBe('新标题')
    expect(next[0]!.description).toBe('新描述')
    expect(next[0]!.prompt).toBe('新prompt')
    // 空标题不被接受（保留原标题）
    const emptied = applyUpdateTask(tasks, 'a', { title: '   ' }, 300)
    expect(emptied[0]!.title).toBe('原标题')
  })

  it('目标 ID 更新时 trim，空白视为解除钉住', () => {
    const tasks = [make('a', { workspaceId: 'ws1' })]
    const next = applyUpdateTask(tasks, 'a', { workspaceId: '  ws2  ', mode: '  ' }, 200)
    expect(next[0]!.workspaceId).toBe('ws2')
    expect(next[0]!.mode).toBeUndefined()
  })

  it('显式置空（空串 category 不走合法校验）——用于「改回未分类」', () => {
    const tasks = [make('a', { category: 'business' })]
    const next = applyUpdateTask(tasks, 'a', { category: undefined }, 200)
    expect(next[0]!.category).toBeUndefined()
  })
})

describe('isDateString / normalize 校验器', () => {
  it('合法日期通过，非法拒绝', () => {
    expect(isDateString('2018-08-20')).toBe(true)
    expect(isDateString('2018-02-29')).toBe(false) // 非闰年
    expect(isDateString('2018-13-01')).toBe(false) // 月越界
    expect(isDateString('2018-08')).toBe(false)
    expect(isDateString(123)).toBe(false)
  })

  it('normalize 系列', () => {
    expect(normalizeCategory('support')).toBe('support')
    expect(normalizeCategory('nope')).toBe('nope') // 分类自定义：任意非空字符串 id 合法
    expect(normalizePriority('high')).toBe('high')
    expect(normalizePriority('nope')).toBeUndefined()
    expect(normalizeDate('2018-08-20')).toBe('2018-08-20')
    expect(normalizeDate('bad')).toBeUndefined()
  })
})

describe('isTaskRecord 结构校验', () => {
  it('接受结构合法的任务记录', () => {
    expect(isTaskRecord(make('a'))).toBe(true)
    expect(isTaskRecord(make('b', { description: 'x', prompt: 'y', status: 'done', priority: 'high' }))).toBe(true)
  })

  it('拒绝结构非法的载荷（读取 tasks.json 容错）', () => {
    expect(isTaskRecord(null)).toBe(false)
    expect(isTaskRecord('x')).toBe(false)
    expect(isTaskRecord({ id: 1, title: 'x' })).toBe(false) // id 非字符串
    expect(isTaskRecord({ id: 'a', title: 42 })).toBe(false) // title 非字符串
    expect(isTaskRecord({ ...make('a'), status: 'bogus' })).toBe(false) // 非法状态
    expect(isTaskRecord({ ...make('a'), executions: 'bad' })).toBe(false) // executions 非数组
  })
})