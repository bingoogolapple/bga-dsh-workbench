/**
 * 用例：设置 / 滚动定时调度。
 *
 * - applySetSchedule：用户设置定时规则（启用开关 + cron），
 *   校验 cron 合法后计算并写入首次 nextRunAt；
 * - applyScheduleNextRun：运行后由调度器回写下次运行/上次触发时间。
 */
 import { isValidCron, nextRunAtMs } from '../schedule.ts'
 import { withSchedule, type TaskRecord } from '../tasks.ts'

 /** 设置定时所需的补丁（启用开关 + cron） */
 export interface SetSchedulePatch {
   enabled?: boolean
   cron?: string
 }

 /** 设置定时用例的结果 */
 export interface SetScheduleResult {
   /** 处理后的任务列表 */
   tasks: readonly TaskRecord[]

   /** 是否应用成功（cron 非法或任务不存在时为 false） */
   applied: boolean
 }

 /**
  * 执行设置定时用例：
  * - cron 必须非空且合法，否则拒绝；
  * - 启用时计算下一次运行时间，未启用则清空 nextRunAt；
  * - 合并进任务并刷新 updatedAt。
  */
 export function applySetSchedule(
   tasks: readonly TaskRecord[],
   id: string,
   patch: SetSchedulePatch,
   now: number,
 ): SetScheduleResult {
   const task = tasks.find(candidate => candidate.id === id)
   if (task === undefined) return { tasks, applied: false }
   const current = task.schedule
   const cron = (patch.cron ?? current?.cron ?? '').trim()
   if (cron === '' || !isValidCron(cron)) return { tasks, applied: false }
   const enabled = patch.enabled ?? current?.enabled ?? false
   // 启用才排程，禁用则清空下次运行时间
   const nextRunAt = enabled ? nextRunAtMs(cron, now) : undefined
   return {
     tasks: tasks.map(candidate =>
       candidate.id === id ? withSchedule(candidate, { enabled, cron, nextRunAt }, now) : candidate),
     applied: true,
   }
 }

 /**
  * 执行排序滚动：把某任务的下次运行/上次触发时间写回。
  * 仅对存在 schedule 的任务生效。
  */
 export function applyScheduleNextRun(
   tasks: readonly TaskRecord[],
   id: string,
   nextRunAt: number | undefined,
   lastTriggeredAt: number | undefined,
   now: number,
 ): readonly TaskRecord[] {
   return tasks.map(task =>
     task.id === id && task.schedule !== undefined
       ? withSchedule(task, { nextRunAt, lastTriggeredAt }, now)
       : task)
 }