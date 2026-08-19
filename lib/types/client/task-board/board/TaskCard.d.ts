import type { TaskRecord } from '../../../core/tasks.ts';
/**
 * 把毫秒时间戳格式化为友好展示。
 *
 * 规则：1 分钟内 -> 「刚刚」；1 小时内 -> Nm；1 天内 -> Nh；
 * 更早 -> 日期（YYYY-MM-DD）。
 *
 * @param ms 时间戳（毫秒）。
 * @returns 格式化后的时间文本。
 */
export declare function formatTime(ms: number): string;
/**
 * 任务卡片内部实现（未 memo 的版本）。
 *
 * @param props.task 任务记录。
 * @param props.onClick 点击卡片（打开详情）。
 * @param props.onDelete 删除请求回调（携带任务 id）。
 */
declare function TaskCardInner({ task, onClick, onDelete }: {
    task: TaskRecord;
    onClick: () => void;
    onDelete: (id: string) => void;
}): import("react").JSX.Element;
/**
 * 对外导出的任务卡片：用 memo 包装 TaskCardInner。
 */
export declare const TaskCard: import("react").MemoExoticComponent<typeof TaskCardInner>;
export {};
