import type { ExecutionRecord, TaskPermission, TaskRecord } from './tasks.ts'

export interface ExecutionWorkspace {
  readonly workspaceId: string
  readonly sessionIds: readonly string[]
}

export function preferredWorkspaceId(
  currentSessionId: string | undefined,
  workspaces: readonly ExecutionWorkspace[],
): string | undefined {
  return workspaces.find(workspace => currentSessionId !== undefined && workspace.sessionIds.includes(currentSessionId))?.workspaceId
    ?? workspaces[0]?.workspaceId
}

type Outcome = {
  outcome: 'succeeded' | 'failed' | 'cancelled'
  error?: string
}

export type ExecutionJournalEvent = { seq: number; time: number } & (
  | { kind: 'turn-start'; turn: number }
  | { kind: 'turn-end'; turn: number; result?: Outcome }
  | { kind: 'prompt'; requestId?: string; text?: string }
  | {
    kind: 'queue'
    target: 'next-turn' | 'next-step'
    start: number
    removedCount: number
    inserted: readonly (string | undefined)[]
    cancelled: boolean
  }
)

export type ExecutionJournalUpdate =
  | { kind: 'append' | 'replace'; events: readonly ExecutionJournalEvent[] }
  | { kind: 'removed' }

export interface ExecutionJournalPage {
  readonly events: readonly ExecutionJournalEvent[]
  readonly cursor: number
  readonly beforeSeq?: number
}

interface PreparedPrompt {
  readonly requestId: string
  send(signal: AbortSignal): Promise<{ ok: true } | { ok: false; message: string; uncertain: boolean }>
  abandon(): void
}

export interface ExecutionSession {
  verifyPreset(preset: string, signal: AbortSignal): Promise<void>
  setPermission(permission: TaskPermission, signal: AbortSignal): Promise<void>
  rename(title: string): Promise<void>
  preparePrompt(text: string): PreparedPrompt
  observe(listener: (update: ExecutionJournalUpdate) => void): () => void
  dispose(): void
}

export interface ExecutionEnvironment {
  workspaces(): readonly ExecutionWorkspace[]
  currentSessionId(): string | undefined
  createSession(workspaceId: string, preset: string | undefined): Promise<string>
  openSession(sessionId: string, signal: AbortSignal): Promise<ExecutionSession>
  readJournal(
    sessionId: string,
    cut: { beforeSeq?: number; throughSeq?: number },
    signal: AbortSignal,
  ): Promise<ExecutionJournalPage | 'missing'>
}

export type ExecutionEvent =
  | { kind: 'started'; taskId: string; executionId: string; sessionId: string; requestId?: string }
  | ({ kind: 'settled'; taskId: string; executionId: string } & Outcome)

type SettledEvent = Extract<ExecutionEvent, { kind: 'settled' }>

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function promptOf(task: TaskRecord): string {
  return task.prompt.trim() === '' ? task.title : task.prompt
}

function settled(task: TaskRecord, execution: ExecutionRecord, result: Outcome): SettledEvent {
  return { ...result, kind: 'settled', taskId: task.id, executionId: execution.id }
}

const sessionRemoved: Outcome = { outcome: 'cancelled', error: 'execution session no longer exists' }
const requestRemoved: Outcome = { outcome: 'cancelled', error: 'execution prompt was removed from the queue' }

/** Follow a queued request from its Inbox position to the turn that claims it. */
class RequestTurn {
  private pending: { target: 'next-turn' | 'next-step'; index: number } | undefined
  private currentTurn: number | undefined
  private requestTurn: number | undefined
  private sequence = -1
  seen = false
  removed = false
  result: Outcome | undefined

  constructor(private readonly requestId: string) {}

  consume(events: readonly ExecutionJournalEvent[]): void {
    for (const event of events) {
      if (event.seq <= this.sequence || this.result !== undefined) continue
      this.sequence = event.seq
      switch (event.kind) {
        case 'turn-start':
          this.currentTurn = event.turn
          break
        case 'turn-end':
          if (this.requestTurn === event.turn) this.result = event.result
          if (this.currentTurn === event.turn) this.currentTurn = undefined
          break
        case 'prompt':
          if (event.requestId === this.requestId) {
            this.seen = true
            this.removed = false
            this.requestTurn ??= this.currentTurn
          }
          break
        case 'queue':
          this.splice(event)
          break
      }
    }
  }

  private splice(event: Extract<ExecutionJournalEvent, { kind: 'queue' }>): void {
    const insertedAt = event.inserted.indexOf(this.requestId)
    if (insertedAt !== -1) {
      this.seen = true
      this.removed = false
      this.pending = { target: event.target, index: event.start + insertedAt }
      return
    }
    const pending = this.pending
    if (pending === undefined || pending.target !== event.target || pending.index < event.start) return
    if (pending.index >= event.start + event.removedCount) {
      pending.index += event.inserted.length - event.removedCount
      return
    }
    this.pending = undefined
    if (event.cancelled) {
      this.removed = true
    } else {
      // The loop opens a turn before claiming next-turn input, even if a
      // pre-step refusal means there is never a user/message for this prompt.
      this.requestTurn ??= this.currentTurn
    }
  }
}

/** Older ledger records lack request IDs. Only attribute an unambiguous matching turn. */
function legacyResult(
  task: TaskRecord,
  execution: ExecutionRecord,
  events: readonly ExecutionJournalEvent[],
): Outcome | undefined {
  let turn: number | undefined
  let matches = false
  const results: Array<Outcome | undefined> = []
  for (const event of events) {
    if (event.kind === 'turn-start') {
      if (matches) results.push(undefined)
      turn = event.time >= execution.startedAt ? event.turn : undefined
      matches = false
    } else if (event.kind === 'prompt' && turn !== undefined && event.text === promptOf(task)) {
      matches = true
    } else if (event.kind === 'turn-end' && event.turn === turn) {
      if (matches) results.push(event.result)
      turn = undefined
      matches = false
    }
  }
  return !matches && results.length === 1 ? results[0] : undefined
}

export class ExecutionService {
  private readonly lifetime = new AbortController()
  private readonly releases = new Set<() => void>()

  constructor(private readonly env: ExecutionEnvironment) {}

  dispose(): void {
    this.lifetime.abort()
    for (const release of this.releases) release()
  }

  /** Launch and return after submission; the subscription owns the session until settlement. */
  async run(
    task: TaskRecord,
    execution: ExecutionRecord,
    onEvent: (event: ExecutionEvent) => void,
  ): Promise<void> {
    const signal = this.lifetime.signal
    if (signal.aborted) return
    let session: ExecutionSession | undefined
    let unsubscribe: (() => void) | undefined
    let prompt: PreparedPrompt | undefined
    let closed = false
    const release = (): void => {
      if (closed) return
      closed = true
      unsubscribe?.()
      prompt?.abandon()
      session?.dispose()
      this.releases.delete(release)
    }
    const finish = (result: Outcome): void => {
      if (closed) return
      release()
      onEvent(settled(task, execution, result))
    }
    this.releases.add(release)
    try {
      const workspaceId = this.workspaceFor(task.workspaceId)
      const preset = task.mode || undefined
      const sessionId = await this.env.createSession(workspaceId, preset)
      signal.throwIfAborted()
      const start: ExecutionEvent = { kind: 'started', taskId: task.id, executionId: execution.id, sessionId }
      onEvent(start)

      session = await this.env.openSession(sessionId, signal)
      if (signal.aborted) {
        session.dispose()
        return
      }
      if (preset !== undefined) await session.verifyPreset(preset, signal)
      if (task.permission !== undefined) await session.setPermission(task.permission, signal)
      await session.rename(task.title).catch(() => {})
      if (preset !== undefined) await session.verifyPreset(preset, signal)
      signal.throwIfAborted()

      prompt = session.preparePrompt(promptOf(task))
      const { requestId } = prompt
      const tracked: ExecutionRecord = { ...execution, sessionId, requestId }
      let request = new RequestTurn(requestId)
      let mayNeedHistory = false
      let recovering = false
      let recoveryRequested = false
      const recover = async (): Promise<void> => {
        if (closed) return
        if (recovering) {
          recoveryRequested = true
          return
        }
        recovering = true
        try {
          do {
            recoveryRequested = false
            const outcome = await this.readOutcome(task, tracked)
            if (outcome !== undefined && !(outcome === requestRemoved && request.seen && !request.removed)) {
              finish(outcome)
            }
          } while (recoveryRequested && !closed)
        } finally {
          recovering = false
        }
      }
      const stop = session.observe(update => {
        if (closed) return
        if (update.kind === 'removed') {
          finish(sessionRemoved)
          return
        }
        if (update.kind === 'replace') {
          request = new RequestTurn(requestId)
          mayNeedHistory = true
        }
        request.consume(update.events)
        if (request.result !== undefined) finish(request.result)
        // Steering is a removal and an immediate insertion into next-step.
        // Check a passive journal cut before treating a live removal as final.
        else if (request.removed || update.kind === 'replace'
          || (mayNeedHistory && update.events.some(event => event.kind === 'turn-end'))) void recover()
      })
      unsubscribe = stop
      if (closed) {
        stop()
        return
      }

      // The controller persists this correlation before the Host can admit the prompt.
      onEvent({ ...start, requestId })
      signal.throwIfAborted()
      const response = await prompt.send(signal)
      if (!response.ok && !request.seen) {
        if (response.uncertain) await recover()
        else finish({ outcome: 'failed', error: response.message })
      }
    } catch (error) {
      if (!signal.aborted) finish({ outcome: 'failed', error: messageOf(error) })
    }
  }

  async reconcile(task: TaskRecord): Promise<ExecutionEvent | undefined> {
    const execution = task.executions.at(-1)
    if (this.lifetime.signal.aborted || execution === undefined || execution.endedAt !== undefined) return undefined
    // Another mounted board can see a prepared execution before it submits.
    // Nothing in the journal has been attributed to this run yet.
    if (execution.requestId === null) return undefined
    const result = await this.readOutcome(task, execution)
    return result === undefined ? undefined : settled(task, execution, result)
  }

  private workspaceFor(pinned: string | undefined): string {
    const workspaces = this.env.workspaces()
    if (pinned !== undefined && pinned !== '') {
      if (!workspaces.some(workspace => workspace.workspaceId === pinned)) {
        throw new Error(`task workspace is not available: ${pinned}`)
      }
      return pinned
    }
    const preferred = preferredWorkspaceId(this.env.currentSessionId(), workspaces)
    if (preferred === undefined) throw new Error('no workspace available to run the task in')
    return preferred
  }

  private async readOutcome(task: TaskRecord, execution: ExecutionRecord): Promise<Outcome | undefined> {
    const signal = this.lifetime.signal
    if (execution.sessionId === undefined || signal.aborted) return undefined
    const events: ExecutionJournalEvent[][] = []
    let foundRequest = false
    let beforeSeq: number | undefined
    let throughSeq: number | undefined
    try {
      while (!signal.aborted) {
        const page = await this.env.readJournal(execution.sessionId, { beforeSeq, throughSeq }, signal)
        if (signal.aborted) return undefined
        if (page === 'missing') return sessionRemoved
        throughSeq ??= page.cursor
        events.push([...page.events])
        if (typeof execution.requestId === 'string') {
          const requestId = execution.requestId
          foundRequest ||= page.events.some(event =>
            (event.kind === 'prompt' && event.requestId === requestId)
            || (event.kind === 'queue' && event.inserted.includes(requestId)))
          if (foundRequest) {
            const request = new RequestTurn(requestId)
            for (let index = events.length - 1; index >= 0; index--) request.consume(events[index]!)
            if (request.result !== undefined) return request.result
            if (request.removed) return requestRemoved
          }
        } else if (page.beforeSeq === undefined || page.events.some(event => event.time < execution.startedAt)) {
          return legacyResult(task, execution, events.reverse().flat())
        }
        if (page.beforeSeq === undefined || (beforeSeq !== undefined && page.beforeSeq >= beforeSeq)) return undefined
        beforeSeq = page.beforeSeq
      }
    } catch (error) {
      if (!signal.aborted) console.warn('[bga-dsh-workbench] execution history read failed', error)
    }
    return undefined
  }
}
