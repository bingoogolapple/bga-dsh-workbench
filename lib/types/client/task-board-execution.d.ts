import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { ExecutionPresetOption } from '../core/controller.ts';
import { ExecutionService } from '../core/execution.ts';
declare module '@deepseek-ai/dsh-api-session-controller/client' {
    interface SessionReferenceSourceMap {
        'bga-dsh-workbench-execution': unknown;
    }
}
export declare function currentTaskBoardSessionId(ctx: ClientContext): SessionId | undefined;
export declare function createTaskBoardExecution(ctx: ClientContext): {
    execution: ExecutionService;
    loadPresets: () => Promise<readonly ExecutionPresetOption[]>;
};
