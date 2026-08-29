// ============================================================================
// 文件：runtime-modules.ts —— DSH 平台模块表的「版本兼容取用层」
//
// 背景：
//   client bundle 被打成 CJS 并包进
//   `window.__ModuleLoader__.load({ factory: (require) => { ... } })`，
//   因此本模块里的 `require` 就是平台模块表的 require。而模块表的 seed 表随
//   DSH 版本变化：
//     - 0.1.1-rc.x     ：有 `@deepseek-ai/dsh-client-runtime/client`
//     - 0.1.2-alpha.1+ ：改为裸名 `@deepseek-ai/dsh-client-store`
//   两者互不存在于对方版本。若写成静态值导入，缺失侧会在加载期直接抛
//   “missed the module table”，导致**整个插件**加载失败（不只是该功能失效）。
//
// 约定：
//   只有本文件允许 require 这类「版本专属」specifier，且必须逐个 try/catch 兜底
//   ——解析失败是预期的（对应版本不存在），只有全部落空才报错。
//   build.mjs 的 purity gate 会在构建期强制这条约定。
// ============================================================================
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'

// require 由 ModuleLoader 的包装器以参数注入（build.mjs 的 banner）。
// 这里是**模块作用域**声明，不会与 @types/node 的全局 require 冲突。
declare const require: (spec: string) => unknown

/** createSnapshotStore 的工厂签名（新旧版本一致）。 */
export type SnapshotStoreFactory = <T>(
  init: T,
  opts?: { flush?: 'raf' | 'sync' },
) => SnapshotStore<T>

/**
 * 快照 store 的候选 specifier，按「新版优先、旧版回退」排列。
 * 命中即缓存，只有第一次调用付探测成本。
 */
const SNAPSHOT_STORE_SPECS: readonly string[] = [
  '@deepseek-ai/dsh-client-store', // 0.1.2-alpha.1+
  '@deepseek-ai/dsh-client-runtime/client', // 0.1.1-rc.x（新版已移除）
]

// 解析结果缓存（首次成功后不再探测）。
let snapshotStore: SnapshotStoreFactory | undefined

/**
 * 取得 createSnapshotStore（惰性解析 + 缓存）。
 *
 * 延迟到真正要用时才解析，因此即使当前宿主缺少其中一个 specifier 也不会
 * 影响插件加载。
 *
 * @returns 快照 store 工厂。
 * @throws 两个版本都不可用时抛错（说明宿主既非新旧任一版本）。
 */
export function snapshotStoreFactory(): SnapshotStoreFactory {
  if (snapshotStore !== undefined) return snapshotStore
  const failures: string[] = []
  for (const spec of SNAPSHOT_STORE_SPECS) {
    try {
      const mod = require(spec) as { createSnapshotStore?: SnapshotStoreFactory } | undefined
      if (typeof mod?.createSnapshotStore === 'function') {
        snapshotStore = mod.createSnapshotStore
        return snapshotStore
      }
      failures.push(`${spec}: 无 createSnapshotStore 导出`)
    } catch (error) {
      failures.push(`${spec}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  throw new Error(
    `[bga-dsh-workbench] 无法解析 createSnapshotStore（新旧 DSH 均未命中）：${failures.join(' | ')}`,
  )
}
