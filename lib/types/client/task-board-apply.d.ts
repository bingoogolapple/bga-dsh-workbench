import type { Context } from '@deepseek-ai/cordis';
import { BoardController } from '../core/controller.ts';
import type { TaskBoardDraft } from './task-board/board/TaskBoard.tsx';
import { type TaskBoardKey } from './task-board/locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'bga-dsh-workbench-task-board': TaskBoardKey;
    }
}
interface BoardView {
    controller: BoardController;
    draft: TaskBoardDraft;
}
export interface BoardSource {
    getSnapshot: () => BoardView | undefined;
    subscribe: (listener: () => void) => () => void;
}
export declare function applyTaskBoard(ctx: Context): BoardSource;
export {};
