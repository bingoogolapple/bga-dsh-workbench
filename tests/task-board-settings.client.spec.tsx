import { act, renderHook } from '@testing-library/react'
import type { ConfigForm, ConfigFormSnapshot } from '@deepseek-ai/dsh-client-ui-settings/client'
import { describe, expect, it, vi } from 'vitest'
import { useTaskBoardSettings, type TaskBoardConfig } from '../src/client/task-board/settings-form.ts'

describe('task board settings', () => {
  it('saves nested changes atomically and keeps the draft when the Host rejects its revision', async () => {
    let snapshot: ConfigFormSnapshot<TaskBoardConfig> = {
      status: 'ready', value: { taskBoard: { enabled: false } },
      base: { taskBoard: { enabled: true } }, user: { taskBoard: { enabled: false } },
      revision: 4, writable: true,
    }
    const mutate = vi.fn<ConfigForm<TaskBoardConfig>['mutate']>()
      .mockImplementationOnce(async () => {
        snapshot = { ...snapshot, revision: 5 }
        return false
      })
      .mockResolvedValueOnce(true)
    const form: ConfigForm<TaskBoardConfig> = {
      getSnapshot: () => snapshot,
      subscribe: () => () => {},
      mutate,
      set: vi.fn(),
      unset: vi.fn(),
    }
    const { result } = renderHook(() => useTaskBoardSettings(form))
    expect(result.current.field('enabled')).toEqual({ text: 'false', overridden: true })
    act(() => {
      result.current.edit('enabled', '')
      result.current.edit('announceToAgent', 'false')
    })

    await act(async () => { await result.current.save() })
    const writes = [
      { op: 'unset', path: ['taskBoard', 'enabled'] },
      { op: 'set', path: ['taskBoard', 'announceToAgent'], value: false },
    ]
    expect(mutate).toHaveBeenNthCalledWith(1, writes, 4)
    expect(result.current.state).toMatchObject({ dirty: true, failed: true, saving: false })

    await act(async () => { await result.current.save() })
    expect(mutate).toHaveBeenNthCalledWith(2, writes, 5)
    expect(result.current.state).toMatchObject({ dirty: false, failed: false, saving: false })
  })
})
