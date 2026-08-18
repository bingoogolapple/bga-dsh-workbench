/**
 * 用例：创建任务。
 *
 * 纯函数式实现：输入旧任务列表 + 新建输入，输出新任务与更新后的列表。
 * 不直接改动控制器状态，由 BoardController 调用并负责持久化。
 */
 import { createTask, type NewTaskInput, type TaskRecord } from '../tasks.ts'

 /** 创建任务用例的结果 */
 export interface CreateTaskResult {
   /** 新创建的任务；标题为空时返回 undefined */
   task: TaskRecord | undefined
   /** 追加新任务后的完整任务列表 */
   tasks: readonly TaskRecord[]
 }

 /**
  * 执行创建任务用例：
  * - 标题 trim 后为空则拒绝创建（task 为 undefined）；
  * - 否则生成新任务并追加到列表末尾。
  */
 export function applyCreateTask(
   tasks: readonly TaskRecord[],
   input: NewTaskInput,
   now: number,
   id: string,
 ): CreateTaskResult {
   if (input.title.trim() === '') return { task: undefined, tasks }
   const task = createTask(input, now, id)
   return { task, tasks: [...tasks, task] }
 }