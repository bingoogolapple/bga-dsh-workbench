/**
 * NewTaskModal.tsx —— 「新建任务」弹窗。
 *
 * 通过 createPortal 渲染到 document.body 的模态框，收集新任务信息：
 * 标题（必填）、描述、执行 Prompt、分类 / 日期 / 优先级 / 形态（轻量待办 | 可执行），
 * 以及可选的执行设置（工作区 / 模式（agent 预设）/ 权限）。
 * - 提交：调用 controller.createTask()，返回 undefined 表示标题为空，显示校验错误；
 *   成功则关闭弹窗；
 * - 可选入参 prefill：矩阵内新建时预填 分类 + 归属日期（reportDate）；
 * - 执行选项（可选工作区与预设清单）订阅控制器快照实时更新；
 * - Esc 或点击遮罩关闭；标题输入框自动聚焦。
 */
import type { BoardController } from '../../../core/controller.ts';
import { type TaskCategory } from '../../../core/tasks.ts';
/**
 * 新建任务弹窗组件。
 *
 * @param props.controller 看板控制器：创建任务、读取执行选项。
 * @param props.onClose 关闭回调（取消 / 成功创建后触发）。
 * @param props.prefill 矩阵内新建预填（分类 + 归属日期）；缺省 undefined。
 */
export declare function NewTaskModal({ controller, onClose, prefill }: {
    controller: BoardController;
    onClose: () => void;
    prefill?: {
        category?: TaskCategory;
        reportDate?: string;
    };
}): import("react").ReactPortal;
