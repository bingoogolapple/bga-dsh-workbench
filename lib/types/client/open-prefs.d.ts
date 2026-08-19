export interface TerminalPreferenceOption {
    readonly id: string;
    readonly label: string;
    readonly platforms?: readonly string[];
}
export interface EditorPreferenceOption {
    readonly id: string;
    readonly label: string;
}
/** 终端偏好选项表（设置页下拉与菜单文案共用）。 */
export declare const TERMINAL_OPTIONS: readonly TerminalPreferenceOption[];
/** 编辑器偏好选项表（设置页下拉与菜单文案共用）。 */
export declare const EDITOR_OPTIONS: readonly EditorPreferenceOption[];
/** 空串/未配置的终端偏好归一化为显式默认 ID（保证下拉 value 与保存值一致）。 */
export declare function normalizeTerminalId(id: string | undefined): string;
/** 空串/未配置的编辑器偏好归一化为显式默认 ID（保证下拉 value 与保存值一致）。 */
export declare function normalizeEditorId(id: string | undefined): string;
/** 当前平台判定（浏览器 userAgent，仅用于过滤可用选项展示）。 */
export declare function currentPlatform(): string;
/** 按平台过滤终端选项：默认项恒在；平台不匹配的项剔除。 */
export declare function terminalOptionsFor(platform: string): readonly TerminalPreferenceOption[];
/** 偏好 ID → 菜单文案中的终端应用名；空串/未知 ID 回退「默认终端」。 */
export declare function terminalLabel(id: string): string;
/** 偏好 ID → 菜单文案中的编辑器应用名；空串/未知 ID 回退「VSCode」。 */
export declare function editorLabel(id: string): string;
/** 菜单中三个打开按钮的行文案（finder 固定；terminal/vscode 均显示应用名）。 */
export declare function openMenuLabels(prefs: {
    terminal?: string;
    editor?: string;
}): readonly {
    kind: 'finder' | 'terminal' | 'vscode';
    label: string;
}[];
/**
 * 「附加 IDE」打开的 kind 集合（与宿主 open-app.ts 的 EXTRA_OPEN_KINDS 保持一致）。
 * 每个 kind 对应设置页的一个展示开关与菜单尾部的一个打开按钮。
 */
export declare const EXTRA_OPEN_KINDS: readonly string[];
/** 附加 IDE 的可读应用名（菜单按钮文案与设置页开关标签共用）。 */
export declare function extraOpenLabel(kind: string): string;
/**
 * 附加 IDE 的展示开关 key（设置项字段名 ↔ kind 的映射）。
 * 开关存于设置 openExtra 对象（routing 校验白名单）。
 */
export declare function extraSettingKey(kind: string): string;
/**
 * 生成菜单尾部「附加 IDE 打开」分组的文案。
 * 仅返回已开启（开关 true）且当前平台可用的 IDE；find 对应的按钮由 workspace-open 注入。
 */
export declare function extraOpenMenuItems(openExtra: Record<string, boolean | undefined>): readonly {
    kind: string;
    label: string;
}[];
