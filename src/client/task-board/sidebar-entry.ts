/**
 * sidebar-entry.ts —— 侧边栏「BGA 任务看板」入口按钮的注入逻辑。
 *
 * 在 DSH 侧边栏里寻找合适位置插入一个启动按钮：
 * - 通过 data-pane="sidebar"（或 sidebarCol 类名）定位侧边栏根；
 * - 在 logo 行 / 新建会话按钮之后插入看板启动按钮（launcher）；
 * - 按钮外观使用 DSH 的 CSS 变量（--dsw-*）与侧边栏样式保持一致，
 *   并跟随「看板是否打开」「侧边栏是否折叠」切换配色与字号；
 * - 由于侧边栏内容可能在用户交互后才渲染（动态插入 DOM），
 *   使用 requestAnimationFrame 循环持续「补位」，把按钮反复钉在
 *   正确锚点后面，直到卸载为止。
 * 返回的清理函数负责取消 rAF 循环、解除订阅并移除按钮。
 */
import type { BoardController } from '../../core/controller.ts'
import { t } from './locales.ts'

// 入口按钮的标记属性名：用于幂等判定（页面中已有该按钮则不再注入）。
const LAUNCHER_ATTR = 'data-bga-kb-launcher'

// 入口按钮的图标：一个内联 SVG 看板图形（矩形 + 分隔线 + 竖线），
// 使用 currentColor 跟随按钮文字颜色。
const ICON_SVG = `<svg viewBox="0 0 16 16" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2.5" width="12" height="11" rx="1.5"/><path d="M2 6.5h12M6.5 6.5v7"/></svg>`

/**
 * 找到侧边栏的根容器。
 *
 * 优先按 data-pane="sidebar" 定位，失败时退回 sidebarCol 类名；
 * 容器未就绪时返回 undefined（由调用方的 rAF 循环稍后重试）。
 */
function findSidebarRoot(): HTMLElement | undefined {
  const col = document.querySelector<HTMLElement>('[data-pane="sidebar"], [class*="sidebarCol"]')
  if (col === null) return undefined
  // 优先把 logo 行的父容器作为锚点区域（按钮插在 logo 附近最自然），
  // 否则退回侧边栏的第一个子元素。
  const logoOwner = col.querySelector<HTMLElement>('[class*="logoRow"]')?.parentElement
  return logoOwner ?? (col.firstElementChild as HTMLElement | undefined)
}

/**
 * 在侧边栏根内找到「新建会话」按钮，用作入口按钮的插入锚点。
 *
 * 先在 root 内查找带 newSession 类名的 button；找不到时退而求其次，
 * 取 root 的第一个 button 子元素（通常就是新建会话按钮）。
 */
function findNewSessionBtn(root: HTMLElement): HTMLButtonElement | undefined {
  const nested = root.querySelector<HTMLButtonElement>('button[class*="newSession"]')
  if (nested !== null) return nested
  for (const child of root.children) {
    // 兜底：取第一个直接 button 子元素，保证能拿到一个锚点。
    if (child.tagName === 'BUTTON') return child as HTMLButtonElement
  }
  return undefined
}

/**
 * 构建看板入口按钮（launcher）。
 *
 * 创建纯 DOM 按钮（不依赖 React），设置标记属性、无障碍标签与样式；
 * 内部由「图标 span + 文字 span」组成，并绑定鼠标悬停配色与点击开合逻辑。
 *
 * @param controller 看板控制器，用于读取 boardOpen 状态并驱动开合。
 */
function buildLauncher(controller: BoardController): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.setAttribute(LAUNCHER_ATTR, '')
  btn.setAttribute('aria-label', t('entry.label'))

  // 样式与侧边栏导航项一致：透明背景、圆角、次要文字色，悬停时变亮。
  Object.assign(btn.style, {
    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
    height: '32px', padding: '0 12px 0 7px', background: 'transparent', border: 'none',
    borderRadius: '8px', color: 'var(--dsw-alias-label-secondary)', cursor: 'pointer',
    fontSize: '13px', whiteSpace: 'nowrap', textAlign: 'left', font: 'inherit',
  })

  const icon = document.createElement('span')
  icon.innerHTML = ICON_SVG
  Object.assign(icon.style, { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' })

  const label = document.createElement('span')
  label.textContent = t('entry.label')

  // 文字过长时省略号截断，按钮宽度撑满侧边栏。
  Object.assign(label.style, { overflow: 'hidden', textOverflow: 'ellipsis', flex: '1' })

  btn.append(icon, label)

  // 点击：看板开闭互斥切换。
  btn.addEventListener('click', () => {
    controller.getSnapshot().boardOpen ? controller.closeBoard() : controller.openBoard()
  })

  return btn
}

/**
 * 把看板入口按钮注入侧边栏。
 *
 * 幂等守卫 + 持续补位：先检查页面是否已有 launcher；没有则创建按钮，
 * 然后订阅控制器刷新配色，并用 requestAnimationFrame 每帧尝试把按钮
 * 插到正确锚点之后（侧边栏 DOM 可能稍后才渲染/被重绘）。
 *
 * @param controller 看板控制器。
 * @returns 清理函数：取消 rAF 循环、解除订阅、移除按钮。
 */
export function mountSidebarEntry(controller: BoardController): () => void {
  // 幂等守卫：页面上已有 launcher 按钮时直接放弃，避免重复注入。
  if (typeof document !== 'undefined' && document.querySelector(`[${LAUNCHER_ATTR}]`) !== null) {
    return () => {}
  }

  const launcher = buildLauncher(controller)
  // 悬停状态（仅跟踪布尔值；real 的配色计算在 applyColors 里统一进行）。
  const state = { hovering: false }
  // 侧边栏是否处于折叠态：以 <html>/文档中是否存在折叠标记属性为准。
  const isCollapsed = (): boolean => document.querySelector('[data-sidebar-collapsed]') !== null
  // 把「悬停 / 打开 / 折叠」三类状态统一折算成按钮的背景、颜色、字重与顶部间距。
  const applyColors = (): void => {
    const open = controller.getSnapshot().boardOpen
    const collapsed = isCollapsed()
    // 悬停或看板打开 -> 激活高亮；否则折叠态下透明、展开态下保留悬停底色。
    launcher.style.background = state.hovering || open
      ? 'var(--dsw-specific-sidebar-nav-item-active)'
      : collapsed ? 'transparent' : 'var(--dsw-specific-sidebar-nav-item-hover)'
    launcher.style.color = 'var(--dsw-alias-label-primary)'
    launcher.style.fontWeight = open ? '600' : 'normal'
    // 侧边栏折叠时上移按钮，使其贴合折叠后的布局。
    launcher.style.marginTop = collapsed ? '-10px' : '0'
  }
  launcher.addEventListener('mouseenter', () => { state.hovering = true; applyColors() })
  launcher.addEventListener('mouseleave', () => { state.hovering = false; applyColors() })
  let root: HTMLElement | undefined
  let placed = false

  // 补位：把按钮插入锚点（新建会话按钮）之后。
  const place = (): void => {
    // 若之前缓存的侧边栏根已脱离文档（被替换/重渲染），作废缓存重新找。
    if (root !== undefined && !root.isConnected) { root = undefined; placed = false }
    // 已放置且按钮仍挂在页面上 -> 无需处理。
    if (placed && document.body.contains(launcher)) return
    root ??= findSidebarRoot()
    // 侧边栏尚未渲染 -> 等下一帧。
    if (root === undefined) return
    const anchor = findNewSessionBtn(root)
    // 只有锚点确实属于侧边栏根时才插入，避免插错层级。
    if (anchor?.parentElement === root) {
      root.insertBefore(launcher, anchor.nextSibling)
      placed = true
    }
  }

  place()
  // 单次订阅统一刷新配色：避免额外订阅泄漏，也统一清理入口
  const unsub = controller.subscribe(applyColors)
  applyColors()

  // rAF 循环：每一帧都补位一次并刷新配色，直到 cleanup 取消。
  // 必要性：DSH 侧边栏会在用户操作时重建 DOM，静态插入会被覆盖，
  // 这里以「每帧钉住按钮位置」的方式对抗重建。
  let raf: number | undefined
  const tick = (): void => { place(); applyColors(); raf = requestAnimationFrame(tick) }
  raf = requestAnimationFrame(tick)

  return () => {
    if (raf !== undefined) cancelAnimationFrame(raf)
    unsub()
    launcher.remove()
  }
}
