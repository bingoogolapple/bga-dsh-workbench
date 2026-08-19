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
import type { BoardController } from '../../core/controller.ts';
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
export declare function mountSidebarEntry(controller: BoardController): () => void;
