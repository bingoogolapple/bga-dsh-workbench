/**
 * useDialogFocus.ts —— 模态对话框焦点管理（无第三方依赖的基础 focus trap）。
 *
 * 用于所有 createPortal 渲染的模态：挂载后把焦点移入对话框内第一个可聚焦元素
 * （无任何可聚焦元素时聚焦容器本身），并将 Tab / Shift+Tab 的焦点循环限制在
 * 对话框内部——避免焦点跑到遮罩之后的页面其余部分，符合基本「对话框可访问性」要求。
 */
import type { RefObject } from 'react'
import { useEffect } from 'react'

/** 可聚焦元素选择器 + 过滤禁用项 */
function focusablesOf(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )).filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
}

/**
 * 绑定对话框焦点管理到容器 ref。
 * @param ref 指向 role="dialog"/"alertdialog" 容器的 ref（挂载后即生效）。
 */
export function useDialogFocus(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const container = ref.current
    if (container === null) return

    // 初始聚焦：优先第一个可聚焦元素；否则容器自身（临时设为可聚焦）。
    const initial = focusablesOf(container)
    if (initial.length > 0) {
      initial[0]!.focus()
    } else {
      container.tabIndex = -1
      container.focus()
    }

    // focus trap：Tab 循环限制在容器内。
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return
      const list = focusablesOf(container)
      if (list.length === 0) return
      const first = list[0]!
      const last = list[list.length - 1]!
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [ref])
}