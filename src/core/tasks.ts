/**
 * 任务领域模型与纯函数。
 *
 * 定义任务看板的核心数据结构（TaskRecord）与不依赖运行时的纯函数：
 * 状态常量、任务创建、状态流转、执行记录管理、定时规则管理。
 * 这些函数均被 use-cases 层和 BoardController 复用。
 */
/** 任务状态：待规划 / 待办 / 进行中 / 已完成 / 已失败 */
 export type TaskStatus = 'backlog' | 'todo' | 'running' | 'done' | 'failed'

 /** 一次任务执行的记录 */
 export interface ExecutionRecord {
   /** 执行唯一 ID（随机 UUID） */
   id: string
   /** 执行驱动起来的 agent 会话 ID（启动后才有） */
   sessionId: string | undefined
   /** 执行开始时间戳（毫秒） */
   startedAt: number
   /** 执行结束时间戳（毫秒），未结束时为 undefined */
   endedAt: number | undefined
   /** 执行结果：成功 / 失败 / 取消 */
   result: 'succeeded' | 'failed' | 'cancelled' | undefined
   /** 失败或取消时的错误信息 */
   error: string | undefined
 }

 /** 定时执行规则 */
 export interface ScheduleRule {
   /** 是否启用定时 */
   enabled: boolean
   /** 5 段 cron 表达式（分 时 日 月 周） */
   cron: string
   /** 下一次计划运行的时间戳（毫秒） */
   nextRunAt: number | undefined
   /** 上一次实际触发的时间戳（毫秒） */
   lastTriggeredAt: number | undefined
 }

 /** 任务记录：看板中一张卡片的完整数据 */
 export interface TaskRecord {
   /** 任务唯一 ID */
   id: string
   /** 任务标题 */
   title: string
   /** 任务描述 */
   description: string
   /** 交给 agent 执行的 prompt；为空时使用标题 */
   prompt: string
   /** 当前状态 */
   status: TaskStatus
   /** 创建时间戳 */
   createdAt: number
   /** 最近一次修改时间戳 */
   updatedAt: number
   /** 历次执行记录（按时间先后追加） */
   executions: ExecutionRecord[]
   /** 定时规则（可选） */
   schedule?: ScheduleRule
   /** 钉住的执行工作区 ID（可选） */
   workspaceId?: string
   /** 钉住的 agent 预设模式 ID（可选） */
   mode?: string
   /** 钉住的权限档位（可选） */
   permission?: TaskPermission
   /** 归档时间戳（归档即从看板主视图隐藏） */
   archivedAt?: number
 }

 /** 可归档的任务状态集合：只有已完成或已失败的任务才能归档 */
 export const ARCHIVABLE_STATUSES: readonly TaskStatus[] = ['done', 'failed']

 /** 允许钉住的权限档位列表 */
 export const TASK_PERMISSIONS = ['read-only', 'workspace-write', 'danger-full-access'] as const

 /** 任务权限档位类型（取自 TASK_PERMISSIONS 的值字面量） */
 export type TaskPermission = typeof TASK_PERMISSIONS[number]

 /** 判断任意值是否为合法的任务权限档位 */
 export function isTaskPermission(value: unknown): value is TaskPermission {
   return typeof value === 'string' && (TASK_PERMISSIONS as readonly string[]).includes(value)
 }

 /** 新建任务的输入（createTask 的入参） */
 export interface NewTaskInput {
   /** 标题（必填，创建时 trim 掉首尾空白） */
   title: string
   /** 描述 */
   description: string
   /** 执行 prompt */
   prompt: string
   /** 钉住的执行工作区 ID（可选） */
   workspaceId?: string
   /** 钉住的 agent 预设模式（可选） */
   mode?: string
   /** 钉住的权限档位（可选） */
   permission?: TaskPermission
 }

 /** 看板列定义：状态 → 中文列名，用于渲染各列 */
 export const COLUMNS: readonly { status: TaskStatus; label: string }[] = [
   { status: 'backlog', label: '待规划' },
   { status: 'todo', label: '待办' },
   { status: 'running', label: '进行中' },
   { status: 'done', label: '已完成' },
   { status: 'failed', label: '已失败' },
 ]

 /** 允许手动移入的状态：只有待规划/待办可被用户手动拖入 */
 export const MANUAL_STATUSES: readonly TaskStatus[] = ['backlog', 'todo']

 /** 运行后最终落定的状态：成功→done，失败→failed */
 export const RUNNER_SETTLE_STATUSES: readonly TaskStatus[] = ['done', 'failed']

 /** 全部状态枚举（用于校验） */
 export const ALL_STATUSES: readonly TaskStatus[] = [
   'backlog', 'todo', 'running', 'done', 'failed',
 ]

 /** 判断任意值是否为合法任务状态 */
 export function isTaskStatus(value: unknown): value is TaskStatus {
   return typeof value === 'string' && (ALL_STATUSES as readonly string[]).includes(value)
 }

 /**
  * 判断任务是否允许被手动移动到目标状态。
  * 当前仅允许移到 MANUAL_STATUSES（待规划/待办）中的状态。
  */
 export function canMoveManually(_from: TaskStatus, to: TaskStatus): boolean {
   return (MANUAL_STATUSES as readonly TaskStatus[]).includes(to)
 }

 /** 规范化可选的目标 ID：trim 后为空则视为 undefined */
 function normalizeTargetId(value: string | undefined): string | undefined {
   const trimmed = value?.trim()
   return trimmed === undefined || trimmed === '' ? undefined : trimmed
 }

 /**
  * 依据输入创建一条新任务记录：初始状态为 todo。
  * 标题/描述/prompt 均去除首尾空白，钉住字段做空值规范化。
  */
 export function createTask(input: NewTaskInput, now: number, id: string): TaskRecord {
   return {
     id,
     title: input.title.trim(),
     description: input.description.trim(),
     prompt: input.prompt.trim(),
     status: 'todo',
     createdAt: now,
     updatedAt: now,
     executions: [],
     workspaceId: normalizeTargetId(input.workspaceId),
     mode: normalizeTargetId(input.mode),
     permission: isTaskPermission(input.permission) ? input.permission : undefined,
   }
 }

 /** 以新状态生成任务副本，并刷新 updatedAt */
 export function withStatus(task: TaskRecord, status: TaskStatus, now: number): TaskRecord {
   return { ...task, status, updatedAt: now }
 }

 /**
  * 合并定时规则补丁生成任务副本。
  * 未在补丁中出现的字段沿用当前值。
  */
 export function withSchedule(
   task: TaskRecord,
   patch: Partial<ScheduleRule>,
   now: number,
 ): TaskRecord {
   const current = task.schedule
   const schedule: ScheduleRule = {
     enabled: current?.enabled ?? false,
     cron: current?.cron ?? '',
     nextRunAt: current?.nextRunAt,
     lastTriggeredAt: current?.lastTriggeredAt,
   }
   if ('enabled' in patch) schedule.enabled = patch.enabled ?? false
   if ('cron' in patch) schedule.cron = patch.cron ?? ''
   if ('nextRunAt' in patch) schedule.nextRunAt = patch.nextRunAt
   if ('lastTriggeredAt' in patch) schedule.lastTriggeredAt = patch.lastTriggeredAt
   return { ...task, updatedAt: now, schedule }
 }

 /**
  * 开始一次执行：追加一条执行记录并把任务状态置为 running。
  * 返回新任务与新建的执行记录。
  */
 export function startExecution(
   task: TaskRecord,
   now: number,
   executionId: string,
 ): { task: TaskRecord; execution: ExecutionRecord } {
   const execution: ExecutionRecord = {
     id: executionId,
     sessionId: undefined,
     startedAt: now,
     endedAt: undefined,
     result: undefined,
     error: undefined,
   }
   return {
     task: { ...task, status: 'running', updatedAt: now, executions: [...task.executions, execution] },
     execution,
   }
 }

 /**
  * 结算一次执行：按执行 ID 找到对应记录补上结束时间与结果。
  * 若执行已结束（endedAt 已存在）则原样返回；任务状态按结果落到 done/failed，
  * 取消（cancelled）时若任务仍为 running 则退回 todo。
  */
 export function settleExecution(
   task: TaskRecord,
   executionId: string,
   outcome: 'succeeded' | 'failed' | 'cancelled',
   now: number,
   error: string | undefined,
 ): TaskRecord {
   const index = task.executions.findIndex(execution => execution.id === executionId)
   if (index === -1) return task
   const execution = task.executions[index]
   if (execution.endedAt !== undefined) return task
   const settled: ExecutionRecord = { ...execution, endedAt: now, result: outcome, error }
   const executions = [...task.executions]
   executions[index] = settled
   const status: TaskStatus = outcome === 'succeeded' ? 'done'
     : outcome === 'failed' ? 'failed'
       : task.status === 'running' ? 'todo' : task.status
   return { ...task, status, updatedAt: now, executions }
 }

 /** 生成执行记录的展示标签：按下标结果返回英文运行/成功/失败/取消标记 */
 export function executionLabel(execution: ExecutionRecord): string {
   if (execution.result === 'succeeded') return 'succeeded'
   if (execution.result === 'failed') return 'failed'
   if (execution.result === 'cancelled') return 'cancelled'
   return 'running'
 }