/**
 * 工作台元数据领域纯函数。
 *
 * 持久化于宿主 workbench-meta.json，包含：
 * - 「当日日报已完成」打卡（date → 时间戳）；
 * - 周起始日偏好（周一/周日）；缺省周一（向后兼容 M1）；
 * - 分类配置（id + label 列表）；缺省内置四类（业务/运维/管理/支持），
 *   兼容既有任务里写死的 category 值；
 * - 日报提醒配置（启用开关 + 5 段 cron + 上次触发时间）。
 */
/** 周起始日：周一 或 周日 */
export type WeekStart = 'monday' | 'sunday'

/** 分类定义：id（任务 category 字段存的值）+ 展示标签 */
export interface CategoryDef {
  id: string
  label: string
}

/** 日报提醒配置 */
export interface WorkbenchReminder {
  /** 是否启用 */
  enabled: boolean
  /** 5 段 cron 表达式（分 时 日 月 周），如 '0 21 * * *' */
  cron: string
  /** 上次触发提醒的时间戳（毫秒；用于避免重复提醒） */
  lastTriggeredAt?: number
}

/** 工作台元数据（存储于宿主 workbench-meta.json） */
export interface WorkbenchMeta {
  /** date(yyyy-mm-dd) → 已标记「当日日报已完成」的时间戳（毫秒） */
  dayDoneAt: Record<string, number>
  /** 元数据最近修改时间戳 */
  updatedAt: number
  /** 周起始偏好（缺省 monday） */
  weekStart?: WeekStart
  /** 分类配置（缺省内置四类） */
  categories?: CategoryDef[]
  /** 日报提醒配置（缺省：关闭） */
  reminder?: WorkbenchReminder
}

/** 内置默认分类（与既有任务 category 取值完全一致，保证向后兼容） */
export const DEFAULT_CATEGORIES: readonly CategoryDef[] = [
  { id: 'business', label: '业务/技术需求' },
  { id: 'ops', label: '运维类' },
  { id: 'management', label: '综合管理类' },
  { id: 'support', label: '期望得到的支持' },
]

/** 创建空元数据（带默认分类与默认周起始） */
export function emptyWorkbenchMeta(now: number): WorkbenchMeta {
  return {
    dayDoneAt: {},
    updatedAt: now,
    weekStart: 'monday',
    categories: [...DEFAULT_CATEGORIES],
  }
}

/** 校验未知对象是否为合法的 WorkbenchMeta（读取持久化时容错用） */
export function isWorkbenchMeta(value: unknown): value is WorkbenchMeta {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  if (typeof record.dayDoneAt !== 'object' || record.dayDoneAt === null) return false
  if (typeof record.updatedAt !== 'number' || !Number.isFinite(record.updatedAt)) return false
  for (const [key, ts] of Object.entries(record.dayDoneAt as Record<string, unknown>)) {
    if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false
    if (typeof ts !== 'number' || !Number.isFinite(ts)) return false
  }
  // 周起始：只接受 'monday' | 'sunday'
  if (record.weekStart !== undefined && record.weekStart !== 'monday' && record.weekStart !== 'sunday') return false
  // 分类配置：数组、id/label 均为非空字符串
  if (record.categories !== undefined) {
    if (!Array.isArray(record.categories)) return false
    for (const item of record.categories) {
      if (typeof item !== 'object' || item === null) return false
      const def = item as Record<string, unknown>
      if (typeof def.id !== 'string' || def.id === '') return false
      if (typeof def.label !== 'string' || def.label === '') return false
    }
  }
  // 提醒配置：enabled 布尔、cron 非空字符串、时间戳可为数值
  if (record.reminder !== undefined) {
    if (typeof record.reminder !== 'object' || record.reminder === null) return false
    const reminder = record.reminder as Record<string, unknown>
    if (typeof reminder.enabled !== 'boolean') return false
    if (typeof reminder.cron !== 'string' || reminder.cron === '') return false
    if (reminder.lastTriggeredAt !== undefined && typeof reminder.lastTriggeredAt !== 'number') return false
  }
  return true
}

/** 读取生效的分类配置：缺省回退内置四类 */
export function categoriesOf(meta: WorkbenchMeta): readonly CategoryDef[] {
  return meta.categories !== undefined && meta.categories.length > 0 ? meta.categories : DEFAULT_CATEGORIES
}

/** 读取某分类 id 的展示标签；查不到时回退 id 本身 */
export function categoryLabelOf(meta: WorkbenchMeta, id: string): string {
  const found = categoriesOf(meta).find(def => def.id === id)
  return found?.label ?? id
}

/** 读取生效的周起始：缺省 monday（向后兼容 M1） */
export function weekStartOf(meta: WorkbenchMeta): WeekStart {
  return meta.weekStart ?? 'monday'
}

/** 设周起始日偏好，返回新元数据 */
export function setWeekStart(meta: WorkbenchMeta, weekStart: WeekStart, now: number): WorkbenchMeta {
  return { ...meta, weekStart, updatedAt: now }
}

/** 替换分类配置（整表替换，由管理弹窗编辑后提交），返回新元数据 */
export function setCategories(meta: WorkbenchMeta, categories: readonly CategoryDef[], now: number): WorkbenchMeta {
  return { ...meta, categories: [...categories], updatedAt: now }
}

/** 追加一个分类（id 冲突时忽略），返回新元数据 */
export function addCategory(meta: WorkbenchMeta, def: CategoryDef, now: number): WorkbenchMeta {
  const current = categoriesOf(meta)
  if (current.some(item => item.id === def.id)) return meta
  return setCategories(meta, [...current, def], now)
}

/** 删除一个分类（内置/仍被任务引用时允许删除，任务将变为未分类显示）。至少保留一个分类，避免删光后回退默认导致 UI 与持久化不一致 */
export function removeCategory(meta: WorkbenchMeta, id: string, now: number): WorkbenchMeta {
  const current = categoriesOf(meta)
  if (current.length <= 1) return meta
  return setCategories(meta, current.filter(item => item.id !== id), now)
}

/** 更新日报提醒配置：设启用 + cron（空字符串视为关闭），返回新元数据 */
export function setReminder(
  meta: WorkbenchMeta,
  patch: { enabled?: boolean; cron?: string },
  now: number,
): WorkbenchMeta {
  const prev = meta.reminder
  return {
    ...meta,
    reminder: {
      enabled: patch.enabled ?? prev?.enabled ?? false,
      cron: patch.cron !== undefined ? patch.cron : (prev?.cron ?? '0 21 * * *'),
      lastTriggeredAt: prev?.lastTriggeredAt,
    },
    updatedAt: now,
  }
}

/** 记录一次提醒触发：更新 lastTriggeredAt（用于去重），返回新元数据 */
export function markReminderTriggered(meta: WorkbenchMeta, now: number): WorkbenchMeta {
  const prev = meta.reminder
  if (prev === undefined) return meta
  return {
    ...meta,
    reminder: { ...prev, lastTriggeredAt: now },
    updatedAt: now,
  }
}

/** 打卡某天：写入时间戳并保留其余元数据字段，返回新元数据 */
export function markDayDone(meta: WorkbenchMeta, date: string, now: number): WorkbenchMeta {
  return {
    ...meta,
    dayDoneAt: { ...meta.dayDoneAt, [date]: now },
    updatedAt: now,
  }
}

/** 取消某天打卡，返回新元数据 */
export function unmarkDayDone(meta: WorkbenchMeta, date: string, now: number): WorkbenchMeta {
  const next = { ...meta.dayDoneAt }
  delete next[date]
  return { dayDoneAt: next, updatedAt: now, weekStart: meta.weekStart, categories: meta.categories, reminder: meta.reminder }
}

/** 查询某天是否已打卡 */
export function isDayMarked(meta: WorkbenchMeta, date: string): boolean {
  return meta.dayDoneAt[date] !== undefined
}

/** 切换某天打卡状态：未打卡 → 打卡；已打卡 → 取消 */
export function toggleDayDone(meta: WorkbenchMeta, date: string, now: number): WorkbenchMeta {
  return isDayMarked(meta, date) ? unmarkDayDone(meta, date, now) : markDayDone(meta, date, now)
}