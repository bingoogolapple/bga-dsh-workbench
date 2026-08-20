/**
 * 工作台设置注册（宿主端）。
 *
 * 向 DSH 的 settings 服务注册本插件的设置命名空间（bga-dsh-workbench），
 * 定义横幅 / 彩带 / 打开方式配置的 schema，并支持「实时生效」的 live 模式。
 */
 import type { Context } from '@deepseek-ai/cordis'
 import z from '@deepseek-ai/schemastery'
 import { settingsNamespace, type SettingsScope } from '@deepseek-ai/dsh-settings'

 /** 本插件的设置命名空间 ID */
 export const WORKBENCH_NAMESPACE = settingsNamespace('bga-dsh-workbench')

 /** 横幅的持久化设置 */
 export interface BannerSettings {
   /** 头像图片路径（空串为默认头像） */
   avatarPath?: string
   /** 横幅问候语文本 */
   text?: string
   /** 是否显示横幅 */
   show?: boolean
 }

 /** 彩带的持久化设置 */
 export interface ConfettiSettings {
   /** 彩带总开关：关闭后不播放特效与音效 */
   show?: boolean
   /** 是否播放庆祝音效 */
   sound?: boolean
 }

 /** 英语学习的持久化设置 */
 export interface EnglishSettings {
   /** 英语学习总开关：关闭后不弹出答题卡 */
   enabled?: boolean
 }

 /** 「打开方式」的持久化偏好（终端 / 编辑器，取值见 open-app.ts 偏好 ID 白名单）。 */
 export interface OpenPrefsSettings {
   /** 终端偏好 ID（如 terminal-iterm）；缺省/空 = 平台默认终端 */
   terminal?: string
   /** 编辑器偏好 ID（如 editor-cursor）；缺省/空 = VS Code */
   editor?: string
 }


/** 附加 IDE 打开方式的展示开关（true = 在工作区菜单尾部展示）。 */
export interface ExtraOpenSettings {
  /** 是否展示「在 Android Studio 中打开」 */
  androidStudio?: boolean
  /** 是否展示「在 Xcode 中打开」 */
  xcode?: boolean
  /** 是否展示「在微信开发者工具中打开」 */
  wechatDevtools?: boolean
  /** 是否展示「在 IntelliJ IDEA 中打开」 */
  intellijIdea?: boolean
  /** 是否展示「在 DevEco Studio 中打开」 */
  devecoStudio?: boolean
  /** 是否展示「在 WebStorm 中打开」 */
  webstorm?: boolean
  /** 是否展示「在 PyCharm 中打开」 */
  pycharm?: boolean
  /** 是否展示「在 GoLand 中打开」 */
  goland?: boolean
}

 /** 工作台整体持久化设置 */
 export interface WorkbenchSettings {
   banner?: BannerSettings
   confetti?: ConfettiSettings
   english?: EnglishSettings
  open?: OpenPrefsSettings
  openExtra?: ExtraOpenSettings
 }

 /** 工作台设置的 schema 声明 */
const WorkbenchSettingsSchema: z<WorkbenchSettings> = z.object({
  banner: z.object({
    avatarPath: z.string(),
    text: z.string(),
    show: z.boolean(),
  }),
  confetti: z.object({
    show: z.boolean(),
    sound: z.boolean(),
  }),
  english: z.object({
    enabled: z.boolean(),
  }),
  open: z.object({
    terminal: z.string(),
    editor: z.string(),
  }),
  openExtra: z.object({
    androidStudio: z.boolean(),
    xcode: z.boolean(),
    wechatDevtools: z.boolean(),
    intellijIdea: z.boolean(),
    devecoStudio: z.boolean(),
    webstorm: z.boolean(),
    pycharm: z.boolean(),
    goland: z.boolean(),
  }),
})

 /**
  * 注册工作台设置命名空间。
  * @param ctx   Cordis 上下文（需已注入 settings 服务）
  * @param base  基础设置（配置默认值，作为回退）
  * @returns     设置作用域句柄（get/update 等）
  */
 export function registerWorkbenchSettings(ctx: Context, base: WorkbenchSettings): SettingsScope<WorkbenchSettings> {
   return ctx.settings.register(WORKBENCH_NAMESPACE, WorkbenchSettingsSchema, {
     base,
     applies: 'live', // 实时生效：改完立即反映到运行时
   })
 }