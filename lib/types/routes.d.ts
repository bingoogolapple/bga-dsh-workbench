import type { IncomingMessage } from 'node:http';
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver';
/** 解析后的横幅配置（已回退到默认值，均为最终生效值） */
export interface ResolvedBannerConfig {
    /** 头像图片绝对路径（空串表示默认头像） */
    readonly avatarPath: string;
    /** 横幅问候语文本 */
    readonly text: string;
    /** 是否显示横幅 */
    readonly show: boolean;
}
/** 彩带（完成回合庆祝特效）配置 */
export interface ConfettiConfig {
    /** 是否播放庆祝音效 */
    readonly sound: boolean;
    /** 彩带配色主题 */
    readonly theme: ConfettiTheme;
    /** 彩带强度 */
    readonly intensity: ConfettiIntensity;
    /** 触发时机 */
    readonly trigger: ConfettiTrigger;
}
/** 彩带配色主题 */
export type ConfettiTheme = 'default' | 'gold' | 'ocean' | 'sakura' | 'neon';
/** 彩带强度 */
export type ConfettiIntensity = 'small' | 'medium' | 'large' | 'epic';
/** 彩带触发时机 */
export type ConfettiTrigger = 'success' | 'every' | 'task';
/** 「打开方式」配置（设置页下拉当前选中的偏好 ID，供界面回显） */
export interface OpenConfig {
    /** 终端偏好 ID；空串 = 平台默认终端 */
    readonly terminal: string;
    /** 编辑器偏好 ID；空串 = VS Code */
    readonly editor: string;
}
/** 工作台当前生效的完整配置 */
export interface WorkbenchConfig {
    readonly banner: ResolvedBannerConfig;
    readonly confetti: ConfettiConfig;
    readonly open: OpenConfig;
    /** 附加 IDE 打开方式的展示开关（true = 展示在工作区菜单尾部） */
    readonly openExtra: ExtraOpenConfig;
}
/** 「附加 IDE」打开方式的展示开关（true = 展示在工作区菜单尾部）。 */
export interface ExtraOpenConfig {
    /** 是否展示「在 Android Studio 中打开」 */
    readonly androidStudio: boolean;
    /** 是否展示「在 Xcode 中打开」 */
    readonly xcode: boolean;
    /** 是否展示「在微信开发者工具中打开」 */
    readonly wechatDevtools: boolean;
    /** 是否展示「在 IntelliJ IDEA 中打开」 */
    readonly intellijIdea: boolean;
    /** 是否展示「在 DevEco Studio 中打开」 */
    readonly devecoStudio: boolean;
    /** 是否展示「在 WebStorm 中打开」 */
    readonly webstorm: boolean;
    /** 是否展示「在 PyCharm 中打开」 */
    readonly pycharm: boolean;
    /** 是否展示「在 GoLand 中打开」 */
    readonly goland: boolean;
}
/** 横幅设置的部分更新（所有字段可选） */
export interface BannerSettingsPatch {
    readonly avatarPath?: string;
    readonly text?: string;
    readonly show?: boolean;
}
/** 彩带设置的部分更新 */
export interface ConfettiSettingsPatch {
    readonly show?: boolean;
    readonly sound?: boolean;
}
/** 英语学习设置的部分更新 */
export interface EnglishSettingsPatch {
    readonly enabled?: boolean;
}
/** 打开方式设置的部分更新 */
export interface OpenSettingsPatch {
    readonly terminal?: string;
    readonly editor?: string;
}
/** 「附加 IDE」打开方式开关的部分更新。 */
export interface ExtraOpenSettingsPatch {
    /** 是否展示「在 Android Studio 中打开」 */
    readonly androidStudio?: boolean;
    /** 是否展示「在 Xcode 中打开」 */
    readonly xcode?: boolean;
    /** 是否展示「在微信开发者工具中打开」 */
    readonly wechatDevtools?: boolean;
    /** 是否展示「在 IntelliJ IDEA 中打开」 */
    readonly intellijIdea?: boolean;
    /** 是否展示「在 DevEco Studio 中打开」 */
    readonly devecoStudio?: boolean;
    /** 是否展示「在 WebStorm 中打开」 */
    readonly webstorm?: boolean;
    /** 是否展示「在 PyCharm 中打开」 */
    readonly pycharm?: boolean;
    /** 是否展示「在 GoLand 中打开」 */
    readonly goland?: boolean;
}
/** 工作台设置的部分更新 */
export interface WorkbenchSettingsPatch {
    readonly banner?: BannerSettingsPatch;
    readonly confetti?: ConfettiSettingsPatch;
    readonly english?: EnglishSettingsPatch;
    readonly open?: OpenSettingsPatch;
    readonly openExtra?: ExtraOpenSettingsPatch;
}
/**
 * 工作台运行时接口：封装配置读取/更新、头像保存与存储目录。
 * 由 index.ts 的 apply 在装配时注入具体实现。
 */
export interface WorkbenchRuntime {
    /** 读取当前生效的配置 */
    resolve(): WorkbenchConfig;
    /** 应用设置更新 */
    updateSettings(patch: WorkbenchSettingsPatch): Promise<void>;
    /** 保存头像字节流，返回落盘后的文件路径 */
    saveAvatar(buffer: Buffer): Promise<string>;
    /** 任务看板等数据的持久化目录 */
    storageDir: string;
}
/** 根据文件路径后缀返回对应的 MIME 类型，未知扩展名默认按 PNG 处理 */
export declare function avatarContentType(path: string): string;
/** 头像上传的最大字节数：10MB */
export declare const MAX_AVATAR_BYTES: number;
/**
 * 从 HTTP 请求流中读取整个请求体，并做大小上限保护。
 * 超过 maxBytes 时抛出错误并销毁请求连接。
 */
export declare function readBody(req: IncomingMessage, maxBytes: number): Promise<Buffer>;
/**
 * 通过文件头魔数嗅探图片类型，返回扩展名（'.png' / '.jpg' / '.gif' / '.webp'）。
 * 无法识别的字节流返回 undefined。
 */
export declare function sniffImageType(buffer: Buffer): string | undefined;
/**
 * 创建工作台的全部网页路由。
 * 返回 WebRoute 数组，由调用方（index.ts）逐个注册到 webServer。
 */
export declare function createWorkbenchRoutes(runtime: WorkbenchRuntime): WebRoute[];
