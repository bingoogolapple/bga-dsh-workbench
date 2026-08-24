// ============================================================
// matrix.spec.ts —— 周矩阵领域纯函数测试
// ============================================================
// 覆盖：周界计算（周一~周日）、矩阵单元格派生、列头三态、
// 任务排序、勾选状态机、单日/周报 Markdown 导出。
import { describe, expect, it } from 'vitest'
import {
  addWeeks, byPriorityThenCreatedAt, canToggleDone, dayReportMarkdown, dayStatus,
  matrixCells, mondayOf, shortDate, toDateKey, toPlainReport, toggleDoneStatus, weekDays, weekdayName, weekReportMarkdown,
} from '../src/core/matrix.ts'
import type { TaskRecord } from '../src/core/tasks.ts'

/** 造一条最小任务 */
function task(partial: Partial<TaskRecord> & { id: string; title: string }, over: Partial<TaskRecord> = {}): TaskRecord {
  return {
    id: partial.id,
    title: partial.title,
    description: '',
    prompt: '',
    status: 'todo',
    createdAt: 0,
    updatedAt: 0,
    executions: [],
    ...partial,
    ...over,
  }
}

describe('mondayOf / weekDays（周一为周起始）', () => {
  it('2018-08-20 是周一，返回自身', () => {
    const monday = mondayOf(new Date(2018, 7, 20)) // 2018-08-20 周一
    expect(toDateKey(monday)).toBe('2018-08-20')
  })

  it('2018-08-22（周三）所在周的周一为 2018-08-20', () => {
    const monday = mondayOf(new Date(2018, 7, 22))
    expect(toDateKey(monday)).toBe('2018-08-20')
  })

  it('周日 2018-08-26 归一化到本周一（周一为起始）', () => {
    const monday = mondayOf(new Date(2018, 7, 26)) // 周日
    expect(toDateKey(monday)).toBe('2018-08-20')
  })

  it('跨月：2018-09-01（周六）所在周周一为 2018-08-27', () => {
    const monday = mondayOf(new Date(2018, 8, 1))
    expect(toDateKey(monday)).toBe('2018-08-27')
  })

  it('weekDays 返回周一~周日七天的 yyyy-mm-dd', () => {
    const monday = new Date(2018, 7, 20)
    expect(weekDays(monday)).toEqual([
      '2018-08-20', '2018-08-21', '2018-08-22', '2018-08-23',
      '2018-08-24', '2018-08-25', '2018-08-26',
    ])
  })

  it('addWeeks 正负推周', () => {
    const monday = new Date(2018, 7, 20)
    expect(toDateKey(addWeeks(monday, 1))).toBe('2018-08-27')
    expect(toDateKey(addWeeks(monday, -1))).toBe('2018-08-13')
  })
})

describe('matrixCells 单元格派生', () => {
  const monday = new Date(2018, 7, 20) // 本周周一
  const inWeek: TaskRecord = task({ id: 'a', title: '需求A' }, { category: 'business', reportDate: '2018-08-20' })
  const nextWeek: TaskRecord = task({ id: 'b', title: '未来任务' }, { category: 'ops', reportDate: '2018-08-27' })
  const noCategory: TaskRecord = task({ id: 'c', title: '未分类' }, { reportDate: '2018-08-20' })
  const archived: TaskRecord = task({ id: 'd', title: '已归档' }, { category: 'business', reportDate: '2018-08-21', archivedAt: 1 })

  it('只取 本周 + 有分类 + 未归档 的任务，按分类×天落格', () => {
    const cells = matrixCells([inWeek, nextWeek, noCategory, archived], monday)
    // 4 分类 × 7 天 = 28 个单元格
    expect(cells).toHaveLength(28)
    const businessMon = cells.find(cell => cell.category === 'business' && cell.date === '2018-08-20')
    // 下周的任务不进本周矩阵（单元格只覆盖本周 7 天，且任务不落格）
    expect(cells.some(cell => cell.date === '2018-08-27')).toBe(false)
    expect(businessMon?.tasks.map(t => t.id)).toEqual(['a'])
    const businessTue = cells.find(cell => cell.category === 'business' && cell.date === '2018-08-21')
    expect(businessTue?.tasks).toEqual([]) // 归档任务不出现
  })
})

describe('dayStatus 列头三态（D5 规则）', () => {
  const monday = new Date(2018, 7, 20)
  const doneTask: TaskRecord = task({ id: 'd1', title: 'done' }, { status: 'done', category: 'business', reportDate: '2018-08-20' })
  const todoTask: TaskRecord = task({ id: 't1', title: 'todo' }, { status: 'todo', category: 'business', reportDate: '2018-08-20' })

  it('无任务 → empty', () => {
    expect(dayStatus([], '2018-08-21', {})).toBe('empty')
  })

  it('有任务但未全 done → draft（即使已打卡也算填写中）', () => {
    expect(dayStatus([doneTask, todoTask], '2018-08-20', { '2018-08-20': 1 })).toBe('draft')
  })

  it('全 done 但未打卡 → draft', () => {
    expect(dayStatus([doneTask], '2018-08-20', {})).toBe('draft')
  })

  it('全 done 且已打卡 → done', () => {
    expect(dayStatus([doneTask], '2018-08-20', { '2018-08-20': 1 })).toBe('done')
  })

  it('其他分类的任务不影响本分类天的状态（同天两分类）', () => {
    expect(dayStatus([doneTask, task({ id: 'o1', title: 'ops' }, { status: 'todo', category: 'ops', reportDate: '2018-08-20' })], '2018-08-20', { '2018-08-20': 1 })).toBe('draft')
  })

  // 完整性：mondayOf / weekDays 在边缘（1 月 1 日）不抛错
  it('1 月 1 日（可能跨年）所在周仍归一', () => {
    const monday = mondayOf(new Date(2019, 0, 1))
    expect(weekDays(monday)).toHaveLength(7)
    expect(dayStatus([], '2019-01-01', {})).toBe('empty')
  })
})

describe('byPriorityThenCreatedAt 排序', () => {
  it('高 → 中 → 低，同优先级按创建时间（undefined 视为中）', () => {
    const high = task({ id: 'h', title: 'h' }, { priority: 'high', createdAt: 10 })
    const low = task({ id: 'l', title: 'l' }, { priority: 'low', createdAt: 5 })
    const med = task({ id: 'm', title: 'm' }, { priority: 'medium', createdAt: 30 })
    const none = task({ id: 'n', title: 'n' }, { createdAt: 1 })
    const sorted = [low, none, high, med].sort(byPriorityThenCreatedAt)
    // high → (medium 组里 n 先于 m，按 createdAt) → low
    expect(sorted.map(t => t.id)).toEqual(['h', 'n', 'm', 'l'])
  })
})

describe('toggleDoneStatus / canToggleDone 勾选状态机', () => {
  it('done → todo（取消）；todo/backlog/failed → done', () => {
    expect(toggleDoneStatus(task({ id: 'a', title: 'a' }, { status: 'done' }))).toBe('todo')
    expect(toggleDoneStatus(task({ id: 'b', title: 'b' }, { status: 'todo' }))).toBe('done')
    expect(toggleDoneStatus(task({ id: 'c', title: 'c' }, { status: 'failed' }))).toBe('done')
  })

  it('running 不可勾选', () => {
    expect(canToggleDone(task({ id: 'r', title: 'r' }, { status: 'running' }))).toBe(false)
    expect(canToggleDone(task({ id: 'd', title: 'd' }, { status: 'done' }))).toBe(true)
  })
})

describe('Markdown 导出', () => {
  const monday = new Date(2018, 7, 20)
  const tasks: TaskRecord[] = [
    task({ id: '1', title: '需求A方案' }, { category: 'business', reportDate: '2018-08-20', status: 'done' }),
    task({ id: '2', title: '修复登录bug' }, { category: 'business', reportDate: '2018-08-21', status: 'done' }),
    task({ id: '3', title: '发布 v2.3' }, { category: 'ops', reportDate: '2018-08-20', status: 'done' }),
    task({ id: '4', title: '周会纪要' }, { category: 'management', reportDate: '2018-08-20', status: 'done' }),
    task({ id: '5', title: '埋点报表权限' }, { category: 'support', reportDate: '2018-08-20', status: 'todo' }),
  ]

  it('单日日报：四类分组，support 未完成带（支持中）', () => {
    const md = dayReportMarkdown(tasks, '2018-08-20')
    expect(md).toContain('# 日报 2018-08-20（周一）')
    expect(md).toContain('## 业务/技术需求')
    expect(md).toContain('- 需求A方案')
    expect(md).toContain('## 运维类')
    expect(md).toContain('- 发布 v2.3')
    expect(md).toContain('## 综合管理类')
    expect(md).toContain('- 周会纪要')
    expect(md).toContain('## 期望得到的支持')
    expect(md).toContain('- 埋点报表权限（支持中）')
    // 8.21 的任务不应出现在 8.20 的单日日报
    expect(md).not.toContain('修复登录bug')
  })

  it('本周周报：按四类聚合，条目带日期标注', () => {
    const md = weekReportMarkdown(tasks, monday)
    expect(md).toContain('# 周报 2018-08-20 ~ 08-26')
    expect(md).toContain('## 业务/技术需求')
    expect(md).toContain('- 需求A方案 (8.20)')
    expect(md).toContain('- 修复登录bug (8.21)')
    expect(md).toContain('## 运维类')
    expect(md).toContain('- 发布 v2.3 (8.20)')
    expect(md).toContain('## 期望得到的支持')
    expect(md).toContain('- 埋点报表权限（支持中）(8.20)')
  })

  it('整周无任务 → 输出占位文案', () => {
    expect(weekReportMarkdown([], monday)).toContain('本周无日报条目')
    expect(dayReportMarkdown([], '2018-08-20')).toContain('本周无日报条目')
  })

  it('weekdayName / shortDate 工具', () => {
    expect(weekdayName('2018-08-20')).toBe('周一')
    expect(weekdayName('2018-08-26')).toBe('周日')
    expect(shortDate('2018-08-20')).toBe('8.20')
    expect(shortDate('bad')).toBe('bad')
    expect(shortDate('2018-08')).toBe('2018-08')
    expect(shortDate('x-y-z')).toBe('x-y-z')
  })

  it('toPlainReport：去掉 #/- 标记保留正文（复制纯文本）', () => {
    const plain = toPlainReport(weekReportMarkdown(tasks, monday))
    expect(plain).toContain('周报 2018-08-20 ~ 08-26')
    expect(plain).toContain('业务/技术需求')
    expect(plain).toContain('需求A方案 (8.20)')
    expect(plain).not.toContain('# 周报')
    expect(plain).not.toContain('## 业务')
    expect(plain).not.toContain('- 需求A方案')
  })
})