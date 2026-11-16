import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { type TaskBoardConfig } from './settings-form.ts';
export interface TaskBoardSettingsCardFace {
    form: ConfigForm<TaskBoardConfig>;
}
type TaskBoardSettingsCardProps = PropsRuntime<'settings.plugins.tab'> & PropsLocale<'bga-dsh-workbench-task-board'> & InjectFace<TaskBoardSettingsCardFace>;
export declare function TaskBoardSettingsCard({ form, t }: TaskBoardSettingsCardProps): import("react").JSX.Element;
export {};
