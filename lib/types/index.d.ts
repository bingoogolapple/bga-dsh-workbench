/**
* 插件宿主入口（Host 端）。
*
* 本文件是 bga-dsh-workbench 插件的总装配点，负责：
* 1. 声明插件对 DSH 工具箱（tools）服务的依赖；
* 2. 读取并校验用户配置（Config），提供默认值；
* 3. 注册「工作台设置」命名空间，并据此构建运行时（WorkbenchRuntime），
*    供 HTTP 路由（横幅头像/配置/设置/任务持久化）读写；
* 4. 向 agent 的 system prompt 注入任务看板的使用指引。
*/
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
/** 插件对外注册名：bga-dsh-workbench */
export declare const name = "bga-dsh-workbench";
/** 插件声明依赖 DSH 提供的 tools（工具箱）服务 */
export declare const inject: string[];
/**
 * 横幅（banner）配置。
 * 控制 hero 空态顶部横幅的显示内容与行为。
 */
export interface BannerConfig {
    /** 头像图片文件路径（空串表示使用内置默认头像） */
    avatarPath?: string;
    /** 横幅问候语文本 */
    text?: string;
    /** 是否显示横幅 */
    show?: boolean;
    /** 是否启用完成回合时的庆祝音效 */
    sound?: boolean;
    /** 头像/任务等数据的宿主存储目录 */
    storageDir?: string;
}
/** 插件完整配置：横幅配置 */
export interface Config extends BannerConfig {
}
/** 插件配置的 schema 声明（含默认值），供 DSH 校验用户配置 */
export declare const Config: z<Config>;
/** 横幅问候语的默认文本 */
export declare const DEFAULT_TEXT = "\u7684 Harness \u5DE5\u4F5C\u53F0";
/**
 * 插件主入口：在 Cordis 上下文中装配所有能力。
 * 1. 注册工作台设置命名空间并构建运行时，将横幅/头像/任务持久化路由挂到 webServer；
 * 2. 向 agent 的 system prompt 注入任务看板指引。
 */
export declare function apply(ctx: Context, config: Config): void;
