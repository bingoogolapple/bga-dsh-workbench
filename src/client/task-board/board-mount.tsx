 
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
 
 import { createRoot, type Root } from 'react-dom/client'
 import type { BoardController } from '../../core/controller.ts'
 import { TaskBoard } from './board/TaskBoard.tsx'
 
 // 对话区中央面板的候选选择器：优先按 data-pane 定位，兼容按 class 兜底。
 const CENTER_SELECTOR = '[data-pane="conversation"], [class*="centerCol"]'
// 挂在看板容器元素上的标记属性（标识该容器是看板视图容器）。
 const VIEW_ATTR = 'data-bga-kb-view'
 // 挂在 <html> 上、表示「看板全屏打开」的属性；全局可见，供样式/其他脚本判断。
 const OPEN_ATTR = 'data-bga-kb-open'
 
 // 看板面板激活全屏时向全局广播的事件名（配合 CustomEvent 传递面板标识）。
 const BGA_PANEL_EVENT = 'bga-kb-panel-activate'
// 本看板面板在广播事件中的唯一标识。
 const BGA_PANEL_ID = 'bga-kb'
 
 /**
 * 判断某个属性名是否属于「会与看板全屏态冲突」的竞争属性（rival）。
 *
 * 竞争属性形如 data-*-active / data-*-open（且不会是看板自己的 OPEN_ATTR）：
 * 当 DSH 页面里别的组件（会话历史、项目面板等）通过这类属性切换自身打开态时，
 * 说明用户正在切换到别的视图，此时全屏看板应当让出屏幕。
 */
 function isRivalAttr(name: string): boolean {
   return name.startsWith('data-') && name !== OPEN_ATTR
       && (name.endsWith('-active') || name.endsWith('-open'))
 }
 
 /**
 * 列出当前 <html> 上存在的全部竞争属性名。
 */
 function rivalAttrsOnHtml(): string[] {
   const el = document.documentElement
   const attrs: string[] = []
   for (const { name } of el.attributes) {
     if (isRivalAttr(name)) attrs.push(name)
   }
   return attrs
 }
 
 /**
 * 清除 <html> 上现存的所有竞争属性。
 *
 * 在看板打开时调用：把其他面板/侧边栏的「active / open」态强制摘掉，
 * 避免两个全屏/展开态同时生效（布局冲突、事件抢焦点），
 * 实现「看板打开即独占全屏」的语义。
 */
 function clearRivalAttrs(): void {
   for (const name of rivalAttrsOnHtml()) {
     document.documentElement.removeAttribute(name)
   }
 }
 
 /**
 * 点击页面上带 data-active 属性的元素（通常是侧边栏里正处于展开状态的入口按钮）。
 *
 * 在看板打开时调用，用于收起可能仍处于展开态的侧边栏项，防止其覆盖在全屏看板上。
 */
 function closeAnyActiveSidebarEntry(): void {
   const btn = document.querySelector<HTMLElement>('[data-active]')
   if (btn !== null && document.documentElement.contains(btn)) {
     btn.click()
   }
 }
 
 /**
 * 找到对话区中央面板容器；找不到时返回 undefined。
 */
 function findCenter(): HTMLElement | undefined {
   return document.querySelector<HTMLElement>(CENTER_SELECTOR) ?? undefined
 }
 
 /**
 * 把全屏看板挂载到对话区中央。
 *
 * 生命周期：订阅控制器快照 -> 打开时创建容器并渲染 <TaskBoard /> ->
 * 处理全屏抢占 / 侧边栏点击 / 全局事件 -> 返回清理函数销毁全部副作用。
 *
 * @param controller 看板控制器，用于读取/订阅快照并驱动打开、关闭、选择等操作。
 * @returns 清理函数：断开观察器、移除事件监听与订阅、卸载 React 根、移除容器。
 */
 export function mountBoard(controller: BoardController): () => void {
   // 模块级闭包状态：React 根 / 覆盖容器 / 当前是否处于打开态。
   // 其中 active 与快照 boardOpen 同步，用于识别「关闭→打开 / 打开→关闭」的边沿跳变。
   let root: Root | undefined
   let container: HTMLElement | undefined
   let active = false
 
   // 惰性创建容器：只在真正需要显示看板时才创建 DOM，
   // 避免页面加载初期就产生多余的覆盖层。
   const ensure = (): void => {
     // 容器已存在则直接复用。
     if (container !== undefined) return
     const center = findCenter()
     // 中央区域还没就绪时先放弃，等待后续订阅/观察再次触发。
     if (center === undefined) return
     container = document.createElement('div')
     container.setAttribute(VIEW_ATTR, '')
     // 绝对定位铺满整个中央区域；默认隐藏，由 applyOpen 控制显示。
     Object.assign(container.style, {
       position: 'absolute', inset: '0', zIndex: '60',
       display: 'none', background: 'var(--dsw-alias-bg-base)',
     })
     center.appendChild(container)
     root = createRoot(container)
     root.render(<TaskBoard controller={controller} />)
   }
 
   // 把控制器快照里的 boardOpen 状态同步到 DOM：
   // 打开时创建并显示容器、清理竞争属性、广播激活事件；
   // 关闭时仅隐藏容器（不卸载 React 根，保留组件状态以便快速恢复）。
   const applyOpen = (): void => {
     const open = controller.getSnapshot().boardOpen
     if (open && !active) {
       // —— 从「关闭」转入「打开」 ——
       ensure()
       active = true
       document.documentElement.setAttribute(OPEN_ATTR, '') // 在 <html> 上标记全屏打开态
       clearRivalAttrs()                                   // 独占全屏：摘掉其他面板的 active/open 属性
       if (container !== undefined) container.style.display = 'flex'
       closeAnyActiveSidebarEntry()                        // 收起侧边栏里可能展开的入口
       // 广播事件：告知其他同样监听该事件的面板「看板已接管全屏」，让它们自行收起。
       document.dispatchEvent(new CustomEvent(BGA_PANEL_EVENT, { detail: BGA_PANEL_ID }))
     } else if (!open && active) {
       // —— 从「打开」转入「关闭」 ——
       active = false
       document.documentElement.removeAttribute(OPEN_ATTR)
       if (container !== undefined) container.style.display = 'none'
     }
   }
 
   
 
   
   // 监听全局「面板激活」广播事件：
   // 若 event.detail 不是本看板（说明是别的面板宣布接管全屏），
   // 则让看板收起，把屏幕交给对方。
   const onBgaPanel = (e: Event): void => {
     if ((e as CustomEvent).detail !== BGA_PANEL_ID) controller.closeBoard()
   }
   document.addEventListener(BGA_PANEL_EVENT, onBgaPanel)
 
   
   
   
   // 观察 <html> 上的属性变化（attributes 模式，持续运行）：
   // 其他组件在 <html> 上添加形如 data-*-active / data-*-open 的竞争属性，
   // 说明页面正切换到别的高层视图；只要看板此刻处于打开状态，
   // 就调用 closeBoard() 让出全屏，实现「谁最后激活谁赢」的抢占语义。
   const observer = new MutationObserver((mutations) => {
     // 看板本来就没打开时无需处理。
     if (!controller.getSnapshot().boardOpen) return
     for (const m of mutations) {
       const name = m.attributeName ?? ''
       // 命中竞争属性且属性真实存在（如果只是移除则忽略）时关闭看板。
       if (m.type === 'attributes' && isRivalAttr(name)
           && document.documentElement.hasAttribute(name)) {
         controller.closeBoard()
         return
       }
     }
   })
   observer.observe(document.documentElement, { attributes: true })
 
   
   // 侧边栏交互热区：点击这些元素表示用户想切换到别的会话 / 项目 / 搜索结果，
   // 或点「新建会话」；看板打开时应退出全屏。选择器覆盖整行区域以便容错。
   const SIDEBAR_SEL = '[class*="sessionRow"], [class*="projectRow"], [class*="searchResultRow"], [class*="searchResultWorkspace"], [class*="newSession"]'
   const onSidebarClick = (e: MouseEvent): void => {
     // 看板未打开时无需干预。
     if (!controller.getSnapshot().boardOpen) return
     // 命中热区（含其子元素）即关闭看板。
     if ((e.target as HTMLElement | null)?.closest(SIDEBAR_SEL) !== null) controller.closeBoard()
   }
   // 用捕获阶段（第三个参数 true）监听，确保在事件到达看板内部元素之前先判断，
   // 避免看板内部的点击被侧边栏判定误伤。
   document.addEventListener('click', onSidebarClick, true)
 
   // 订阅控制器快照：任何状态变化都会触发 applyOpen 同步 DOM 显隐。
   const unsub = controller.subscribe(applyOpen)
   // 挂载时立即执行一次，使当前快照状态（可能已打开）立刻落到 DOM 上。
   applyOpen()
 
   // —— 清理阶段（dispose）—— 逆序断开所有副作用：
   // 观察器、全局事件、订阅、React 根、DOM 容器。
   return () => {
     observer.disconnect()
     document.removeEventListener(BGA_PANEL_EVENT, onBgaPanel)
     document.removeEventListener('click', onSidebarClick, true)
     // 记得清掉 <html> 上残留的打开标记，避免脏属性影响下次判定。
     document.documentElement.removeAttribute(OPEN_ATTR)
     unsub()
     root?.unmount()
     root = undefined
     container?.remove()
     container = undefined
   }
 }