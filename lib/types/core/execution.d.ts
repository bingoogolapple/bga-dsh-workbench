import type { ExecutionRecord, TaskPermission, TaskRecord } from './tasks.ts';
export interface ExecutionWorkspace {
    readonly workspaceId: string;
    readonly sessionIds: readonly string[];
}
export declare function preferredWorkspaceId(currentSessionId: string | undefined, workspaces: readonly ExecutionWorkspace[]): string | undefined;
type Outcome = {
    outcome: 'succeeded' | 'failed' | 'cancelled';
    error?: string;
};
export type ExecutionJournalEvent = {
    seq: number;
    time: number;
} & ({
    kind: 'turn-start';
    turn: number;
} | {
    kind: 'turn-end';
    turn: number;
    result?: Outcome;
} | {
    kind: 'prompt';
    requestId?: string;
    text?: string;
} | {
    kind: 'queue';
    target: 'next-turn' | 'next-step';
    start: number;
    removedCount: number;
    inserted: readonly (string | undefined)[];
    cancelled: boolean;
});
export type ExecutionJournalUpdate = {
    kind: 'append' | 'replace';
    events: readonly ExecutionJournalEvent[];
} | {
    kind: 'removed';
};
export interface ExecutionJournalPage {
    readonly events: readonly ExecutionJournalEvent[];
    readonly cursor: number;
    readonly beforeSeq?: number;
}
interface PreparedPrompt {
    readonly requestId: string;
    send(signal: AbortSignal): Promise<{
        ok: true;
    } | {
        ok: false;
        message: string;
        uncertain: boolean;
    }>;
    abandon(): void;
}
export interface ExecutionSession {
    verifyPreset(preset: string, signal: AbortSignal): Promise<void>;
    setPermission(permission: TaskPermission, signal: AbortSignal): Promise<void>;
    rename(title: string): Promise<void>;
    preparePrompt(text: string): PreparedPrompt;
    observe(listener: (update: ExecutionJournalUpdate) => void): () => void;
    dispose(): void;
}
export interface ExecutionEnvironment {
    workspaces(): readonly ExecutionWorkspace[];
    currentSessionId(): string | undefined;
    createSession(workspaceId: string, preset: string | undefined): Promise<string>;
    openSession(sessionId: string, signal: AbortSignal): Promise<ExecutionSession>;
    readJournal(sessionId: string, cut: {
        beforeSeq?: number;
        throughSeq?: number;
    }, signal: AbortSignal): Promise<ExecutionJournalPage | 'missing'>;
}
export type ExecutionEvent = {
    kind: 'started';
    taskId: string;
    executionId: string;
    sessionId: string;
    requestId?: string;
} | ({
    kind: 'settled';
    taskId: string;
    executionId: string;
} & Outcome);
export declare class ExecutionService {
    private readonly env;
    private readonly lifetime;
    private readonly releases;
    constructor(env: ExecutionEnvironment);
    dispose(): void;
    /** Launch and return after submission; the subscription owns the session until settlement. */
    run(task: TaskRecord, execution: ExecutionRecord, onEvent: (event: ExecutionEvent) => void): Promise<void>;
    reconcile(task: TaskRecord): Promise<ExecutionEvent | undefined>;
    private workspaceFor;
    private readOutcome;
}
export {};
