import type { Context } from '@deepseek-ai/cordis'
import type { ISessions } from '@deepseek-ai/dsh-api-session-controller/client'
import type {} from '@deepseek-ai/dsh-api-workspace-controller/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { BoardController } from '../core/controller.ts'
import { FileTaskStore } from '../core/file-store.ts'
import { SchedulerService } from '../core/scheduler.ts'
import { WorkbenchMetaStore } from '../core/workbench-meta-store.ts'
import { createTaskBoardExecution, currentTaskBoardSessionId } from './task-board-execution.ts'
import type { TaskBoardDraft } from './task-board/board/TaskBoard.tsx'
import { mountBoard } from './task-board/board-mount.tsx'
import { en, zh, type TaskBoardKey } from './task-board/locales.ts'
import { mountSidebarEntry } from './task-board/sidebar-entry.tsx'
import type { TaskBoardConfig } from './task-board/settings-form.ts'
import { TaskBoardSettingsCard } from './task-board/TaskBoardSettingsCard.tsx'

const NS = 'bga-dsh-workbench-task-board'
const HOST_ENTRY = 'bga-dsh-workbench'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'bga-dsh-workbench-task-board': TaskBoardKey
  }
}

interface BoardView {
  controller: BoardController
  draft: TaskBoardDraft
}

export interface BoardSource {
  getSnapshot: () => BoardView | undefined
  subscribe: (listener: () => void) => () => void
}

function startTaskBoard(ctx: Context) {
  const { execution, loadPresets } = createTaskBoardExecution(ctx)
  const sessions = ctx.get('sessions' as string) as ISessions
  const { workspaces, uiWorkspace } = ctx
  const controller = new BoardController({
    store: new FileTaskStore(),
    exec: execution,
    metaStore: new WorkbenchMetaStore(),
    sessions: {
      list: {
        getSnapshot: () => ({ current: currentTaskBoardSessionId(ctx) }),
        subscribe: listener => sessions.list.subscribe(listener),
      },
      open: id => uiWorkspace.openSession(id as SessionId),
    },
  })
  const scheduler = new SchedulerService({
    tasks: () => controller.getSnapshot().tasks,
    refresh: () => controller.reloadFromStore(),
    now: () => Date.now(),
    runTask: id => controller.runTask(id),
    applySchedule: (id, nextRunAt, lastTriggeredAt) =>
      controller.applyScheduleNextRun(id, nextRunAt, lastTriggeredAt),
    readiness: {
      getSnapshot: () => sessions.list.getSnapshot().phase === 'ready'
        && workspaces.list.getSnapshot().phase === 'ready',
      subscribe(listener) {
        const offSessions = sessions.list.subscribe(listener)
        const offWorkspaces = workspaces.list.subscribe(listener)
        return () => { offSessions(); offWorkspaces() }
      },
    },
    environment: {
      addEventListener: (type, listener) => document.addEventListener(type, listener),
      removeEventListener: (type, listener) => document.removeEventListener(type, listener),
      get visibilityState() { return document.visibilityState },
    },
  })
  const scope = new AbortController()
  let presetGeneration = 0
  const pushPresets = async (): Promise<void> => {
    const generation = ++presetGeneration
    try {
      const presets = await loadPresets()
      if (!scope.signal.aborted && generation === presetGeneration) controller.setExecutionOptions({ presets })
    } catch (error) {
      if (!scope.signal.aborted) console.error('[bga-dsh-workbench] agent preset roster read failed', error)
    }
  }
  const pushWorkspaces = () => {
    controller.setExecutionOptions({
      workspaces: workspaces.list.getSnapshot().items.map(item => ({
        workspaceId: item.workspaceId,
        title: item.title || item.path,
      })),
    })
  }

  const disposers: Array<() => void> = [() => { execution.dispose() }, () => { controller.dispose() }]
  const dispose = () => {
    scope.abort()
    for (const disposer of disposers.splice(0).reverse()) disposer()
  }
  try {
    controller.start()
    disposers.push(workspaces.list.subscribe(pushWorkspaces))
    disposers.push(ctx.on('connection/reset', () => { void pushPresets() }))
    pushWorkspaces()
    void pushPresets()
    disposers.push(mountBoard(ctx, controller))
    disposers.push(mountSidebarEntry(ctx))
    disposers.push(() => { scheduler.dispose() })
    scheduler.start()
  } catch (error) {
    dispose()
    throw error
  }
  const view: BoardView = { controller, draft: {} }
  return { view, dispose }
}

export function applyTaskBoard(ctx: Context): BoardSource {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'task-board: dictionaries')
  const form = ctx.configForms.get<TaskBoardConfig>(HOST_ENTRY)
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: NS,
    order: 110,
    locale: NS,
    label: () => ctx.locale.bind(NS)('settings.title'),
    inject: () => ({ form }),
  }, TaskBoardSettingsCard))

  let board: ReturnType<typeof startTaskBoard> | undefined
  const listeners = new Set<() => void>()
  const update = (next: typeof board) => {
    const previous = board
    board = next
    previous?.dispose()
    for (const listener of listeners) listener()
  }
  ctx.effect(() => {
    const sync = () => {
      const snapshot = form.getSnapshot()
      if (snapshot.status === 'loading') return
      const enabled = snapshot.status === 'ready' && (snapshot.value?.taskBoard?.enabled ?? true)
      if (enabled === (board !== undefined)) return
      try {
        update(enabled ? startTaskBoard(ctx) : undefined)
      } catch (error) {
        console.error('[bga-dsh-workbench] task board initialization failed', error)
      }
    }
    const unsubscribe = form.subscribe(sync)
    sync()
    return () => {
      unsubscribe()
      update(undefined)
      listeners.clear()
    }
  }, 'task-board: enable and dispose')
  return {
    getSnapshot: () => board?.view,
    subscribe: listener => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  }
}
