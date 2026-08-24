import { type BoardController } from '../../../core/controller.ts';
/** 今天的 yyyy-mm-dd（本地时区） */
export declare function todayKeyOf(now?: Date): string;
/**
 * 矩阵视图。
 */
export declare function MatrixView({ controller }: {
    controller: BoardController;
}): import("react").JSX.Element;
