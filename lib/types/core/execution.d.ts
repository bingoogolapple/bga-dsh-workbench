/**
 * 执行服务（浏览端 → 真实 agent 会话的驱动层）。
 *
 * 负责把看板任务真正跑起来：
 * 1. 连上/创建目标工作区对应的执行会话；
 * 2. 按任务的钉住配置应用 agent 预设（模式）与权限；
 * 3. 重命名单会以来标记任务、发送 prompt（排队模式）；
 * 4. 监听会话轮次结束，判定成功/失败/取消并回传事件；
 * 5. 提供 reconcile：为页面刷新后遗留在 running 的任务查回真实结局。
 */
import type { ExecutionRecord, TaskRecord } from './tasks.ts';
/** 会话现状摘要（执行服务所需的会话快照类型） */
export interface ExecutionSessionSummary {
    /** 会话当前是否在运行回合 */
    running: boolean;
    /** 是否已完成（可选） */
    completed?: boolean;
    /** 是否为空白会话（未跑过任何回合，允许换预设） */
    blank?: boolean;
    /** 会话当前使用的 agent 预设 ID（旧版 DSH：直接挂在会话摘要上） */
    agentPreset?: string;
    /**
     * 宿主持久化投影值（新版 DSH：agentPreset 已从摘要迁到 projection，
     * 由 agent-presets 投影插件注册；旧版无此字段）。
     */
    projectionValues?: {
        readonly agentPreset?: string;
    };
}
/**
* 读取会话当前使用的 agent 预设（新旧 DSH 双来源）。
*
* - 旧版：直接挂在会话摘要的 `agentPreset` 字段上；
* - 新版：摘要上已移除该字段，改由 `projectionValues.agentPreset` 提供
*   （由 agent-presets 投影插件注册，未启用时缺失）。
*
* 不做静默降级：两个来源都取不到就返回 undefined，由调用方决定行为。
*/
export declare function presetOf(summary: ExecutionSessionSummary | undefined): string | undefined;
/** 工作区列表快照（执行服务所需的最小形状） */
export interface WorkspaceListSnapshot {
    items: readonly {
        workspaceId: string;
        sessionIds?: readonly string[];
    }[];
    /** 最近使用的工作区：仅旧版 DSH 提供，新版上游已移除该字段 */
    recentWorkspaceId: string | undefined;
}
/**
 * 未钉工作区时的默认工作区择优顺序：
 *
 * 1. **当前会话所在的工作区** —— 新版 DSH 语义。上游已移除 `recentWorkspaceId`，
 *    改用「当前会话归属哪个工作区」来贴近用户当前所在上下文；
 * 2. `recentWorkspaceId` —— 仅旧版 DSH 提供（旧版 WorkspaceView 未必带 sessionIds）；
 * 3. 列表第一个 —— 最终兜底。
 *
 * 任一步取不到就自然落到下一步，不做静默吞错。
 *
 * @param sessions   会话列表快照（取 current）。
 * @param workspaces 工作区列表快照。
 * @returns 选中的工作区 id，全部落空时为 undefined。
 */
export declare function preferredWorkspaceId(sessions: {
    current?: string;
}, workspaces: WorkspaceListSnapshot): string | undefined;
/** 会话执行门面：会话列表/绑定/预设记录（由 task-board-apply.ts 适配注入） */
export interface SessionsExecutionFace {
    list: {
        getSnapshot(): {
            /** 会话仓库是否就绪 */
            phase: 'pending' | 'ready';
            byId: Record<string, ExecutionSessionSummary>;
            /** 当前选中的会话（新版 DSH 提供；旧版缺失时为 undefined） */
            current?: string;
        };
        subscribe(fn: () => void): () => void;
    };
    /** 获取会话绑定（内含驱动句柄） */
    binding(id: string): {
        session: SessionDriver;
    } | undefined;
    /** 可选：记录某会话已切换到某预设 */
    noteAgentPreset?(sessionId: string, agentPreset: string): void;
}
/** 预设执行门面：切换会话的 agent 预设 */
export interface PresetsExecutionFace {
    /** 给会话切换预设；返回成功或失败详情 */
    select(sessionId: string, agentPreset: string): Promise<{
        ok: true;
    } | {
        ok: false;
        error: unknown;
    }>;
}
/** 工作区执行门面：工作区列表与连接 */
export interface WorkspacesExecutionFace {
    list: {
        getSnapshot(): {
            items: readonly {
                workspaceId: string;
                sessionIds?: readonly string[];
            }[];
            /** 最近使用的工作区：仅旧版 DSH 提供，新版上游已移除该字段 */
            recentWorkspaceId: string | undefined;
        };
    };
    /** 连接（创建/激活）某工作区会话，返回会话 ID */
    connectWorkspace(workspaceId: string): Promise<string>;
}
/** 会话历史中的一条事件（用于执行结局兜底探测） */
export interface ExecutionHistoryEvent {
    type: string;
    data?: unknown;
}
/** 历史门面：读取会话尾部历史事件 */
export interface HistoryExecutionFace {
    loadTail(sessionId: string): Promise<{
        events: readonly ExecutionHistoryEvent[];
    } | undefined>;
}
/** 会话驱动句柄：执行服务与真实会话交互的最小接口 */
export interface SessionDriver {
    /** 重命名会话标题 */
    rename(title: string): Promise<unknown>;
    /** 发送 prompt（排队模式，等待轮次开始） */
    prompt(content: readonly unknown[], mode: 'queue'): Promise<{
        ok: true;
    } | {
        ok: false;
        error: unknown;
    }>;
    /** 执行斜杠命令（这里用于 /permission） */
    command(line: string): Promise<{
        ok: true;
        matched: boolean;
    } | {
        ok: false;
        error: unknown;
    }>;
    /** 会话快照：是否运行、最后一次 agent 错误、已结束轮次数 */
    getSnapshot(): {
        running: boolean;
        lastAgentError: string | null;
        turnEnds: ReadonlyMap<number, number>;
    };
    /** 订阅会话变化 */
    subscribe(fn: () => void): () => void;
}
/** 执行服务所需的全部外部环境（会话/工作区/预设/历史） */
export interface ExecutionEnvironment {
    sessions: SessionsExecutionFace;
    workspaces: WorkspacesExecutionFace;
    /** 预设切换能力（部署可能不支持） */
    presets?: PresetsExecutionFace;
    /** 历史读取能力（用于结局兜底探测） */
    history?: HistoryExecutionFace;
}
/** 执行事件：started = 已绑定会话；settled = 已有结局 */
export type ExecutionEvent = {
    kind: 'started';
    taskId: string;
    executionId: string;
    sessionId: string;
} | {
    kind: 'settled';
    taskId: string;
    executionId: string;
    outcome: 'succeeded' | 'failed' | 'cancelled';
    error?: string;
};
/** 执行服务：把任务驱动为真实 agent 执行 */
export declare class ExecutionService {
    private readonly env;
    /** 构造执行服务，注入环境依赖 */
    constructor(env: ExecutionEnvironment);
    /**
     * 执行一个任务：
     * 1. 连接会话；
     * 2. 应用模式（agent 预设）与权限；
     * 3. 重命名会话、发送 prompt；
     * 4. 监听回合结束并结算。
     * 任何一步失败都会以 settled-failed 事件回传。
     */
    run(task: TaskRecord, execution: ExecutionRecord, onEvent: (event: ExecutionEvent) => void): Promise<void>;
    /**
     * 应用任务钉住的模式（agent 预设）：
     * - 未钉住 → 直接通过；
     * - 会话非空白（已有历史）→ 拒绝，因为换预设会丢失会话上下文；
     * - 已处于目标预设 → 通过；
     * - 部署不支持预设 → 拒绝；
     * - 切换被拒但错误表明目标预设已在运行 → 视作成功。
     */
    private applyMode;
    /**
     * 应用任务钉住的权限：向会话执行 `/permission <档位>` 命令。
     * 未钉住 → 通过；命令未识别或执行失败 → 拒绝。
     */
    private applyPermission;
    /**
     * 调和：为遗留运行中的任务查回真实结局（页面刷新/会话结束等场景）。
     * 逻辑：
     * - 执行记录不完整（无会话或无结束时间）→ 不处理；
     * - 会话仓库未就绪 → 不处理；
     * - 会话已不存在 → 视为取消；
     * - 会话仍在运行 → 不处理；
     * - 会话有已结束轮次 → 按 lastAgentError 判定成败；
     * - 否则回看历史尾部有无错误回合，有则判失败；
     * - 两者皆无（会话空闲且从未结束过回合）→ 无法判定，留待后续调和。
     */
    reconcile(task: TaskRecord): Promise<ExecutionEvent | undefined>;
    /** 回看会话历史尾部是否存在「错误回合」事件（兜底判定失败） */
    private historyShowsFailure;
    /**
     * 连接执行会话：任务钉了工作区则校验其可用并连接之；
     * 未钉时按「当前会话所在工作区 → recentWorkspaceId（旧版）→ 第一个」择优。
     */
    private connectSession;
    /** 通过会话绑定获取驱动句柄 */
    private driverOf;
    /** 发送 prompt：任务 prompt 为空时回退用标题；排队模式等待回合开始 */
    private sendPrompt;
    /**
     * 监听回合结束并结算：
     * 订阅会话变化，每当已结束轮次数超过基线且会话不再运行时，
     * 依据 lastAgentError 判定成功/失败，并发出唯一的 settled 事件。
     */
    private watchForSettlement;
}
