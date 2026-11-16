import type { ReactNode } from 'react'
import type {} from '@deepseek-ai/dsh-api-remote-access/client'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { PANEL_ID } from './board-mount.tsx'
import css from './sidebar-entry.module.css'

interface LauncherActions {
  toggle: () => void
}

type LauncherProps = PropsLocale<'bga-dsh-workbench-task-board'> & InjectFace<LauncherActions> & {
  wide: boolean
  active: boolean
}

function Launcher({ t, wide, active, toggle }: LauncherProps) {
  const label = t('entry.label')
  return (
    <button
      type="button"
      className={css.launcher}
      data-bga-kb-launcher=""
      data-wide={wide || undefined}
      aria-label={label}
      aria-pressed={active}
      title={wide ? undefined : label}
      onClick={toggle}
    >
      <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor"
        strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
        <path d="M2 6.5h12M6.5 6.5v7" />
      </svg>
      {wide && <span className={css.label}>{label}</span>}
    </button>
  )
}

function NewSessionLauncher({ children, t, wide, usePanelInfo, toggle }: PropsRuntime<'sidebar.session.action'>
  & PropsLocale<'bga-dsh-workbench-task-board'> & InjectFace<LauncherActions> & { children: ReactNode }) {
  const active = usePanelInfo(info => info.activePanelId === PANEL_ID)
  const launcher = <Launcher t={t} wide={wide} active={active} toggle={toggle} />
  if (!wide) return <>{children}{launcher}</>
  return <div className={css.sessionActions}>{children}{launcher}</div>
}

function FooterLauncher({ t, wide, usePanelInfo, useRemoteAccess, toggle }: PropsRuntime<'sidebar.footer.action'>
  & PropsLocale<'bga-dsh-workbench-task-board'> & InjectFace<LauncherActions>) {
  const active = usePanelInfo(info => info.activePanelId === PANEL_ID)
  const canStartSession = useRemoteAccess('session/create')
  return canStartSession ? null : <Launcher t={t} wide={wide} active={active} toggle={toggle} />
}

export function mountSidebarEntry(ctx: Context): () => void {
  const inject = (): LauncherActions => ({
    toggle: () => {
      const active = ctx.layout.panelInfo.getSnapshot().activePanelId === PANEL_ID
      ctx.layout.selectPanel(active ? null : PANEL_ID)
    },
  })
  const disposeSession = ctx.slots.inject('sidebar.session.action', () => ctx.slots.register({
    name: 'sidebar.session.action', id: PANEL_ID, locale: 'bga-dsh-workbench-task-board', inject,
  }, NewSessionLauncher))
  const disposeFooter = ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action', id: PANEL_ID, locale: 'bga-dsh-workbench-task-board', inject,
  }, FooterLauncher))
  return () => { disposeFooter(); disposeSession() }
}
