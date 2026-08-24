// ============================================================
// m2-extended.spec.ts —— M2 扩展能力单测
// ============================================================
// 覆盖：
// - 周起始可配置（mondayOf 支持 sunday，周界随之变化）；
// - 分类配置驱动（matrixCells 自定义分类、导出标题用配置 label、categoryLabel）；
// - 「期望支持」闭环（createTask/updateTask 落库、导出后缀（已解决））；
// - workbench-meta 扩展（weekStart/categories/reminder 校验、增删改、旧数据兼容）；
// - 日报提醒（nextRunAtMs 计算今日触发时刻）。
import { describe, expect, it } from 'vitest'
import {
  mondayOf, matrixCells, dayReportMarkdown, weekReportMarkdown, weekDays, toDateKey, categoryLabel,
} from '../src/core/matrix.ts'
import { nextRunAtMs, isValidCron } from '../src/core/schedule.ts'
import {
  createTask, type TaskRecord as TR,
} from '../src/core/tasks.ts'
import { applyUpdateTask } from '../src/core/use-cases/task-update.ts'
import {
  addCategory, categoriesOf, categoryLabelOf, emptyWorkbenchMeta, isWorkbenchMeta, markReminderTriggered,
  removeCategory, setReminder, setWeekStart, weekStartOf,
} from '../src/core/workbench-meta.ts'

/** 造一条任务；第二个可选参数合并进任务字段（如 category/reportDate/supportStatus） */
function task(partial: Partial<TR> & { id: string; title: string }, extra?: Record<string, unknown>): TR {
  return {
    description: '',
    prompt: '',
    status: 'todo',
    createdAt: 0,
    updatedAt: 0,
    executions: [],
    ...partial,
    ...extra,
  } as TR
}

describe('M2 · 周起始可配置', () => {
  it('weekly boundary follows weekStart', () => {
    // 2018-08-20 是周一；2018-08-26 是周日
    const mon = mondayOf(new Date(2018, 7, 22), 'monday')
    expect(toDateKey(mon)).toBe('2018-08-20')
    const sun = mondayOf(new Date(2018, 7, 22), 'sunday')
    expect(toDateKey(sun)).toBe('2018-08-19')
    // 周日起始的周 = 周日~周六
    expect(weekDays(sun)).toEqual([
      '2018-08-19', '2018-08-20', '2018-08-21', '2018-08-22',
      '2018-08-23', '2018-08-24', '2018-08-25',
    ])
  })

  it('matrix cells follow weekStart', () => {
    const sundayStart = mondayOf(new Date(2018, 7, 22), 'sunday')
    const tasks = [
      task({ id: 'a', title: '周日任务' }, { category: 'business', reportDate: '2018-08-19', status: 'done' }),
      task({ id: 'b', title: '周六任务' }, { category: 'business', reportDate: '2018-08-25', status: 'done' }),
    ]
    const cells = matrixCells(tasks, sundayStart)
    const found = cells.filter(cell => cell.category === 'business' && cell.tasks.length > 0)
    expect(found.map(c => c.date)).toEqual(['2018-08-19', '2018-08-25'])
  })

  it('workbench-meta weekStart preference round-trips', () => {
    const a = setWeekStart(emptyWorkbenchMeta(0), 'sunday', 100)
    expect(weekStartOf(a)).toBe('sunday')
    expect(isWorkbenchMeta(a)).toBe(true)
    expect(weekStartOf(emptyWorkbenchMeta(0))).toBe('monday') // 缺省兼容 M1
  })
})

describe('M2 · 分类配置驱动', () => {
  const cats = [
    { id: 'business', label: '业务/技术需求' },
    { id: 'ops', label: '运维类' },
    { id: 'collab', label: '协同支持' }, // 自定义分类
  ] as const

  it('matrixCells includes custom categories only', () => {
    const start = mondayOf(new Date(2018, 7, 20))
    const tasks = [
      task({ id: 'a', title: '业务A' }, { category: 'business', reportDate: '2018-08-20' }),
      task({ id: 'b', title: '协同B' }, { category: 'collab', reportDate: '2018-08-20' }),
      task({ id: 'c', title: '管理C' }, { category: 'management', reportDate: '2018-08-20' }), // 不在配置里
    ]
    const cells = matrixCells(tasks, start, cats)
    const catIds = new Set(cells.map(cell => cell.category))
    expect(catIds).toEqual(new Set(['business', 'ops', 'collab'])) // management 不出现
    const collab = cells.find(cell => cell.category === 'collab' && cell.date === '2018-08-20')
    expect(collab?.tasks.map(t => t.id)).toEqual(['b'])
  })

  it('dayReport/weekReport use configured labels and skip missing categories', () => {
    const start = mondayOf(new Date(2018, 7, 20))
    const tasks = [
      task({ id: 'a', title: '业务A' }, { category: 'business', reportDate: '2018-08-20', status: 'done' }),
      task({ id: 'b', title: '协同B' }, { category: 'collab', reportDate: '2018-08-20', status: 'done' }),
    ]
    const day = dayReportMarkdown(tasks, '2018-08-20', cats)
    expect(day).toContain('## 协同支持')
    expect(day).toContain('- 协同B')
    const week = weekReportMarkdown(tasks, start, cats)
    expect(week).not.toContain('## 综合管理类')
    expect(week).toContain('## 协同支持')
  })

  it('categoryLabel falls back to configured label else id', () => {
    expect(categoryLabel('collab', cats)).toBe('协同支持')
    expect(categoryLabel('ghost', cats)).toBe('ghost')
    expect(categoryLabel('business')).toBe('业务/技术需求')
  })

  it('workbench-meta category management', () => {
    const meta = emptyWorkbenchMeta(0)
    expect(categoriesOf(meta).map(c => c.id)).toEqual(['business', 'ops', 'management', 'support'])
    const added = addCategory(meta, { id: 'collab', label: '协同' }, 100)
    expect(categoriesOf(added).map(c => c.id)).toContain('collab')
    expect(categoryLabelOf(added, 'collab')).toBe('协同')
    const dup = addCategory(added, { id: 'collab', label: '重复' }, 100)
    expect(categoriesOf(dup).length).toBe(5)
    const removed = removeCategory(dup, 'ops', 200)
    expect(categoriesOf(removed).map(c => c.id)).not.toContain('ops')
    expect(isWorkbenchMeta(removed)).toBe(true)
  })

  it('rejects malformed category configs', () => {
    expect(isWorkbenchMeta({ dayDoneAt: {}, updatedAt: 1, categories: 'bad' })).toBe(false)
    expect(isWorkbenchMeta({ dayDoneAt: {}, updatedAt: 1, categories: [{ id: 'a' }] })).toBe(false) // 缺 label
  })
})

describe('M2 · 期望支持闭环', () => {

  it('createTask stores supportStatus for support tasks', () => {
    const created = createTask({
      title: '要 X 组权限', description: '', prompt: '',
      category: 'support', supportStatus: 'pending',
    }, 100, 's1')
    expect(created.supportStatus).toBe('pending')
    expect(createTask({ title: 't', description: '', prompt: '' }, 100, 's2').supportStatus).toBeUndefined()
  })

  it('applyUpdateTask advances supportStatus', () => {
    const tasks = [task({ id: 's', title: 'x' }, { category: 'support', supportStatus: 'pending' })]
    const next = applyUpdateTask(tasks, 's', { supportStatus: 'resolved' }, 200)
    expect(next[0]!.supportStatus).toBe('resolved')
    expect(next[0]!.updatedAt).toBe(200)
  })

  it('export marks resolved support tasks as （已解决）', () => {
    const tasks = [
      task({ id: 'a', title: '做完的支持' }, { category: 'support', reportDate: '2018-08-20', status: 'todo', supportStatus: 'resolved' }),
      task({ id: 'b', title: '待响应支持' }, { category: 'support', reportDate: '2018-08-20', status: 'todo', supportStatus: 'pending' }),
    ]
    const md = dayReportMarkdown(tasks, '2018-08-20')
    expect(md).toContain('- 做完的支持（已解决）')
    expect(md).toContain('- 待响应支持（支持中）')
  })
})

describe('M2 · 日报提醒', () => {
  it('validates cron and computes today trigger', () => {
    expect(isValidCron('0 21 * * *')).toBe(true)
    expect(isValidCron('bad')).toBe(false)
    // 从今日 00:00 起算 21:00 的触发时刻
    const from = new Date(2018, 7, 20, 0, 0, 0)
    const next = nextRunAtMs('0 21 * * *', from.getTime())
    const dt = next === undefined ? null : new Date(next)
    expect(dt?.getDate()).toBe(20)
    expect(dt?.getHours()).toBe(21)
    expect(dt?.getMinutes()).toBe(0)
  })

  it('workbench-meta reminder config and trigger bookkeeping', () => {
    const meta = emptyWorkbenchMeta(0)
    const on = setReminder(meta, { enabled: true, cron: '0 21 * * *' }, 100)
    expect(on.reminder).toEqual({ enabled: true, cron: '0 21 * * *', lastTriggeredAt: undefined })
    const off = setReminder(on, { enabled: false }, 200)
    expect(off.reminder?.enabled).toBe(false)
    expect(off.reminder?.cron).toBe('0 21 * * *') // cron 保留
    const triggered = markReminderTriggered(on, 300)
    expect(triggered.reminder?.lastTriggeredAt).toBe(300)
    expect(isWorkbenchMeta(triggered)).toBe(true)
    expect(isWorkbenchMeta({ dayDoneAt: {}, updatedAt: 1, reminder: { enabled: 'x', cron: 'a' } })).toBe(false)
  })
})