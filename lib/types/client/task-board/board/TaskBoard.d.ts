import { type BoardController } from '../../../core/controller.ts';
/**
 * 看板主视图。
 *
 * @param props.controller 看板控制器（读取快照、订阅、执行各种操作）。
 * @param props.embedded 是否处于内嵌模式（隐藏「返回对话」按钮）。
 */
export declare function TaskBoard({ controller, embedded }: {
    controller: BoardController;
    embedded?: boolean;
}): import("react").JSX.Element;
