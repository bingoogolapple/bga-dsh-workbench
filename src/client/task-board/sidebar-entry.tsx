import type { Context } from '@deepseek-ai/cordis'
import type { SidebarPanelIconOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { PANEL_ID } from './board-mount.tsx'

const NS = 'bga-dsh-workbench-task-board'

function WorkbenchIcon({ size }: SidebarPanelIconOwnerProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M6.5 6.5v7" />
    </svg>
  )
}

export function mountSidebarEntry(ctx: Context): () => void {
  const t = ctx.locale.bind(NS)
  return ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: PANEL_ID,
    order: 20,
    locale: NS,
    label: () => t('entry.label'),
  }, WorkbenchIcon))
}
