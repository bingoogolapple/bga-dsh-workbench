/**
 * TaskBoardEmbed.tsx —— 看板的内嵌卡片视图。
 *
 * 用于 DSH 首页 hero 空态（data-phase="hero" 且看板未以全屏方式打开）时，
 * 在对话区中央渲染一个内嵌看板面板：顶部是欢迎横幅（WelcomeBannerRow），
 * 下方是完整看板（embedded 形态，不显示「返回对话」按钮）。
 *
 * 组件通过一套「持续测算 + 被动观察」的组合机制把自己定位到中央列：
 * - update() 每帧/每次事件都会根据中央列的 getBoundingClientRect 重新摆放
 *   自己的绝对定位盒子（左上角内缩 EMBED_INSET 像素，底部给输入框座椅
 *   区域让出空间）；
 * - MutationObserver 观察 body 的子树与 <html> 属性变化（data-phase），
 *   ResizeObserver 观察中央相位根，window resize 也触发重算；
 * - 一旦页面离开 hero 阶段或看板全屏打开（OPEN_ATTR 出现），立即隐藏自身。
 * 另外会调用 setupHeroHeadlineHider() 隐藏 hero 大标题，避免遮挡内嵌看板。
 */
import { useEffect, useRef } from 'react'
import type { BoardController } from '../../core/controller.ts'
import { setupHeroHeadlineHider } from '../hide-hero-headline.ts'
import { WelcomeBannerRow } from '../WelcomeBannerRow.tsx'
import { TaskBoard } from './board/TaskBoard.tsx'
import css from './embed.module.css'

// 对话区中央列的选择器（与 board-mount 保持一致，优先 data-pane）。
const CENTER_SELECTOR = '[data-pane="conversation"], [class*="centerCol"]'
// <html> 上表示「看板全屏打开」的属性：全屏打开时内嵌视图必须隐藏。
const OPEN_ATTR = 'data-bga-kb-open'
// 挂载到 <html>、表示「内嵌看板正在占屏」的属性（供样式选择器使用）。
const EMBED_ATTR = 'data-bga-kb-embed'
// 输入框座椅（composer seat）选择器：内嵌看板底部要给座椅让出空间。
const SEAT_SELECTOR = '[data-composer-seat]'
// 内嵌盒相对中央列的内缩边距（像素）。
const EMBED_INSET = 4
// 内嵌盒底部与座椅顶部之间的间隙（负值表示轻微上移贴合）。
const EMBED_BOTTOM_GAP = -8

/**
 * 看板内嵌视图组件（用于 hero 空态）。
 *
 * @param props.controller 看板控制器，透传给内部 <TaskBoard />。
 */
export function TaskBoardEmbed({ controller }: { controller: BoardController }) {
  // 指向自身根容器的 ref：所有定位都直接改这个 DOM 节点的 style。
  const ref = useRef<HTMLDivElement>(null)

  // 定位与显隐的主逻辑：只挂载一次（空依赖数组）。
  useEffect(() => {
    const el = ref.current
    if (el === null) return
    // 上次可见阶段的记录：阶段切换时强制重排并重置定位 key。
    let lastPhase: string | null = null
    // 上次摆放的「几何指纹」（left x top x bottom x width），相同则跳过重排。
    let lastKey = ''
    // 当前被 ResizeObserver 观察的相位根。
    let observedRoot: Element | null = null
    let resizeObserver: ResizeObserver | undefined

    // 确保相位根被 ResizeObserver 观察：相位根变化时重建观察器。
    const ensureObserved = (root: Element | null): void => {
      if (root === null || root === observedRoot) return
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver?.disconnect()
        resizeObserver = new ResizeObserver(update)
        resizeObserver.observe(root)
      }
      observedRoot = root
    }

    // 隐藏内嵌盒子：移除 EMBED_ATTR 标记并置 display:none。
    const hide = (current: HTMLElement): void => {
      document.documentElement.removeAttribute(EMBED_ATTR)
      current.style.display = 'none'
    }

    // 核心更新函数：判断是否该显示，并按中央列几何重新摆放盒子。
    const update = (): void => {
      const current = ref.current
      if (current === null) return
      const root = document.querySelector('[data-phase]')
      ensureObserved(root)
      const phase = root?.getAttribute('data-phase') ?? null
      // 只在 hero 阶段且看板未全屏打开时显示内嵌视图。
      const hidden = phase !== 'hero' || document.documentElement.hasAttribute(OPEN_ATTR)
      if (phase !== lastPhase) {
        // 阶段变化：重置指纹，强制下一轮重排。
        lastPhase = phase
        lastKey = ''
      }
      if (hidden) {
        hide(current)
        return
      }
      // 取中央列（找不到就以相位根兜底）并测量几何。
      const column = root!.querySelector<HTMLElement>(CENTER_SELECTOR) ?? root!
      const rect = column.getBoundingClientRect()
      // 中央列尺寸无效（尚未布局/折叠）时先隐藏。
      if (rect.width <= 0 || rect.height <= 0) {
        hide(current)
        return
      }
      // 底部对齐策略：优先对齐到输入框座椅上方，留出 EMBED_BOTTOM_GAP 间隙；
      // 没有座椅时退化为「距离底部 240px 收底」，并限制高度不超过 560px。
      const seat = root!.querySelector<HTMLElement>(SEAT_SELECTOR)
      const seatRect = seat?.getBoundingClientRect()
      const top = rect.top + 12
      const bottom = seatRect !== undefined && seatRect.height > 0
        ? seatRect.top - EMBED_BOTTOM_GAP
        : Math.min(rect.bottom - 240, top + 560)
      // 几何指纹：只要位置/尺寸没变就不再重排（性能优化）。
      const key = `${Math.round(rect.left)}x${Math.round(top)}x${Math.round(bottom)}x${Math.round(rect.width)}`
      if (key === lastKey && current.style.display === 'flex') return
      lastKey = key
      // 应用摆放：内缩 EMBED_INSET，宽度随中央列，高度至少 220px。
      current.style.display = 'flex'
      current.style.left = `${rect.left + EMBED_INSET}px`
      current.style.top = `${Math.round(top)}px`
      current.style.width = `${Math.max(0, rect.width - EMBED_INSET * 2)}px`
      current.style.height = `${Math.max(220, Math.round(bottom - top))}px`
      // 标记 EMBED_ATTR：通知全局样式「内嵌看板正在占屏」。
      document.documentElement.setAttribute(EMBED_ATTR, '')
    }
    update()

    // 观察 body 子树结构变化 + data-phase 属性变化 + <html> 属性变化，
    // 以及窗口 resize——任何可能影响布局的事件都触发重算。
    const observer = new MutationObserver(update)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-phase'],
    })
    observer.observe(document.documentElement, { attributes: true })
    window.addEventListener('resize', update)
    // 清理：断开全部观察器与事件监听，并摘掉 EMBED_ATTR 残留标记。
    return () => {
      observer.disconnect()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', update)
      document.documentElement.removeAttribute(EMBED_ATTR)
    }
  }, [])

  // 隐藏 hero 大标题，避免与内嵌看板顶部重叠（独立副作用，同样一次挂载）。
  useEffect(() => setupHeroHeadlineHider(), [])

  return (
    <div ref={ref} className={css['bga-kb-embed']} data-bga-kb-embed-view="">
      <WelcomeBannerRow />
      <div className={css['bga-kb-embed-body']}>
        <TaskBoard controller={controller} embedded />
      </div>
    </div>
  )
}