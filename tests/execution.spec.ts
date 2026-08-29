// ============================================================
// execution.spec.ts —— 执行服务 reconcile 调和判定的回归测试
// ============================================================
// 覆盖：页面刷新后遗留 running 任务的结局调和，特别是「会话空闲但零回合」
// 不能被误判为成功（应返回 undefined 留待后续调和）。
import { describe, expect, it } from 'vitest'
import {
  ExecutionService,
  preferredWorkspaceId,
  presetOf,
  type ExecutionEnvironment,
  type SessionDriver,
} from '../src/core/execution.ts'
import type { TaskRecord } from '../src/core/tasks.ts'

/** 造一条处于 running 状态、且最后一条执行记录已挂会话但未结束的任务 */
function runningTask(sessionId: string): TaskRecord {
  return {
    id: 't1',
    title: '任务',
    description: '',
    prompt: '',
    status: 'running',
    createdAt: 0,
    updatedAt: 0,
    executions: [{
      id: 'e1',
      sessionId,
      startedAt: 1,
      endedAt: undefined,
      result: undefined,
      error: undefined,
    }],
  }
}

/** 造一个指定已结束回合数的会话驱动句柄 */
function driver(turnEnds: number): SessionDriver {
  return {
    rename: async () => {},
    prompt: async () => ({ ok: true }),
    command: async () => ({ ok: true, matched: true }),
    getSnapshot: () => ({
      running: false,
      lastAgentError: null,
      turnEnds: new Map(Array.from({ length: turnEnds }, (_, i) => [i, i])),
    }),
    subscribe: () => () => {},
  }
}

/** 构造最小执行环境：会话存在且空闲；历史尾部由调用方指定 */
function env(d: SessionDriver | undefined, historyTail: { events: readonly { type: string; data?: unknown }[] } | undefined): ExecutionEnvironment {
  return {
    sessions: {
      list: {
        getSnapshot: () => ({ phase: 'ready', byId: { s1: { running: false } } }),
        subscribe: () => () => {},
      },
      binding: (id: string) => (d === undefined ? undefined : { session: d }),
    },
    workspaces: {
      list: { getSnapshot: () => ({ items: [], recentWorkspaceId: undefined }) },
      connectWorkspace: async () => 's1',
    },
    history: { loadTail: async () => historyTail },
  }
}

describe('ExecutionService.reconcile 调和判定', () => {
  it('会话空闲但零回合且无错误历史 → 返回 undefined（不误判成功）', async () => {
    const svc = new ExecutionService(env(driver(0), undefined))
    expect(await svc.reconcile(runningTask('s1'))).toBeUndefined()
  })

  it('有已结束回合且无 agent 错误 → 判成功', async () => {
    const svc = new ExecutionService(env(driver(1), undefined))
    const result = await svc.reconcile(runningTask('s1'))
    expect(result?.kind).toBe('settled')
    if (result?.kind === 'settled') expect(result.outcome).toBe('succeeded')
  })

  it('历史尾部有错误回合 → 判失败（即使驱动零回合）', async () => {
    const svc = new ExecutionService(env(driver(0), {
      events: [{ type: 'turn/end', data: { reason: { kind: 'error' } } }],
    }))
    const result = await svc.reconcile(runningTask('s1'))
    expect(result?.kind).toBe('settled')
    if (result?.kind === 'settled') expect(result.outcome).toBe('failed')
  })

  it('会话已不存在 → 判取消', async () => {
    const e = env(driver(0), undefined)
    e.sessions.list.getSnapshot = () => ({ phase: 'ready', byId: {} })
    const svc = new ExecutionService(e)
    const result = await svc.reconcile(runningTask('s1'))
    expect(result?.kind).toBe('settled')
    if (result?.kind === 'settled') expect(result.outcome).toBe('cancelled')
  })
})

// ------------------------------------------------------------
// 新旧 DSH 兼容：agent 预设读取
// 新版把 agentPreset 从会话摘要迁到了 projectionValues，旧版直挂在摘要上。
// 读取不到会让「已是目标预设就跳过切换」失效 → 每次跑任务都多发一次 RPC。
// ------------------------------------------------------------
describe('presetOf：agent 预设的新旧双来源读取', () => {
  it('旧版：预设直挂在摘要 agentPreset 上 → 能读到', () => {
    expect(presetOf({ running: false, agentPreset: 'plan' })).toBe('plan')
  })

  it('新版：预设迁到 projectionValues.agentPreset → 能读到', () => {
    expect(presetOf({ running: false, projectionValues: { agentPreset: 'plan' } })).toBe('plan')
  })

  it('两个来源都有时以摘要为准（旧版语义优先）', () => {
    expect(presetOf({ running: false, agentPreset: 'a', projectionValues: { agentPreset: 'b' } })).toBe('a')
  })

  it('两个来源都缺失 → undefined（不做静默降级，交由调用方处理）', () => {
    expect(presetOf({ running: false })).toBeUndefined()
    expect(presetOf(undefined)).toBeUndefined()
  })
})

// ------------------------------------------------------------
// 新旧 DSH 兼容：默认工作区择优
// 新版上游移除了 recentWorkspaceId，改用「当前会话归属哪个工作区」。
// ------------------------------------------------------------
describe('preferredWorkspaceId：默认工作区择优', () => {
  const items = [
    { workspaceId: 'w-first' },
    { workspaceId: 'w-second', sessionIds: ['s-current'] },
  ]

  it('当前会话能归属到工作区 → 用它（优先于 recentWorkspaceId 和第一个）', () => {
    expect(preferredWorkspaceId({ current: 's-current' }, { items, recentWorkspaceId: 'w-recent' }))
      .toBe('w-second')
  })

  it('当前会话无归属（旧版 WorkspaceView 未必带 sessionIds）→ 回落 recentWorkspaceId', () => {
    expect(preferredWorkspaceId(
      { current: 's-unknown' },
      { items: [{ workspaceId: 'w-first' }], recentWorkspaceId: 'w-recent' },
    )).toBe('w-recent')
  })

  it('无 current 且无 recentWorkspaceId → 兜底列表第一个', () => {
    expect(preferredWorkspaceId({}, { items, recentWorkspaceId: undefined })).toBe('w-first')
  })

  it('工作区列表为空 → undefined（connectSession 会据此抛出明确错误）', () => {
    expect(preferredWorkspaceId({}, { items: [], recentWorkspaceId: undefined })).toBeUndefined()
  })
})