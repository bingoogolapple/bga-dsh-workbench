 
 // ============================================================================
 // 文件：task-board-apply.ts —— 任务看板与运行时页面的“装配层”
 //
 // 职责：
 //   把位于 src/core 下的黑板控制器（BoardController）、执行服务（ExecutionService）、
 //   定时调度器（SchedulerService）与文件存储（FileTaskStore）真正接进 DeepSeek Harness
 //   的浏览器运行时：
 //     1. 注册「任务看板」设置卡片（web-ui.plugin.item slot）与多语言词典；
 //     2. 通过 apply-guard 确保同一页面中看板只被装载一次（热重载/多实例防重复）；
 //     3. 依据「任务看板开关」的启用状态决定是否挂载看板 UI 与启动调度；
 //     4. 把核心服务运行所需的运行时能力（会话、工作区、连接 API）逐一装配进
 //        ExecutionService / BoardController / SchedulerService。
 // ============================================================================
 import type { ClientContext, SessionId, SettingsScope, SettingsScopeSpec, WorkspaceId } from '@deepseek-ai/dsh-client-runtime/client'
 import type { ISessions, IWorkspaces } from '@deepseek-ai/dsh-client-runtime/client'
 import type { ConnectionHandle, PromptContentPart } from '@deepseek-ai/dsh-client-connection/client'
 import type {} from '@deepseek-ai/dsh-client-ui-slots'
 
 import type {} from '@deepseek-ai/dsh-client-locale/client'
 
 import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
 
 import { BoardController } from '../core/controller.ts'
 import { ExecutionService } from '../core/execution.ts'
 import { SchedulerService } from '../core/scheduler.ts'
 import { FileTaskStore } from '../core/file-store.ts'
 import { WorkbenchMetaStore } from '../core/workbench-meta-store.ts'
 
 import { claimTaskBoardApply, releaseTaskBoardApply } from './task-board/apply-guard.ts'
 import { mountBoard } from './task-board/board-mount.tsx'
import { mountBoardEmbed } from './task-board/embed-mount.tsx'
 import { mountSidebarEntry } from './task-board/sidebar-entry.ts'
 import { TaskBoardSettingsCard, TaskBoardSettingsCardController, type TaskBoardSettings } from './task-board/TaskBoardSettingsCard.tsx'
 import { en, zh, type TaskBoardKey } from './task-board/locales.ts'
 
 // 多语言词典的注册命名空间（与 ./task-board/locales.ts 的 key 结构对应）
 const NS = 'bga-dsh-workbench-task-board'
 
 // 任务看板配置在“设置作用域”中的命名空间（「开关：启用任务看板」存在这里）
 const TASK_BOARD_NS = 'bga-dsh-workbench-task-board'
 
 // 模块扩充声明：把任务看板的多语言命名空间与「插件设置项」槽位接入运行时类型系统
 declare module '@deepseek-ai/dsh-client-ui-slots' {
   interface LocaleNamespaceMap {
     'bga-dsh-workbench-task-board': TaskBoardKey
   }
   interface SlotMap {
     'web-ui.plugin.item': { kind: 'list'; scope: 'root'; owner: SettingsPluginItemOwnerProps }
   }
 }
 
 // 任务看板设置卡片在「插件设置项」列表里声明的 owner 属性类型（当前无附加属性）
 interface SettingsPluginItemOwnerProps {
   children?: never
 }
 
 // 扩充 cordis 上下文类型：新版运行时可选暴露 webUiSettings 绑定能力；
 // 缺失（旧运行时）时回退到 ctx.settingsScope（见下方 applyTaskBoard 的 binder 选择）
 declare module '@deepseek-ai/cordis' {
   interface Context {
     
     webUiSettings?: { bind<S>(spec: SettingsScopeSpec<S>): SettingsScope<S> }
   }
 }
 
 // 任务看板的总装配入口：注册设置卡片与词典、按开关状态挂载看板 UI 与调度器。
 // @param ctx 客户端运行时上下文
 //
 // 装配顺序（依赖链）：FileTaskStore（持久化）→ ExecutionService（执行能力）
 //   → BoardController（黑板状态）→ SchedulerService（按 cron 定时触发执行）
 //   → UI 挂载（侧边栏/独立看板视图/嵌入欢迎视图）。工作区列表与 agent 预设名册
 //   作为“执行参数选项”持续同步进控制器。
 export function applyTaskBoard(ctx: ClientContext): void {

   // 抢占“已装载”标志：热重载/多实例并存时，只有第一个调用方真正装载看板，其余直接返回
   if (!claimTaskBoardApply()) return
   // 注册释放“已装载”标志的清理副作用（随插件卸载自动释放）
   ctx.effect(() => releaseTaskBoardApply, 'task-board: apply claim')
 
   // 注册中英文多语言词典，供任务看板各 UI 组件翻译文案使用
   ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'task-board: dictionaries')
 
   // 优先使用新版 webUiSettings 的 bind 能力；旧版运行时缺失时退回 settingsScope（向下兼容）
   const binder = ctx.get('webUiSettings') ?? ctx.settingsScope
   const settingsScope = binder.bind<TaskBoardSettings>({ namespace: TASK_BOARD_NS })
   // 构造设置卡片控制器并注册到「插件设置项」列表（用于打开/关闭任务看板）
   const settingsCard = new TaskBoardSettingsCardController(settingsScope)
   ctx.slots.inject('web-ui.plugin.item', () => ctx.slots.register({
     name: 'web-ui.plugin.item',
     id: 'bga-dsh-workbench-task-board',
     order: 110,
     locale: NS,
     inject: () => settingsCard.inject(),
   }, TaskBoardSettingsCard))
 
   
   // —— 依赖装配：把核心服务接进运行时 ——
   // uiDisposer 保存当前 UI 的清理函数；设置开关关闭或插件卸载时通过它整体拆除。
   let uiDisposer: (() => void) | undefined
   const mountUi = (): void => {
     if (uiDisposer !== undefined) return
     const sessions = ctx.sessions as unknown as ISessions
     const workspaces = ctx.workspaces as unknown as IWorkspaces
     const connection = ctx.get('connection') as ConnectionHandle | undefined
 
     // 任务存储：为每一个任务提供持久化能力（底层是宿主提供的写文件能力）
     const store = new FileTaskStore()
     // 工作台元数据存储：日报「当日已完成」打卡（宿主 workbench-meta.json）
     const metaStore = new WorkbenchMetaStore()
     // 执行服务：把运行时的话会/工作区/连接 API 适配成黑板的执行能力
     const exec = new ExecutionService({
       // 会话能力适配：登记列表查询与「按 id 绑定会话」的方式。
       // binding 返回的会话包装只暴露黑板需要的少量方法（改名/提问/命令/快照/订阅），
       // 返回结果归一化为 { ok, ... } 二元形态，屏蔽不同运行时返回结构的差异。
       sessions: {
         list: sessions.list,
         binding: id => {
           const binding = sessions.binding(id as SessionId)
           if (binding === undefined) return undefined
           const { session } = binding
           return {
             session: {
               rename: title => session.rename(title),
               prompt: (content, mode) =>
                 session.prompt(content as PromptContentPart[], mode).then(result =>
                   result.ok ? { ok: true as const } : { ok: false as const, error: result.error }),
               command: line =>
                 session.command(line).then(result =>
                   result.ok ? { ok: true as const, matched: result.value.matched } : { ok: false as const, error: result.error }),
               getSnapshot: () => session.getSnapshot(),
               subscribe: fn => session.subscribe(fn),
             },
           }
         },
         noteAgentPreset: (sessionId, agentPreset) => sessions.noteAgentPreset(sessionId as SessionId, agentPreset),
       },
       workspaces: {
         list: workspaces.list,
         connectWorkspace: id => workspaces.connectWorkspace(id as WorkspaceId),
       },
       // agent 预设能力：仅当连接可用时提供（用于任务运行参数中的「模式/预设」选择）
       presets: connection !== undefined ? {
         select: async (sessionId, agentPreset) => {
           try {
             const response = await connection.api.agentPresets.select({ sessionId: sessionId as SessionId, agentPreset })
             return response.result.ok ? { ok: true as const } : { ok: false as const, error: response.result.error }
           } catch (error) {
             return { ok: false as const, error }
           }
         },
       } : undefined,
       // 会话历史能力：仅当连接可用时提供（用于任务执行时的上下文预热/拼接）
       history: connection !== undefined ? {
         loadTail: async sessionId => {
           const response = await connection.api.sessions.history({
             sessionId: sessionId as SessionId,
             maxMessages: 20,
           })
           return response.result.ok
             ? { events: response.result.value.events.map(entry => entry.event) }
             : undefined
         },
       } : undefined,
     })
 
     // 黑板控制器：持有任务列表状态机，串联存储与执行，并对外暴露启动/运行/调度 API
     const controller = new BoardController({
       store,
       exec,
       metaStore,
       sessions: {
         list: sessions.list,
         open: id => sessions.open(id as SessionId),
       },
     })
     // 启动黑板（加载持久化任务并进入就绪状态）
     controller.start()
 
     // 定时调度器：轮询各任务配置的 cron 表达式，到期就调用 controller.runTask 执行，
     // 并把下次触发时间写回任务（applySchedule 更新持久化）
     const scheduler = new SchedulerService({
       tasks: () => controller.getSnapshot().tasks,
       refresh: () => controller.reloadFromStore(),
       now: () => Date.now(),
       runTask: id => controller.runTask(id),
       applySchedule: (id, nextRunAt, lastTriggeredAt) =>
         controller.applyScheduleNextRun(id, nextRunAt, lastTriggeredAt),
       ready: () => sessions.list.getSnapshot().phase === 'ready',
       environment: {
         addEventListener: (type, listener) => document.addEventListener(type, listener),
         removeEventListener: (type, listener) => document.removeEventListener(type, listener),
       },
     })
     // 启动调度循环（调度器开始监听定时触发事件）
     scheduler.start()
 
     // 收集所有需要随看板一起拆除的清理函数（UI 挂载、订阅等）
     const disposers: Array<() => void> = []
 
     
     // 把当前工作区列表同步给控制器，作为任务创建/运行时可选用的「执行工作区」
     const pushWorkspaceOptions = (): void => {
       const snapshot = workspaces.list.getSnapshot()
       controller.setExecutionOptions({
         workspaces: snapshot.items.map(item => ({
           workspaceId: item.workspaceId,
           title: item.title !== '' ? item.title : item.path,
         })),
       })
     }
     pushWorkspaceOptions()
     // 工作区列表变化时回调同步
     disposers.push(workspaces.list.subscribe(pushWorkspaceOptions))
 
     if (connection !== undefined) {
       // 拉取 agent 预设名册并同步给控制器（供任务运行参数选择「模式/预设」）
       const pushPresetOptions = async (): Promise<void> => {
         try {
           const response = await connection.api.agentPresets.list({})
           if (!response.result.ok) return
           controller.setExecutionOptions({
             presets: response.result.value.presets.map(preset => ({
               id: preset.id,
               name: preset.name,
               description: preset.description,
               broken: preset.broken,
               isDefault: preset.isDefault,
             })),
           })
         } catch (error) {
           console.error('[bga-dsh-workbench] agent preset roster read failed', error)
         }
       }
       void pushPresetOptions()
       // 连接重置（如宿主重启）后重新拉取预设名册
       disposers.push(ctx.on('connection/reset', () => { void pushPresetOptions() }))
     }
     // 装载三处 UI：侧边栏入口、独立看板视图、嵌入欢迎视图（任一失败不影响其它）
     try {
       disposers.push(mountSidebarEntry(controller))
       disposers.push(mountBoard(controller))
       disposers.push(mountBoardEmbed(controller))
     } catch (error) {
       console.error('[bga-dsh-workbench] mount failed:', error)
     }
 
     // 统一拆除：依次执行全部清理函数、停止调度与黑板，最后自身置空（允许下次重新挂载）
     uiDisposer = () => {
       for (const dispose of disposers.splice(0)) dispose()
       scheduler.dispose()
       controller.dispose()
       uiDisposer = undefined
     }
   }
 
   // 依据「任务看板开关」的启用状态决定挂载（开）或拆除（关）整套 UI 与调度；
   // 开关处于默认值或设置不可用状态时按「启用」处理（兼容无显式配置的老用户）。
   const syncEnabled = (): void => {
     const snapshot = settingsScope.getSnapshot()
     const enabled = snapshot.status === 'ready'
       ? snapshot.value?.enabled ?? true
       : snapshot.status === 'unavailable'
     if (enabled) mountUi()
     else uiDisposer?.()
   }
   // 订阅开关变化，并在启动时立即同步一次
   settingsScope.subscribe(syncEnabled)
   syncEnabled()
 }