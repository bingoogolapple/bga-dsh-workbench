/**
 * embed-mount.tsx —— 看板「内嵌模式」的挂载逻辑。
 *
 * 与 board-mount.tsx 的全屏覆盖不同，本模块把 <TaskBoardEmbed /> 渲染到一个
 * 采用 display: contents 的占位容器里并挂到 <body> 末尾：容器只作为 React
 * 承载节点、不产生任何布局盒子，真正的视觉布局由 TaskBoardEmbed 内部通过
 * 绝对定位完成，用于 DSH 首页 hero 空态时把看板以内嵌卡片形式显示在
 * 对话区中央。入口带幂等守卫：若页面上已存在内嵌根容器
 * （data-bga-kb-embed-root），说明本页面已挂载过，直接返回空清理函数。
 */
import { createRoot, type Root } from 'react-dom/client'
import type { BoardController } from '../../core/controller.ts'
import { TaskBoardEmbed } from './TaskBoardEmbed.tsx'

// 内嵌根容器的标记属性名：用于幂等判定（页面中已存在则不再重复挂载）。
const CONTAINER_ATTR = 'data-bga-kb-embed-root'

/**
 * 挂载内嵌版看板（TaskBoardEmbed）。
 *
 * @param controller 看板控制器，透传给内嵌组件用于驱动看板状态。
 * @returns 清理函数：卸载 React 根并移除占位容器；若幂等守卫拦截，
 *          则返回一个什么都不做的空函数。
 */
export function mountBoardEmbed(controller: BoardController): () => void {
  // 幂等守卫：页面上已有内嵌根容器时直接放弃，避免重复挂载。
  if (typeof document !== 'undefined' && document.querySelector(`[${CONTAINER_ATTR}]`) !== null) {
    return () => {}
  }
  const container = document.createElement('div')
  container.setAttribute(CONTAINER_ATTR, '')
  // display: contents —— 容器不产生布局盒子，仅作为 React 树的挂载点，
  // 页面其余布局不受影响，视觉效果全部由 TaskBoardEmbed 的定位样式负责。
  container.style.display = 'contents'
  document.body.appendChild(container)
  const root: Root = createRoot(container)
  root.render(<TaskBoardEmbed controller={controller} />)
  return () => {
    root.unmount()
    container.remove()
  }
}