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
export type WeekStart = 'monday' | 'sunday';
/** 分类定义：id（任务 category 字段存的值）+ 展示标签 */
export interface CategoryDef {
    id: string;
    label: string;
}
/** 日报提醒配置 */
export interface WorkbenchReminder {
    /** 是否启用 */
    enabled: boolean;
    /** 5 段 cron 表达式（分 时 日 月 周），如 '0 21 * * *' */
    cron: string;
    /** 上次触发提醒的时间戳（毫秒；用于避免重复提醒） */
    lastTriggeredAt?: number;
}
/** 工作台元数据（存储于宿主 workbench-meta.json） */
export interface WorkbenchMeta {
    /** date(yyyy-mm-dd) → 已标记「当日日报已完成」的时间戳（毫秒） */
    dayDoneAt: Record<string, number>;
    /** 元数据最近修改时间戳 */
    updatedAt: number;
    /** 周起始偏好（缺省 monday） */
    weekStart?: WeekStart;
    /** 分类配置（缺省内置四类） */
    categories?: CategoryDef[];
    /** 日报提醒配置（缺省：关闭） */
    reminder?: WorkbenchReminder;
}
/** 内置默认分类（与既有任务 category 取值完全一致，保证向后兼容） */
export declare const DEFAULT_CATEGORIES: readonly CategoryDef[];
/** 创建空元数据（带默认分类与默认周起始） */
export declare function emptyWorkbenchMeta(now: number): WorkbenchMeta;
/** 校验未知对象是否为合法的 WorkbenchMeta（读取持久化时容错用） */
export declare function isWorkbenchMeta(value: unknown): value is WorkbenchMeta;
/** 读取生效的分类配置：缺省回退内置四类 */
export declare function categoriesOf(meta: WorkbenchMeta): readonly CategoryDef[];
/** 读取某分类 id 的展示标签；查不到时回退 id 本身 */
export declare function categoryLabelOf(meta: WorkbenchMeta, id: string): string;
/** 读取生效的周起始：缺省 monday（向后兼容 M1） */
export declare function weekStartOf(meta: WorkbenchMeta): WeekStart;
/** 设周起始日偏好，返回新元数据 */
export declare function setWeekStart(meta: WorkbenchMeta, weekStart: WeekStart, now: number): WorkbenchMeta;
/** 替换分类配置（整表替换，由管理弹窗编辑后提交），返回新元数据 */
export declare function setCategories(meta: WorkbenchMeta, categories: readonly CategoryDef[], now: number): WorkbenchMeta;
/** 追加一个分类（id 冲突时忽略），返回新元数据 */
export declare function addCategory(meta: WorkbenchMeta, def: CategoryDef, now: number): WorkbenchMeta;
/** 删除一个分类（内置/仍被任务引用时允许删除，任务将变为未分类显示）。至少保留一个分类，避免删光后回退默认导致 UI 与持久化不一致 */
export declare function removeCategory(meta: WorkbenchMeta, id: string, now: number): WorkbenchMeta;
/** 更新日报提醒配置：设启用 + cron（空字符串视为关闭），返回新元数据 */
export declare function setReminder(meta: WorkbenchMeta, patch: {
    enabled?: boolean;
    cron?: string;
}, now: number): WorkbenchMeta;
/** 记录一次提醒触发：更新 lastTriggeredAt（用于去重），返回新元数据 */
export declare function markReminderTriggered(meta: WorkbenchMeta, now: number): WorkbenchMeta;
/** 打卡某天：写入时间戳并保留其余元数据字段，返回新元数据 */
export declare function markDayDone(meta: WorkbenchMeta, date: string, now: number): WorkbenchMeta;
/** 取消某天打卡，返回新元数据 */
export declare function unmarkDayDone(meta: WorkbenchMeta, date: string, now: number): WorkbenchMeta;
/** 查询某天是否已打卡 */
export declare function isDayMarked(meta: WorkbenchMeta, date: string): boolean;
/** 切换某天打卡状态：未打卡 → 打卡；已打卡 → 取消 */
export declare function toggleDayDone(meta: WorkbenchMeta, date: string, now: number): WorkbenchMeta;
