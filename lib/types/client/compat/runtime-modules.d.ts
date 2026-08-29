import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
/** createSnapshotStore 的工厂签名（新旧版本一致）。 */
export type SnapshotStoreFactory = <T>(init: T, opts?: {
    flush?: 'raf' | 'sync';
}) => SnapshotStore<T>;
/**
 * 取得 createSnapshotStore（惰性解析 + 缓存）。
 *
 * 延迟到真正要用时才解析，因此即使当前宿主缺少其中一个 specifier 也不会
 * 影响插件加载。
 *
 * @returns 快照 store 工厂。
 * @throws 两个版本都不可用时抛错（说明宿主既非新旧任一版本）。
 */
export declare function snapshotStoreFactory(): SnapshotStoreFactory;
