import type { BoardController } from '../../../core/controller.ts';
import { type TaskRecord } from '../../../core/tasks.ts';
/**
* 任务详情组件（全屏模态）。
*
* createPortal 渲染到 document.body。内部维护两个要点：
* - confirmDelete：控制删除确认框是否显示；
* - latest/current：「latest 快照」保存当前展示的任务对象，task prop 变化
*   时同步进去——这样当任务在后台被更新（例如执行结果回流、定时状态刷新）
*   时，详情内容能跟随快照实时刷新。
*
* @param props.controller 看板控制器。
* @param props.task 当前任务对象（受控输入）。
*/
export declare function TaskDetail({ controller, task }: {
    controller: BoardController;
    task: TaskRecord;
}): import("react").ReactPortal;
