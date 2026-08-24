/**
 * 工作台元数据存储（浏览器端）。
 *
 * 与 FileTaskStore 同构：通过宿主 HTTP 端点读写 workbench-meta.json。
 * 使用同步 XHR（与任务存储一致），任何失败都容错返回默认空元数据。
 */
import { type WorkbenchMeta } from './workbench-meta.ts';
/** 工作台元数据存储 */
export declare class WorkbenchMetaStore {
    /** 读取元数据：GET 端点并解析；文件缺失/非法时回退空元数据（不抛错） */
    load(now?: number): WorkbenchMeta;
    /** 整体写回：POST 序列化后的元数据 JSON（宿主校验并落盘） */
    save(meta: WorkbenchMeta): void;
}
