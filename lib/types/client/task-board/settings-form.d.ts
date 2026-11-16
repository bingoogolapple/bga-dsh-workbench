import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
export interface TaskBoardConfig {
    taskBoard?: {
        enabled?: boolean;
        announceToAgent?: boolean;
    };
}
type Field = keyof NonNullable<TaskBoardConfig['taskBoard']>;
type FieldText = '' | 'true' | 'false';
export interface CardShell {
    available: boolean;
    exposed: boolean;
    writable: boolean;
    dirty: boolean;
    saving: boolean;
    failed: boolean;
    failedReason?: string;
}
export declare function useTaskBoardSettings(form: ConfigForm<TaskBoardConfig>): {
    state: CardShell;
    field: (name: Field) => {
        text: FieldText;
        overridden: boolean;
    };
    edit: (name: Field, value: string) => void;
    save: () => Promise<void>;
    discard: () => void;
};
export {};
