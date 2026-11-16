import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { ISessions, SessionBinding } from '@deepseek-ai/dsh-api-session-controller/client'
import type { SessionWireEvent } from '@deepseek-ai/dsh-api-session-controller/types'
import type { WorkspaceId } from '@deepseek-ai/dsh-api-workspace-controller/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-permission-presets/types'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { ExecutionPresetOption } from '../core/controller.ts'
import { ExecutionService, type ExecutionJournalEvent, type ExecutionSession } from '../core/execution.ts'

declare module '@deepseek-ai/dsh-api-session-controller/client' {
  interface SessionReferenceSourceMap {
    'bga-dsh-workbench-execution': unknown
  }
}

export function currentTaskBoardSessionId(ctx: ClientContext): SessionId | undefined {
  const sessions = ctx.get('sessions' as string) as ISessions
  return Object.values(sessions.list.getSnapshot().byId)
    .find(session => (session.retainedBy.mainView ?? 0) > 0)?.id
}

function objectOf(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : undefined
}

function promptRequestId(message: unknown): string | undefined {
  const source = objectOf(objectOf(message)?.source)
  return source?.kind === 'user' && typeof source.rpcId === 'string' ? source.rpcId : undefined
}

function turnResult(reason: unknown): Extract<ExecutionJournalEvent, { kind: 'turn-end' }>['result'] {
  const value = objectOf(reason)
  switch (value?.kind) {
    case 'completed': return { outcome: 'succeeded' }
    case 'error': {
      const error = objectOf(value.error)
      return { outcome: 'failed', error: typeof error?.message === 'string' ? error.message : 'agent turn failed' }
    }
    case 'blocked': return { outcome: 'failed', error: 'agent rejected turn admission' }
    case 'max-tokens': return { outcome: 'failed', error: 'agent reached the output token limit' }
    case 'aborted': return { outcome: 'cancelled', error: 'agent turn was cancelled' }
    case 'interrupted': return { outcome: 'cancelled', error: 'agent turn was interrupted' }
    default: return undefined
  }
}

/** Live and cold History both carry the same durable event envelope. */
function journalEvent(event: Omit<SessionWireEvent, 'data'> & { data: unknown }): ExecutionJournalEvent | undefined {
  const data = objectOf(event.data)
  if (data === undefined) return undefined
  const point = { seq: event.seq, time: event.time }
  switch (event.type) {
    case 'turn/start':
      if (typeof data.turn === 'number') return { ...point, kind: 'turn-start', turn: data.turn }
      return undefined
    case 'turn/end':
      if (typeof data.turn === 'number') {
        return { ...point, kind: 'turn-end', turn: data.turn, result: turnResult(data.reason) }
      }
      return undefined
    case 'user/message': {
      if (objectOf(data.source)?.kind !== 'user') return undefined
      const content = Array.isArray(data.content) ? data.content : []
      const blocks = content.map(objectOf)
      const text = blocks.length > 0 && blocks.every(block => block?.type === 'text' && typeof block.text === 'string')
        ? blocks.map(block => block?.text).join('')
        : undefined
      return { ...point, kind: 'prompt', requestId: promptRequestId(data), text }
    }
    case 'agent/inbox/spliced':
      if ((data.target === 'next-turn' || data.target === 'next-step')
        && typeof data.start === 'number' && Array.isArray(data.inserted)) {
        return {
          ...point,
          kind: 'queue',
          target: data.target,
          start: data.start,
          removedCount: typeof data.removedCount === 'number' ? data.removedCount : 0,
          inserted: data.inserted.map(promptRequestId),
          cancelled: data.outcome === 'canceled',
        }
      }
      return undefined
    default: return undefined
  }
}

function journalEvents(entries: readonly { type: string; event: Omit<SessionWireEvent, 'data'> & { data: unknown } }[]): ExecutionJournalEvent[] {
  const events: ExecutionJournalEvent[] = []
  for (const entry of entries) {
    if (entry.type !== 'event') continue
    const event = journalEvent(entry.event)
    if (event !== undefined) events.push(event)
  }
  return events
}

function sessionDriver(ctx: ClientContext, binding: SessionBinding, dispose: () => void): ExecutionSession {
  const { eventSource, session, sessionId } = binding
  return {
    async verifyPreset(preset, signal) {
      signal.throwIfAborted()
      if (session.projections.faceOf('agentPreset').getSnapshot() !== preset) {
        throw new Error(`execution session did not activate the selected agent preset: ${preset}`)
      }
    },
    async setPermission(permission, signal) {
      // Session.command only reports whether a handler matched. Read the typed
      // execution result to catch a handler error before verifying the durable write.
      const execution = await ctx.remote.commands.execute(sessionId, `/permission ${permission}`, [], signal)
      if (!execution.ok) throw execution.error
      if (execution.value === undefined) throw new Error('the Host did not recognize /permission')
      if (execution.value.result.kind === 'error') throw new Error(execution.value.result.text)
      const projection = await ctx.remote.session.projections({ sessionId }, signal)
      if (!projection.ok) throw projection.error
      if (projection.value?.kind !== 'sequenced' || projection.value.values.permissions?.currentValue !== permission) {
        throw new Error(`execution permission was not applied: ${permission}`)
      }
    },
    async rename(title) { await session.rename(title) },
    preparePrompt(text) {
      const submission = session.beginSubmission({ mode: 'queue', text, attachments: [] })
      return {
        requestId: submission.requestId,
        abandon: () => { submission.abandon() },
        async send(signal) {
          const result = await session.prompt([{ type: 'text', text }], 'queue', signal, submission.requestId)
          if (result.ok) return { ok: true }
          return {
            ok: false,
            message: result.error.message,
            // A carrier failure does not say whether the Host admitted the request.
            uncertain: result.error.code === 'gateway/internal' || result.error.code === 'gateway/cancelled',
          }
        },
      }
    },
    observe(listener) {
      const stopEvents = eventSource.subscribe(() => {
        const { change } = eventSource.getSnapshot()
        if (change.kind === 'append' || change.kind === 'replace') {
          listener({ kind: change.kind, events: journalEvents(change.entries) })
        }
      })
      const stopSession = session.subscribe(() => {
        if (session.getSnapshot().removed) listener({ kind: 'removed' })
      })
      return () => { stopEvents(); stopSession() }
    },
    dispose,
  }
}

export function createTaskBoardExecution(ctx: ClientContext): {
  execution: ExecutionService
  loadPresets: () => Promise<readonly ExecutionPresetOption[]>
} {
  const sessions = ctx.get('sessions' as string) as ISessions
  const loadPresets = async (): Promise<readonly ExecutionPresetOption[]> => {
    const result = await ctx.remote.agentPresets.list()
    if (!result.ok) throw result.error
    return result.value.presets
  }
  return {
    loadPresets,
    execution: new ExecutionService({
      workspaces: () => ctx.workspaces.list.getSnapshot().items,
      currentSessionId: () => currentTaskBoardSessionId(ctx),
      async createSession(workspaceId, preset) {
        if (preset !== undefined) {
          const option = (await loadPresets()).find(option => option.id === preset)
          if (option === undefined) throw new Error(`agent preset is not available: ${preset}`)
          if (option.broken !== undefined) throw new Error(`agent preset ${preset} is unavailable: ${option.broken}`)
        }
        return sessions.create({ workspaceId: workspaceId as WorkspaceId, agentPreset: preset })
      },
      async openSession(sessionId, signal) {
        const reference = sessions.retain(sessionId as SessionId, { source: 'bga-dsh-workbench-execution', signal })
        try {
          const binding = await reference.ready
          const snapshot = binding.session.getSnapshot()
          if (snapshot.openState !== 'open' || snapshot.removed) {
            throw snapshot.openError ?? new Error('execution session did not open')
          }
          return sessionDriver(ctx, binding, () => { reference.release() })
        } catch (error) {
          reference.release()
          throw error
        }
      },
      async readJournal(sessionId, cut, signal) {
        const response = await ctx.remote.session.events({
          address: { kind: 'session', sessionId: sessionId as SessionId },
          ...cut,
          maxMessages: 100,
          turnWindow: { minMessages: 20, minTurns: 2 },
        }, signal)
        if (!response.ok) {
          if (response.error.code === 'session/not-found') return 'missing'
          throw response.error
        }
        const { cursor, records, hasMore } = response.value
        return {
          cursor,
          events: journalEvents(records),
          beforeSeq: hasMore ? records[0]?.event.seq : undefined,
        }
      },
    }),
  }
}
