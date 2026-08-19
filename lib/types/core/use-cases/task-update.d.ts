/**
 * 用例：更新任务。
 *
 * 只允许更新四个执行相关字段以外的「文案」字段：标题、描述、prompt，
 * 以及执行钉住字段：工作区、模式（agent 预设）、权限。
 * 空字符串会被规范化为 undefined（表示不钉住、使用运行时默认）。
 */
import { type TaskRecord } from '../tasks.ts';
/** 任务更新补丁：仅开放部分字段 */
export type TaskUpdatePatch = Partial<Pick<TaskRecord, 'title' | 'description' | 'prompt' | 'workspaceId' | 'mode' | 'permission'>>;
/**
 * 执行更新任务用例：
 * - 只更新匹配 ID 的任务；
 * - 基于补丁展开合并，并对工作区/模式/权限做空值与合法性规范化；
 * - 更新 updatedAt。
 */
export declare function applyUpdateTask(tasks: readonly TaskRecord[], id: string, patch: TaskUpdatePatch, now: number): readonly TaskRecord[];
