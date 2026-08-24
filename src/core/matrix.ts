/**
 * 周矩阵领域纯函数。
 *
 * 将任务列表按「日报分类 × 自然周」切分为矩阵单元格（分类配置与周起始
 * 均可配置，缺省兼容 M1：内置四类、周一为一周起始），并派生列头三态
 * （未填写/填写中/已完成）与周/日日报的 Markdown 导出文本。
 * 全部为不依赖运行时的纯函数，供 UI 与测试复用。
 */
import type { CategoryDef, WeekStart } from './workbench-meta.ts'
import { DEFAULT_CATEGORIES } from './workbench-meta.ts'
import type { TaskRecord } from './tasks.ts'

/** 一周 7 天的日期 key（yyyy-mm-dd），按起始日~下一起始日前一天顺序 */
export const WEEKDAY_OFFSETS = [0, 1, 2, 3, 4, 5, 6] as const

/** 生成 yyyy-mm-dd 字符串（本地时区，不补 UTC 偏移） */
export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** 从 yyyy-mm-dd 解析回本地日期（避免 UTC 解析产生时区偏移） */
export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(part => Number(part))
  return new Date(year, month - 1, day)
}

/**
 * 计算某个日期所在周的起始日（周一或周日，由 weekStart 指定；缺省周一）。
 * @param date 本地日期
 * @param weekStart 周起始（缺省 'monday'，兼容 M1）
 * @returns 该周的起始日（本地日期）
 */
export function mondayOf(date: Date, weekStart: WeekStart = 'monday'): Date {
  // getDay(): 0=周日 … 6=周六；monday: 转成「周一=0」偏移；sunday: 「周日=0」偏移
  const offset = weekStart === 'sunday' ? date.getDay() : (date.getDay() + 6) % 7
  const start = new Date(date)
  start.setDate(date.getDate() - offset)
  start.setHours(0, 0, 0, 0)
  return start
}

/** 返回起始日所在周的 7 天日期 key（起始日~下一起始日前一天） */
export function weekDays(start: Date): string[] {
  return WEEKDAY_OFFSETS.map(offset => {
    const day = new Date(start)
    day.setDate(start.getDate() + offset)
    return toDateKey(day)
  })
}

/** 加减 N 周的日期（N 可为负） */
export function addWeeks(date: Date, weeks: number): Date {
  const next = new Date(date)
  next.setDate(date.getDate() + weeks * 7)
  return next
}

/** 日历矩阵单元格：某分类在某天的任务集合 */
export interface MatrixCell {
  category: string
  date: string
  tasks: TaskRecord[]
}

/** 列头三态 */
export type DayStatus = 'empty' | 'draft' | 'done'

/** 读取生效的分类定义列表（缺省内置四类） */
export function categoriesOf(categories?: readonly CategoryDef[]): readonly CategoryDef[] {
  return categories !== undefined && categories.length > 0 ? categories : DEFAULT_CATEGORIES
}

/**
 * 派生本周矩阵：返回「分类 × 7 天」的全部单元格（过滤未归档任务）。
 * 分类集合由 categories 决定（缺省内置四类）。
 * 注：当前 MatrixView 使用等价的逐格 filter（需叠加搜索过滤），本函数保留为
 * 规范化领域逻辑与测试基准，供未来按需复用，并非无意遗留的死代码。
 */
export function matrixCells(
  tasks: readonly TaskRecord[],
  start: Date,
  categories?: readonly CategoryDef[],
): MatrixCell[] {
  const days = weekDays(start)
  const daySet = new Set(days)
  const defs = categoriesOf(categories)
  const cells: MatrixCell[] = []
  for (const def of defs) {
    for (const date of days) {
      cells.push({
        category: def.id,
        date,
        tasks: tasks
          .filter(task =>
            task.archivedAt === undefined
            && task.category === def.id
            && task.reportDate !== undefined
            && daySet.has(task.reportDate)
            && task.reportDate === date,
          )
          .sort(byPriorityThenCreatedAt),
      })
    }
  }
  return cells
}

/** 单元格内任务排序：优先级 high→low，再按创建时间升序 */
export function byPriorityThenCreatedAt(a: TaskRecord, b: TaskRecord): number {
  const rank = (p: string | undefined): number => {
    if (p === 'high') return 0
    if (p === 'medium') return 1
    if (p === 'low') return 2
    return 1 // undefined 视为 medium
  }
  const diff = rank(a.priority) - rank(b.priority)
  if (diff !== 0) return diff
  return a.createdAt - b.createdAt
}

/** 取某天的全部矩阵任务（未归档、reportDate=date，且带分类） */
export function tasksOfDay(
  tasks: readonly TaskRecord[],
  date: string,
): TaskRecord[] {
  return tasks.filter(task =>
    task.archivedAt === undefined
    && task.reportDate === date
    && task.category !== undefined,
  )
}

/**
 * 派生某天列头的三态：
 * - empty：当天没有任何任务（未填写）
 * - done：当天所有任务均为 done **且** dayDoneAt 已打卡
 * - draft：其余（有任务但未全 done / 或未打卡）——填写中
 */
export function dayStatus(
  tasks: readonly TaskRecord[],
  date: string,
  dayDoneAt: Readonly<Record<string, number>>,
): DayStatus {
  const dayTasks = tasksOfDay(tasks, date)
  if (dayTasks.length === 0) return 'empty'
  const allDone = dayTasks.every(task => task.status === 'done')
  const marked = dayDoneAt[date] !== undefined
  if (allDone && marked) return 'done'
  return 'draft'
}

/** 是否为可勾选完成的状态（todo/backlog/failed 可勾为 done；done 可取消） */
export function canToggleDone(task: TaskRecord): boolean {
  return task.status !== 'running'
}

/** 勾选后的目标状态：done → todo（取消）；其余 → done */
export function toggleDoneStatus(task: TaskRecord): 'todo' | 'done' {
  return task.status === 'done' ? 'todo' : 'done'
}

/** 生成日期中文标签：8.18 */
export function shortDate(dateKey: string): string {
  const parts = dateKey.split('-')
  if (parts.length !== 3) return dateKey
  const month = Number(parts[1])
  const day = Number(parts[2])
  if (!Number.isInteger(month) || !Number.isInteger(day)) return dateKey
  return `${month}.${day}`
}

/** 取某分类某天任务（供单日日报/周报使用） */
function categoryTasksOnDay(
  tasks: readonly TaskRecord[],
  category: string,
  date: string,
): TaskRecord[] {
  return tasks.filter(task =>
    task.category === category
    && task.reportDate === date
    && task.archivedAt === undefined,
  )
}

/**
 * 生成单日日报 Markdown（§PRD 6 模板）。
 * @param categories 分类定义（缺省内置四类）
 */
export function dayReportMarkdown(
  tasks: readonly TaskRecord[],
  date: string,
  categories?: readonly CategoryDef[],
): string {
  const weekday = weekdayName(date)
  const lines: string[] = [`# 日报 ${date}（${weekday}）`, '']
  for (const def of categoriesOf(categories)) {
    const items = categoryTasksOnDay(tasks, def.id, date)
    if (items.length === 0) continue
    lines.push(`## ${def.label}`, '')
    for (const task of items) {
      lines.push(`- ${task.title}${supportSuffix(task)}`)
    }
    lines.push('')
  }
  if (lines.length <= 2) lines.push('本周无日报条目')
  return lines.join('\n').trimEnd() + '\n'
}

/**
 * 生成本周日报 Markdown：按分类聚合 7 天，条目保留日期标注。
 * @param categories 分类定义（缺省内置四类）
 */
export function weekReportMarkdown(
  tasks: readonly TaskRecord[],
  start: Date,
  categories?: readonly CategoryDef[],
): string {
  const days = weekDays(start)
  const lines: string[] = [`# 周报 ${days[0]} ~ ${days[6]!.slice(5)}`, '']
  let total = 0
  for (const def of categoriesOf(categories)) {
    const items: TaskRecord[] = []
    for (const date of days) {
      for (const task of categoryTasksOnDay(tasks, def.id, date)) {
        items.push(task)
      }
    }
    if (items.length === 0) continue
    total += items.length
    lines.push(`## ${def.label}`, '')
    for (const task of items) {
      const date = task.reportDate ?? ''
      const suffix = supportSuffix(task)
      // 普通条目「标题 (8.20)」带空格；support 后缀（支持中）后不加空格
      lines.push(`- ${task.title}${suffix}${suffix === '' ? ' ' : ''}(${shortDate(date)})`)
    }
    lines.push('')
  }
  if (total === 0) lines.push('本周无日报条目')
  return lines.join('\n').trimEnd() + '\n'
}

/** 把 Markdown 日报/周报转成纯文本：去掉行首 `# ` / `## ` / `- `（PRD §5.5「复制纯文本」） */
export function toPlainReport(markdown: string): string {
  return markdown
    .split('\n')
    .map(line => {
      const stripped = line.replace(/^#{1,2} /, '').replace(/^[-•] /, '')
      return stripped.trimEnd()
    })
    .join('\n')
    .trim()
}

/**
 * 「期望支持」闭环后缀：
 * - support 类且未 done：
 *   - supportStatus 已解决（resolved）→ 「（已解决）」
 *   - 其余（待响应/处理中/未设）→ 「（支持中）」
 * - 其余情况 → ''
 */
function supportSuffix(task: TaskRecord): string {
  if (task.category !== 'support' || task.status === 'done') return ''
  if (task.supportStatus === 'resolved') return '（已解决）'
  return '（支持中）'
}

/** 分类 → 展示标签（按配置查询；查不到回退 id；缺省配置兼容内置四类） */
export function categoryLabel(category: string, categories?: readonly CategoryDef[]): string {
  const found = categoriesOf(categories).find(def => def.id === category)
  return found?.label ?? category
}

/** 日期 key → 星期名（周一~周日） */
export function weekdayName(dateKey: string): string {
  const date = fromDateKey(dateKey)
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return names[date.getDay()] ?? ''
}