// ============================================================
// m2-controller.spec.ts —— M2 控制器配置入口与支持闭环端到端测试
// ============================================================
// 覆盖：setWeekStart / setCategories / addCategory / removeCategory /
// setReminder / markReminderTriggered，
// 以及快照中 meta/tasks 的正确派生。
import { describe, expect, it } from 'vitest'
import { BoardController } from '../src/core/controller.ts'
import type { ExecutionService } from '../src/core/execution.ts'
import type { TaskStore } from '../src/core/store.ts'
import type { TaskRecord } from '../src/core/tasks.ts'

function task(partial: Partial<TaskRecord> & { id: string; title: string }): TaskRecord {
  return {
    description: '',
    prompt: '',
    status: 'todo',
    createdAt: 1,
    updatedAt: 1,
    executions: [],
    ...partial,
  }
}

function makeController(initial: TaskRecord[] = []): BoardController {
  let ledger: TaskRecord[] = [...initial]
  const store: TaskStore = {
    load: () => ledger,
    save: (next: readonly TaskRecord[]) => { ledger = [...next] },
    clear: () => { ledger = [] },
  }
  const controller = new BoardController({
    store,
    exec: {
      run: async () => {},
      reconcile: async () => undefined,
    } as unknown as ExecutionService,
    sessions: {
      list: {
        getSnapshot: () => ({ current: undefined }),
        subscribe: () => () => {},
      },
      open: () => {},
    },
  })
  controller.start()
  return controller
}

describe('M2 · 控制器配置入口', () => {
  it('setWeekStart 写入 meta 并通知', () => {
    const c = makeController()
    expect(c.getSnapshot().meta.weekStart).toBe('monday')
    c.setWeekStart('sunday')
    expect(c.getSnapshot().meta.weekStart).toBe('sunday')
  })

  it('分类管理：追加/整体替换/删除', () => {
    const c = makeController()
    c.addCategory({ id: 'collab', label: '协同支持' })
    expect(c.getSnapshot().meta.categories?.map(d => d.id)).toContain('collab')

    c.setCategories([
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ])
    expect(c.getSnapshot().meta.categories?.map(d => d.id)).toEqual(['a', 'b'])

    c.removeCategory('a')
    expect(c.getSnapshot().meta.categories?.map(d => d.id)).toEqual(['b'])
    // 至少保留一个分类：删到只剩一个时不再删，避免删光后回退默认造成状态不一致
    c.removeCategory('b')
    expect(c.getSnapshot().meta.categories?.map(d => d.id)).toEqual(['b'])
  })

  it('提醒：启用 cron、关闭保留 cron、触发记时间戳', () => {
    const c = makeController()
    c.setReminder({ enabled: true, cron: '0 21 * * *' })
    expect(c.getSnapshot().meta.reminder).toMatchObject({ enabled: true, cron: '0 21 * * *' })
    c.setReminder({ enabled: false })
    expect(c.getSnapshot().meta.reminder?.enabled).toBe(false)
    expect(c.getSnapshot().meta.reminder?.cron).toBe('0 21 * * *')
    c.markReminderTriggered()
    expect(c.getSnapshot().meta.reminder?.lastTriggeredAt).toBeTypeOf('number')
  })
})

