/**
 * 用例：删除任务。
 *
 * 从列表中移除指定任务，并报告是否需要清空当前选中态
 * （当被删任务恰好是当前选中的任务时）。
 */
 import type { TaskRecord } from '../tasks.ts'

 /** 删除任务用例的结果 */
 export interface DeleteTaskResult {
   /** 删除后的任务列表 */
   tasks: readonly TaskRecord[]

   /** 是否清空了选中态（被删任务 == 当前选中任务） */
   selectionCleared: boolean
 }

 /**
  * 执行删除任务用例：过滤掉匹配 ID 的任务，并按选中关系返回标记。
  */
 export function applyDeleteTask(
   tasks: readonly TaskRecord[],
   selectedTaskId: string | undefined,
   id: string,
 ): DeleteTaskResult {
   const next = tasks.filter(task => task.id !== id)
   return {
     tasks: next,
     selectionCleared: selectedTaskId === id,
   }
 }