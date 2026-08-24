/**
 * 看板控制器（浏览器端状态中枢）。
 *
 * BoardController 持有看板的全部可变状态（任务列表、面板开关、选中态、归档视图、
 * 执行选项），并提供对外操作（增删改、移动、排序、执行、归档）。它以 getSnapshot /
 * subscribe 的响应式方式向 React 组件暴露状态；每次变更都会先持久化（store.save）
 * 再通知订阅者。同时负责协调执行事件与运行中任务的挽回（reconcile）。
 */
 import { ExecutionService, type ExecutionEvent } from './execution.ts'
 import type { TaskStore } from './store.ts'
 import {
  settleExecution, startExecution, withStatus,
   type NewTaskInput, type TaskRecord, type TaskStatus,
 } from './tasks.ts'
 import { applyArchiveTask, applyRestoreTask } from './use-cases/task-archive.ts'
 import { applyCreateTask } from './use-cases/task-create.ts'
 import { applyDeleteTask } from './use-cases/task-delete.ts'
 import { applyScheduleNextRun as applyScheduleRollForward, applySetSchedule } from './use-cases/task-schedule.ts'
 import { applyUpdateTask, type TaskUpdatePatch } from './use-cases/task-update.ts'
import {
  addCategory as metaAddCategory, emptyWorkbenchMeta, markReminderTriggered as metaMarkReminderTriggered,
  removeCategory as metaRemoveCategory, setCategories as metaSetCategories, setReminder as metaSetReminder,
  setWeekStart as metaSetWeekStart, toggleDayDone as toggleMetaDayDone,
  type CategoryDef, type WeekStart, type WorkbenchMeta,
} from './workbench-meta.ts'
 import type { WorkbenchMetaStore } from './workbench-meta-store.ts'

 /** 会话控制器门面：只暴露控制器需要的最小能力（当前会话快照 + 打开会话） */
 export interface SessionsControllerFace {
   list: {
     /** 获取当前会话 ID 快照 */
     getSnapshot(): { current: string | undefined }
     /** 订阅会话变化 */
     subscribe(fn: () => void): () => void
   }
   /** 打开（跳转到）某个会话 */
   open(id: string): void
 }

 /** 控制器的外部依赖（存储、执行服务、会话门面，均来自 task-board-apply.ts 装配） */
 export interface ControllerDeps {
   store: TaskStore
   exec: ExecutionService
   sessions: SessionsControllerFace
   /** 工作台元数据存储（可选：日报「当日已完成」打卡；缺省使用内存空元数据） */
   metaStore?: WorkbenchMetaStore
   /** 时钟（默认 Date.now） */
   now?: () => number
   /** 生成执行/任务 ID（默认随机 UUID） */
   uuid?: () => string
   /** 运行中任务调和（reconcile）的去抖毫秒数（默认 350） */
   reconcileDebounceMs?: number
 }

 /** 执行可用的工作区选项 */
 export interface ExecutionWorkspaceOption {
   workspaceId: string
   /** 展示名（取工作区标题或路径） */
   title: string
 }

 /** 执行可用的 agent 预设（模式）选项 */
 export interface ExecutionPresetOption {
   id: string
   name?: string
   description?: string
   /** 预设不可用（broken）时的提示；存在即不可选 */
   broken?: string
   isDefault: boolean
 }

 /** 执行选项快照（工作区列表 + 预设列表） */
 export interface ExecutionOptionsSnapshot {
   workspaces: readonly ExecutionWorkspaceOption[]
   presets: readonly ExecutionPresetOption[]
 }

 /** 控制器对外快照：React 组件订阅的最小视图 */
 export interface ControllerSnapshot {
   tasks: readonly TaskRecord[]
   boardOpen: boolean
   /** 是否处于归档视图 */
   archiveView: boolean
   selectedTaskId: string | undefined
   /** 新建/编辑任务时可选的执行目标 */
   executionOptions: ExecutionOptionsSnapshot
   /** 工作台元数据（日报「当日已完成」打卡等） */
   meta: WorkbenchMeta
 }

 /** 从快照中取出当前选中的任务 */
 export function selectedTaskOf(snapshot: ControllerSnapshot): TaskRecord | undefined {
   if (snapshot.selectedTaskId === undefined) return undefined
   return snapshot.tasks.find(task => task.id === snapshot.selectedTaskId)
 }

 /** 生成随机 UUID v4；浏览器无 crypto 时降级为时间戳+随机数的简化 ID */
 function randomUuid(): string {
   const bytes = globalThis.crypto?.getRandomValues(new Uint8Array(16))
   if (bytes === undefined) {
     // 降级：基于时间戳与随机数的轻量 ID
     return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
   }
   // 设置版本位（第 7 字节高 4 位 = 4）与变体位（第 9 字节高 2 位 = 10）
   bytes[6] = (bytes[6] & 0x0f) | 0x40
   bytes[8] = (bytes[8] & 0x3f) | 0x80
   const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
   return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
 }

 /** 读取当前会话 ID（用于打开面板时记录，会话切换时自动关面板） */
 function currentOf(sessions: SessionsControllerFace): string | undefined {
   return sessions.list.getSnapshot().current
 }

 /** 看板控制器：看板全部状态与操作的持有者 */
 export class BoardController {
   /** 任务列表（内存副本，变更后立即落盘） */
   private tasks: TaskRecord[] = []
   /** 看板是否打开（全屏面板可见） */
   private boardOpen = false
   /** 是否处于归档视图 */
   private archiveView = false
   /** 当前选中的任务 ID（详情弹窗） */
   private selectedTaskId: string | undefined
   /** 执行选项（工作区/预设列表），由外部推送 */
   private executionOptions: ExecutionOptionsSnapshot = { workspaces: [], presets: [] }
   /** 工作台元数据（日报「当日已完成」打卡），从 metaStore 加载 */
   private meta: WorkbenchMeta = emptyWorkbenchMeta(0)
   /** 状态订阅者集合 */
   private listeners = new Set<() => void>()
   /** 生命周期清理函数集合（dispose 时逐一执行） */
   private disposers: Array<() => void> = []
   /** 时钟函数（可注入以便测试） */
   private readonly now: () => number
   /** ID 生成函数（可注入以便测试） */
   private readonly uuid: () => string

   /** 构造控制器：注入依赖，配置默认时钟/ID 生成器 */
   constructor(private readonly deps: ControllerDeps) {
     this.now = deps.now ?? (() => Date.now())
     this.uuid = deps.uuid ?? randomUuid
   }

   /**
    * 启动控制器：
    * 1. 从存储加载任务；
    * 2. 立即调和（reconcile）运行中任务的真实结局；
    * 3. 订阅外部存储改动与会话变化；
    * 4. 通知一次初始快照。
    */
   start(): void {
     this.tasks = this.deps.store.load()
     this.meta = this.deps.metaStore?.load(this.now()) ?? emptyWorkbenchMeta(this.now())
     void this.reconcileRunningTasks()
     // 订阅外部存储变化：例如另一个标签页改了 tasks.json，重载并通知
     const unsubscribeExternal = this.deps.store.subscribeExternal?.(() => {
       this.tasks = this.deps.store.load()
       this.notify()
     })
     if (unsubscribeExternal !== undefined) this.disposers.push(unsubscribeExternal)
     this.disposers.push(this.deps.sessions.list.subscribe(() => {
       this.onSessionsChanged()
     }))
     this.notify()
   }

   /** 释放控制器：清理订阅、定时器与监听者 */
   dispose(): void {
     for (const dispose of this.disposers.splice(0)) dispose()
     this.listeners.clear()
     if (this.reconcileTimer !== undefined) clearTimeout(this.reconcileTimer)
     this.reconcileTimer = undefined
   }

   /** 获取当前状态快照（React 组件渲染用） */
   getSnapshot(): ControllerSnapshot {
     return {
       tasks: this.tasks,
       boardOpen: this.boardOpen,
       archiveView: this.archiveView,
       selectedTaskId: this.selectedTaskId,
       executionOptions: this.executionOptions,
       meta: this.meta,
     }
   }

   /** 切换某天「当日日报已完成」打卡（打卡/取消），返回切换后的状态 */
   toggleDayDone(date: string): void {
     this.meta = toggleMetaDayDone(this.meta, date, this.now())
     this.persistAndNotify()
   }
   /** 设置周起始日偏好（monday/sunday），持久化并通知 */
   setWeekStart(weekStart: WeekStart): void {
     this.meta = metaSetWeekStart(this.meta, weekStart, this.now())
     this.persistAndNotify()
   }

   /** 替换整张分类配置表（分类管理弹窗提交），持久化并通知 */
   setCategories(categories: readonly CategoryDef[]): void {
     this.meta = metaSetCategories(this.meta, categories, this.now())
     this.persistAndNotify()
   }

   /** 追加一个分类（id 冲突时忽略） */
   addCategory(def: CategoryDef): void {
     this.meta = metaAddCategory(this.meta, def, this.now())
     this.persistAndNotify()
   }

   /** 删除一个分类（任务引用该分类时变为「未分类」显示） */
   removeCategory(id: string): void {
     this.meta = metaRemoveCategory(this.meta, id, this.now())
     this.persistAndNotify()
   }

   /** 更新日报提醒配置（启用 + cron） */
   setReminder(patch: { enabled?: boolean; cron?: string }): void {
     this.meta = metaSetReminder(this.meta, patch, this.now())
     this.persistAndNotify()
   }

   /** 记录一次日报提醒触发（去重用），持久化 */
   markReminderTriggered(): void {
     this.meta = metaMarkReminderTriggered(this.meta, this.now())
     this.persistAndNotify()
   }

   /** 订阅快照变化，返回取消订阅函数 */
   subscribe(fn: () => void): () => void {
     this.listeners.add(fn)
     return () => { this.listeners.delete(fn) }
   }

   /**
    * 打开看板（全屏面板）。
    * 记录打开瞬间的当前会话，用于会话切换时自动关闭。
    */
   openBoard(): void {
     if (this.boardOpen) return
     // 记录打开时的会话：若之后用户切到别的会话，则自动收起看板
     this.lastCurrent = currentOf(this.deps.sessions)
     this.boardOpen = true
     this.notify()
   }

   /** 关闭看板 */
   closeBoard(): void {
     if (!this.boardOpen) return
     this.boardOpen = false
     this.notify()
   }

   /** 切换看板开关 */
   toggleBoard(): void {
     if (this.boardOpen) this.closeBoard()
     else this.openBoard()
   }

   /** 切换归档视图 */
   toggleArchiveView(): void {
     this.archiveView = !this.archiveView
     // 退出归档视图时，若选中项是已归档任务则清空选中
     if (!this.archiveView && this.selectedTaskId !== undefined) {
       const selected = this.tasks.find(task => task.id === this.selectedTaskId)
       if (selected?.archivedAt !== undefined) this.selectedTaskId = undefined
     }
     this.notify()
   }

   /** 选中（打开详情）某任务；任务不存在则忽略 */
   openTask(id: string): void {
     if (this.tasks.some(task => task.id === id)) {
       this.selectedTaskId = id
       this.notify()
     }
   }

   /** 关闭任务详情弹窗 */
   closeTask(): void {
     if (this.selectedTaskId === undefined) return
     this.selectedTaskId = undefined
     this.notify()
   }

   /** 创建新任务（标题为空时返回 undefined 表示失败） */
   createTask(input: NewTaskInput): TaskRecord | undefined {
     const { task, tasks } = applyCreateTask(this.tasks, input, this.now(), this.uuid())
     if (task === undefined) return undefined
     this.tasks = [...tasks]
     this.persistAndNotify()
     return task
   }

   /** 更新任务（补丁合并后落盘） */
   updateTask(id: string, patch: TaskUpdatePatch): void {
     this.tasks = [...applyUpdateTask(this.tasks, id, patch, this.now())]
     this.persistAndNotify()
   }

   /** 从外部推送执行选项（工作区/预设列表） */
   setExecutionOptions(patch: Partial<ExecutionOptionsSnapshot>): void {
     this.executionOptions = { ...this.executionOptions, ...patch }
     this.notify()
   }

   /** 手动移动任务到目标状态 */
   moveTask(id: string, status: TaskStatus): void {
     this.tasks = this.tasks.map(task => task.id === id ? withStatus(task, status, this.now()) : task)
     this.persistAndNotify()
   }

   /** 删除任务（如删除的是当前选中任务，清空选中态） */
   deleteTask(id: string): void {
     const { tasks, selectionCleared } = applyDeleteTask(this.tasks, this.selectedTaskId, id)
     this.tasks = [...tasks]
     if (selectionCleared) this.selectedTaskId = undefined
     this.persistAndNotify()
   }

   /** 归档任务：仅已完成/已失败可归档，返回是否成功 */
   archiveTask(id: string): boolean {
     const { tasks, archived } = applyArchiveTask(this.tasks, id, this.now())
     if (!archived) return false
     this.tasks = [...tasks]
     this.persistAndNotify()
     return true
   }

   /** 恢复归档任务，返回是否成功 */
   restoreTask(id: string): boolean {
     const { tasks, archived } = applyRestoreTask(this.tasks, id, this.now())
     if (!archived) return false
     this.tasks = [...tasks]
     this.persistAndNotify()
     return true
   }

   /**
    * 设置任务的定时规则（启用 + cron），返回是否应用成功。
    * cron 非法或任务不存在时返回 false（不会落盘）。
    */
   setSchedule(id: string, patch: { enabled?: boolean; cron?: string }): boolean {
     const { tasks, applied } = applySetSchedule(this.tasks, id, patch, this.now())
     if (!applied) return false
     this.tasks = [...tasks]
     this.persistAndNotify()
     return true
   }

   /** 调度器回写某任务的下次运行/上次触发时间 */
   applyScheduleNextRun(id: string, nextRunAt: number | undefined, lastTriggeredAt: number | undefined): void {
     const next = applyScheduleRollForward(this.tasks, id, nextRunAt, lastTriggeredAt, this.now())
     this.tasks = [...next]
     this.persistAndNotify()
   }

   /** 从存储重新加载任务列表（不通知，供调度器刷新快照） */
   reloadFromStore(): void {
     this.tasks = this.deps.store.load()
   }

   /** 跳转到某个执行会话 */
   openSession(sessionId: string): void {
     this.deps.sessions.open(sessionId)
   }

   /**
    * 执行任务：启动一次执行并监听结局事件。
    * 任务不存在或已在运行时返回 false；否则：
    * 1. 落盘置为 running 并追加执行记录；
    * 2. 记录执行 ID 到 activeExecutionIds（调和时跳过）；
    * 3. 交给 ExecutionService.run 驱动真实 agent 会话。
    */
   async runTask(id: string): Promise<boolean> {
     const task = this.tasks.find(candidate => candidate.id === id)
     if (task === undefined || task.status === 'running') return false
     const { task: next, execution } = startExecution(task, this.now(), this.uuid())
     this.tasks = this.tasks.map(candidate => candidate.id === id ? next : candidate)
     this.persistAndNotify()
     // 记录在途执行：调和逻辑不会动它，等事件回调收尾
     this.activeExecutionIds.add(execution.id)
     await this.deps.exec.run(next, execution, (event) => { this.handleExecutionEvent(event) })
     return true
   }

   /** 重新执行任务：先移回 todo（若未在运行），再启动执行 */
   async rerunTask(id: string): Promise<void> {
     const task = this.tasks.find(candidate => candidate.id === id)
     if (task === undefined) return
     if (task.status !== 'running') {
       this.tasks = this.tasks.map(candidate => candidate.id === id ? withStatus(candidate, 'todo', this.now()) : candidate)
       this.persistAndNotify()
     }
     await this.runTask(id)
   }

   /** 处理执行事件：started 挂上会话 ID；settled 落定结果与状态 */
   private handleExecutionEvent(event: ExecutionEvent): void {
     if (event.kind === 'started') {
       // 执行已启动：把 sessionId 记回对应执行记录
       this.tasks = this.tasks.map(task => task.id === event.taskId
         ? attachSessionId(task, event.executionId, event.sessionId, this.now())
         : task)
       this.persistAndNotify()
       return
     }
     // 结算：移除在途标记，按 outcome 落定状态
     this.activeExecutionIds.delete(event.executionId)
     this.tasks = this.tasks.map(task => task.id === event.taskId
       ? settleExecution(task, event.executionId, event.outcome, this.now(), event.error)
       : task)
     this.persistAndNotify()
   }

   /**
    * 会话变化回调：
    * 1. 总是调度一次运行中任务的调和（会话可能已消失/结束）；
    * 2. 若看板打开且当前会话已切换，自动关闭看板。
    */
   private onSessionsChanged(): void {
     // 会话变化意味着运行中任务的结局可能已改变，先去抖地调和一次
     this.scheduleReconcile()
     if (!this.boardOpen) return
     const current = currentOf(this.deps.sessions)
     // 仅在「打开时已记录到真实会话」且「会话确实切换」时才关闭，避免打开瞬间会话未就绪时被误关
     if (this.lastCurrent !== undefined && current !== this.lastCurrent) this.closeBoard()
     this.lastCurrent = current
   }

   /** 打开看板时记录的会话 ID（用于会话切换检测） */
   private lastCurrent: string | undefined = undefined

   /** 在途执行 ID 集合（调和时跳过，等待事件回调处理） */
   private readonly activeExecutionIds = new Set<string>()

   /** 调和定时器句柄 */
   private reconcileTimer: ReturnType<typeof setTimeout> | undefined = undefined

   /** 调和进行中标记（防重入） */
   private reconcileInFlight = false

   /** 去抖调度一次运行中任务调和 */
   private scheduleReconcile(): void {
     if (this.reconcileTimer !== undefined) return
     this.reconcileTimer = setTimeout(() => {
       this.reconcileTimer = undefined
       void this.reconcileRunningTasks()
     }, this.deps.reconcileDebounceMs ?? 350)
   }

  /**
   * 调和运行中任务：对每个「不在途」的运行中任务，向执行服务询问真实结局
   * （会话消失 → 视为取消；会话空闲 → 按 lastAgentError 判定成败），
   * 并一次性落盘与通知。
   */
   private async reconcileRunningTasks(): Promise<void> {
     if (this.reconcileInFlight) return
     this.reconcileInFlight = true
     try {
       type Settled = Extract<ExecutionEvent, { kind: 'settled' }>
       const events: Array<{ taskId: string; event: Settled }> = []
       for (const task of this.tasks) {
         if (task.status !== 'running') continue
         const execution = task.executions[task.executions.length - 1]
         // 在途执行由事件回调负责，调和跳过
         if (execution !== undefined && this.activeExecutionIds.has(execution.id)) continue
         const event = await this.deps.exec.reconcile(task)
         if (event !== undefined && event.kind === 'settled') events.push({ taskId: task.id, event })
       }
       if (events.length === 0) return
       let changed = false
       for (const { taskId, event } of events) {
         // 逐条结算：settleExecution 会自己忽略已结算的执行
         const task = this.tasks.find(candidate => candidate.id === taskId)
         if (task === undefined) continue
         const next = settleExecution(task, event.executionId, event.outcome, this.now(), event.error)
         if (next === task) continue
         this.tasks = this.tasks.map(candidate => candidate.id === taskId ? next : candidate)
         changed = true
       }
       if (changed) this.persistAndNotify()
     } finally {
       this.reconcileInFlight = false
     }
   }

   /** 落盘并通知订阅者（每次状态变更的标准出口） */
   private persistAndNotify(): void {
     this.deps.store.save(this.tasks)
     this.deps.metaStore?.save(this.meta)
     this.notify()
   }

   /** 通知所有订阅者快照已变化 */
   private notify(): void {
     for (const fn of [...this.listeners]) fn()
   }
 }

 /** 把会话 ID 挂到指定执行记录上（执行启动事件回调使用） */
 function attachSessionId(
   task: TaskRecord,
   executionId: string,
   sessionId: string,
   now: number,
 ): TaskRecord {
   return {
     ...task,
     updatedAt: now,
     executions: task.executions.map(execution =>
       execution.id === executionId ? { ...execution, sessionId } : execution),
   }
 }