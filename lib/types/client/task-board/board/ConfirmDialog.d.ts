/**
 * 确认对话框的 props。
 */
export interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel: string;
    danger?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}
/**
 * 确认对话框组件。
 */
export declare function ConfirmDialog({ title, message, confirmLabel, danger, onCancel, onConfirm }: ConfirmDialogProps): import("react").JSX.Element;
