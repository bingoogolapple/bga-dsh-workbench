// ============================================================================
// 文件：Banner.tsx —— 「工作台横幅」组件
//
// 职责：
//   在页面空态（hero 阶段）顶部居中显示「头像 + 问候语」横幅。
//   通过 MutationObserver 监听页面 data-phase 状态的变化，只在进入 hero 阶段时
//   把横幅定位到中间对话列的上方；一旦进入对话阶段或有任务看板接管则自动隐藏。
// ============================================================================
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { AVATAR_URL, DEFAULT_TEXT, useBannerConfig } from './banner-config.ts'

// 横幅外层样式：fixed 定位于视口；初始 display:none，
// 后续由 update() 在 hero 阶段计算出坐标后改为 flex 显示。
const bannerStyle: CSSProperties = {
  position: 'fixed',
  zIndex: 20, // 位于页面主体之上、但低于对话框等交互层
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
}

const contentStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  userSelect: 'text',
}

// 头像样式：圆形裁切 + 轻阴影
const avatarStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  objectFit: 'cover',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
}

// 问候语文案样式
const textStyle: CSSProperties = {
  fontSize: 20,
  lineHeight: 1.2,
  fontWeight: 600,
  color: 'var(--dsw-alias-label-primary, #222)',
}

// 「工作台横幅」组件：渲染于页面顶层（fixed 定位），仅在空态 hero 阶段显示。
// 无 props；文案与是否显示均来自 useBannerConfig（设置页修改后会实时刷新）。
export function WorkbenchBanner() {
  const ref = useRef<HTMLDivElement>(null)
  const config = useBannerConfig(DEFAULT_TEXT)

  // —— DOM 定位逻辑 ——
  // 目标：把横幅定位到“中间对话列”的上方。
  // 实现：页面主区域带 [data-phase] 属性标识当前阶段，输入框带 [data-composer-seat]；
  // 通过 MutationObserver + ResizeObserver 监听这两者的变化，实时读取它们的矩形坐标，
  // 把横幅定位到目标位置；无法拿到有效矩形或不在 hero 阶段时则隐藏横幅。
  useEffect(() => {
    const el = ref.current
    if (el === null) return
    let lastPhase: string | null = null // 最近一次见到的阶段值（用于检测阶段切换）
    let lastRectKey = '' // 上次定位时列矩形的整数化 key（用于跳过重复定位）
    let observedRoot: Element | null = null // 已建立 ResizeObserver 的列容器
    let resizeObserver: ResizeObserver | undefined

    // 确保对“hero 列容器”建立 ResizeObserver：
    // 窗口尺寸变化 / 列重新布局时，能及时触发 update() 重新定位。
    const ensureObserved = (root: Element | null): void => {
      if (root === null || root === observedRoot) return
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver?.disconnect()
        resizeObserver = new ResizeObserver(update)
        resizeObserver.observe(root)
      }
      observedRoot = root
    }

    // 核心定位函数：DOM 变化或尺寸变化时都会执行
    const update = (): void => {
      const current = ref.current
      if (current === null) return
      const root = document.querySelector('[data-phase]')
      ensureObserved(root)
      const phase = root?.getAttribute('data-phase') ?? null

      // 任务看板接管页面时（html 上有 bga-kb-open / bga-kb-embed 标记），
      // 让出顶部空间：直接隐藏横幅，避免遮挡看板 UI。
      const takeover = document.documentElement.hasAttribute('data-bga-kb-open')
        || document.documentElement.hasAttribute('data-bga-kb-embed')
      if (takeover) {
        lastRectKey = ''
        current.style.display = 'none'
        return
      }

      // 阶段切换时更新记忆；只有 hero 阶段需要显示，其余阶段一律隐藏。
      if (phase !== lastPhase) {
        lastPhase = phase
        if (phase !== 'hero') {
          lastRectKey = ''
          current.style.display = 'none'
          return
        }
      }
      if (phase !== 'hero') return

      // 以 hero 列的包围矩形为定位基准；宽高为 0 说明列尚未完成布局，先隐藏。
      const column = root!.getBoundingClientRect()
      if (column.width <= 0 || column.height <= 0) {
        lastRectKey = ''
        current.style.display = 'none'
        return
      }

      // 把列矩形取整后拼成 key，若与上次完全相同则跳过定位
      // （避免滚动、布局抖动等微小变化导致反复改写样式造成闪烁）。
      const rectKey = `${Math.round(column.left)}x${Math.round(column.top)}`
        + `x${Math.round(column.width)}x${Math.round(column.height)}`
      if (rectKey === lastRectKey) return
      lastRectKey = rectKey

      // 定位：优先把横幅放在输入框上方约 140px 处；输入框不可用时
      // 退化为放在列顶部下方 24px。
      const seat = root!.querySelector('[data-composer-seat]')
      const seatRect = seat?.getBoundingClientRect()
      current.style.display = 'flex'
      current.style.left = `${column.left}px`
      current.style.width = `${Math.max(0, column.width)}px`
      current.style.top = seatRect !== undefined && seatRect.height > 0
        ? `${seatRect.top - 140}px`
        : `${column.top + 24}px`
    }
    update()

    // 监听 body 的节点/属性变化（含 data-phase 的改动）以及 html 属性变化
    // （任务看板的接管标记），任何相关变化都触发重新定位。
    const observer = new MutationObserver(update)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-phase'],
    })
    observer.observe(document.documentElement, { attributes: true })
    return () => {
      // 卸载清理：断开观测器，避免内存泄漏
      observer.disconnect()
      resizeObserver?.disconnect()
    }
  }, [])

  if (!config.show) return null
  return (
    <div ref={ref} style={bannerStyle} data-bga-banner="">
      <div style={contentStyle}>
        <img src={AVATAR_URL} alt="" style={avatarStyle} />
        <span style={textStyle}>{config.text}</span>
      </div>
    </div>
  )
}