/**
 * 任务领域模型与纯函数。
 *
 * 定义任务看板的核心数据结构（TaskRecord）与不依赖运行时的纯函数：
 * 状态常量、任务创建、状态流转、执行记录管理、定时规则管理。
 * 这些函数均被 use-cases 层和 BoardController 复用。
 */
/** 任务状态：待规划 / 待办 / 进行中 / 已完成 / 已失败 */
export type TaskStatus = 'backlog' | 'todo' | 'running' | 'done' | 'failed';
/** 一次任务执行的记录 */
export interface ExecutionRecord {
    /** 执行唯一 ID（随机 UUID） */
    id: string;
    /** 执行驱动起来的 agent 会话 ID（启动后才有） */
    sessionId: string | undefined;
    /** 执行开始时间戳（毫秒） */
    startedAt: number;
    /** 执行结束时间戳（毫秒），未结束时为 undefined */
    endedAt: number | undefined;
    /** 执行结果：成功 / 失败 / 取消 */
    result: 'succeeded' | 'failed' | 'cancelled' | undefined;
    /** 失败或取消时的错误信息 */
    error: string | undefined;
}
/** 定时执行规则 */
export interface ScheduleRule {
    /** 是否启用定时 */
    enabled: boolean;
    /** 5 段 cron 表达式（分 时 日 月 周） */
    cron: string;
    /** 下一次计划运行的时间戳（毫秒） */
    nextRunAt: number | undefined;
    /** 上一次实际触发的时间戳（毫秒） */
    lastTriggeredAt: number | undefined;
}
/** 任务记录：看板中一张卡片的完整数据 */
export interface TaskRecord {
    /** 任务唯一 ID */
    id: string;
    /** 任务标题 */
    title: string;
    /** 任务描述 */
    description: string;
    /** 交给 agent 执行的 prompt；为空时使用标题 */
    prompt: string;
    /** 当前状态 */
    status: TaskStatus;
    /** 创建时间戳 */
    createdAt: number;
    /** 最近一次修改时间戳 */
    updatedAt: number;
    /** 历次执行记录（按时间先后追加） */
    executions: ExecutionRecord[];
    /** 定时规则（可选） */
    schedule?: ScheduleRule;
    /** 钉住的执行工作区 ID（可选） */
    workspaceId?: string;
    /** 钉住的 agent 预设模式 ID（可选） */
    mode?: string;
    /** 钉住的权限档位（可选） */
    permission?: TaskPermission;
    /** 归档时间戳（归档即从看板主视图隐藏） */
    archivedAt?: number;
    /** 任务形态：todo = 轻量待办（不执行）；task = 可执行看板任务。缺省 task（向后兼容） */
    kind?: TaskKind;
    /** 日报四分类：business/ops/management/support；缺省 undefined（未分类任务不进矩阵） */
    category?: TaskCategory;
    /** 到期日：yyyy-mm-dd（待办视图排序/卡片展示） */
    dueDate?: string;
    /** 日报归属日期：yyyy-mm-dd（矩阵落格依据） */
    reportDate?: string;
    /** 优先级：high/medium/low */
    priority?: TaskPriority;
    /** 「期望支持」闭环：pending/processing/resolved（仅 support 类） */
    supportStatus?: SupportStatus;
}
/** 可归档的任务状态集合：只有已完成或已失败的任务才能归档 */
export declare const ARCHIVABLE_STATUSES: readonly TaskStatus[];
/** 允许钉住的权限档位列表 */
export declare const TASK_PERMISSIONS: readonly ["read-only", "workspace-write", "danger-full-access"];
/** 允许的任务形态列表 */
export declare const TASK_KINDS: readonly ["todo", "task"];
/** 允许的任务分类列表（日报四类） */
export declare const TASK_CATEGORIES: readonly ["business", "ops", "management", "support"];
/** 允许的优先级列表 */
export declare const TASK_PRIORITIES: readonly ["high", "medium", "low"];
/** 任务形态类型（取自 TASK_KINDS 的值字面量） */
export type TaskKind = typeof TASK_KINDS[number];
/** 任务分类 id：可为内置四类（business/ops/management/support）或分类自定义中的任意非空字符串 id */
export type TaskCategory = string;
/** 优先级类型（取自 TASK_PRIORITIES 的值字面量） */
export type TaskPriority = typeof TASK_PRIORITIES[number];
/** 「期望支持」闭环状态：待响应 → 处理中 → 已解决 */
export declare const SUPPORT_STATUSES: readonly ["pending", "processing", "resolved"];
/** 「期望支持」闭环状态类型 */
export type SupportStatus = typeof SUPPORT_STATUSES[number];
/** yyyy-mm-dd 日期格式校验：`^\d{4}-\d{2}-\d{2}$` 且月份/日期在合法区间 */
export declare const DATE_RE: RegExp;
/** 判断任意值是否为合法的任务形态 */
export declare function isTaskKind(value: unknown): value is TaskKind;
/** 判断任意值是否为合法的任务分类（内置四类或分类自定义中的任意非空字符串 id） */
export declare function isTaskCategory(value: unknown): value is TaskCategory;
/** 判断任意值是否为合法的「期望支持」闭环状态 */
export declare function isSupportStatus(value: unknown): value is SupportStatus;
/** 规范化「期望支持」闭环状态：非法返回 undefined */
export declare function normalizeSupportStatus(value: unknown): SupportStatus | undefined;
/** 判断任意值是否为合法的优先级 */
export declare function isTaskPriority(value: unknown): value is TaskPriority;
/** 判断字符串是否为合法的 yyyy-mm-dd 日期（同时校验月/日区间，非严格闰年） */
export declare function isDateString(value: unknown): value is string;
/** 规范化分类：非法值返回 undefined */
export declare function normalizeCategory(value: unknown): TaskCategory | undefined;
/** 规范化优先级：非法值返回 undefined */
export declare function normalizePriority(value: unknown): TaskPriority | undefined;
/** 规范化日期：非法或空返回 undefined */
export declare function normalizeDate(value: unknown): string | undefined;
/** 任务权限档位类型（取自 TASK_PERMISSIONS 的值字面量） */
export type TaskPermission = typeof TASK_PERMISSIONS[number];
/** 判断任意值是否为合法的任务权限档位 */
export declare function isTaskPermission(value: unknown): value is TaskPermission;
/** 新建任务的输入（createTask 的入参） */
export interface NewTaskInput {
    /** 标题（必填，创建时 trim 掉首尾空白） */
    title: string;
    /** 描述 */
    description: string;
    /** 执行 prompt */
    prompt: string;
    /** 钉住的执行工作区 ID（可选） */
    workspaceId?: string;
    /** 钉住的 agent 预设模式（可选） */
    mode?: string;
    /** 钉住的权限档位（可选） */
    permission?: TaskPermission;
    /** 任务形态：todo = 轻量待办（不执行）；task = 可执行看板任务 */
    kind?: TaskKind;
    /** 日报四分类（可选） */
    category?: TaskCategory;
    /** 到期日 yyyy-mm-dd（可选） */
    dueDate?: string;
    /** 日报归属日期 yyyy-mm-dd（可选） */
    reportDate?: string;
    /** 优先级（可选） */
    priority?: TaskPriority;
    /** 「期望支持」闭环状态（仅 support 类有意义） */
    supportStatus?: SupportStatus;
}
/** 看板列定义：状态 → 中文列名，用于渲染各列 */
export declare const COLUMNS: readonly {
    status: TaskStatus;
    label: string;
}[];
/** 允许手动移入的状态：只有待规划/待办可被用户手动拖入 */
export declare const MANUAL_STATUSES: readonly TaskStatus[];
/** 全部状态枚举（用于校验） */
export declare const ALL_STATUSES: readonly TaskStatus[];
/** 判断任意值是否为合法任务状态 */
export declare function isTaskStatus(value: unknown): value is TaskStatus;
/**
 * 判断未知值是否为结构合法的任务记录（读取 tasks.json 时容错用）。
 * 采用宽松校验：保证渲染/操作所需的字段类型正确即可，其余可选字段不逐一校验，
 * 目标是过滤损坏或来历不明的条目，避免渲染时对 title/status 等关键字段解引用崩溃。
 */
export declare function isTaskRecord(value: unknown): value is TaskRecord;
/**
 * 依据输入创建一条新任务记录：初始状态为 todo。
 * 标题/描述/prompt 均去除首尾空白，钉住字段做空值规范化。
 */
export declare function createTask(input: NewTaskInput, now: number, id: string): TaskRecord;
/** 以新状态生成任务副本，并刷新 updatedAt */
export declare function withStatus(task: TaskRecord, status: TaskStatus, now: number): TaskRecord;
/**
 * 合并定时规则补丁生成任务副本。
 * 未在补丁中出现的字段沿用当前值。
 */
export declare function withSchedule(task: TaskRecord, patch: Partial<ScheduleRule>, now: number): TaskRecord;
/**
 * 开始一次执行：追加一条执行记录并把任务状态置为 running。
 * 返回新任务与新建的执行记录。
 */
export declare function startExecution(task: TaskRecord, now: number, executionId: string): {
    task: TaskRecord;
    execution: ExecutionRecord;
};
/**
 * 结算一次执行：按执行 ID 找到对应记录补上结束时间与结果。
 * 若执行已结束（endedAt 已存在）则原样返回；任务状态按结果落到 done/failed，
 * 取消（cancelled）时若任务仍为 running 则退回 todo。
 */
export declare function settleExecution(task: TaskRecord, executionId: string, outcome: 'succeeded' | 'failed' | 'cancelled', now: number, error: string | undefined): TaskRecord;
/** 生成执行记录的展示标签：按下标结果返回英文运行/成功/失败/取消标记 */
export declare function executionLabel(execution: ExecutionRecord): string;
