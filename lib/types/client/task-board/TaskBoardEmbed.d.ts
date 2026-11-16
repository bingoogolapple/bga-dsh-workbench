import type { BoardController } from '../../core/controller.ts';
import { type TaskBoardDraft } from './board/TaskBoard.tsx';
export declare function TaskBoardEmbed({ controller, draft }: {
    controller: BoardController;
    draft?: TaskBoardDraft;
}): import("react").JSX.Element;
