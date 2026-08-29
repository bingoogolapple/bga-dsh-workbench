/** 统一后的 RPC 结果信封（吸收新旧两版的 {ok,value} 与 {result:{ok,value}}）。 */
export interface HostRpcResult {
    ok: boolean;
    value?: unknown;
    error?: unknown;
}
/**
 * 调一次宿主 RPC（双协议）。
 *
 * @param connection ctx.connection（新旧形状皆可）。
 * @param endpoint  斜杠分隔端点，如 'agentPresets/select'（旧版会转成 api.agentPresets.select）。
 * @param args      业务参数；新版自动包成 `{ args }`，旧版原样透传。
 * @param signal    可选取消信号。
 * @returns 统一信封 `{ ok, value, error }`。
 * @throws 当前连接句柄两种协议都不可用时抛错。
 */
export declare function callHostRpc(connection: unknown, endpoint: string, args?: Record<string, unknown>, signal?: AbortSignal): Promise<HostRpcResult>;
/**
 * 连接（打开）一个工作区并拿到其会话 id（双版本）。
 *
 * 新版该能力归属 `ctx.uiWorkspace`，旧版在 `ctx.workspaces` 上。
 *
 * @param ctx         客户端上下文。
 * @param workspaceId 目标工作区 id。
 * @returns 连接后得到的会话 id。
 * @throws 两条路径都不可用时抛错（不做静默降级，避免功能悄悄失效）。
 */
export declare function connectWorkspace(ctx: unknown, workspaceId: string): Promise<string>;
