import type { BoardController } from '../../core/controller.ts';
/**
 * 看板内嵌视图组件（用于 hero 空态）。
 *
 * @param props.controller 看板控制器，透传给内部 <TaskBoard />。
 */
export declare function TaskBoardEmbed({ controller }: {
    controller: BoardController;
}): import("react").JSX.Element;
