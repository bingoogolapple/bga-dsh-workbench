import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { BooleanField, PluginSettingsCard } from './PluginSettingsCard.tsx'
import { useTaskBoardSettings, type TaskBoardConfig } from './settings-form.ts'

export interface TaskBoardSettingsCardFace {
  form: ConfigForm<TaskBoardConfig>
}

type TaskBoardSettingsCardProps = PropsRuntime<'settings.plugins.tab'>
  & PropsLocale<'bga-dsh-workbench-task-board'>
  & InjectFace<TaskBoardSettingsCardFace>

export function TaskBoardSettingsCard({ form, t }: TaskBoardSettingsCardProps) {
  const { state, field, edit, save, discard } = useTaskBoardSettings(form)
  const fieldProps = {
    inheritLabel: t('settings.inherit'),
    onLabel: t('settings.on'),
    offLabel: t('settings.off'),
    overriddenLabel: t('settings.overridden'),
    resetLabel: t('settings.reset'),
    disabled: !state.writable || state.saving,
  }
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <PluginSettingsCard
        t={t}
        titleKey="settings.title"
        descriptionKey="settings.description"
        state={state}
        onSave={() => { void save() }}
        onDiscard={discard}
      >
        <BooleanField
          id="settings-task-board-enabled"
          label={t('settings.enabled')}
          hint={t('settings.enabledHint')}
          {...fieldProps}
          {...field('enabled')}
          onEdit={text => edit('enabled', text)}
          onReset={() => edit('enabled', '')}
        />
        <BooleanField
          id="settings-task-board-announce"
          label={t('settings.announceToAgent')}
          hint={t('settings.announceToAgentHint')}
          {...fieldProps}
          {...field('announceToAgent')}
          onEdit={text => edit('announceToAgent', text)}
          onReset={() => edit('announceToAgent', '')}
        />
      </PluginSettingsCard>
    </ul>
  )
}
