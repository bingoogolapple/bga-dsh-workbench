/**
 * 工作台元数据存储（浏览器端）。
 *
 * 与 FileTaskStore 同构：通过宿主 HTTP 端点读写 workbench-meta.json。
 * 使用同步 XHR（与任务存储一致），任何失败都容错返回默认空元数据。
 */
import { emptyWorkbenchMeta, isWorkbenchMeta, type WorkbenchMeta } from './workbench-meta.ts'

 /** 宿主持久化端点 */
 const META_URL = '/bga-dsh-workbench/workbench-meta'

 /** 工作台元数据存储 */
 export class WorkbenchMetaStore {
   /** 读取元数据：GET 端点并解析；文件缺失/非法时回退空元数据（不抛错） */
   load(now: number = Date.now()): WorkbenchMeta {
     try {
       const xhr = new XMLHttpRequest()
       xhr.open('GET', META_URL, false) // 同步模式
       xhr.send()
       if (xhr.status === 200) {
         const data = JSON.parse(xhr.responseText)
         if (isWorkbenchMeta(data)) return data
       }
     } catch {
       // 读取失败：返回空元数据（保证工作台可用）
     }
     return emptyWorkbenchMeta(now)
   }

   /** 整体写回：POST 序列化后的元数据 JSON（宿主校验并落盘） */
   save(meta: WorkbenchMeta): void {
     try {
       const xhr = new XMLHttpRequest()
       xhr.open('POST', META_URL, false) // 同步模式
       xhr.setRequestHeader('Content-Type', 'application/json')
       xhr.send(JSON.stringify(meta))
     } catch (error) {
       console.error('[bga-dsh-workbench] workbench-meta write failed', error)
     }
   }
 }