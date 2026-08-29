// ============================================================================
// 文件：host-bridge.ts —— 宿主能力（RPC / 工作区连接）的双版本桥接
//
// 这些能力来自 cordis 服务（ctx.connection / ctx.workspaces / ctx.uiWorkspace），
// 不涉及平台模块表 require，因此不存在“加载期炸整个插件”的风险；差异只在于
// **形状**：
//   - RPC：新版 `connection.rpc.call('/api', 'a/b', { args })`
//          旧版 `connection.api.a.b({ ... })`，返回外层还多包一层 `{ result }`
//   - 连接工作区：新版 `ctx.uiWorkspace.connectWorkspace(id)`
//                 旧版 `ctx.workspaces.connectWorkspace(id)`
//
// 本文件用「能力探测」抹平差异：优先走新版，缺失则回退旧版，并把返回信封统一，
// 调用方无需关心当前宿主版本。
// ============================================================================

/** 统一后的 RPC 结果信封（吸收新旧两版的 {ok,value} 与 {result:{ok,value}}）。 */
export interface HostRpcResult {
  ok: boolean
  value?: unknown
  error?: unknown
}

/** 连接句柄里本插件用到的最小能力面（新旧形状不同，故全部可选）。 */
interface ConnectionShape {
  rpc?: {
    call(
      channel: string,
      endpoint: string,
      payload: unknown,
      signal?: AbortSignal,
    ): Promise<HostRpcResult>
  }
  api?: Readonly<
    Record<
      string,
      Readonly<Record<string, (args: unknown, signal?: AbortSignal) => Promise<{ result: HostRpcResult }>>>
    >
  >
}

/** RPC 通道名（新旧版本一致）。 */
const RPC_CHANNEL = '/api'

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
export async function callHostRpc(
  connection: unknown,
  endpoint: string,
  args: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<HostRpcResult> {
  const shape = connection as ConnectionShape
  // 新版：远程网关（Remote gateway）统一走 rpc.call。
  if (typeof shape.rpc?.call === 'function') {
    return await shape.rpc.call(RPC_CHANNEL, endpoint, { args }, signal)
  }
  // 旧版：点分命名空间 → connection.api.<ns>.<method>(args)
  const slash = endpoint.indexOf('/')
  const ns = slash === -1 ? endpoint : endpoint.slice(0, slash)
  const method = slash === -1 ? '' : endpoint.slice(slash + 1)
  const fn = shape.api?.[ns]?.[method]
  if (typeof fn !== 'function') {
    throw new Error(
      `[bga-dsh-workbench] 宿主 RPC 不可用：${endpoint}`
      + `（新版的 rpc.call 与旧版的 api.${ns}.${method} 均缺失）`,
    )
  }
  const response = await fn(args, signal)
  return response.result
}

/** 上下文里本插件用到的最小工作区能力面。 */
interface WorkspacesShape {
  uiWorkspace?: { connectWorkspace?: (workspaceId: string) => Promise<string> }
  workspaces?: { connectWorkspace?: (workspaceId: string) => Promise<string> }
}

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
export function connectWorkspace(ctx: unknown, workspaceId: string): Promise<string> {
  const shape = ctx as WorkspacesShape
  if (typeof shape.uiWorkspace?.connectWorkspace === 'function') {
    return shape.uiWorkspace.connectWorkspace(workspaceId)
  }
  if (typeof shape.workspaces?.connectWorkspace === 'function') {
    return shape.workspaces.connectWorkspace(workspaceId)
  }
  throw new Error(
    '[bga-dsh-workbench] 无法连接工作区：'
    + 'uiWorkspace.connectWorkspace（新版）与 workspaces.connectWorkspace（旧版）均不可用',
  )
}
