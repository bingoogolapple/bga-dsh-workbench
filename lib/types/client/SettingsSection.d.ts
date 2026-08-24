import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
export interface WorkbenchSectionState {
    /** 当前头像路径（空字符串表示尚未设置） */
    readonly avatarPath: string;
    /** 横幅问候语文案 */
    readonly text: string;
    /** 是否显示横幅 */
    readonly show: boolean;
}
export interface ConfettiSectionState {
    /** 整轮完成时是否播放庆祝音效 */
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
export interface WorkbenchSectionInjected {
    /** 读取横幅 + 彩带配置（内部做默认值回退） */
    load: () => Promise<WorkbenchSectionState & ConfettiSectionState & OpenPrefsSectionState>;
    /** 保存横幅配置：text / show / avatarPath 均可选，按需局部更新 */
    save: (patch: {
        text?: string;
        show?: boolean;
        avatarPath?: string;
    }) => Promise<void>;
    /** 保存彩带配置（总开关 + 音效开关 + 主题/强度/触发时机） */
    saveConfetti: (patch: {
        show?: boolean;
        sound?: boolean;
        theme?: ConfettiTheme;
        intensity?: ConfettiIntensity;
        trigger?: ConfettiTrigger;
    }) => Promise<void>;
    /** 上传头像图片，返回服务端保存后的头像路径 */
    uploadAvatar: (file: File) => Promise<{
        avatarPath: string;
    }>;
    /** 恢复默认头像 */
    resetAvatar: () => Promise<void>;
    /** 保存「打开方式」偏好（局部更新） */
    saveOpenPrefs: (patch: OpenPrefsPatch) => Promise<void>;
    /** 保存「附加 IDE」展示开关（局部更新） */
    saveExtraOpen: (patch: ExtraOpenSettingsPatch) => Promise<void>;
}
export type WorkbenchSectionProps = PropsRuntime<'settings.section'> & InjectFace<WorkbenchSectionInjected>;
export declare function SettingsSection({ load, save, saveConfetti, uploadAvatar, resetAvatar, saveOpenPrefs, saveExtraOpen }: WorkbenchSectionProps): import("react").JSX.Element;
export interface OpenPrefsSectionState {
    /** 终端偏好 ID（空串 = 平台默认终端） */
    readonly terminal: string;
    /** 编辑器偏好 ID（空串 = VS Code） */
    readonly editor: string;
    /** 附加 IDE 展示开关（true = 展示在菜单尾部），字段对应后端 settings.openExtra */
    readonly openExtra: Record<string, boolean>;
}
export interface OpenPrefsPatch {
    readonly terminal?: string;
    readonly editor?: string;
}
export interface ExtraOpenSettingsPatch {
    readonly androidStudio?: boolean;
    readonly xcode?: boolean;
    readonly wechatDevtools?: boolean;
    readonly intellijIdea?: boolean;
    readonly devecoStudio?: boolean;
    readonly webstorm?: boolean;
    readonly pycharm?: boolean;
    readonly goland?: boolean;
}
