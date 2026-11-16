import { describe, expect, it, vi } from 'vitest'
import { BoardController } from '../src/core/controller.ts'
import {
  ExecutionService, preferredWorkspaceId, type ExecutionEnvironment, type ExecutionJournalEvent,
  type ExecutionJournalUpdate, type ExecutionSession,
} from '../src/core/execution.ts'
import { isTaskRecord, type TaskRecord } from '../src/core/tasks.ts'

const succeeded = { outcome: 'succeeded' } as const
const now = 100
const start = (seq: number, turn: number): ExecutionJournalEvent => ({ kind: 'turn-start', seq, time: now + seq, turn })
const end = (
  seq: number, turn: number, result: Extract<ExecutionJournalEvent, { kind: 'turn-end' }>['result'] = succeeded,
): ExecutionJournalEvent => ({ kind: 'turn-end', seq, time: now + seq, turn, result })
const prompt = (seq: number, requestId: string, text?: string): ExecutionJournalEvent => ({
  kind: 'prompt', seq, time: now + seq, requestId, text,
})
const queued = (seq: number, start: number, ...inserted: string[]): Extract<ExecutionJournalEvent, { kind: 'queue' }> => ({
  kind: 'queue', target: 'next-turn', seq, time: now + seq, start, removedCount: 0, inserted, cancelled: false,
})
const removed = (seq: number, start: number, cancelled = false): Extract<ExecutionJournalEvent, { kind: 'queue' }> => ({
  kind: 'queue', target: 'next-turn', seq, time: now + seq, start, removedCount: 1, inserted: [], cancelled,
})

function runningTask(requestId?: string | null): TaskRecord {
  return {
    id: 'task', title: '任务', description: '', prompt: '执行任务', status: 'running', createdAt: now, updatedAt: now,
    executions: [{
      id: 'run', sessionId: 's1', requestId, startedAt: now, endedAt: undefined, result: undefined, error: undefined,
    }],
  }
}

function fixture() {
  let listener: ((update: ExecutionJournalUpdate) => void) | undefined
  const send = vi.fn<ReturnType<ExecutionSession['preparePrompt']>['send']>().mockResolvedValue({ ok: true })
  const driver: ExecutionSession = {
    rename: vi.fn().mockResolvedValue(undefined),
    preparePrompt: vi.fn(() => ({ requestId: 'own', abandon: vi.fn(), send })),
    setPermission: vi.fn().mockResolvedValue(undefined),
    verifyPreset: vi.fn().mockResolvedValue(undefined),
    observe(next) {
      listener = next
      return () => { listener = undefined }
    },
    dispose: vi.fn(),
  }
  const env: ExecutionEnvironment = {
    workspaces: () => [
      { workspaceId: 'default', sessionIds: [] },
      { workspaceId: 'current-workspace', sessionIds: ['current'] },
    ],
    currentSessionId: () => 'current',
    createSession: vi.fn().mockResolvedValue('s1'),
    openSession: vi.fn().mockResolvedValue(driver),
    readJournal: vi.fn().mockResolvedValue({ cursor: 0, events: [] }),
  }
  return {
    env, driver, send, service: new ExecutionService(env),
    publish: (events: readonly ExecutionJournalEvent[]) => listener?.({ kind: 'append', events }),
    replace: (events: readonly ExecutionJournalEvent[]) => listener?.({ kind: 'replace', events }),
  }
}

describe('workbench task execution', () => {
  it('creates a dedicated session in the selected workspace, records the request before submitting, and keeps the reference until its turn ends', async () => {
    const { service, env, driver, send, publish } = fixture()
    const task = { ...runningTask(), mode: 'ptc', permission: 'read-only' as const }
    const trace: string[] = []
    send.mockImplementation(async () => { trace.push('sent'); return { ok: true } })
    const onEvent = vi.fn(event => { if (event.kind === 'started' && event.requestId !== undefined) trace.push('stored') })
    await service.run(task, task.executions[0]!, onEvent)

    expect(env.createSession).toHaveBeenCalledWith('current-workspace', 'ptc')
    expect(driver.verifyPreset).toHaveBeenCalledWith('ptc', expect.any(AbortSignal))
    expect(driver.setPermission).toHaveBeenCalledWith('read-only', expect.any(AbortSignal))
    expect(trace).toEqual(['stored', 'sent'])
    expect(driver.dispose).not.toHaveBeenCalled()

    publish([queued(1, 0, 'other'), queued(2, 1, 'own'), start(3, 1), removed(4, 0), end(5, 1)])
    expect(onEvent).toHaveBeenCalledTimes(2)
    // A turn can fail during pre-step admission without ever producing user/message.
    publish([start(6, 2), removed(7, 0), end(8, 2, { outcome: 'failed', error: 'blocked' })])
    publish([end(9, 2)])
    expect(onEvent).toHaveBeenCalledTimes(3)
    expect(onEvent).toHaveBeenLastCalledWith({
      kind: 'settled', taskId: 'task', executionId: 'run', outcome: 'failed', error: 'blocked',
    })
    expect(driver.dispose).toHaveBeenCalledTimes(1)
  })

  it('handles settlement arriving before the prompt response and ignores later unrelated turns', async () => {
    const { service, send, publish } = fixture()
    const task = runningTask()
    send.mockImplementation(async () => {
      publish([start(1, 1), prompt(2, 'own'), end(3, 1)])
      return { ok: false, message: 'connection lost', uncertain: true }
    })
    const onEvent = vi.fn()
    await service.run(task, task.executions[0]!, onEvent)
    expect(onEvent).toHaveBeenCalledTimes(3)
    expect(onEvent).toHaveBeenLastCalledWith({
      kind: 'settled', taskId: 'task', executionId: 'run', outcome: 'succeeded',
    })
  })

  it('ignores a later successful turn when the task request was removed from the queue', async () => {
    const { service, env, publish } = fixture()
    const task = runningTask()
    const onEvent = vi.fn()
    await service.run(task, task.executions[0]!, onEvent)
    const events = [queued(1, 0, 'own'), removed(2, 0, true), start(3, 1), prompt(4, 'other'), end(5, 1)]
    vi.mocked(env.readJournal).mockResolvedValue({ cursor: 5, events })
    publish(events)
    await vi.waitFor(() => expect(onEvent).toHaveBeenLastCalledWith(expect.objectContaining({ outcome: 'cancelled' })))
  })

  it('tracks a queued request moved into a running turn instead of cancelling it', async () => {
    const { service, env, publish } = fixture()
    const task = runningTask()
    const onEvent = vi.fn()
    await service.run(task, task.executions[0]!, onEvent)
    const events = [
      start(1, 1), queued(2, 0, 'own'), removed(3, 0, true),
      { ...queued(4, 0, 'own'), target: 'next-step' } as const,
      { ...removed(5, 0), target: 'next-step' } as const, end(6, 1),
    ]
    vi.mocked(env.readJournal).mockResolvedValue({ cursor: 6, events })
    publish(events.slice(0, 3))
    publish(events.slice(3))
    expect(onEvent).toHaveBeenLastCalledWith(expect.objectContaining({ outcome: 'succeeded' }))
    expect(onEvent).toHaveBeenCalledTimes(3)
  })

  it('releases the session on disposal without treating shutdown as a Host cancellation', async () => {
    const { service, driver, publish } = fixture()
    const task = runningTask()
    const onEvent = vi.fn()
    await service.run(task, task.executions[0]!, onEvent)
    service.dispose()
    publish([start(1, 1), prompt(2, 'own'), end(3, 1)])
    expect(driver.dispose).toHaveBeenCalledTimes(1)
    expect(onEvent).toHaveBeenCalledTimes(2)
  })

  it('recovers a result after reconnect truncated the request from the live history window', async () => {
    const { service, env, publish, replace } = fixture()
    const task = runningTask()
    const onEvent = vi.fn()
    const history = [queued(1, 0, 'own'), start(2, 1), removed(3, 0)]
    let finishOldRead: (value: { cursor: number; events: readonly ExecutionJournalEvent[] }) => void = () => {}
    vi.mocked(env.readJournal)
      .mockImplementationOnce(() => new Promise(resolve => { finishOldRead = resolve }))
      .mockResolvedValueOnce({ cursor: 12, events: [...history, end(12, 1)] })
    await service.run(task, task.executions[0]!, onEvent)
    publish(history)
    replace([])
    publish([end(12, 1)])
    finishOldRead({ cursor: 11, events: history })
    await vi.waitFor(() => expect(onEvent).toHaveBeenLastCalledWith(expect.objectContaining({ outcome: 'succeeded' })))
  })

  it('does not send when the controller cannot persist the request identity', async () => {
    const { service, send } = fixture()
    const original = { ...runningTask(), executions: [], status: 'todo' as const }
    const writes: TaskRecord[] = []
    const store = {
      load: () => [original],
      save(rows: readonly TaskRecord[]) {
        const [task] = rows
        writes.push(task!)
        return task?.status !== 'running' || task.executions[0]?.requestId !== 'own'
      },
      clear() {},
    }
    const controller = new BoardController({
      exec: service, store, now: () => now, uuid: () => 'run',
      sessions: { list: { getSnapshot: () => ({}), subscribe: () => () => {} }, open() {} },
    })
    controller.start()
    await controller.runTask('task')
    controller.dispose()
    expect(send).not.toHaveBeenCalled()
    expect(writes.map(task => task.executions[0]?.requestId)).toEqual([null, null, 'own', 'own'])
    expect(writes.at(-1)?.executions[0]?.result).toBe('failed')
  })
})

describe('workbench execution recovery', () => {
  it('uses a bounded cut across pages and attributes a completed turn to its own request', async () => {
    const { service, env } = fixture()
    vi.mocked(env.readJournal)
      .mockResolvedValueOnce({ cursor: 8, beforeSeq: 4, events: [end(4, 1), start(5, 2), prompt(6, 'other'), end(8, 2)] })
      .mockResolvedValueOnce({ cursor: 8, events: [queued(1, 0, 'own'), start(2, 1), removed(3, 0)] })
    const result = await service.reconcile(runningTask('own'))
    expect(env.readJournal).toHaveBeenLastCalledWith('s1', { beforeSeq: 4, throughSeq: 8 }, expect.any(AbortSignal))
    expect(result).toMatchObject({ outcome: 'succeeded' })
  })

  it('does not infer a result from an unrelated turn or from a request that is only queued', async () => {
    const { service, env } = fixture()
    vi.mocked(env.readJournal).mockResolvedValue({
      cursor: 5, events: [start(1, 1), prompt(2, 'other'), end(3, 1), queued(5, 0, 'own')],
    })
    await expect(service.reconcile(runningTask('own'))).resolves.toBeUndefined()
    await expect(service.reconcile(runningTask(null))).resolves.toBeUndefined()
  })

  it('treats a missing tracked session as cancelled and read failures as unverified', async () => {
    const { service, env } = fixture()
    vi.mocked(env.readJournal).mockResolvedValueOnce('missing').mockRejectedValueOnce(new Error('offline'))
    await expect(service.reconcile(runningTask('own'))).resolves.toMatchObject({ outcome: 'cancelled' })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      await expect(service.reconcile(runningTask('own'))).resolves.toBeUndefined()
    } finally {
      warn.mockRestore()
    }
  })

  it('keeps old ledger rows readable and only recovers a single matching turn', async () => {
    const { service, env } = fixture()
    const legacy = JSON.parse(JSON.stringify(runningTask()))
    expect(isTaskRecord(legacy)).toBe(true)
    expect(legacy.executions[0]).not.toHaveProperty('requestId')
    expect(isTaskRecord(JSON.parse(JSON.stringify(runningTask('own'))))).toBe(true)
    expect(isTaskRecord(JSON.parse(JSON.stringify(runningTask(null))))).toBe(true)
    vi.mocked(env.readJournal).mockResolvedValueOnce({
      cursor: 3, events: [start(1, 1), prompt(2, 'legacy', '执行任务'), end(3, 1)],
    }).mockResolvedValueOnce({
      cursor: 6,
      events: [start(1, 1), prompt(2, 'a', '执行任务'), end(3, 1), start(4, 2), prompt(5, 'b', '执行任务'), end(6, 2)],
    })
    await expect(service.reconcile(legacy)).resolves.toMatchObject({ outcome: 'succeeded' })
    await expect(service.reconcile(legacy)).resolves.toBeUndefined()
  })
})

describe('default workbench workspace', () => {
  const workspaces = [
    { workspaceId: 'first', sessionIds: [] },
    { workspaceId: 'active', sessionIds: ['current'] },
  ]
  it('prefers the workspace of the current session, then the first workspace', () => {
    expect(preferredWorkspaceId('current', workspaces)).toBe('active')
    expect(preferredWorkspaceId('other', workspaces)).toBe('first')
    expect(preferredWorkspaceId(undefined, [])).toBeUndefined()
  })
})
