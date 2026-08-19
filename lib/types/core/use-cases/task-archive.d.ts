/**
 * 用例：归档 / 恢复任务。
 *
 * 归档：仅「已完成 / 已失败」且尚未归档的任务可归档，写入 archivedAt；
 * 恢复：清除 archivedAt，让任务回到看板主视图。
 */
import type { TaskRecord } from '../tasks.ts';
/** 归档/恢复用例的公共结果 */
export interface ArchiveTaskResult {
    /** 处理后的任务列表 */
    tasks: readonly TaskRecord[];
    /** 是否真正发生了归档或恢复 */
    archived: boolean;
}
/**
 * 执行归档：
 * - 任务不存在 / 已归档 / 状态不在 ARCHIVABLE_STATUSES 中时不做任何事；
 * - 满足条件则写入 archivedAt 与 updatedAt。
 */
export declare function applyArchiveTask(tasks: readonly TaskRecord[], id: string, now: number): ArchiveTaskResult;
/**
 * 执行恢复：
 * - 仅对已归档任务生效（archivedAt 不为 undefined）；
 * - 剥掉 archivedAt 并刷新 updatedAt。
 */
export declare function applyRestoreTask(tasks: readonly TaskRecord[], id: string, now: number): ArchiveTaskResult;
