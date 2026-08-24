/**
 * 用例：更新任务。
 *
 * 允许更新「文案」字段（标题、描述、prompt）、执行钉住字段（工作区、
 * 模式（agent 预设）、权限），以及矩阵字段（形态 kind、分类 category、
 * 到期日 dueDate、日报归属 reportDate、优先级 priority）与
 * 「期望支持」闭环状态 supportStatus。
 * 文案字段去除首尾空白（标题空白则保留原值）；空字符串目标 ID 会被规范化为
 * undefined（表示不钉住、使用运行时默认）；非法枚举值回退当前值。
 */
import { type TaskRecord } from '../tasks.ts';
/** 任务更新补丁：仅开放部分字段 */
export type TaskUpdatePatch = Partial<Pick<TaskRecord, 'title' | 'description' | 'prompt' | 'workspaceId' | 'mode' | 'permission' | 'kind' | 'category' | 'dueDate' | 'reportDate' | 'priority' | 'supportStatus'>>;
/**
 * 执行更新任务用例：
 * - 只更新匹配 ID 的任务；
 * - 文案字段（标题/描述/prompt）去除首尾空白，标题为空则保留原值；
 * - 目标 ID 与矩阵字段做空值与合法性规范化，非法枚举回退当前值；
 * - 更新 updatedAt。
 */
export declare function applyUpdateTask(tasks: readonly TaskRecord[], id: string, patch: TaskUpdatePatch, now: number): readonly TaskRecord[];
