/**
 * 任务数据存储接口（浏览器端可持久化的存储抽象）。
 *
 * 看板控制器通过该接口读写任务列表，从而与具体持久化方式解耦。
 * 当前实现为 FileTaskStore（基于宿主 HTTP 端点读写 tasks.json）。
 */
 import type { TaskRecord } from './tasks.ts'

 /** 任务存储的通用接口 */
 export interface TaskStore {
   /** 读取全部任务（失败时返回空数组） */
   load(): TaskRecord[]
   /** 整体写回任务列表 */
   save(tasks: readonly TaskRecord[]): void
   /** 清空全部任务 */
   clear(): void
   /** 可选：订阅外部对存储的修改（外部改动时触发重载监听） */
   subscribeExternal?(listener: () => void): () => void
 }