import type { BoardController } from '../../core/controller.ts';
/**
 * 挂载内嵌版看板（TaskBoardEmbed）。
 *
 * @param controller 看板控制器，透传给内嵌组件用于驱动看板状态。
 * @returns 清理函数：卸载 React 根并移除占位容器；若幂等守卫拦截，
 *          则返回一个什么都不做的空函数。
 */
export declare function mountBoardEmbed(controller: BoardController): () => void;
