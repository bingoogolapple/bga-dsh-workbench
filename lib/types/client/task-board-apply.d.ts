import type { ClientContext, SettingsScope, SettingsScopeSpec } from '@deepseek-ai/dsh-client-runtime/client';
import { type TaskBoardKey } from './task-board/locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'bga-dsh-workbench-task-board': TaskBoardKey;
    }
    interface SlotMap {
        'web-ui.plugin.item': {
            kind: 'list';
            scope: 'root';
            owner: SettingsPluginItemOwnerProps;
        };
    }
}
interface SettingsPluginItemOwnerProps {
    children?: never;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        webUiSettings?: {
            bind<S>(spec: SettingsScopeSpec<S>): SettingsScope<S>;
        };
    }
}
export declare function applyTaskBoard(ctx: ClientContext): void;
export {};
