/** 三种打开方式：文件管理器（Finder） / 终端 / VSCode。 */
export type OpenKind = 'finder' | 'terminal' | 'vscode';
/**
 * 「附加打开方式」kind 集合：设置页可开关、追加在工作区菜单尾部的常用 IDE。
 * 与 OpenKind 隔离，避免干扰 finder/terminal/vscode 的偏好链。
 */
export type ExtraOpenKind = 'android-studio' | 'xcode' | 'wechat-devtools' | 'intellij-idea' | 'deveco-studio' | 'webstorm' | 'pycharm' | 'goland';
/** 完整的附加 IDE kind 集合（路由与开关配置校验用）。 */
export declare const EXTRA_OPEN_KINDS: readonly ExtraOpenKind[];
/** 判断一个未知值是否为合法的附加 IDE kind。 */
export declare function isExtraOpenKind(value: unknown): value is ExtraOpenKind;
/** 附加 IDE 的可读应用名（菜单按钮文案与设置页开关标签共用）。 */
export declare function extraOpenLabel(kind: ExtraOpenKind): string;
/**
 * 附加 IDE 的打开命令候选链（按平台返回多条候选，openExtraPathIn 依次尝试）。
 *
 * 命令遵循各 IDE 真实的 CLI 用法：
 *   - 微信开发者工具：内置 cli 可执行，用法 `cli open --project <path>`
 *     （需在「设置 → 安全 → 服务端口」开启端口后方可被 CLI 唤起）。
 *   - DevEco Studio：基于 JetBrains 的启动器，直接以项目路径为参数打开
 *     （macOS `<app>/Contents/MacOS/devecostudio <path>`，
 *     Windows `<安装目录>/bin/devecostudio64.exe <path>`）。
 * 每个候选的命令若是绝对路径则指向真实安装位置；openExtraPathIn 会在
 * 执行前用 existsSync 过滤掉磁盘上不存在的绝对路径候选，避免浪费一次 spawn。
 * 平台不提供该 IDE 时返回空数组（如 Xcode/微信开发者工具在非对应平台）。
 */
export declare function extraOpenCommand(platform: string, kind: ExtraOpenKind, path: string): OpenCommand[];
/**
 * 过滤候选链：跳过命令为「磁盘绝对路径」但文件不存在的候选（避免无谓 spawn）。
 * PATH 命令（open/code/idea 等）不在此列，保留按原样尝试。
 */
export declare function filterExistingCandidates(candidates: readonly OpenCommand[]): OpenCommand[];
/** 判断一个未知值是否为合法的 OpenKind。 */
export declare function isOpenKind(value: unknown): value is OpenKind;
/** 一条待执行的命令：可执行文件 + 参数数组（不经 shell，规避注入）。 */
export interface OpenCommand {
    readonly command: string;
    readonly args: readonly string[];
}
/** 打开操作的结果。 */
export interface OpenResult {
    readonly ok: boolean;
    readonly error?: string;
}
/** 终端偏好集合：设置页下拉的取值。 */
export type TerminalPreference = 'terminal-default' | 'terminal-iterm' | 'terminal-wterm' | 'terminal-gnome' | 'terminal-konsole' | 'terminal-xfce';
/** 编辑器偏好集合：设置页下拉的取值。 */
export type EditorPreference = 'editor-default' | 'editor-insiders' | 'editor-cursor' | 'editor-codebuddy' | 'editor-codebuddycn' | 'editor-catpaw' | 'editor-catpawai' | 'editor-trae' | 'editor-traecn' | 'editor-qoder' | 'editor-qodercn';
/** 用户对「打开方式」的偏好（来自设置页，缺省字段视为默认）。 */
export interface OpenPreference {
    readonly terminal?: string;
    readonly editor?: string;
}
/** 判断未知字符串是否为合法的终端偏好 ID（白名单校验）。 */
export declare function isTerminalPreference(value: unknown): value is TerminalPreference;
/** 判断未知字符串是否为合法的编辑器偏好 ID（白名单校验）。 */
export declare function isEditorPreference(value: unknown): value is EditorPreference;
/**
 * 为指定平台与打开方式生成命令候选列表（纯函数，测试友好）。
 * 传入偏好时：偏好命中 → 只返回该候选；偏好缺失/非法/平台不支持 → 返回默认链。
 * 不支持的平台返回空数组。
 */
export declare function openCommandCandidates(platform: string, kind: OpenKind, path: string, preference?: OpenPreference): OpenCommand[];
/** spawn 的窄接口，测试可注入替身。 */
export type SpawnFn = (command: string, args: readonly string[], options: {
    detached: boolean;
    stdio: 'ignore';
}) => {
    on(event: 'error', listener: (error: NodeJS.ErrnoException) => void): unknown;
    on(event: 'spawn', listener: () => void): unknown;
    unref(): void;
};
/** 真正的 spawn 工厂（生产实现）。 */
export declare const defaultSpawn: SpawnFn;
/**
 * 依次尝试命令候选：第一个能成功启动（触发 spawn 事件）即视为打开成功；
 * ENOENT 等启动错误（如命令未安装）则尝试下一个；全部失败返回最后的错误。
 * 偏好候选失败时错误信息会携带偏好 ID，便于设置页诊断。
 */
export declare function openPathIn(kind: OpenKind, path: string, options?: {
    platform?: string;
    spawnFn?: SpawnFn;
    preference?: OpenPreference;
}): Promise<OpenResult>;
/**
 * 用附加 IDE 打开目录：取该 kind 的候选命令链，依次尝试直到一个成功启动。
 * 绝对路径候选会先用 existsSync 过滤（未安装则跳过），全部失败返回可读错误。
 * 平台不提供该 IDE（候选为空）时直接返回错误。
 */
export declare function openExtraPathIn(kind: ExtraOpenKind, path: string, options?: {
    platform?: string;
    spawnFn?: SpawnFn;
}): Promise<OpenResult>;
