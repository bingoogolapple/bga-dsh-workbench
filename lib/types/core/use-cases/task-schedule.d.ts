import { type TaskRecord } from '../tasks.ts';
/** 设置定时所需的补丁（启用开关 + cron） */
export interface SetSchedulePatch {
    enabled?: boolean;
    cron?: string;
}
/** 设置定时用例的结果 */
export interface SetScheduleResult {
    /** 处理后的任务列表 */
    tasks: readonly TaskRecord[];
    /** 是否应用成功（cron 非法或任务不存在时为 false） */
    applied: boolean;
}
/**
 * 执行设置定时用例：
 * - cron 必须非空且合法，否则拒绝；
 * - 启用时计算下一次运行时间，未启用则清空 nextRunAt；
 * - 合并进任务并刷新 updatedAt。
 */
export declare function applySetSchedule(tasks: readonly TaskRecord[], id: string, patch: SetSchedulePatch, now: number): SetScheduleResult;
/**
 * 执行排序滚动：把某任务的下次运行/上次触发时间写回。
 * 仅对存在 schedule 的任务生效。
 */
export declare function applyScheduleNextRun(tasks: readonly TaskRecord[], id: string, nextRunAt: number | undefined, lastTriggeredAt: number | undefined, now: number): readonly TaskRecord[];
