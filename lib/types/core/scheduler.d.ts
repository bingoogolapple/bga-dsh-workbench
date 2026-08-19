import type { TaskRecord } from './tasks.ts';
/** 调度器的外部依赖接口（由 task-board-apply.ts 组装注入） */
export interface SchedulerDeps {
    /** 读取当前全部任务 */
    tasks(): readonly TaskRecord[];
    /** 可选：每次 tick 前先从持久化存储重新加载任务 */
    refresh?: () => void;
    /** 当前时间戳（毫秒） */
    now(): number;
    /** 真正执行某个任务；返回是否被接受（接受后才会滚动下次时间） */
    runTask(id: string): Promise<boolean>;
    /** 把某任务的下次运行/上次触发时间写回控制器 */
    applySchedule(id: string, nextRunAt: number | undefined, lastTriggeredAt: number | undefined): void;
    /** tick 间隔毫秒数（默认 60_000） */
    tickMs?: number;
    /** 可选的就绪判断：未就绪时跳过本 tick */
    ready?: () => boolean;
    /** 可选环境（浏览器 document）：用于挂 visibilitychange 监听 */
    environment?: {
        addEventListener(type: 'visibilitychange', listener: () => void): void;
        removeEventListener(type: 'visibilitychange', listener: () => void): void;
    };
}
/** 定时调度服务 */
export declare class SchedulerService {
    private readonly deps;
    /** setInterval 句柄 */
    private timer;
    /** visibilitychange 监听器（用于页面恢复可见时补扫） */
    private environmentListener;
    /** 是否已释放（dispose 后不再工作） */
    private disposed;
    /** 是否已启动 */
    private started;
    /** 构造调度器，注入依赖 */
    constructor(deps: SchedulerDeps);
    /** 启动调度：立即补一次 tick，随后进入固定间隔循环，并可选挂上可见性监听 */
    start(): void;
    /** 停止调度（等价于 dispose） */
    stop(): void;
    /** 释放全部资源：清定时器、移除监听、标记已释放 */
    dispose(): void;
    /**
     * 执行一轮扫描：
     * 1. 刷新任务快照；
     * 2. 为缺失 nextRunAt 的启用任务补算；
     * 3. 到点且未超时（宽限期 = 2 个 tick）的任务触发执行，
     *    超时的任务仅滚动下次时间而不执行（标注错过）。
     */
    tick(): Promise<void>;
}
