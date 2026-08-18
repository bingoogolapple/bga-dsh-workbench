/**
 * 用例：更新任务。
 *
 * 只允许更新四个执行相关字段以外的「文案」字段：标题、描述、prompt，
 * 以及执行钉住字段：工作区、模式（agent 预设）、权限。
 * 空字符串会被规范化为 undefined（表示不钉住、使用运行时默认）。
 */
 import { isTaskPermission, type TaskRecord, type TaskPermission } from '../tasks.ts'

 /** 任务更新补丁：仅开放部分字段 */
 export type TaskUpdatePatch = Partial<Pick<TaskRecord, 'title' | 'description' | 'prompt' | 'workspaceId' | 'mode' | 'permission'>>

 /** 规范化目标 ID：trim 后为空视为 undefined（不钉住） */
 function normalizeTargetId(value: string | undefined): string | undefined {
   return value !== undefined && value.trim() === '' ? undefined : value
 }

 /** 规范化权限：传入非法值时保留原值 */
 function normalizePermission(
   current: TaskPermission | undefined,
   value: TaskPermission | undefined,
 ): TaskPermission | undefined {
   if (value === undefined) return undefined
   return isTaskPermission(value) ? value : current
 }

 /**
  * 执行更新任务用例：
  * - 只更新匹配 ID 的任务；
  * - 基于补丁展开合并，并对工作区/模式/权限做空值与合法性规范化；
  * - 更新 updatedAt。
  */
 export function applyUpdateTask(
   tasks: readonly TaskRecord[],
   id: string,
   patch: TaskUpdatePatch,
   now: number,
 ): readonly TaskRecord[] {
   return tasks.map(task => {
     if (task.id !== id) return task
     const workspaceId = 'workspaceId' in patch ? normalizeTargetId(patch.workspaceId) : undefined
     const mode = 'mode' in patch ? normalizeTargetId(patch.mode) : undefined
     const permission = 'permission' in patch ? normalizePermission(task.permission, patch.permission) : undefined
     const next: TaskRecord = { ...task, ...patch, updatedAt: now }
     // 只有补丁中显式包含对应字段时才覆盖（避免误清空未修改的字段）
     if (workspaceId !== undefined || 'workspaceId' in patch) next.workspaceId = workspaceId
     if (mode !== undefined || 'mode' in patch) next.mode = mode
     if (permission !== undefined || 'permission' in patch) next.permission = permission
     return next
   })
 }