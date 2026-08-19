/**
 * 基于宿主 HTTP 端点的任务文件存储实现。
 *
 * 浏览器端无法直接写文件系统，因此通过宿主暴露的
 * /bga-dsh-workbench/tasks 端点（见 routes.ts）实现 load/save/clear。
 * 注意：这里使用同步 XHR，避免在事件回调/控制器流程中引入异步状态复杂度。
 */
import type { TaskRecord } from './tasks.ts';
import type { TaskStore } from './store.ts';
/** 文件任务存储：读/写宿主磁盘上的 tasks.json */
export declare class FileTaskStore implements TaskStore {
    /** 读取任务列表：GET 端点并解析 JSON；任何失败都容错返回空数组 */
    load(): TaskRecord[];
    /** 整体写回：POST 序列化后的任务 JSON（宿主校验并落盘） */
    save(tasks: readonly TaskRecord[]): void;
    /** 清空任务：DELETE 端点的任务文件 */
    clear(): void;
}
