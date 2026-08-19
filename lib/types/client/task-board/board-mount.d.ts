/**
* board-mount.tsx —— 全屏看板面板的挂载逻辑。
*
* 本模块把 <TaskBoard /> 以「覆盖在对话区中央的绝对定位容器」形式挂到页面：
* - 在 conversation / centerCol 中找到对话中央区域，追加一个全屏覆盖容器；
* - 订阅看板控制器（BoardController）快照，驱动面板的打开/关闭（显示/隐藏）；
* - 打开时清理其他 UI 的「活跃/打开」数据属性（侧边栏热区冲突处理），并广播
*   一个全局事件，让其他同样监听该事件的面板主动收起自己；
* - 用 MutationObserver 观察 <html> 的属性变化：一旦出现其他组件抢占全屏态
*   （rival 属性，如 data-*-active / data-*-open），立即关闭看板、让出屏幕；
* - 在捕获阶段监听侧边栏点击：点击会话 / 项目 / 搜索行 / 新建按钮时关闭看板。
* 返回一个清理函数，卸载时彻底移除 DOM、事件监听、观察器与订阅。
*/
import type { BoardController } from '../../core/controller.ts';
/**
* 把全屏看板挂载到对话区中央。
*
* 生命周期：订阅控制器快照 -> 打开时创建容器并渲染 <TaskBoard /> ->
* 处理全屏抢占 / 侧边栏点击 / 全局事件 -> 返回清理函数销毁全部副作用。
*
* @param controller 看板控制器，用于读取/订阅快照并驱动打开、关闭、选择等操作。
* @returns 清理函数：断开观察器、移除事件监听与订阅、卸载 React 根、移除容器。
*/
export declare function mountBoard(controller: BoardController): () => void;
