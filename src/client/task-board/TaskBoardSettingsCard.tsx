 
 
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
 import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
 import type { SettingsScope } from '@deepseek-ai/dsh-client-ui-settings/client'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
 import { PluginSettingsCard, BooleanField } from './PluginSettingsCard.tsx'
 import { CardForm, booleanField, type CardActions, type CardShell, type FieldState as CardFieldState } from './settings-form.ts'
 
 /**
 * 本插件（任务看板）的设置项。
 */
 export interface TaskBoardSettings {
   
   // 是否启用任务看板（关闭后隐藏侧边栏入口与看板视图）。
   enabled?: boolean
   
   // 是否在每条 agent 系统提示中播报任务看板的说明。
   announceToAgent?: boolean
 }
 
 /**
 * 本设置卡片对外投影的可订阅状态：卡片外壳状态 + 每个字段的字段状态。
 */
 export interface TaskBoardSettingsCardState extends CardShell {
   
   // 「启用看板」开关的字段状态。
   enabled: CardFieldState
   
   // 「向 agent 播报」开关的字段状态。
   announceToAgent: CardFieldState
 }
 
 /**
 * 本设置卡片的注入面（InjectionFace）：向宿主槽位暴露动作与 hooks。
 */
 export interface TaskBoardSettingsCardFace extends CardActions {
   hooks: {
     
     // 宿主可订阅的状态快照（key 即槽位名，由 inject() 注册）。
     taskBoardSettingsCard: SnapshotStore<TaskBoardSettingsCardState>
   }
 }
 
 /**
 * 本设置卡片的控制器：把 CardForm 与 SnapshotStore 组装起来。
 *
 * 职责：构造 CardForm（注册两个布尔字段）、绑定投影 store、向槽位注入。
 */
 export class TaskBoardSettingsCardController {
   private readonly form: CardForm<TaskBoardSettings>
   private readonly store: SnapshotStore<TaskBoardSettingsCardState>
 
   
   /**
    * @param scope 本插件配置命名空间的设置作用域（读写入口 + 订阅源）。
    */
   constructor(scope: SettingsScope<TaskBoardSettings>) {
     this.form = new CardForm(scope, [
       booleanField('enabled'),
       booleanField('announceToAgent'),
     ])
     this.store = this.form.bind(() => this.projection())
   }
 
   /**
    * 投影函数：把表单外壳状态 + 逐字段状态合成可订阅快照。
    */
   private projection(): TaskBoardSettingsCardState {
     return {
       ...this.form.shell(),
       enabled: this.form.field('enabled'),
       announceToAgent: this.form.field('announceToAgent'),
     }
   }
 
   
   /**
    * 向槽位注入（inject）：返回动作集合 + 状态 hooks，供宿主消费。
    */
   inject(): TaskBoardSettingsCardFace {
     return { hooks: { taskBoardSettingsCard: this.store }, ...this.form.actions() }
   }
 }
 
 /**
 * 设置卡片组件的完整 props：槽位运行时 props + 本命名空间的 locale + 注入面。
 */
 export type TaskBoardSettingsCardProps =
   PropsRuntime<'web-ui.plugin.item'>
   & PropsLocale<'bga-dsh-workbench-task-board'>
   & InjectFace<TaskBoardSettingsCardFace>
 
 /**
 * 「BGA 任务看板」设置卡片界面。
 *
 * 订阅 hooks.taskBoardSettingsCard 拿到快照，渲染两个 BooleanField 开关，
 * 并把界面的编辑 / 重置动作映射回 CardActions 调用。
 */
 export function TaskBoardSettingsCard(props: TaskBoardSettingsCardProps) {
   const { t } = props
   // 订阅注入的 store（快照即最新表单状态）。
   const state = props.useTaskBoardSettingsCard(snapshot => snapshot)
   // 部署只读（writable=false）时禁用全部控件。
   const disabled = !state.writable
   const fieldProps = {
     overriddenLabel: t('settings.overridden'),
     resetLabel: t('settings.reset'),
     invalidLabel: t('settings.invalidNumber'),
     disabled,
   }
   return (
     <PluginSettingsCard
       t={t}
       titleKey="settings.title"
       descriptionKey="settings.description"
       state={state}
       onSave={props.save}
       onDiscard={props.discard}
     >
       {/* 启用任务看板开关 */}
       <BooleanField
         id="settings-task-board-enabled"
         label={t('settings.enabled')}
         hint={t('settings.enabledHint')}
         inheritLabel={t('settings.inherit')}
         onLabel={t('settings.on')}
         offLabel={t('settings.off')}
         {...fieldProps}
         {...state.enabled}
         onEdit={(text) => { props.edit('enabled', text) }}
         onReset={() => { props.resetField('enabled') }}
       />
       {/* 向 agent 播报看板开关 */}
       <BooleanField
         id="settings-task-board-announce"
         label={t('settings.announceToAgent')}
         hint={t('settings.announceToAgentHint')}
         inheritLabel={t('settings.inherit')}
         onLabel={t('settings.on')}
         offLabel={t('settings.off')}
         {...fieldProps}
         {...state.announceToAgent}
         onEdit={(text) => { props.edit('announceToAgent', text) }}
         onReset={() => { props.resetField('announceToAgent') }}
       />
     </PluginSettingsCard>
   )
 }