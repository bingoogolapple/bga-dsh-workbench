import { expect, it, vi } from 'vitest'
import { SchedulerService } from '../src/core/scheduler.ts'
import type { TaskRecord } from '../src/core/tasks.ts'

it('scans immediately when runtime catalogs become ready after the startup scan', async () => {
  const now = new Date(2026, 10, 16, 9, 0, 10).getTime()
  const template: TaskRecord = {
    id: 'due', title: 'Due', description: '', prompt: '', status: 'todo', kind: 'task',
    createdAt: now, updatedAt: now, executions: [],
    schedule: { enabled: true, cron: '* * * * *', nextRunAt: now - 10_000, lastTriggeredAt: undefined },
  }
  const missed: TaskRecord = {
    ...template, id: 'missed',
    schedule: { ...template.schedule!, nextRunAt: now - 180_000 },
  }
  let ready = false
  const listeners = new Set<() => void>()
  const refresh = vi.fn()
  const runTask = vi.fn().mockResolvedValue(true)
  const applySchedule = vi.fn()
  const scheduler = new SchedulerService({
    tasks: () => [missed, template],
    refresh,
    now: () => now,
    runTask,
    applySchedule,
    readiness: {
      getSnapshot: () => ready,
      subscribe(listener) {
        listeners.add(listener)
        return () => { listeners.delete(listener) }
      },
    },
  })

  scheduler.start()
  try {
    expect(refresh).not.toHaveBeenCalled()

    ready = true
    for (const listener of listeners) listener()
    await Promise.resolve()

    expect(runTask).toHaveBeenCalledExactlyOnceWith('due')
    const next = new Date(2026, 10, 16, 9, 1).getTime()
    expect(applySchedule.mock.calls).toEqual([
      ['missed', next, undefined],
      ['due', next, now],
    ])
    for (const listener of listeners) listener()
    expect(refresh).toHaveBeenCalledTimes(1)
  } finally {
    scheduler.dispose()
  }
  expect(listeners.size).toBe(0)
})
