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
import { isTaskPermission, normalizeCategory, normalizeDate, normalizePriority, isTaskKind, isSupportStatus, type TaskRecord } from '../tasks.ts'

/** 任务更新补丁：仅开放部分字段 */
export type TaskUpdatePatch = Partial<Pick<TaskRecord, 'title' | 'description' | 'prompt' | 'workspaceId' | 'mode' | 'permission' | 'kind' | 'category' | 'dueDate' | 'reportDate' | 'priority' | 'supportStatus'>>

/** 规范化目标 ID：trim 后为空视为 undefined（不钉住） */
function normalizeTargetId(value: string | undefined): string | undefined {
  if (value === undefined) return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

/**
 * 执行更新任务用例：
 * - 只更新匹配 ID 的任务；
 * - 文案字段（标题/描述/prompt）去除首尾空白，标题为空则保留原值；
 * - 目标 ID 与矩阵字段做空值与合法性规范化，非法枚举回退当前值；
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
    const next: TaskRecord = { ...task, updatedAt: now }
    // 文案字段：trim；标题为空则保留原值（不允许把标题清空）
    if ('title' in patch) {
      const title = (patch.title ?? '').trim()
      if (title !== '') next.title = title
    }
    if ('description' in patch) next.description = (patch.description ?? '').trim()
    if ('prompt' in patch) next.prompt = (patch.prompt ?? '').trim()
    // 执行钉住字段与矩阵字段
    if ('workspaceId' in patch) next.workspaceId = normalizeTargetId(patch.workspaceId)
    if ('mode' in patch) next.mode = normalizeTargetId(patch.mode)
    if ('permission' in patch) {
      const value = patch.permission
      next.permission = value === undefined ? undefined : (isTaskPermission(value) ? value : task.permission)
    }
    if ('kind' in patch) next.kind = isTaskKind(patch.kind) ? patch.kind : task.kind
    if ('category' in patch) next.category = normalizeCategory(patch.category)
    if ('dueDate' in patch) next.dueDate = normalizeDate(patch.dueDate)
    if ('reportDate' in patch) next.reportDate = normalizeDate(patch.reportDate)
    if ('priority' in patch) next.priority = normalizePriority(patch.priority)
    if ('supportStatus' in patch) {
      const value = patch.supportStatus
      next.supportStatus = value === undefined ? undefined : (isSupportStatus(value) ? value : task.supportStatus)
    }
    return next
  })
}