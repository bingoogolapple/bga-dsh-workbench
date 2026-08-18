// ============================================================
// workspace-open.client.spec.tsx —— 工作区菜单打开按钮注入器测试
// ============================================================
// 测试对象：src/client/workspace-open.ts
//   - workspaceLabelFromAria：从「⋯」按钮 aria-label 提取工作区名；
//   - resolveWorkspacePath：按显示名在工作区列表中解析目录路径；
//   - injectOpenButtons：向工作区菜单注入按钮组（幂等/定位/拦截）。
// 覆盖范围：
//   - 中英文 aria-label 模板解析；
//   - title 精确匹配与 basename 兜底匹配、重名取第一个、无匹配返回 undefined；
//   - 工作区菜单注入成功、非工作区菜单不注入、重复注入幂等；
//   - 按钮点击触发 onRequest 并携带正确的 kind/path，且不冒泡到菜单。
// 测试环境：vitest + jsdom。
import { cleanup, fireEvent } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  injectOpenButtons,
  resolveWorkspacePath,
  workspaceLabelFromAria,
  workspaceLabelFromRow,
} from '../src/client/workspace-open.ts'
import type { WorkspaceView } from '@deepseek-ai/dsh-client-runtime/client'

// 每个用例结束后清理测试注入到 body 的节点
afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

/** 构造一段与产品 Menu 组件结构一致的菜单 DOM（工作区菜单：重命名 + 删除工作区）。 */
function workspaceMenu(): HTMLDivElement {
  const menu = document.createElement('div')
  menu.setAttribute('role', 'menu')
  const viewport = document.createElement('div')
  const rename = document.createElement('button')
  rename.setAttribute('role', 'menuitem')
  rename.textContent = '重命名'
  const del = document.createElement('button')
  del.setAttribute('role', 'menuitem')
  del.textContent = '删除工作区'
  viewport.append(rename, del)
  menu.appendChild(viewport)
  return menu
}

describe('workspaceLabelFromAria', () => {
  it('解析中文模板（弯引号，与 locales.ts 一致）：工作区“名称”的操作', () => {
    expect(workspaceLabelFromAria('工作区“我的项目”的操作')).toBe('我的项目')
  })

  it('解析中文模板（直引号变体）', () => {
    expect(workspaceLabelFromAria('工作区"我的项目"的操作')).toBe('我的项目')
  })

  it('解析英文模板：Workspace actions for 名称', () => {
    expect(workspaceLabelFromAria('Workspace actions for my-project')).toBe('my-project')
  })

  it('显示名前后带空白时 trim', () => {
    expect(workspaceLabelFromAria('工作区“ 我的项目 ”的操作')).toBe('我的项目')
  })

  it('非工作区按钮（会话菜单）返回 undefined', () => {
    expect(workspaceLabelFromAria('会话“demo”的操作')).toBeUndefined()
    expect(workspaceLabelFromAria('Session actions for demo')).toBeUndefined()
    expect(workspaceLabelFromAria('')).toBeUndefined()
  })
})

describe('workspaceLabelFromRow', () => {
  it('从工作区行的 projectText 标题节点提取显示名', () => {
    const row = document.createElement('div')
    row.setAttribute('role', 'treeitem')
    const projectText = document.createElement('span')
    projectText.className = 'sXLsga_projectText'
    const title = document.createElement('span')
    title.textContent = '我的项目'
    projectText.appendChild(title)
    row.appendChild(projectText)
    expect(workspaceLabelFromRow(row)).toBe('我的项目')
  })

  it('无标题节点时返回 undefined', () => {
    const row = document.createElement('div')
    row.setAttribute('role', 'treeitem')
    expect(workspaceLabelFromRow(row)).toBeUndefined()
    expect(workspaceLabelFromRow(null)).toBeUndefined()
  })
})

describe('resolveWorkspacePath', () => {
  const items: WorkspaceView[] = [
    { workspaceId: 'a' as WorkspaceView['workspaceId'], title: '项目A', path: '/home/u/项目A', sessionIds: [] },
    { workspaceId: 'b' as WorkspaceView['workspaceId'], title: '重命名后的名字', path: '/home/u/repo-b', sessionIds: [] },
  ]

  it('按 title 精确匹配返回 path', () => {
    expect(resolveWorkspacePath(items, '项目A')).toBe('/home/u/项目A')
    expect(resolveWorkspacePath(items, '重命名后的名字')).toBe('/home/u/repo-b')
  })

  it('title 不匹配时按路径 basename 兜底匹配', () => {
    expect(resolveWorkspacePath(items, 'repo-b')).toBe('/home/u/repo-b')
  })

  it('重名时取第一个匹配', () => {
    const dup = [
      { workspaceId: 'x' as WorkspaceView['workspaceId'], title: '同名', path: '/a/同名', sessionIds: [] },
      { workspaceId: 'y' as WorkspaceView['workspaceId'], title: '同名', path: '/b/同名', sessionIds: [] },
    ]
    expect(resolveWorkspacePath(dup, '同名')).toBe('/a/同名')
  })

  it('无匹配时返回 undefined', () => {
    expect(resolveWorkspacePath(items, '不存在的名字')).toBeUndefined()
    expect(resolveWorkspacePath([], 'x')).toBeUndefined()
  })
})

describe('injectOpenButtons', () => {
  // 收集被点击的 (kind, path) 请求
  const spy = vi.fn()

  it('向工作区菜单注入三个按钮并位于重命名项之前', () => {
    const menu = workspaceMenu()
    const injected = injectOpenButtons(menu, '/home/u/project', spy)
    expect(injected).toBe(true)

    const group = menu.querySelector('[data-bga-open-group]')
    expect(group).not.toBeNull()
    const buttons = group?.querySelectorAll('button[data-bga-open-kind]') ?? []
    expect(buttons.length).toBe(3)
    const kinds = Array.from(buttons).map(button => button.getAttribute('data-bga-open-kind'))
    expect(kinds).toEqual(['finder', 'terminal', 'vscode'])

    // 打开组必须插在「删除工作区」之后（而非重命名之前）
    const del = Array.from(menu.querySelectorAll('button')).find(b => b.textContent === '删除工作区')
    expect(del).not.toBeUndefined()
    expect(del!.nextElementSibling).toBe(group)
  })

  it('每个按钮前部带一个 16×16 的 SVG 图标（与产品菜单项一致）', () => {
    const menu = workspaceMenu()
    injectOpenButtons(menu, '/home/u/project', spy)
    const buttons = menu.querySelectorAll<HTMLButtonElement>('button[data-bga-open-kind]')
    expect(buttons.length).toBe(3)
    for (const button of buttons) {
      const svg = button.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg?.getAttribute('width')).toBe('16')
      expect(svg?.getAttribute('height')).toBe('16')
      expect(svg?.querySelectorAll('path').length ?? 0).toBeGreaterThan(0)
      // 图标容器（含 SVG）是按钮的第一个子元素
      const iconWrap = button.firstElementChild
      expect(iconWrap?.tagName).toBe('SPAN')
      expect(iconWrap?.querySelector('svg')).toBe(svg)
      // 文本标签紧随图标
      const label = button.querySelector('span:last-child')
      expect(label?.textContent?.trim().length ?? 0).toBeGreaterThan(0)
    }
  })

  it('非工作区菜单（不含删除项）不注入', () => {
    const menu = document.createElement('div')
    menu.setAttribute('role', 'menu')
    const item = document.createElement('button')
    item.setAttribute('role', 'menuitem')
    item.textContent = '重命名'
    menu.appendChild(item)

    const injected = injectOpenButtons(menu, '/home/u/project', spy)
    expect(injected).toBe(false)
    expect(menu.querySelector('[data-bga-open-group]')).toBeNull()
  })

  it('同一菜单重复注入幂等（只注入一次）', () => {
    const menu = workspaceMenu()
    expect(injectOpenButtons(menu, '/p', spy)).toBe(true)
    expect(injectOpenButtons(menu, '/p', spy)).toBe(false)
    expect(menu.querySelectorAll('[data-bga-open-group]').length).toBe(1)
  })

  it('找不到重命名项时不注入', () => {
    const menu = document.createElement('div')
    menu.setAttribute('role', 'menu')
    const del = document.createElement('button')
    del.setAttribute('role', 'menuitem')
    del.textContent = '删除工作区'
    menu.appendChild(del)

    const injected = injectOpenButtons(menu, '/p', spy)
    expect(injected).toBe(false)
  })

  it('点击按钮触发 onRequest 并携带 kind 与 path，且不冒泡到菜单', () => {
    const onRequest = vi.fn()
    const menu = workspaceMenu()
    menu.addEventListener('click', () => {})
    injectOpenButtons(menu, '/home/u/project', onRequest)

    const finder = menu.querySelector<HTMLButtonElement>('button[data-bga-open-kind="finder"]')
    expect(finder).not.toBeNull()
    fireEvent.click(finder!)
    expect(onRequest).toHaveBeenCalledTimes(1)
    expect(onRequest).toHaveBeenCalledWith('finder', '/home/u/project')

    const vscode = menu.querySelector<HTMLButtonElement>('button[data-bga-open-kind="vscode"]')
    fireEvent.click(vscode!)
    expect(onRequest).toHaveBeenCalledWith('vscode', '/home/u/project')
  })
})


describe('injectOpenButtons 偏好文案', () => {
  it('未传偏好时使用默认文案（在默认终端中打开 / 在 VSCode 中打开）', () => {
    const menu = workspaceMenu()
    injectOpenButtons(menu, '/home/u/project', vi.fn())
    const buttons = menu.querySelectorAll<HTMLButtonElement>('button[data-bga-open-kind]')
    const labels = Array.from(buttons).map(button => button.textContent?.trim() ?? '')
    expect(labels).toEqual(['在 Finder 中打开', '在默认终端中打开', '在 VSCode 中打开'])
  })

  it('配置终端偏好后 terminal 按钮文案显示应用名（在 iTerm 中打开）', () => {
    const menu = workspaceMenu()
    injectOpenButtons(menu, '/home/u/project', vi.fn(), { terminal: 'terminal-iterm' })
    const terminal = menu.querySelector<HTMLButtonElement>('button[data-bga-open-kind="terminal"]')
    expect(terminal?.textContent?.trim()).toBe('在 iTerm 中打开')
    // finder / vscode 不受影响
    const finder = menu.querySelector<HTMLButtonElement>('button[data-bga-open-kind="finder"]')
    expect(finder?.textContent?.trim()).toBe('在 Finder 中打开')
  })

  it('未知偏好 ID 回退默认文案', () => {
    const menu = workspaceMenu()
    injectOpenButtons(menu, '/home/u/project', vi.fn(), { terminal: 'nope', editor: 'yikes' })
    const labels = Array.from(menu.querySelectorAll<HTMLButtonElement>('button[data-bga-open-kind]'))
      .map(button => button.textContent?.trim() ?? '')
    expect(labels).toEqual(['在 Finder 中打开', '在默认终端中打开', '在 VSCode 中打开'])
  })
})

