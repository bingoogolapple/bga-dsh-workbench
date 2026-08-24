/**
 * useDialogFocus.ts —— 模态对话框焦点管理（无第三方依赖的基础 focus trap）。
 *
 * 用于所有 createPortal 渲染的模态：挂载后把焦点移入对话框内第一个可聚焦元素
 * （无任何可聚焦元素时聚焦容器本身），并将 Tab / Shift+Tab 的焦点循环限制在
 * 对话框内部——避免焦点跑到遮罩之后的页面其余部分，符合基本「对话框可访问性」要求。
 */
import type { RefObject } from 'react';
/**
 * 绑定对话框焦点管理到容器 ref。
 * @param ref 指向 role="dialog"/"alertdialog" 容器的 ref（挂载后即生效）。
 */
export declare function useDialogFocus(ref: RefObject<HTMLElement | null>): void;
