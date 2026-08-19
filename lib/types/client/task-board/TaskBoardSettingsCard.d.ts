/**
* TaskBoardSettingsCard.tsx —— 「BGA 任务看板」的设置卡片。
*
* 在 DSH 设置页的 web-ui.plugin.item 槽位渲染本插件的专属设置卡片：
* - 通过 SettingsScope<TaskBoardSettings> 对接「启用看板 / 向 agent 播报看板」
*   两个布尔配置项；
* - TaskBoardSettingsCardController 基于 settings-form.ts 的 CardForm 封装表单
*   状态，并把状态投影（projection）成一个可订阅的 SnapshotStore，注入到
*   hooks.taskBoardSettingsCard 槽位，供 React 卡片消费；
* - 界面层用通用外壳 PluginSettingsCard 加两个 BooleanField 渲染开关，
*   编辑 / 重置 / 保存 / 放弃等动作通过 CardActions（props.edit /
*   props.resetField / props.save / props.discard）回传给 CardForm。
*/
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { SettingsScope, SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import { type CardActions, type CardShell, type FieldState as CardFieldState } from './settings-form.ts';
/**
* 本插件（任务看板）的设置项。
*/
export interface TaskBoardSettings {
    enabled?: boolean;
    announceToAgent?: boolean;
}
/**
* 本设置卡片对外投影的可订阅状态：卡片外壳状态 + 每个字段的字段状态。
*/
export interface TaskBoardSettingsCardState extends CardShell {
    enabled: CardFieldState;
    announceToAgent: CardFieldState;
}
/**
* 本设置卡片的注入面（InjectionFace）：向宿主槽位暴露动作与 hooks。
*/
export interface TaskBoardSettingsCardFace extends CardActions {
    hooks: {
        taskBoardSettingsCard: SnapshotStore<TaskBoardSettingsCardState>;
    };
}
/**
* 本设置卡片的控制器：把 CardForm 与 SnapshotStore 组装起来。
*
* 职责：构造 CardForm（注册两个布尔字段）、绑定投影 store、向槽位注入。
*/
export declare class TaskBoardSettingsCardController {
    private readonly form;
    private readonly store;
    /**
     * @param scope 本插件配置命名空间的设置作用域（读写入口 + 订阅源）。
     */
    constructor(scope: SettingsScope<TaskBoardSettings>);
    /**
     * 投影函数：把表单外壳状态 + 逐字段状态合成可订阅快照。
     */
    private projection;
    /**
     * 向槽位注入（inject）：返回动作集合 + 状态 hooks，供宿主消费。
     */
    inject(): TaskBoardSettingsCardFace;
}
/**
* 设置卡片组件的完整 props：槽位运行时 props + 本命名空间的 locale + 注入面。
*/
export type TaskBoardSettingsCardProps = PropsRuntime<'web-ui.plugin.item'> & PropsLocale<'bga-dsh-workbench-task-board'> & InjectFace<TaskBoardSettingsCardFace>;
/**
* 「BGA 任务看板」设置卡片界面。
*
* 订阅 hooks.taskBoardSettingsCard 拿到快照，渲染两个 BooleanField 开关，
* 并把界面的编辑 / 重置动作映射回 CardActions 调用。
*/
export declare function TaskBoardSettingsCard(props: TaskBoardSettingsCardProps): import("react").JSX.Element;
