// ============================================================================
// 文件：hide-hero-headline.ts —— 隐藏 hero 空态中的默认醒目头条文案
//
// 职责：
//   空态（hero）页面上默认会展示一句品牌性质的固定头条（如「探索未至之境」）。
//   本工作台已经在空态顶部叠加了自定义横幅（Banner.tsx），这句默认头条会与其
//   视觉上重叠；本模块负责把这些默认头条所在的整行隐藏掉，为横幅让出位置。
// ============================================================================

// 需要隐藏的 hero 默认头条文案列表（与运行时页面内置文案保持一致）
const HERO_HEADLINES = ['探索未至之境', 'Into the Unknown'] as const

// 标记“已隐藏”行的 data 属性名：避免对同一行反复处理与重复改样式
const HIDE_HERO_MARK = 'bgaHeroHidden'

// 启动“隐藏 hero 默认头条”的能力，返回清理函数（断开 MutationObserver、清除防抖定时器）。
//
// 实现要点：
//  - 先同步扫描一次当前 DOM，隐藏命中的头条行；
//  - 再用 MutationObserver 监听后续动态渲染，保证新出现的头条也能及时隐藏；
//  - 命中行的隐藏操作带 dataset 标记去重，并做 50ms 防抖节流，避免热点路径频繁扫描。
export function setupHeroHeadlineHider(): () => void {
  let timer: number | undefined // 防抖定时器句柄

  // 执行一轮隐藏扫描
  const hidePass = (): void => {
    const root = document.querySelector('[data-phase]')
    // 只在空态 hero 阶段处理（其它阶段没有默认头条需要隐藏）
    if (root === null || root.getAttribute('data-phase') !== 'hero') return
    for (const span of root.querySelectorAll('span')) {
      const text = span.textContent?.trim()
      if (text === undefined || text.length === 0 || !HERO_HEADLINES.includes(text as (typeof HERO_HEADLINES)[number])) continue
      // 定位到头条所在的整行做隐藏（只是 display:none，不删除文本节点）；
      // 已处理过的行用 dataset 标记跳过
      const row = span.parentElement
      if (row === null || row.dataset[HIDE_HERO_MARK] !== undefined) continue
      row.dataset[HIDE_HERO_MARK] = ''
      row.style.display = 'none'
    }
  }

  // 防抖调度：多次 DOM 变动合并到一次 50ms 后的扫描里
  const schedule = (): void => {
    if (timer !== undefined) return // 已有待执行扫描，本次变动直接并入
    timer = window.setTimeout(() => {
      timer = undefined
      hidePass()
    }, 50)
  }

  hidePass()
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })
  return () => {
    // 清理：断开观测器并清除未执行的防抖定时器
    observer.disconnect()
    if (timer !== undefined) window.clearTimeout(timer)
  }
}