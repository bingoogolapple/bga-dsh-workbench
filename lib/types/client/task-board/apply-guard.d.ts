/**
* apply-guard.ts —— 任务看板「一次性应用守卫」。
*
* 专门为「任务看板」的 DOM 挂载流程提供幂等保护：
* 该插件的同一页面生命周期内，全屏看板面板与内嵌看板卡片可能由多个入口
* （侧边栏入口、hero 空态、插件自身的逻辑）触发挂载，若不加以约束就会
* 重复创建 DOM、重复绑定事件。这里借助一个挂在 globalThis（即 window）
* 上的布尔标志位，保证同一页面内看板「同一类挂载只生效一次」，并在销毁
* 时释放标志位，以便将来（如 HMR 或重新激活）能够再次挂载。
*/
declare global {
    var __bgaDshWorkbenchTaskBoardApplied: boolean | undefined;
}
/**
* 「认领」看板挂载资格（claim）。
*
* 若标志位已是 true（已有入口挂载过看板），本次认领失败并返回 false；
* 否则把标志位置为 true 并返回 true，表示本调用方获得了挂载资格，
* 可以继续执行后续的 mount 动作。调用方通常只在返回 true 时才挂载，
* 从而保证「同一页面只挂载一次」。
*
* @returns true = 成功认领，可继续挂载；false = 已被他人认领，应放弃。
*/
export declare function claimTaskBoardApply(): boolean;
/**
* 「释放」看板挂载资格（release）。
*
* 把全局标志位恢复为 undefined。通常在挂载入口的清理函数
* （dispose / unmount 回调）里调用，与 claimTaskBoardApply 成对出现，
* 使页面反复进入/退出看板场景时能重新获得挂载资格。
*/
export declare function releaseTaskBoardApply(): void;
