import { useState, useSyncExternalStore } from 'react'
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'

export interface TaskBoardConfig {
  taskBoard?: {
    enabled?: boolean
    announceToAgent?: boolean
  }
}

type Field = keyof NonNullable<TaskBoardConfig['taskBoard']>
type FieldText = '' | 'true' | 'false'
type SettingsDraft = Partial<Record<Field, FieldText>>

interface Draft {
  revision: number | undefined
  values: SettingsDraft
}

export interface CardShell {
  available: boolean
  exposed: boolean
  writable: boolean
  dirty: boolean
  saving: boolean
  failed: boolean
  failedReason?: string
}

function readField(section: unknown, field: Field): FieldText {
  if (typeof section !== 'object' || section === null || !('taskBoard' in section)) return ''
  const board = section.taskBoard
  if (typeof board !== 'object' || board === null || !Object.hasOwn(board, field)) return ''
  const value = (board as Record<string, unknown>)[field]
  if (value === true) return 'true'
  if (value === false) return 'false'
  return ''
}

export function useTaskBoardSettings(form: ConfigForm<TaskBoardConfig>) {
  const snapshot = useSyncExternalStore(
    listener => form.subscribe(listener),
    () => form.getSnapshot(),
  )
  const [draft, setDraft] = useState<Draft>()
  const [saving, setSaving] = useState(false)
  const [failure, setFailure] = useState<{ reason?: string }>()

  const field = (name: Field) => {
    const text = draft?.values[name] ?? readField(snapshot.user, name)
    return { text, overridden: text !== '' }
  }

  const edit = (name: Field, value: string) => {
    if (saving || (value !== '' && value !== 'true' && value !== 'false')) return
    setDraft(previous => {
      const values = { ...previous?.values, [name]: value }
      if (value === readField(snapshot.user, name)) delete values[name]
      if (Object.keys(values).length === 0) return undefined
      return { revision: previous?.revision ?? snapshot.revision, values }
    })
    setFailure(undefined)
  }

  const save = async () => {
    if (!snapshot.writable || draft === undefined || saving) return
    const writes = Object.entries(draft.values).map(([field, value]) => {
      const path = ['taskBoard', field]
      return value === '' ? { op: 'unset' as const, path }
        : { op: 'set' as const, path, value: value === 'true' }
    })
    setSaving(true)
    setFailure(undefined)
    try {
      if (await form.mutate(writes, draft.revision)) {
        setDraft(undefined)
      } else {
        // Rc.3 refreshes the snapshot on a rejected batch. Keep the draft for an explicit retry.
        setDraft({ ...draft, revision: form.getSnapshot().revision })
        setFailure({})
      }
    } catch (error) {
      setFailure({ reason: error instanceof Error ? error.message : String(error) })
    } finally {
      setSaving(false)
    }
  }

  const state: CardShell = {
    available: snapshot.status !== 'loading',
    exposed: snapshot.status === 'ready',
    writable: snapshot.writable,
    dirty: draft !== undefined,
    saving,
    failed: failure !== undefined,
    failedReason: failure?.reason,
  }
  return {
    state, field, edit, save,
    discard: () => { setDraft(undefined); setFailure(undefined) },
  }
}
