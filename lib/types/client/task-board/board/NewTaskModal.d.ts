/**
* NewTaskModal.tsx —— 「新建任务」弹窗。
*
* 通过 createPortal 渲染到 document.body 的模态框，收集新任务信息：
* 标题（必填）、描述、执行 Prompt、以及可选的执行设置
* （工作区 / 模式（agent 预设）/ 权限），统称为「钉住的执行目标」。
* - 提交：调用 controller.createTask()，返回 undefined 表示标题为空，
*   显示校验错误；成功则关闭弹窗；
* - 执行选项（可选工作区与预设清单）订阅控制器快照实时更新；
* - Esc 或点击遮罩关闭；标题输入框自动聚焦。
*/
import type { BoardController } from '../../../core/controller.ts';
/**
* 新建任务弹窗组件。
*
* @param props.controller 看板控制器：创建任务、读取执行选项。
* @param props.onClose 关闭回调（取消 / 成功创建后触发）。
*/
export declare function NewTaskModal({ controller, onClose }: {
    controller: BoardController;
    onClose: () => void;
}): import("react").ReactPortal;
