/**
 * ConfirmDialog.tsx —— 通用的确认对话框（卸载看板的删除/危险操作用）。
 *
 * 渲染一个模态遮罩 + 小尺寸对话框：标题、消息、「取消」按钮与
 * 「确认」按钮（danger 时使用危险样式）。交互细节：
 * - 按 Esc 键触发取消并让当前聚焦元素失焦；
 * - 点击遮罩本身（target === currentTarget）也触发取消；
 * - 通过 createPortal 之外的普通渲染（由调用方决定挂载位置）。
 */
import { useEffect } from 'react'
import { t } from '../locales.ts'
import css from '../kanban.module.css'

/**
 * 确认对话框的 props。
 */
export interface ConfirmDialogProps {
  // 对话框标题（同时作为 alertdialog 的可访问名称）。
  title: string
  // 正文说明文字。
  message: string
  // 确认按钮上的文字（如「删除」）。
  confirmLabel: string

  // 是否使用危险（红色）样式。
  danger?: boolean
  // 取消回调（取消/点击遮罩/Esc 时触发）。
  onCancel: () => void
  // 确认回调（点击确认按钮时触发）。
  onConfirm: () => void
}

/**
 * 确认对话框组件。
 */
export function ConfirmDialog({ title, message, confirmLabel, danger, onCancel, onConfirm }: ConfirmDialogProps) {
  // 让当前聚焦元素失焦：关闭对话框后避免残留的聚焦态/键盘焦点。
  const blurActive = (): void => {
    const el = document.activeElement
    if (el instanceof HTMLElement && el !== document.body) el.blur()
  }

  // 挂载期间监听键盘：Esc 键即视为取消（并失焦）。
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onCancel()
        blurActive()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onCancel])
  return (
    // 遮罩：只有点击遮罩本身（而非对话框内部）时才取消。
    <div className={css["bga-kb-modal-bg"]} onMouseDown={event => { if (event.target === event.currentTarget) onCancel() }}>
      <div className={css["bga-kb-modal-sm"]} role="alertdialog" aria-label={title}>
        <h2 className={css["bga-kb-modal-title"]}>{title}</h2>
        <p className={css["bga-kb-modal-msg"]}>{message}</p>
        <footer className={css["bga-kb-modal-foot"]}>
          <button type="button" className={css["bga-kb-btn-ghost"]} onClick={onCancel}>
            {t('delete.cancel')}
          </button>
          <button
            type="button"
            className={danger ? css["bga-kb-btn-danger"] : css["bga-kb-btn-primary"]}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  )
}