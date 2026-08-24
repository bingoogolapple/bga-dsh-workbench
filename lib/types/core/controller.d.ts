/**
 * 看板控制器（浏览器端状态中枢）。
 *
 * BoardController 持有看板的全部可变状态（任务列表、面板开关、选中态、归档视图、
 * 执行选项），并提供对外操作（增删改、移动、排序、执行、归档）。它以 getSnapshot /
 * subscribe 的响应式方式向 React 组件暴露状态；每次变更都会先持久化（store.save）
 * 再通知订阅者。同时负责协调执行事件与运行中任务的挽回（reconcile）。
 */
import { ExecutionService } from './execution.ts';
import type { TaskStore } from './store.ts';
import { type NewTaskInput, type TaskRecord, type TaskStatus } from './tasks.ts';
import { type TaskUpdatePatch } from './use-cases/task-update.ts';
import { type CategoryDef, type WeekStart, type WorkbenchMeta } from './workbench-meta.ts';
import type { WorkbenchMetaStore } from './workbench-meta-store.ts';
/** 会话控制器门面：只暴露控制器需要的最小能力（当前会话快照 + 打开会话） */
export interface SessionsControllerFace {
    list: {
        /** 获取当前会话 ID 快照 */
        getSnapshot(): {
            current: string | undefined;
        };
        /** 订阅会话变化 */
        subscribe(fn: () => void): () => void;
    };
    /** 打开（跳转到）某个会话 */
    open(id: string): void;
}
/** 控制器的外部依赖（存储、执行服务、会话门面，均来自 task-board-apply.ts 装配） */
export interface ControllerDeps {
    store: TaskStore;
    exec: ExecutionService;
    sessions: SessionsControllerFace;
    /** 工作台元数据存储（可选：日报「当日已完成」打卡；缺省使用内存空元数据） */
    metaStore?: WorkbenchMetaStore;
    /** 时钟（默认 Date.now） */
    now?: () => number;
    /** 生成执行/任务 ID（默认随机 UUID） */
    uuid?: () => string;
    /** 运行中任务调和（reconcile）的去抖毫秒数（默认 350） */
    reconcileDebounceMs?: number;
}
/** 执行可用的工作区选项 */
export interface ExecutionWorkspaceOption {
    workspaceId: string;
    /** 展示名（取工作区标题或路径） */
    title: string;
}
/** 执行可用的 agent 预设（模式）选项 */
export interface ExecutionPresetOption {
    id: string;
    name?: string;
    description?: string;
    /** 预设不可用（broken）时的提示；存在即不可选 */
    broken?: string;
    isDefault: boolean;
}
/** 执行选项快照（工作区列表 + 预设列表） */
export interface ExecutionOptionsSnapshot {
    workspaces: readonly ExecutionWorkspaceOption[];
    presets: readonly ExecutionPresetOption[];
}
/** 控制器对外快照：React 组件订阅的最小视图 */
export interface ControllerSnapshot {
    tasks: readonly TaskRecord[];
    boardOpen: boolean;
    /** 是否处于归档视图 */
    archiveView: boolean;
    selectedTaskId: string | undefined;
    /** 新建/编辑任务时可选的执行目标 */
    executionOptions: ExecutionOptionsSnapshot;
    /** 工作台元数据（日报「当日已完成」打卡等） */
    meta: WorkbenchMeta;
}
/** 从快照中取出当前选中的任务 */
export declare function selectedTaskOf(snapshot: ControllerSnapshot): TaskRecord | undefined;
/** 看板控制器：看板全部状态与操作的持有者 */
export declare class BoardController {
    private readonly deps;
    /** 任务列表（内存副本，变更后立即落盘） */
    private tasks;
    /** 看板是否打开（全屏面板可见） */
    private boardOpen;
    /** 是否处于归档视图 */
    private archiveView;
    /** 当前选中的任务 ID（详情弹窗） */
    private selectedTaskId;
    /** 执行选项（工作区/预设列表），由外部推送 */
    private executionOptions;
    /** 工作台元数据（日报「当日已完成」打卡），从 metaStore 加载 */
    private meta;
    /** 状态订阅者集合 */
    private listeners;
    /** 生命周期清理函数集合（dispose 时逐一执行） */
    private disposers;
    /** 时钟函数（可注入以便测试） */
    private readonly now;
    /** ID 生成函数（可注入以便测试） */
    private readonly uuid;
    /** 构造控制器：注入依赖，配置默认时钟/ID 生成器 */
    constructor(deps: ControllerDeps);
    /**
     * 启动控制器：
     * 1. 从存储加载任务；
     * 2. 立即调和（reconcile）运行中任务的真实结局；
     * 3. 订阅外部存储改动与会话变化；
     * 4. 通知一次初始快照。
     */
    start(): void;
    /** 释放控制器：清理订阅、定时器与监听者 */
    dispose(): void;
    /** 获取当前状态快照（React 组件渲染用） */
    getSnapshot(): ControllerSnapshot;
    /** 切换某天「当日日报已完成」打卡（打卡/取消），返回切换后的状态 */
    toggleDayDone(date: string): void;
    /** 设置周起始日偏好（monday/sunday），持久化并通知 */
    setWeekStart(weekStart: WeekStart): void;
    /** 替换整张分类配置表（分类管理弹窗提交），持久化并通知 */
    setCategories(categories: readonly CategoryDef[]): void;
    /** 追加一个分类（id 冲突时忽略） */
    addCategory(def: CategoryDef): void;
    /** 删除一个分类（任务引用该分类时变为「未分类」显示） */
    removeCategory(id: string): void;
    /** 更新日报提醒配置（启用 + cron） */
    setReminder(patch: {
        enabled?: boolean;
        cron?: string;
    }): void;
    /** 记录一次日报提醒触发（去重用），持久化 */
    markReminderTriggered(): void;
    /** 订阅快照变化，返回取消订阅函数 */
    subscribe(fn: () => void): () => void;
    /**
     * 打开看板（全屏面板）。
     * 记录打开瞬间的当前会话，用于会话切换时自动关闭。
     */
    openBoard(): void;
    /** 关闭看板 */
    closeBoard(): void;
    /** 切换看板开关 */
    toggleBoard(): void;
    /** 切换归档视图 */
    toggleArchiveView(): void;
    /** 选中（打开详情）某任务；任务不存在则忽略 */
    openTask(id: string): void;
    /** 关闭任务详情弹窗 */
    closeTask(): void;
    /** 创建新任务（标题为空时返回 undefined 表示失败） */
    createTask(input: NewTaskInput): TaskRecord | undefined;
    /** 更新任务（补丁合并后落盘） */
    updateTask(id: string, patch: TaskUpdatePatch): void;
    /** 从外部推送执行选项（工作区/预设列表） */
    setExecutionOptions(patch: Partial<ExecutionOptionsSnapshot>): void;
    /** 手动移动任务到目标状态 */
    moveTask(id: string, status: TaskStatus): void;
    /** 删除任务（如删除的是当前选中任务，清空选中态） */
    deleteTask(id: string): void;
    /** 归档任务：仅已完成/已失败可归档，返回是否成功 */
    archiveTask(id: string): boolean;
    /** 恢复归档任务，返回是否成功 */
    restoreTask(id: string): boolean;
    /**
     * 设置任务的定时规则（启用 + cron），返回是否应用成功。
     * cron 非法或任务不存在时返回 false（不会落盘）。
     */
    setSchedule(id: string, patch: {
        enabled?: boolean;
        cron?: string;
    }): boolean;
    /** 调度器回写某任务的下次运行/上次触发时间 */
    applyScheduleNextRun(id: string, nextRunAt: number | undefined, lastTriggeredAt: number | undefined): void;
    /** 从存储重新加载任务列表（不通知，供调度器刷新快照） */
    reloadFromStore(): void;
    /** 跳转到某个执行会话 */
    openSession(sessionId: string): void;
    /**
     * 执行任务：启动一次执行并监听结局事件。
     * 任务不存在或已在运行时返回 false；否则：
     * 1. 落盘置为 running 并追加执行记录；
     * 2. 记录执行 ID 到 activeExecutionIds（调和时跳过）；
     * 3. 交给 ExecutionService.run 驱动真实 agent 会话。
     */
    runTask(id: string): Promise<boolean>;
    /** 重新执行任务：先移回 todo（若未在运行），再启动执行 */
    rerunTask(id: string): Promise<void>;
    /** 处理执行事件：started 挂上会话 ID；settled 落定结果与状态 */
    private handleExecutionEvent;
    /**
     * 会话变化回调：
     * 1. 总是调度一次运行中任务的调和（会话可能已消失/结束）；
     * 2. 若看板打开且当前会话已切换，自动关闭看板。
     */
    private onSessionsChanged;
    /** 打开看板时记录的会话 ID（用于会话切换检测） */
    private lastCurrent;
    /** 在途执行 ID 集合（调和时跳过，等待事件回调处理） */
    private readonly activeExecutionIds;
    /** 调和定时器句柄 */
    private reconcileTimer;
    /** 调和进行中标记（防重入） */
    private reconcileInFlight;
    /** 去抖调度一次运行中任务调和 */
    private scheduleReconcile;
    /**
     * 调和运行中任务：对每个「不在途」的运行中任务，向执行服务询问真实结局
     * （会话消失 → 视为取消；会话空闲 → 按 lastAgentError 判定成败），
     * 并一次性落盘与通知。
     */
    private reconcileRunningTasks;
    /** 落盘并通知订阅者（每次状态变更的标准出口） */
    private persistAndNotify;
    /** 通知所有订阅者快照已变化 */
    private notify;
}
