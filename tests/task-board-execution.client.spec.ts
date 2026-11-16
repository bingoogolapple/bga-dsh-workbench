import type { Context } from '@deepseek-ai/cordis'
import { describe, expect, it, vi } from 'vitest'
import { createTaskBoardExecution } from '../src/client/task-board-execution.ts'
import { startExecution, type TaskRecord } from '../src/core/tasks.ts'

function fixture() {
  const listeners = new Set<() => void>()
  type Wire = { seq: number; time: number; type: string; data: unknown }
  let entries: Array<{ type: 'event'; event: Wire }> = []
  let openState = 'open'
  let preset = 'ptc'
  const prompt = vi.fn().mockResolvedValue({ ok: true })
  const execute = vi.fn().mockResolvedValue({ ok: true, value: { result: { kind: 'success' } } })
  const projections = vi.fn().mockResolvedValue({
    ok: true, value: { kind: 'sequenced', values: { permissions: { currentValue: 'read-only' } } },
  })
  const release = vi.fn()
  const session = {
    getSnapshot: () => ({ openState, openError: new Error('could not load history'), removed: false }),
    subscribe: vi.fn(() => () => {}),
    projections: { faceOf: () => ({ getSnapshot: () => preset }) },
    rename: vi.fn().mockResolvedValue({ ok: true }),
    beginSubmission: vi.fn(() => ({ requestId: 'request-own', abandon: vi.fn() })),
    prompt,
  }
  const binding = {
    session,
    sessionId: 'session-test',
    eventSource: {
      getSnapshot: () => ({ change: { kind: 'append', entries } }),
      subscribe: (listener: () => void) => {
        listeners.add(listener)
        return () => { listeners.delete(listener) }
      },
    },
  }
  const sessions = {
    create: vi.fn().mockResolvedValue(binding.sessionId),
    retain: vi.fn(() => ({ ready: Promise.resolve(binding), release })),
    list: { getSnapshot: () => ({ byId: {} }) },
  }
  const list = vi.fn().mockResolvedValue({
    ok: true, value: { presets: [{ id: 'ptc', isDefault: true }, { id: 'broken', isDefault: false, broken: 'invalid config' }] },
  })
  const events = vi.fn().mockResolvedValue({ ok: true, value: { cursor: 0, hasMore: false, records: [] } })
  const ctx = {
    get: (name: string) => name === 'sessions' ? sessions : undefined,
    workspaces: { list: { getSnapshot: () => ({ items: [{ workspaceId: 'workspace-test', sessionIds: [] }] }) } },
    remote: { agentPresets: { list }, commands: { execute }, session: { projections, events } },
  } as unknown as Context
  const service = createTaskBoardExecution(ctx)
  const task: TaskRecord = {
    id: 'task', title: 'Title', description: '', prompt: 'Run this', status: 'todo', mode: 'ptc', permission: 'read-only',
    createdAt: 0, updatedAt: 0, executions: [],
  }
  const onEvent = vi.fn()
  return {
    ...service, sessions, prompt, execute, projections, release, onEvent, events,
    setOpenError: () => { openState = 'error' },
    setPreset: (id: string) => { preset = id },
    run: (overrides: Partial<TaskRecord> = {}) => {
      const { task: started, execution } = startExecution({ ...task, ...overrides }, 1, 'run')
      return service.execution.run(started, execution, onEvent)
    },
    publish(records: readonly Wire[]) {
      entries = records.map(event => ({ type: 'event', event }))
      for (const listener of listeners) listener()
    },
  }
}

describe('rc.3 execution adapter', () => {
  it('uses the typed roster, dedicated create, command handler output and durable permission projection', async () => {
    const fixtureData = fixture()
    const { loadPresets, sessions, execute, projections, prompt, release, onEvent, publish } = fixtureData
    const presets = await loadPresets()
    expect(presets[0]).not.toHaveProperty('broken')
    await fixtureData.run()

    expect(sessions.create).toHaveBeenCalledWith({ workspaceId: 'workspace-test', agentPreset: 'ptc' })
    expect(sessions.retain).toHaveBeenCalledWith('session-test', {
      source: 'bga-dsh-workbench-execution', signal: expect.any(AbortSignal),
    })
    expect(execute).toHaveBeenCalledWith('session-test', '/permission read-only', [], expect.any(AbortSignal))
    expect(projections).toHaveBeenCalledWith({ sessionId: 'session-test' }, expect.any(AbortSignal))
    expect(prompt).toHaveBeenCalledWith([{ type: 'text', text: 'Run this' }], 'queue', expect.any(AbortSignal), 'request-own')
    expect(release).not.toHaveBeenCalled()

    publish([
      { seq: 1, time: 2, type: 'agent/inbox/spliced', data: {
        target: 'next-turn', start: 0, inserted: [{ source: { kind: 'user', rpcId: 'request-own' } }],
      } },
      { seq: 2, time: 3, type: 'turn/start', data: { turn: 1 } },
      { seq: 3, time: 3, type: 'agent/inbox/spliced', data: {
        target: 'next-turn', start: 0, removedCount: 1, inserted: [],
      } },
      { seq: 4, time: 4, type: 'turn/end', data: { turn: 1, reason: { kind: 'error', error: { message: 'model refused' } } } },
    ])
    expect(onEvent).toHaveBeenLastCalledWith(expect.objectContaining({ outcome: 'failed', error: 'model refused' }))
    expect(release).toHaveBeenCalledTimes(1)
  })

  it('refuses to send when the Host matched the command but its handler returned an error', async () => {
    const { run, execute, projections, prompt, release, onEvent } = fixture()
    execute.mockResolvedValue({ ok: true, value: { result: { kind: 'error', text: 'unknown preset' } } })
    await run()
    expect(projections).not.toHaveBeenCalled()
    expect(prompt).not.toHaveBeenCalled()
    expect(onEvent).toHaveBeenLastCalledWith(expect.objectContaining({ outcome: 'failed', error: 'unknown preset' }))
    expect(release).toHaveBeenCalledTimes(1)
  })

  it('refuses to send when the requested permission or preset does not match the authoritative projection', async () => {
    const first = fixture()
    first.projections.mockResolvedValue({
      ok: true, value: { kind: 'sequenced', values: { permissions: { currentValue: 'danger-full-access' } } },
    })
    await first.run()
    expect(first.prompt).not.toHaveBeenCalled()
    expect(first.onEvent).toHaveBeenLastCalledWith(expect.objectContaining({ outcome: 'failed' }))

    const second = fixture()
    second.setPreset('standard')
    await second.run()
    expect(second.execute).not.toHaveBeenCalled()
    expect(second.prompt).not.toHaveBeenCalled()
    expect(second.onEvent).toHaveBeenLastCalledWith(expect.objectContaining({ outcome: 'failed' }))
  })

  it('releases the failed reference even if the open attempt resolved', async () => {
    const { run, setOpenError, prompt, release, onEvent } = fixture()
    setOpenError()
    await run()
    expect(prompt).not.toHaveBeenCalled()
    expect(release).toHaveBeenCalledTimes(1)
    expect(onEvent).toHaveBeenLastCalledWith(expect.objectContaining({ error: 'could not load history' }))
  })

  it('leaves the Host default available and refuses missing or broken pinned presets before creating', async () => {
    const { run, prompt, sessions, onEvent, execution } = fixture()
    await run({ mode: 'missing' })
    await run({ mode: 'broken' })
    expect(sessions.create).not.toHaveBeenCalled()
    expect(onEvent).toHaveBeenCalledTimes(2)
    await run({ mode: undefined, permission: undefined })
    expect(sessions.create).toHaveBeenCalledWith({ workspaceId: 'workspace-test', agentPreset: undefined })
    expect(prompt).toHaveBeenCalledTimes(1)
    execution.dispose()
  })
})
