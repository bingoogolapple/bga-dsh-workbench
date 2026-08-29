/**
  * 工作区条目菜单的「在 Finder/终端/VSCode 中打开」注入器（客户端）。
  *
  * 产品侧的工作区「⋯」下拉菜单（ui-workspace 的 ProjectRowItem）没有公开的
  * 菜单扩展点，菜单项是写死的。本模块用 DOM 注入在不改动核心包的前提下，
  * 在「重命名条目」上方插入三个打开按钮：
  *   1. click 捕获阶段识别工作区行的「⋯」按钮，解析该工作区目录路径；
  *   2. MutationObserver 观察到工作区菜单（含「删除工作区」项）出现时，
  *      在「重命名」项之前注入按钮组；
  *   3. 按钮点击后 POST /bga-dsh-workbench/open 交给宿主端跨平台执行。
  * 菜单节点由产品组件持有并在关闭时卸载，注入的按钮随之消失，无需手动清理。
  */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
/**
 * 打开 kind → 可读应用名（错误提示前缀用）。附加 IDE 走 extraOpenLabel；
 * finder/terminal/vscode 直接映射。
 */
export declare function openDisplayName(kind: string): string;
/** 从「⋯」按钮的 aria-label 中提取工作区显示名；非工作区按钮返回 undefined。 */
export declare function workspaceLabelFromAria(aria: string): string | undefined;
/**
 * 用工作区显示名在工作区列表中解析目录路径：
 * 先精确匹配 title（含用户重命名后的标题），再兜底匹配路径 basename。
 * 重名时取第一个匹配（产品允许重复标题）。
 */
export interface ResolvableWorkspace {
    readonly workspaceId: string;
    readonly title?: string;
    readonly path?: string;
}
export declare function resolveWorkspacePath(items: readonly ResolvableWorkspace[], label: string): string | undefined;
/**
 * 兜底解析：从「⋯」按钮所在的工作区行（role=treeitem）提取显示名。
 * 行内标题文本节点是 .projectText span（CSS Modules 类名形如 hash_projectText，
 * 属性选择器按子串匹配），其文本即该工作区的显示名。
 */
export declare function workspaceLabelFromRow(row: Element | null): string | undefined;
/**
 * 向一个工作区菜单注入打开按钮组（在「重命名」项之前）。
 * 幂等：已注入过的菜单直接跳过；找不到重命名项或非工作区菜单时不注入。
 */
export declare function injectOpenButtons(menu: Element, path: string, onRequest: (kind: string, path: string) => void, prefs?: {
    terminal?: string;
    editor?: string;
}, openExtra?: {
    androidStudio?: boolean;
    xcode?: boolean;
    wechatDevtools?: boolean;
    intellijIdea?: boolean;
    devecoStudio?: boolean;
    webstorm?: boolean;
    pycharm?: boolean;
    goland?: boolean;
}): boolean;
export declare function mountWorkspaceOpenMenu(ctx: ClientContext): () => void;
