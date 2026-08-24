// ============================================================
// task-board-matrix.client.spec.tsx —— 周矩阵视图交互测试
// ============================================================
// 测试对象：src/client/task-board/board/MatrixView.tsx（通过 TaskBoard 渲染，
// embedded=false 时默认进入周矩阵视图）。
// 覆盖：点击矩阵任务行仅打开详情、不冒泡触发「在此新建任务」弹窗。
// 测试环境：vitest + @testing-library/react（jsdom）。
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { BoardController } from '../src/core/controller.ts'
import type { ExecutionService } from '../src/core/execution.ts'
import type { TaskStore } from '../src/core/store.ts'
import type { TaskRecord } from '../src/core/tasks.ts'
import { toDateKey } from '../src/core/matrix.ts'
import { TaskBoard } from '../src/client/task-board/board/TaskBoard.tsx'

afterEach(() => {
  cleanup()
})

// 构造一条落在本周、分类为 business 的任务，使其在矩阵中可见
function task(partial: Partial<TaskRecord> & { id: string; title: string }): TaskRecord {
  return {
    description: '',
    prompt: '',
    status: 'todo',
    createdAt: 1,
    updatedAt: 1,
    executions: [],
    category: 'business',
    reportDate: toDateKey(new Date()),
    ...partial,
  }
}

// 最小化的 BoardController：内存 ledger + 静默执行服务 + 空会话门面
function makeController(initial: TaskRecord[]): BoardController {
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

describe('MatrixView 任务行点击', () => {
  it('点击任务只打开详情，不冒泡打开「新建任务」弹窗', () => {
    const controller = makeController([task({ id: 'a', title: '矩阵任务' })])
    render(<TaskBoard controller={controller} />)

    // 点击任务标题，事件会经过任务行再冒泡到所在单元格
    fireEvent.click(screen.getByText('矩阵任务'))

    // 详情弹窗已打开
    expect(screen.getByRole('dialog', { name: '任务详情' })).toBeDefined()
    // 「在此新建任务」弹窗不应被冒泡触发
    expect(screen.queryByRole('dialog', { name: '新建任务' })).toBeNull()
  })
})

describe('TaskDetail 关闭保存草稿', () => {
  it('编辑标题后点关闭按钮，未失焦的草稿也会落库', () => {
    const controller = makeController([task({ id: 'a', title: '旧标题' })])
    render(<TaskBoard controller={controller} />)

    // 打开详情并编辑标题（输入框尚未失焦）
    fireEvent.click(screen.getByText('旧标题'))
    const titleInput = screen.getByDisplayValue('旧标题')
    fireEvent.change(titleInput, { target: { value: '新标题' } })
    titleInput.focus()

    // 直接点右上角关闭按钮（不先退出输入框）
    fireEvent.click(screen.getByRole('button', { name: '关闭' }))

    // 草稿应在关闭前被 blur 保存落库
    expect(controller.getSnapshot().tasks.find(t => t.id === 'a')?.title).toBe('新标题')
  })
})