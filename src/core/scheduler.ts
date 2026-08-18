/**
 * 定时调度服务（浏览器端）。
 *
 * 以固定 tick 间隔（默认 60 秒）扫描任务列表：
 * - 为未计算下次运行时间的任务补算 nextRunAt；
 * - 到点（且未严重超时的）任务触发执行、滚动下次时间；
 * - 通过 visibilitychange 监听在页面重新可见时立即补一次扫描，
 *   尽量弥补标签页休眠期间错过的调度。
 */
 import { nextRunAtMs } from './schedule.ts'
 import type { TaskRecord } from './tasks.ts'

 /** 调度器的外部依赖接口（由 task-board-apply.ts 组装注入） */
 export interface SchedulerDeps {
   /** 读取当前全部任务 */
   tasks(): readonly TaskRecord[]
   /** 可选：每次 tick 前先从持久化存储重新加载任务 */
   refresh?: () => void
   /** 当前时间戳（毫秒） */
   now(): number
   /** 真正执行某个任务；返回是否被接受（接受后才会滚动下次时间） */
   runTask(id: string): Promise<boolean>
   /** 把某任务的下次运行/上次触发时间写回控制器 */
   applySchedule(id: string, nextRunAt: number | undefined, lastTriggeredAt: number | undefined): void
   /** tick 间隔毫秒数（默认 60_000） */
   tickMs?: number
   /** 可选的就绪判断：未就绪时跳过本 tick */
   ready?: () => boolean
   /** 可选环境（浏览器 document）：用于挂 visibilitychange 监听 */
   environment?: {
     addEventListener(type: 'visibilitychange', listener: () => void): void
     removeEventListener(type: 'visibilitychange', listener: () => void): void
   }
 }

 /** 定时调度服务 */
 export class SchedulerService {
   /** setInterval 句柄 */
   private timer: ReturnType<typeof setInterval> | undefined
   /** visibilitychange 监听器（用于页面恢复可见时补扫） */
   private environmentListener: (() => void) | undefined
   /** 是否已释放（dispose 后不再工作） */
   private disposed = false
   /** 是否已启动 */
   private started = false

   /** 构造调度器，注入依赖 */
   constructor(private readonly deps: SchedulerDeps) {}

   /** 启动调度：立即补一次 tick，随后进入固定间隔循环，并可选挂上可见性监听 */
   start(): void {
     if (this.disposed) return
     if (this.started) return
     this.started = true
     // 先立即扫一次，随后按 tickMs 周期循环
     this.tick()
     this.timer = setInterval(() => { this.tick() }, this.deps.tickMs ?? 60_000)
     if (this.deps.environment !== undefined) {
       this.environmentListener = () => { this.tick() }
       this.deps.environment.addEventListener('visibilitychange', this.environmentListener)
     }
   }

   /** 停止调度（等价于 dispose） */
   stop(): void {
     this.dispose()
   }

   /** 释放全部资源：清定时器、移除监听、标记已释放 */
   dispose(): void {
     if (this.disposed && this.timer === undefined && this.environmentListener === undefined) return
     this.disposed = true
     this.started = false
     if (this.timer !== undefined) {
       clearInterval(this.timer)
       this.timer = undefined
     }
     if (this.environmentListener !== undefined && this.deps.environment !== undefined) {
       this.deps.environment.removeEventListener('visibilitychange', this.environmentListener)
       this.environmentListener = undefined
     }
   }

   /**
    * 执行一轮扫描：
    * 1. 刷新任务快照；
    * 2. 为缺失 nextRunAt 的启用任务补算；
    * 3. 到点且未超时（宽限期 = 2 个 tick）的任务触发执行，
    *    超时的任务仅滚动下次时间而不执行（标注错过）。
    */
   async tick(): Promise<void> {
     if (this.disposed) return
     if (this.deps.ready !== undefined && !this.deps.ready()) return
     // 先从存储重新加载，避免拿到过期数据
     this.deps.refresh?.()
     const now = this.deps.now()
     // 宽限期：超过它仍未执行视为「错过」（例如标签页休眠），滚动到下次而不执行
     const graceMs = 2 * (this.deps.tickMs ?? 60_000)
     for (const task of this.deps.tasks()) {
       const schedule = task.schedule
       if (schedule === undefined || !schedule.enabled) continue
       if (schedule.nextRunAt === undefined) {
         // 启用但还没排过首次时间（如刚开启定时）：按当前时刻补算
         const repaired = nextRunAtMs(schedule.cron, now)
         if (repaired === undefined) continue
         this.deps.applySchedule(task.id, repaired, undefined)
         continue
       }
       if (schedule.nextRunAt > now) continue
       // 已到点：先判断是否已错过太多（超过宽限期）
       // 错过：只滚动下次时间，不执行
       if (now - schedule.nextRunAt > graceMs) {
         const next = nextRunAtMs(schedule.cron, now)
         this.deps.applySchedule(task.id, next, undefined)
         continue
       }
       // 正常到点：先算好下一次时间（确保落在 now 之后）
       let next = nextRunAtMs(schedule.cron, schedule.nextRunAt)
       // 若计算出的下次仍不晚于 now（极少见），以 now 为基准重算
       if (next !== undefined && next <= now) next = nextRunAtMs(schedule.cron, now)
       const accepted = await this.deps.runTask(task.id)
       if (accepted) this.deps.applySchedule(task.id, next, now)
     }
   }
 }