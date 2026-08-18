// ============================================================
// task-board-embed.client.spec.tsx —— 内置任务看板嵌入式形态测试
// ============================================================
// 测试对象：src/client/task-board/TaskBoardEmbed.tsx 的 TaskBoardEmbed 组件
// （配合 src/core 下的 controller / store / tasks / execution），
// 它是 hero 首页上嵌入显示的任务看板形态。
// 覆盖范围：
//   - hero 页完整嵌入看板：任务按状态归入各列、欢迎行文案/头像、不显示“返回对话”；
//   - 通过嵌入式表单创建任务；
//   - 快速添加条、删除任务（含确认弹窗）、Esc 关闭/取消；
//   - 页面离开 hero / 全屏看板遮罩打开时隐藏嵌入视图并恢复；
//   - 嵌入时隐藏宿主 hero 标题行，且非 hero 场景不误隐藏普通消息内容。
// 测试环境：vitest + @testing-library/react（jsdom）。
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BoardController } from '../src/core/controller.ts'
import type { ExecutionService } from '../src/core/execution.ts'
import type { TaskStore } from '../src/core/store.ts'
import type { TaskRecord } from '../src/core/tasks.ts'
import { TaskBoardEmbed } from '../src/client/task-board/TaskBoardEmbed.tsx'

// 关键 DOM 选择器与属性常量
const EMBED = '[data-bga-kb-embed-view]' // 嵌入视图根元素
const BOARD = '[data-bga-kb-root]' // 看板主体根元素
const EMBED_ATTR = 'data-bga-kb-embed' // 嵌入视图打开时打到 <html> 上的标记属性
const WELCOME_ROW = '[data-bga-welcome-row]' // 欢迎行元素

// 每个用例结束后卸载组件、恢复全局 mock，并清理 hero 标记与残留 DOM
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  document.documentElement.removeAttribute('data-bga-kb-open')
  document.documentElement.removeAttribute(EMBED_ATTR)
  document.querySelectorAll('[data-phase]').forEach(el => el.remove())
})

// stub 全局 fetch，返回指定的横幅配置（欢迎行的文案与头像由此读取）
function stubBannerConfig(text = '欢迎回来', show = true): void {
  vi.stubGlobal('fetch', vi.fn(async (): Promise<unknown> => ({
    ok: true,
    json: async () => ({ banner: { text, show } }),
  })))
}

// 构造一条任务记录，缺省字段自动填充
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

// 构造一个基于内存 ledger 的 BoardController：store 读写同一数组，
// 执行服务与会话服务均使用最小 stub，使 controller 可独立测试
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
  controller.start() // 启动订阅与初始化
  return controller
}

// 搭建 hero 阶段 DOM，并 stub 各元素的布局几何，
// 供嵌入视图计算显示区域（若尺寸塌陷则视图判定为隐藏）
function heroDom(): { root: HTMLDivElement; column: HTMLDivElement; seat: HTMLDivElement } {
  const root = document.createElement('div')
  root.setAttribute('data-phase', 'hero')
  const column = document.createElement('div')
  column.setAttribute('data-pane', 'conversation')
  root.appendChild(column)
  const seat = document.createElement('div')
  seat.setAttribute('data-composer-seat', '')
  root.appendChild(seat)
  document.body.appendChild(root)
  const box = { left: 120, top: 60, width: 800, height: 500 } as const
  root.getBoundingClientRect = (() => box) as typeof root.getBoundingClientRect
  column.getBoundingClientRect = (() => ({ ...box, bottom: 560, right: 920, x: 120, y: 60 })) as typeof column.getBoundingClientRect
  seat.getBoundingClientRect = (() => ({
    left: 120, top: 480, width: 800, height: 80, bottom: 560, right: 920, x: 120, y: 480,
  })) as typeof seat.getBoundingClientRect
  return { root, column, seat }
}

// TaskBoardEmbed 组件行为测试
describe('TaskBoardEmbed', () => {
  // hero 首页上嵌入完整看板：任务按状态归入各列，欢迎行显示配置文案与默认头像
  it('embeds the full board on the hero page with tasks in their columns', async () => {
    heroDom()
    stubBannerConfig('专属工作台') // 欢迎行文案来自横幅配置
    const controller = makeController([
      task({ id: 'a', title: '任务A', status: 'todo' }),
      task({ id: 'b', title: '任务B', status: 'running' }),
      task({ id: 'c', title: '任务C', status: 'done' }),
    ])
    const { container } = render(<TaskBoardEmbed controller={controller} />)
    // 嵌入视图最终以 flex 显示，并在 <html> 上打上嵌入标记
    await waitFor(() => expect(container.querySelector(EMBED)?.getAttribute('style')).toContain('display: flex'))
    expect(document.documentElement.hasAttribute(EMBED_ATTR)).toBe(true)

    const board = container.querySelector<HTMLElement>(BOARD)!
    expect(board).not.toBeNull()
    // 看板主体应包含全部五个状态列标题
    for (const label of ['待规划', '待办', '进行中', '已完成', '已失败']) {
      expect(board.textContent).toContain(label)
    }
    // 三个任务的标题均应在看板内
    expect(board.textContent).toContain('任务A')
    expect(board.textContent).toContain('任务B')
    expect(board.textContent).toContain('任务C')

    // 嵌入形态不应提供“返回对话”入口（那是全屏形态的功能）
    expect(board.textContent).not.toContain('返回对话')

    // 欢迎行：文案来自横幅配置，头像指向工作台头像路由
    const welcome = container.querySelector<HTMLElement>(WELCOME_ROW)!
    expect(welcome).not.toBeNull()
    expect(welcome.textContent).toBe('专属工作台')
    expect(welcome.querySelector('img')?.getAttribute('src')).toBe('/bga-dsh-workbench/avatar')
  })

  // 通过嵌入看板的“+ 新建任务”表单创建任务
  it('creates a task through the embedded board form', async () => {
    heroDom()
    const controller = makeController()
    render(<TaskBoardEmbed controller={controller} />)
    await waitFor(() => expect(document.documentElement.hasAttribute(EMBED_ATTR)).toBe(true))

    fireEvent.click(screen.getByRole('button', { name: '+ 新建任务' })) // 打开新建弹窗
    fireEvent.change(screen.getByPlaceholderText('一句话描述要做什么'), { target: { value: '嵌入式创建' } })
    fireEvent.click(screen.getByRole('button', { name: '创建' })) // 提交表单
    await waitFor(() => expect(controller.getSnapshot().tasks).toHaveLength(1))
    expect(controller.getSnapshot().tasks[0].title).toBe('嵌入式创建')
  })

  // 卡片删除：经确认弹窗后真正删除；取消则保留
  it('deletes a task from the card icon after a confirmation dialog', async () => {
    heroDom()
    stubBannerConfig()
    const controller = makeController()
    render(<TaskBoardEmbed controller={controller} />)
    await waitFor(() => expect(document.documentElement.hasAttribute(EMBED_ATTR)).toBe(true))

    // 通过快速添加条（回车）新建一条待删除的任务
    const quick = screen.getByPlaceholderText('输入后回车快速添加待办')
    fireEvent.change(quick, { target: { value: '待删除' } })
    fireEvent.keyDown(quick, { key: 'Enter' })
    await waitFor(() => expect(controller.getSnapshot().tasks).toHaveLength(1))

    fireEvent.click(screen.getByRole('button', { name: '删除任务' })) // 打开删除确认弹窗

    // 确认弹窗出现且此时任务尚未被删除（等待用户确认）
    await waitFor(() => expect(screen.getByRole('button', { name: '删除' })).not.toBeUndefined())
    expect(controller.getSnapshot().tasks).toHaveLength(1)
    // 点击确认删除（exact 匹配弹窗主按钮，避免误命中别的“删除任务”按钮）
    fireEvent.click(screen.getByRole('button', { name: '删除', exact: true }))
    await waitFor(() => expect(controller.getSnapshot().tasks).toHaveLength(0))
    expect(screen.queryByRole('button', { name: '取消' })).toBeNull() // 弹窗已关闭
  })

  // Esc 键：关闭新建弹窗、取消删除确认弹窗（均不产生实际变更）
  it('closes the new-task modal with Escape and cancels card delete with Escape', async () => {
    heroDom()
    stubBannerConfig()
    const controller = makeController()
    render(<TaskBoardEmbed controller={controller} />)
    await waitFor(() => expect(document.documentElement.hasAttribute(EMBED_ATTR)).toBe(true))

    // 打开新建弹窗后按 Esc，弹窗应关闭
    fireEvent.click(screen.getByRole('button', { name: '+ 新建任务' }))
    expect(screen.getByRole('button', { name: '创建' })).not.toBeUndefined()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('button', { name: '创建' })).toBeNull()

    // 快速添加一条任务，再打开删除确认弹窗
    fireEvent.change(screen.getByPlaceholderText('输入后回车快速添加待办'), { target: { value: '不会删' } })
    fireEvent.keyDown(screen.getByPlaceholderText('输入后回车快速添加待办'), { key: 'Enter' })
    await waitFor(() => expect(controller.getSnapshot().tasks).toHaveLength(1))
    fireEvent.click(screen.getByRole('button', { name: '删除任务' }))
    await waitFor(() => expect(screen.getByRole('button', { name: '取消' })).not.toBeUndefined())
    fireEvent.keyDown(document, { key: 'Escape' }) // 按 Esc 取消删除
    expect(screen.queryByRole('button', { name: '取消' })).toBeNull()
    expect(controller.getSnapshot().tasks).toHaveLength(1) // 任务仍保留
  })

  // 页面离开 hero 阶段（进入 active）时，嵌入视图隐藏且清除标记
  it('hides when the page leaves the hero phase', async () => {
    const { root } = heroDom()
    const { container } = render(<TaskBoardEmbed controller={makeController()} />)
    await waitFor(() => expect(container.querySelector(EMBED)?.getAttribute('style')).toContain('display: flex'))

    // 模拟页面切换到普通对话阶段
    act(() => { root.setAttribute('data-phase', 'active') })
    await waitFor(() => expect(container.querySelector(EMBED)?.getAttribute('style')).toContain('display: none'))
    expect(document.documentElement.hasAttribute(EMBED_ATTR)).toBe(false)
  })

  // 全屏看板遮罩打开时隐藏嵌入视图，关闭后恢复
  it('hides while the full board overlay is open, then restores', async () => {
    heroDom()
    const { container } = render(<TaskBoardEmbed controller={makeController()} />)
    await waitFor(() => expect(container.querySelector(EMBED)?.getAttribute('style')).toContain('display: flex'))

    // 打开全屏看板（在 <html> 上打标记）
    act(() => { document.documentElement.setAttribute('data-bga-kb-open', '') })
    await waitFor(() => expect(container.querySelector(EMBED)?.getAttribute('style')).toContain('display: none'))
    expect(document.documentElement.hasAttribute(EMBED_ATTR)).toBe(false)

    // 关闭全屏看板后嵌入视图恢复
    act(() => { document.documentElement.removeAttribute('data-bga-kb-open') })
    await waitFor(() => expect(container.querySelector(EMBED)?.getAttribute('style')).toContain('display: flex'))
    expect(document.documentElement.hasAttribute(EMBED_ATTR)).toBe(true)
  })

  // 嵌入时隐藏宿主 hero 的标题行（防止与欢迎行重复展示）
  it('hides the host hero headline row while embedded', async () => {
    const { root } = heroDom()
    // 模拟宿主 hero 顶部的标题行（文案“探索未至之境”）
    const row = document.createElement('div')
    const span = document.createElement('span')
    span.textContent = '探索未至之境'
    row.appendChild(span)
    root.appendChild(row)
    stubBannerConfig()
    const { container } = render(<TaskBoardEmbed controller={makeController()} />)
    await waitFor(() => expect(container.querySelector(EMBED)?.getAttribute('style')).toContain('display: flex'))
    // 嵌入后宿主标题行被隐藏，并被标记上隐藏属性供宿主识别
    await waitFor(() => expect(row.style.display).toBe('none'))
    expect(span.parentElement?.getAttribute('data-bga-hero-hidden')).not.toBeNull()
  })

  // 非 hero 场景下，普通消息内容即使与标题文案相同也不应被隐藏
  it('never hides message content that matches the headline outside hero', async () => {
    const root = document.createElement('div')
    root.setAttribute('data-phase', 'active') // 非 hero 阶段
    const row = document.createElement('div')
    const span = document.createElement('span')
    span.textContent = '探索未至之境' // 与标题文案相同的普通消息文本
    row.appendChild(span)
    root.appendChild(row)
    document.body.appendChild(root)
    stubBannerConfig()
    render(<TaskBoardEmbed controller={makeController()} />)

    // 触发一次 DOM 变更并等待观察期，确认没有误伤
    act(() => { root.appendChild(document.createElement('i')) })
    await new Promise(resolve => setTimeout(resolve, 80))
    expect(row.style.display).toBe('') // 未设置 display（未被隐藏）
    expect(row.getAttribute('data-bga-hero-hidden')).toBeNull()
  })
})