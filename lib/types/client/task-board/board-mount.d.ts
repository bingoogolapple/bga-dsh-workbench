import type { Context } from '@deepseek-ai/cordis';
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client';
import type { BoardController } from '../../core/controller.ts';
export declare const PANEL_ID: MainPanelId;
export declare function mountBoard(ctx: Context, controller: BoardController): () => void;
