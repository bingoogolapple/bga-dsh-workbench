import type { Context } from '@deepseek-ai/cordis'
import type { MenuContribution } from '@deepseek-ai/dsh-client-ui-context-menu/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerWorkspaceOpenMenu } from '../src/client/workspace-open.ts'

function register() {
  let contribution: MenuContribution<'workspace'> | undefined
  let dispose: (() => void) | undefined
  const unregister = vi.fn()
  const notify = vi.fn()
  const ctx = {
    slots: { inject: vi.fn() },
    contextMenus: {
      register: (value: MenuContribution<'workspace'>) => {
        contribution = value
        return unregister
      },
      notify,
    },
    effect: (effect: () => () => void) => { dispose = effect() },
  } as unknown as Context
  registerWorkspaceOpenMenu(ctx)
  if (!contribution || !dispose) throw new Error('missing workspace menu registration')
  return { contribution: contribution as MenuContribution<'workspace'>, dispose, unregister, notify }
}

const workspace = {
  workspaceId: 'workspace-b' as Parameters<MenuContribution<'workspace'>['resolve']>[0]['workspaceId'],
  displayTitle: '同名工作区',
  path: '/b/actual-path',
}

afterEach(() => vi.unstubAllGlobals())

describe('workspace open menu', () => {
  it('opens the captured workspace, honors preferences and unregisters on unload', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ open: { terminal: 'terminal-iterm' }, openExtra: { xcode: false } }),
    }).mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })
    vi.stubGlobal('fetch', fetchMock)
    const { contribution, dispose, unregister } = register()
    const actions = await contribution.resolve(workspace, new AbortController().signal)

    expect(contribution.target).toBe('workspace')
    expect(actions.slice(0, 3).map(action => action.id)).toEqual(['finder', 'terminal', 'vscode'])
    expect(actions.some(action => action.id === 'xcode')).toBe(false)
    expect(actions[3].separatorBefore).toBe(true)
    const terminal = actions.find(action => action.id === 'terminal')
    expect(terminal?.label).toBe('在 iTerm 中打开')
    expect(terminal?.icon?.key).toBe('bga-workbench.open-terminal')
    await terminal?.run?.()
    expect(fetchMock).toHaveBeenLastCalledWith('/bga-dsh-workbench/open', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ kind: 'terminal', path: workspace.path }),
    }))
    dispose()
    expect(unregister).toHaveBeenCalledOnce()
  })

  it('keeps default actions on a preference failure and reports the launch error', async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ ok: false, json: async () => ({ ok: false, error: 'not installed' }) })
    vi.stubGlobal('fetch', fetchMock)
    const { contribution, notify } = register()
    const actions = await contribution.resolve(workspace, new AbortController().signal)
    expect(actions).toHaveLength(11)
    await actions[0].run?.()
    expect(notify).toHaveBeenCalledWith(expect.stringContaining('not installed'))
  })

  it('discards preference results if the menu closes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const { contribution } = register()
    const abort = new AbortController()
    const result = contribution.resolve(workspace, abort.signal)
    abort.abort()
    await expect(result).rejects.toMatchObject({ name: 'AbortError' })
  })
})
