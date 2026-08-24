/**
 * 基于宿主 HTTP 端点的任务文件存储实现。
 *
 * 浏览器端无法直接写文件系统，因此通过宿主暴露的
 * /bga-dsh-workbench/tasks 端点（见 routes.ts）实现 load/save/clear。
 * 注意：这里使用同步 XHR，避免在事件回调/控制器流程中引入异步状态复杂度。
 */
 import type { TaskRecord } from './tasks.ts'
 import { isTaskRecord } from './tasks.ts'
 import type { TaskStore } from './store.ts'

 /** 宿主持久化端点 */
 const TASKS_URL = '/bga-dsh-workbench/tasks'

 /** 文件任务存储：读/写宿主磁盘上的 tasks.json */
 export class FileTaskStore implements TaskStore {
   /** 读取任务列表：GET 端点并解析 JSON；任何失败都容错返回空数组 */
   load(): TaskRecord[] {
     // 同步请求：宿主插件不存在或响应异常时静默返回空列表
     try {
       const xhr = new XMLHttpRequest()
       xhr.open('GET', TASKS_URL, false) // 同步模式
       xhr.send()
       if (xhr.status === 200) {
         const data = JSON.parse(xhr.responseText)
         // 逐条过滤损坏/非法条目，避免脏数据在渲染时解引用崩溃
         return Array.isArray(data) ? data.filter(isTaskRecord) : []
       }
     } catch {
       // 读取失败：返回空列表（不抛错，保证看板可用）
     }
     return []
   }

   /** 整体写回：POST 序列化后的任务 JSON（宿主校验并落盘） */
   save(tasks: readonly TaskRecord[]): void {
     try {
       const xhr = new XMLHttpRequest()
       xhr.open('POST', TASKS_URL, false) // 同步模式
       xhr.setRequestHeader('Content-Type', 'application/json')
       xhr.send(JSON.stringify(tasks))
     } catch (error) {
       console.error('[bga-dsh-workbench] task ledger write failed', error)
     }
   }

   /** 清空任务：DELETE 端点的任务文件 */
   clear(): void {
     try {
       const xhr = new XMLHttpRequest()
       xhr.open('DELETE', TASKS_URL, false) // 同步模式
       xhr.send()
     } catch (error) {
       console.error('[bga-dsh-workbench] task ledger clear failed', error)
     }
   }
 }