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
 import type { Context as ClientContext } from '@deepseek-ai/cordis'
 import type { IWorkspaces } from '@deepseek-ai/dsh-api-workspace-controller/client'
import { openMenuLabels, extraOpenMenuItems, extraOpenLabel } from './open-prefs.ts'

 /** 宿主打开端点的相对地址（与 src/routes.ts 的 /open 路由对应）。 */
 const OPEN_URL = '/bga-dsh-workbench/open'

 /** 读取「打开方式」偏好的配置端点（/config 返回当前生效值）。 */
 const CONFIG_URL = '/bga-dsh-workbench/config'

 /** 注入按钮组在菜单上的自定义数据标记（防止同一菜单重复注入）。 */
 const INJECTED_MARK = 'data-bga-open-injected'

 /**
  * 打开 kind → 可读应用名（错误提示前缀用）。附加 IDE 走 extraOpenLabel；
  * finder/terminal/vscode 直接映射。
  */
 export function openDisplayName(kind: string): string {
   switch (kind) {
     case 'finder': return 'Finder'
     case 'terminal': return '终端'
     case 'vscode': return 'VSCode'
     default: return extraOpenLabel(kind)
   }
 }

 /** 按钮组区域的自定义数据标记（供点击处理与测试定位）。 */
 const GROUP_MARK = 'data-bga-open-group'

 /**
 * 工作区行「⋯」按钮 aria-label 的中英文模板（来自 ui-workspace locales.ts）。
 * 注意中文模板的双引号是弯引号“ ”（U+201C/U+201D），且 {name} 可能本身含
 * 引号或空白，因此按「前缀 + 任意内容 + 后缀」宽容提取并 trim。
 */
 const WORKSPACE_ARIA_PATTERNS: readonly RegExp[] = [
   /^工作区[“"「『]?\s*(.+?)\s*[”"」』]?的操作$/u,
   /^Workspace actions for\s+(.+?)\s*$/u,
 ]

 /** 从「⋯」按钮的 aria-label 中提取工作区显示名；非工作区按钮返回 undefined。 */
 export function workspaceLabelFromAria(aria: string): string | undefined {
   for (const pattern of WORKSPACE_ARIA_PATTERNS) {
     const match = pattern.exec(aria)
     if (match !== null) return match[1].trim()
   }
   return undefined
 }


 /** 取路径的 basename（兼容两种分隔符），用于按显示名兜底匹配。 */
 function basenameOf(path: string): string {
   const trimmed = path.replace(/[/\\]+$/u, '')
   const parts = trimmed.split(/[/\\]/u)
   return parts[parts.length - 1] ?? path
 }

 /**
  * 用工作区显示名在工作区列表中解析目录路径：
  * 先精确匹配 title（含用户重命名后的标题），再兜底匹配路径 basename。
  * 重名时取第一个匹配（产品允许重复标题）。
  */
 export interface ResolvableWorkspace {
   readonly workspaceId: string
   readonly title?: string
   readonly path?: string
 }

 export function resolveWorkspacePath(
   items: readonly ResolvableWorkspace[],
   label: string,
 ): string | undefined {
   const byTitle = items.find(item => item.title === label)
   if (byTitle !== undefined) return byTitle.path
   return items.find(item => basenameOf(item.path ?? '') === label)?.path
 }

 /**
  * 兜底解析：从「⋯」按钮所在的工作区行（role=treeitem）提取显示名。
  * 行内标题文本节点是 .projectText span（CSS Modules 类名形如 hash_projectText，
  * 属性选择器按子串匹配），其文本即该工作区的显示名。
  */
 export function workspaceLabelFromRow(row: Element | null): string | undefined {
   if (row === null) return undefined
   const title = row.querySelector('[class*="projectText"] span')
   const text = title?.textContent?.trim()
   return text !== undefined && text.length > 0 ? text : undefined
 }

 /** 判断一个菜单节点是否为工作区菜单：含「删除工作区」项（会话菜单没有它）。 */
 function isWorkspaceMenu(menu: Element): boolean {
   return /删除工作区|Delete workspace/u.test(menu.textContent ?? '')
 }

 /** 在菜单中定位「重命名」条目按钮（中英文都覆盖）。 */
 function findRenameItem(menu: Element): HTMLButtonElement | null {
   const buttons = menu.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]')
   for (const button of buttons) {
     const text = button.textContent?.trim() ?? ''
     if (text === '重命名' || text === 'Rename') return button
   }
   return null
 }

 /** 找到工作区菜单中的「删除工作区」项（把附加 IDE 分组插在它之后）。 */
 function findDeleteItem(menu: Element): HTMLButtonElement | null {
   const buttons = menu.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]')
   for (const button of buttons) {
     const text = button.textContent?.trim() ?? ''
     if (text === '删除工作区' || text === 'Delete Workspace' || text === '删除') return button
   }
   return null
 }

 /** 菜单项的样式（对齐产品 Menu.module.css 的 .item：min-h 40、pad 10/8、r10）。 */
 const itemStyle = (): Partial<CSSStyleDeclaration> => ({
   display: 'flex',
   alignItems: 'center',
   gap: '8px',
   width: '100%',
   minHeight: '40px',
   padding: '8px 10px',
   border: 'none',
   borderRadius: '10px',
   background: 'transparent',
   cursor: 'pointer',
   fontSize: '14px',
   lineHeight: '22px',
   color: 'var(--dsw-alias-label-primary)',
   textAlign: 'left',
 })

 /** 16×16 菜单图标定义：SVG path 数据（风格与产品图标一致，currentColor 着色）。 */
 interface OpenActionIcon {
   /**
    * 图标 path 列表。每个 path 有两种画法：
    *   - 默认：path 填充 currentColor（用于实心剪影 / 圆点，如 Android 眼睛）；
    *   - `stroke: true`：仅描边 currentColor（1.3 线宽、圆头圆角），用于细线轮廓
    *     （如 Android 头部、微信气泡），二者可混用，便于更贴近官方标志造型。
    * 多色图标（如 Android Studio 官方配色）可给单个 path 指定 `fill`。
    * 自定义 viewBox（非 16×16，如 1024 原始坐标系）用 `viewBox` 覆盖。
    */
   readonly viewBox?: string
   readonly paths: readonly { readonly d: string; readonly stroke?: boolean; readonly opacity?: string; readonly fill?: string }[]
   }

   /** 生成一个 16×16 的 SVG 图标元素（默认 fill=currentColor，随菜单文字颜色）。 */
   function buildIcon(icon: OpenActionIcon): SVGSVGElement {
   const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
   svg.setAttribute('width', '16')
   svg.setAttribute('height', '16')
   svg.setAttribute('viewBox', icon.viewBox ?? '0 0 16 16')
   svg.setAttribute('fill', 'none')
   svg.setAttribute('aria-hidden', 'true')
   for (const entry of icon.paths) {
     const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
     path.setAttribute('d', entry.d)
     if (entry.stroke === true) {
       // 描边画法：细线轮廓 + 圆头圆角，线条随菜单文字颜色
       path.setAttribute('fill', 'none')
       path.setAttribute('stroke', 'currentColor')
       path.setAttribute('stroke-width', '1.3')
       path.setAttribute('stroke-linecap', 'round')
       path.setAttribute('stroke-linejoin', 'round')
     } else {
       path.setAttribute('fill', entry.fill ?? 'currentColor')
     }
     if (entry.opacity !== undefined) path.setAttribute('opacity', entry.opacity)
     svg.appendChild(path)
   }
   return svg
   }

 /** 在 Finder 中打开。 */
 const FINDER_ICON: OpenActionIcon = {
   viewBox: '0 0 1024 1024',
   paths: [
     { d: 'M605.8432 102.4c-89.03424 136.17152-139.66592 288.06784-158.87488 448.6976l187.68768 0c-15.712 61.10592-25.31712 121.34272-27.05792 180.70784 99.50976-9.60384 186.8032-35.77728 240.07296-69.83936l31.424 40.15744c-73.33632 42.76992-168.49152 70.70976-271.49824 81.18528 1.5744 31.05152 5.0944 61.14944 10.4832 91.06432 0.7296 3.95776 1.46048 7.9168 2.26432 11.86816 0.05888 0.29952 0.11904 0.59904 0.17792 0.89856 3.17824 15.49952 6.97344 30.94144 11.31904 46.32192L1024 933.46176 1024 102.4 605.8432 102.4zM744.6528 351.18208l-53.25824 0 0-123.08352 53.25824 0L744.6528 351.18208z', fill: '#009FE8' },
     { d: 'M552.78464 788.77568c-0.13056-1.41824-0.1984-2.11968-0.1984-1.95968-134.42944 5.22496-279.3472-20.07808-401.54752-81.21088l25.30304-40.13184c14.16576 6.66496 28.58624 12.79232 43.19488 18.43456 0.69504 0.2688 1.38496 0.55168 2.08128 0.81792 5.55392 2.12352 11.14368 4.15104 16.7488 6.13248 9.85984 3.48416 19.78752 6.77504 29.78432 9.82656 11.66848 3.56224 23.4176 6.83136 35.22176 9.82144 0.09216 0.02304 0.18432 0.04864 0.27648 0.07168 2.01984 0.51072 4.04608 0.98944 6.06976 1.4848 1.95072 0.47616 3.8976 0.96896 5.8496 1.43104 1.14176 0.27008 2.28736 0.5184 3.4304 0.78336 2.83648 0.65664 5.67296 1.31712 8.51456 1.94304 1.68576 0.3712 3.37408 0.71424 5.06112 1.07392 2.304 0.49152 4.60672 0.99584 6.91328 1.46688 2.06592 0.4224 4.13568 0.81408 6.20416 1.21984 1.92768 0.37888 3.85536 0.77312 5.78432 1.13664 2.79808 0.52864 5.59744 1.02272 8.39808 1.52192 1.2032 0.21376 2.40512 0.44544 3.60832 0.65408 5.67808 0.98688 11.35872 1.89184 17.03936 2.75968 3.47648 0.5312 6.95296 1.0432 10.42816 1.53088 6.3552 0.89088 12.70656 1.71648 19.0528 2.46144 0.5056 0.05888 1.0112 0.128 1.5168 0.1856 47.97184 5.55264 95.55968 7.02464 141.056 5.056 1.23648-43.08224 5.728-86.45888 13.11104-129.20704L383.24864 606.08c0.64768-7.43552 1.3824-14.82624 2.15808-22.19776 0.1728-1.63584 0.35456-3.26656 0.53248-4.89984 0.672-6.15168 1.38624-12.2816 2.14528-18.38848 0.16512-1.33248 0.32384-2.67008 0.4928-4 0.94336-7.38816 1.9392-14.74816 3.00928-22.06848 0.08448-0.57984 0.1792-1.15456 0.26368-1.73312 0.94208-6.37696 1.93792-12.72448 2.97344-19.04896 0.37248-2.27968 0.75648-4.55424 1.14176-6.82752 0.79232-4.66944 1.61408-9.32224 2.45888-13.96352 0.47232-2.60224 0.93312-5.21088 1.4208-7.80416 1.09824-5.82144 2.23488-11.62112 3.41376-17.39776 0.9152-4.49536 1.87904-8.96256 2.8416-13.43104 0.38528-1.7792 0.76416-3.56224 1.15584-5.3376C435.31264 321.5936 482.76096 205.60512 545.05856 102.4L0 102.4l0 831.06304 572.87168 0C561.0752 887.12704 554.59968 838.41408 552.78464 788.77568zM247.936 228.09728l53.23136 0 0 123.08352L247.936 351.1808 247.936 228.09728z', fill: '#D2ECFA' },
   ],
 }

 /** 在终端中打开：取自官方图标（devicon 1024 viewBox）的终端窗口标志——圆角窗口 + >_ 提示符，currentColor 填充（不缩放）。 */
 const TERMINAL_ICON: OpenActionIcon = {
   viewBox: '0 0 1024 1024',
   paths: [
     { d: 'M514.2 514h-135c-1.2 0-2.2 0-3.4-0.2-1.2-0.2-2.2-0.2-3.2-0.4s-2.2-0.4-3.2-0.8-2-0.6-3.2-1.2c-1-0.4-2-0.8-3-1.4-1-0.6-2-1-2.8-1.8-1-0.6-1.8-1.2-2.6-2s-1.6-1.4-2.4-2.2c-0.8-0.8-1.6-1.6-2.2-2.4-0.8-0.8-1.4-1.8-2-2.6-0.6-1-1.2-1.8-1.8-2.8-0.6-1-1-2-1.4-3-0.4-1-0.8-2-1.2-3.2s-0.6-2.2-0.8-3.2c-0.2-1-0.4-2.2-0.4-3.2-0.2-1.2-0.2-2.2-0.2-3.4 0-1.2 0-2.2 0.2-3.4 0.2-1.2 0.2-2.2 0.4-3.2s0.4-2.2 0.8-3.2 0.6-2 1.2-3.2c0.4-1 0.8-2 1.4-3s1-2 1.8-2.8 1.2-1.8 2-2.6 1.4-1.6 2.2-2.4c0.8-0.8 1.6-1.6 2.4-2.2 0.8-0.8 1.8-1.4 2.6-2s1.8-1.2 2.8-1.8c1-0.6 2-1 3-1.4 1-0.4 2-0.8 3.2-1.2 1-0.4 2.2-0.6 3.2-0.8 1-0.2 2.2-0.4 3.2-0.4 1.2-0.2 2.2-0.2 3.4-0.2h135c1.2 0 2.2 0 3.4 0.2 1.2 0.2 2.2 0.2 3.2 0.4s2.2 0.4 3.2 0.8 2 0.6 3.2 1.2c1 0.4 2 0.8 3 1.4 1 0.6 2 1 2.8 1.8s1.8 1.2 2.6 2 1.6 1.4 2.4 2.2c0.8 0.8 1.6 1.6 2.2 2.4 0.8 0.8 1.4 1.8 2 2.6 0.6 1 1.2 1.8 1.8 2.8 0.6 1 1 2 1.4 3 0.4 1 0.8 2 1.2 3.2 0.4 1 0.6 2.2 0.8 3.2 0.2 1 0.4 2.2 0.4 3.2 0.2 1.2 0.2 2.2 0.2 3.4 0 1.2 0 2.2-0.2 3.4-0.2 1.2-0.2 2.2-0.4 3.2s-0.4 2.2-0.8 3.2-0.6 2-1.2 3.2c-0.4 1-0.8 2-1.4 3-0.6 1-1 2-1.8 2.8-0.6 1-1.2 1.8-2 2.6s-1.4 1.6-2.2 2.4c-0.8 0.8-1.6 1.6-2.4 2.2-0.8 0.8-1.8 1.4-2.6 2-1 0.6-1.8 1.2-2.8 1.8-1 0.6-2 1-3 1.4-1 0.4-2 0.8-3.2 1.2-1 0.4-2.2 0.6-3.2 0.8-1 0.2-2.2 0.4-3.2 0.4-1.2 0.2-2.2 0.2-3.4 0.2z m-337.4 0c-1.8 0-3.4-0.2-5.2-0.4-1.8-0.2-3.4-0.6-5-1.2s-3.2-1.2-4.8-2c-1.6-0.8-3-1.6-4.4-2.6-1.4-1-2.8-2.2-4-3.4-1.2-1.2-2.4-2.6-3.4-3.8-1-1.4-2-2.8-2.8-4.4-0.8-1.6-1.6-3.2-2-4.8-0.6-1.6-1-3.4-1.4-5s-0.6-3.4-0.6-5.2 0-3.4 0.2-5.2c0.2-1.8 0.6-3.4 1-5s1-3.2 1.8-4.8c0.8-1.6 1.6-3 2.6-4.6 1-1.4 2-2.8 3.2-4 1.2-1.2 2.4-2.4 3.8-3.6l135.8-108.6-135.8-108.6c-0.8-0.6-1.6-1.4-2.4-2.2-0.8-0.8-1.6-1.6-2.2-2.4-0.8-0.8-1.4-1.8-2-2.6-0.6-1-1.2-1.8-1.8-2.8s-1-2-1.4-3c-0.4-1-0.8-2-1.2-3.2-0.4-1-0.6-2.2-0.8-3.2-0.2-1-0.4-2.2-0.6-3.2-0.2-1-0.2-2.2-0.2-3.4 0-1.2 0-2.2 0.2-3.4 0-1.2 0.2-2.2 0.4-3.2s0.4-2.2 0.8-3.2 0.6-2.2 1-3.2 0.8-2 1.4-3c0.6-1 1-2 1.6-2.8 0.6-1 1.2-1.8 2-2.6s1.4-1.6 2.2-2.4c0.8-0.8 1.6-1.6 2.4-2.2 0.8-0.8 1.8-1.4 2.6-2 1-0.6 1.8-1.2 2.8-1.8 1-0.6 2-1 3-1.4 1-0.4 2-0.8 3.2-1.2 1-0.4 2.2-0.6 3.2-0.8 1-0.2 2.2-0.4 3.2-0.6 1-0.2 2.2-0.2 3.4-0.2 1.2 0 2.2 0 3.4 0.2 1.2 0 2.2 0.2 3.2 0.4s2.2 0.4 3.2 0.8 2.2 0.6 3.2 1 2 0.8 3 1.4c1 0.6 2 1 2.8 1.6 1 0.6 1.8 1.2 2.6 2l168.8 135c1 0.8 2 1.6 2.8 2.6 0.8 0.8 1.8 1.8 2.6 2.8 0.8 1 1.6 2 2.2 3 0.6 1 1.2 2.2 1.8 3.4 0.6 1.2 1 2.4 1.4 3.4 0.4 1.2 0.8 2.4 1 3.6 0.2 1.2 0.4 2.4 0.6 3.8 0.2 1.2 0.2 2.6 0.2 3.8 0 1.2 0 2.6-0.2 3.8-0.2 1.2-0.4 2.4-0.6 3.8-0.2 1.2-0.6 2.4-1 3.6-0.4 1.2-0.8 2.4-1.4 3.4-0.6 1.2-1.2 2.2-1.8 3.4-0.6 1-1.4 2-2.2 3s-1.6 2-2.6 2.8c-0.8 0.8-1.8 1.8-2.8 2.6L198 507c-3 2.4-6.2 4.2-10 5.4-3.6 1-7.4 1.6-11.2 1.6zM885.4 41.6H143c-2.2 0-4.4 0-6.6 0.2s-4.4 0.2-6.6 0.4c-2.2 0.2-4.4 0.4-6.6 0.8l-6.6 1.2c-2.2 0.4-4.4 1-6.4 1.4-2.2 0.6-4.2 1.2-6.4 1.8-2.2 0.6-4.2 1.4-6.2 2-2 0.8-4.2 1.6-6.2 2.4-2 0.8-4 1.8-6 2.6l-6 3c-2 1-3.8 2.2-5.8 3.2-1.8 1.2-3.8 2.4-5.6 3.6-1.8 1.2-3.6 2.4-5.4 3.8-1.8 1.4-3.6 2.6-5.2 4s-3.4 2.8-5 4.4-3.2 3-4.8 4.6-3 3.2-4.6 4.8c-1.4 1.6-3 3.4-4.4 5s-2.8 3.4-4 5.2c-1.4 1.8-2.6 3.6-3.8 5.4-1.2 1.8-2.4 3.8-3.6 5.6-1.2 1.8-2.2 3.8-3.2 5.8l-3 6c-1 2-1.8 4-2.6 6s-1.6 4-2.4 6.2c-0.8 2-1.4 4.2-2 6.2-0.6 2.2-1.2 4.2-1.8 6.4-0.6 2.2-1 4.2-1.4 6.4l-1.2 6.6c-0.4 2.2-0.6 4.4-0.8 6.6-0.2 2.2-0.4 4.4-0.4 6.6C8 172 8 174.2 8 176.6v675c0 2.2 0 4.4 0.2 6.6 0.2 2.2 0.2 4.4 0.4 6.6 0.2 2.2 0.4 4.4 0.8 6.6l1.2 6.6c0.4 2.2 1 4.4 1.4 6.4 0.6 2.2 1.2 4.2 1.8 6.4 0.6 2.2 1.4 4.2 2 6.2 0.8 2 1.6 4.2 2.4 6.2 0.8 2 1.8 4 2.6 6l3 6c1 2 2.2 3.8 3.2 5.8 1.2 1.8 2.4 3.8 3.6 5.6 1.2 1.8 2.4 3.6 3.8 5.4 1.4 1.8 2.6 3.6 4 5.2 1.4 1.8 2.8 3.4 4.4 5 1.4 1.6 3 3.2 4.6 4.8 1.6 1.6 3.2 3 4.8 4.6s3.4 3 5 4.4c1.8 1.4 3.4 2.8 5.2 4 1.8 1.4 3.6 2.6 5.4 3.8 1.8 1.2 3.8 2.4 5.6 3.6 1.8 1.2 3.8 2.2 5.8 3.2l6 3c2 1 4 1.8 6 2.6s4 1.6 6.2 2.4c2 0.8 4.2 1.4 6.2 2 2.2 0.6 4.2 1.2 6.4 1.8 2.2 0.6 4.2 1 6.4 1.4l6.6 1.2c2.2 0.4 4.4 0.6 6.6 0.8 2.2 0.2 4.4 0.4 6.6 0.4s4.4 0.2 6.6 0.2h742.4c2.2 0 4.4 0 6.6-0.2s4.4-0.2 6.6-0.4c2.2-0.2 4.4-0.4 6.6-0.8l6.6-1.2c2.2-0.4 4.4-1 6.4-1.4 2.2-0.6 4.2-1.2 6.4-1.8 2.2-0.6 4.2-1.4 6.2-2s4.2-1.6 6.2-2.4c2-0.8 4-1.8 6-2.6l6-3c2-1 3.8-2.2 5.8-3.2 1.8-1.2 3.8-2.4 5.6-3.6 1.8-1.2 3.6-2.4 5.4-3.8 1.8-1.4 3.6-2.6 5.2-4 1.8-1.4 3.4-2.8 5-4.4s3.2-3 4.8-4.6c1.6-1.6 3-3.2 4.6-4.8 1.4-1.6 3-3.4 4.4-5 1.4-1.8 2.8-3.4 4-5.2 1.4-1.8 2.6-3.6 3.8-5.4 1.2-1.8 2.4-3.8 3.6-5.6 1.2-1.8 2.2-3.8 3.2-5.8l3-6c1-2 1.8-4 2.6-6s1.6-4 2.4-6.2c0.8-2 1.4-4.2 2-6.2s1.2-4.2 1.8-6.4c0.6-2.2 1-4.2 1.4-6.4l1.2-6.6c0.4-2.2 0.6-4.4 0.8-6.6 0.2-2.2 0.4-4.4 0.4-6.6 0.2-2.2 0.2-4.4 0.2-6.6V176.6c0-2.2 0-4.4-0.2-6.6-0.2-2.2-0.2-4.4-0.4-6.6-0.2-2.2-0.4-4.4-0.8-6.6l-1.2-6.6c-0.4-2.2-1-4.4-1.4-6.4-0.6-2.2-1.2-4.2-1.8-6.4-0.6-2.2-1.4-4.2-2-6.2-0.8-2-1.6-4.2-2.4-6.2-0.8-2-1.8-4-2.6-6l-3-6c-1-2-2.2-3.8-3.2-5.8-1.2-1.8-2.4-3.8-3.6-5.6-1.2-1.8-2.4-3.6-3.8-5.4-1.4-1.8-2.6-3.6-4-5.2-1.4-1.8-2.8-3.4-4.4-5-1.4-1.6-3-3.2-4.6-4.8s-3.2-3-4.8-4.6c-1.6-1.4-3.4-3-5-4.4-1.8-1.4-3.4-2.8-5.2-4s-3.6-2.6-5.4-3.8c-1.8-1.2-3.8-2.4-5.6-3.6-1.8-1.2-3.8-2.2-5.8-3.2l-6-3c-2-1-4-1.8-6-2.6s-4-1.6-6.2-2.4c-2-0.8-4.2-1.4-6.2-2-2.2-0.6-4.2-1.2-6.4-1.8-2.2-0.6-4.2-1-6.4-1.4l-6.6-1.2c-2.2-0.4-4.4-0.6-6.6-0.8-2.2-0.2-4.4-0.4-6.6-0.4s-4-0.4-6.4-0.4z' },
   ],
 }

 /** 在 VSCode 中打开：官方 VSCode 标志（1024 viewBox，蓝色 #2196F3，不缩放）。 */
 const VSCODE_ICON: OpenActionIcon = {
   viewBox: '0 0 1024 1024',
   paths: [
     { d: 'M746.222933 102.239573l-359.799466 330.820267L185.347413 281.4976 102.2464 329.864533l198.20544 182.132054-198.20544 182.132053 83.101013 48.510293 201.076054-151.558826 359.799466 330.676906 175.527254-85.251413V187.4944z m0 217.57952v384.341334l-255.040853-192.177494z', fill: '#2196F3' },
   ],
 }

/**
 * 在 Android Studio 中打开：取自官方图标（devicon 128×128）的安卓机器人——
 * 头部/身体绿色 + 蓝色四肢 + 深色关节 + 白色高光，保持官方多色造型
 * （直接用原始 1024 viewBox 与配色，不缩放）。
 */
const ANDROID_STUDIO_ICON: OpenActionIcon = {
  viewBox: '0 0 1024 1024',
  paths: [
    // 白色高光底层（淡影）
    { d: 'M398.824 987.936c-15.824-3.752-29.072-12.528-47.6-31.544-30.968-31.768-56.104-44.992-99.776-52.512-45.312-7.8-65.44-24.64-77.552-64.864-14.936-49.648-30.56-73.424-64.864-98.768-38.928-28.752-48.912-54.112-39.416-100.056 8.8-42.56 5.432-72.808-12.44-111.712C35.84 482.08 38.48 457.28 68.776 419.24c27.76-34.856 36.48-57.904 40.632-107.448 4.192-50 18.104-70.52 59.08-87.12 34.192-13.856 63.44-37.912 79.664-65.504 18.752-31.92 21.488-35.576 33.112-44.24 18.752-13.992 33.912-17.864 62.784-16.056 50.16 3.144 77.04-2.88 110.72-24.8 43.92-28.592 70.544-28.592 114.456 0 33.68 21.92 60.56 27.944 110.72 24.8 47.432-2.976 67.168 9.472 96.08 60.616 14.32 25.336 43.608 50 75.664 63.72 45.648 19.536 58.912 37.36 62.28 83.704 3.648 50.184 13.936 78.24 41.192 112.328 30.352 37.96 33 62.784 11.656 109.24-17.864 38.904-21.24 69.16-12.44 111.712 9.504 45.944-0.488 71.304-39.408 100.056-34.312 25.336-49.928 49.12-64.872 98.768-12.104 40.224-32.24 57.064-77.552 64.864-43.76 7.536-68.92 20.8-99.76 52.616-34.2 35.256-58.712 41.08-106.512 25.272-39.096-12.92-69.2-12.976-108.136-0.192-27.28 8.952-41.816 10.512-59.312 6.36z', fill: '#FFFFFF', opacity: '0.2' },
    // 绿色头部/身体主体
    { d: 'M398.824 978.568c-15.824-3.76-29.072-12.536-47.6-31.552-30.968-31.76-56.104-44.992-99.776-52.504-45.312-7.8-65.44-24.648-77.552-64.864-14.936-49.656-30.56-73.44-64.864-98.776-38.928-28.752-48.912-54.104-39.416-100.056 8.8-42.56 5.432-72.808-12.44-111.712-21.328-46.408-18.696-71.208 11.6-109.24 27.76-34.856 36.48-57.896 40.632-107.448 4.192-50 18.104-70.52 59.08-87.12 34.192-13.856 63.44-37.912 79.664-65.504 18.752-31.92 21.488-35.568 33.112-44.24 18.752-13.992 33.912-17.864 62.784-16.056 50.16 3.144 77.04-2.88 110.72-24.8 43.92-28.592 70.544-28.592 114.456 0 33.68 21.92 60.56 27.944 110.72 24.8 47.432-2.976 67.168 9.472 96.08 60.616 14.32 25.336 43.608 50 75.664 63.72 45.648 19.536 58.912 37.36 62.28 83.704 3.648 50.184 13.936 78.24 41.192 112.328 30.352 37.96 33 62.784 11.656 109.24-17.864 38.904-21.24 69.16-12.44 111.712 9.504 45.944-0.488 71.304-39.408 100.056-34.312 25.344-49.928 49.12-64.872 98.776-12.104 40.216-32.24 57.064-77.552 64.864-43.76 7.528-68.92 20.8-99.76 52.608-34.2 35.264-58.712 41.08-106.512 25.28-39.096-12.928-69.2-12.984-108.136-0.2-27.28 8.952-41.816 10.512-59.312 6.368z', fill: '#3DDC84' },
    // 头部斑点 + 身体细节（绿色）
    { d: 'M680.04 472.24a12.112 12.112 0 0 1 5.6-16.208 12.112 12.112 0 0 1 16.208 5.6 12.112 12.112 0 0 1-5.6 16.208 12.112 12.112 0 0 1-16.208-5.6z m58.616 120.48a12.104 12.104 0 0 1 5.6-16.208 12.112 12.112 0 0 1 16.208 5.6 12.112 12.112 0 0 1-5.6 16.208 12.104 12.104 0 0 1-16.208-5.6z m5.12-156.328c-38.56-27.528-88.856-34.64-135.424-16.624l127.288 261.744c42.896-25.48 68.32-69.52 70.488-116.8l48.312 3.424a5.008 5.008 0 0 0 5.36-4.696 5 5 0 0 0-4.696-5.36l-48.92-3.496c-0.48-20.6-5.416-41.624-15.24-61.864-9.816-20.184-23.312-37.048-39.216-50.184l27.472-40.664a5.04 5.04 0 0 0-8.32-5.664l-27.104 40.12', fill: '#3DDC84' },
    // 蓝色左臂 + 头部天线
    { d: 'M626.424 534.944c-35.904 17.352-74.52 26.144-114.76 26.144a264.056 264.056 0 0 1-221.024-119.28 12.048 12.048 0 0 0-17.232-3.064l-46.2 34.032a12.16 12.16 0 0 0-2.776 16.624 345.488 345.488 0 0 0 287.232 153.136c52.592 0 103.136-11.504 150.184-34.216l-35.424-73.376zM511.248 245.36h25v-55.232c0-13.8-11.2-25-25-25a25.016 25.016 0 0 0-25 25v55.24h25z', fill: '#4285F4' },
    // 蓝色右臂 + 双腿
    { d: 'M446.184 353.2L274.312 706.936a58.464 58.464 0 0 0-5.904 24.456l-1.024 46.328c-0.24 11.984 13.616 18.736 22.896 11.144l35.784-29.4a58.72 58.72 0 0 0 15.6-19.76l169.4-348.736-64.824-37.712-0.056-0.056zM754.136 731.336a59.384 59.384 0 0 0-5.904-24.464L576.368 353.136l-64.824 37.84 169.4 348.608a59.304 59.304 0 0 0 15.6 19.76l35.784 29.4c9.28 7.592 23.2 0.84 22.896-11.144l-1.024-46.32-0.064 0.056z', fill: '#4285F4' },
    // 深色颈部关节
    { d: 'M511.24 240.968c-41.384 0-75 33.68-75 75 0 41.328 33.68 75 75 75 41.328 0 75-33.68 75-75 0-41.328-33.672-75-75-75z m0 116.264a41.328 41.328 0 0 1-41.264-41.264 41.288 41.288 0 0 1 41.264-41.264 41.288 41.288 0 0 1 41.272 41.264 41.288 41.288 0 0 1-41.272 41.264z', fill: '#073042' },
  ],
}

/** 在 Xcode 中打开：取自官方图标（devicon 128×128）的蓝色锤子——
 * 蓝色锤头 + 深色手柄，保持官方多色造型（直接用原始 1024 viewBox 与配色）。 */
const XCODE_ICON: OpenActionIcon = {
  viewBox: '0 0 1024 1024',
  paths: [
    // 蓝色锤头
    { d: 'M69.024 335.776l86.016 544.8a32 32 0 0 0 36.416 26.624l672.736-102.368a32 32 0 0 0 26.784-36.608L804.96 223.424a32 32 0 0 0-36.416-26.624L95.808 299.168a32 32 0 0 0-26.784 36.608z', fill: '#488CF3' },
    // 深色手柄
    { d: 'M1017.696 233.728l-28.48 106.08a24 24 0 0 1-29.376 16.96l-44-11.744a23.04 23.04 0 0 1-15.104-14.528 64.48 64.48 0 0 0-47.68-35.392c-34.112-9.152-59.904-1.216-64.48 15.84l-9.92 37.024a32 32 0 0 1-39.2 22.624l-123.584-33.056a32 32 0 0 1-22.624-39.168l17.504-65.216a15.584 15.584 0 0 0-11.04-18.944c-85.024-23.872-137.792 28.704-168.512 83.648a16.16 16.16 0 0 1-17.28 7.104l-9.504-2.56a12.16 12.16 0 0 1-8.448-14.976v-0.128c28.448-105.888 163.2-201.152 263.552-174.272l155.104 41.504a23.04 23.04 0 0 1 15.136 14.528 64.48 64.48 0 0 0 47.648 35.392c19.584 7.424 41.6 4.864 58.976-6.848a23.04 23.04 0 0 1 20.352-5.024l44 11.776a24 24 0 0 1 16.96 29.376zM632.32 377.184l73.6 19.712c12.8 3.424 20.512 16.48 17.376 29.376l-109.344 447.136a65.184 65.184 0 0 1-80.128 47.456l-14.72-3.936a65.088 65.088 0 0 1-45.664-81.152l129.088-441.824a24.448 24.448 0 0 1 29.76-16.768z', fill: '#475266' },
  ],
}

/**
 * 在微信开发者工具中打开：取自官方微信图标（devicon 1024 viewBox）的绿色双气泡标志
 * —— 外框 + 双聊天气泡，currentColor 填充（原始坐标系，不缩放）。
 */
const WECHAT_DEVTOOLS_ICON: OpenActionIcon = {
  viewBox: '0 0 1024 1024',
  paths: [
    // 外框 + 底部平台（微信绿 #07C160）
    { d: 'M950.1 797.1H72.8c-13.8 0-25-11.2-25-25V164c0-13.8 11.2-25 25-25h877.3c13.8 0 25 11.2 25 25v608.1c0 13.8-11.2 25-25 25z m-872.3-30h867.3V169H77.8v598.1zM755.9 872H271.3c-14.8 0-26.9-12.1-26.9-26.9 0-14.8 12.1-26.9 26.9-26.9h484.5c14.8 0 26.9 12.1 26.9 26.9 0.1 14.8-12 26.9-26.8 26.9z', fill: '#07C160' },
    // 双聊天气泡（微信绿 #07C160）
    { d: 'M617.9 380.4c6.9 0 13.7 0.5 20.6 1.2-18.4-77.7-110.2-135.4-214.9-135.4-117.1 0-213 72.2-213 164 0 53 31.9 96.5 85.2 130.2l-21.3 58 74.5-33.8c26.6 4.7 48 9.6 74.6 9.6 6.7 0 13.3-0.3 19.9-0.7-4.1-12.9-6.6-26.4-6.6-40.5 0-84.2 79.9-152.6 181-152.6z m-114.5-52.3c16.1 0 26.7 9.6 26.7 24.1 0 14.4-10.6 24.1-26.7 24.1-15.9 0-31.9-9.7-31.9-24.1 0-14.6 16-24.1 31.9-24.1z m-149 48.2c-16 0-32.1-9.7-32.1-24.1 0-14.5 16.1-24.1 32.1-24.1s26.6 9.5 26.6 24.1c0 14.4-10.6 24.1-26.6 24.1z m458 154.4c0-77.1-85.2-139.9-181-139.9-101.4 0-181.1 62.9-181.1 139.9 0 77.3 79.8 139.9 181.1 139.9 21.2 0 42.6-4.8 63.9-9.6l58.4 29-16-48.2c42.8-29.1 74.7-67.6 74.7-111.1z m-239.7-24.1c-10.6 0-21.3-9.5-21.3-19.3 0-9.6 10.7-19.3 21.3-19.3 16.2 0 26.7 9.7 26.7 19.3 0 9.7-10.5 19.3-26.7 19.3z m117.1 0c-10.5 0-21.2-9.5-21.2-19.3 0-9.6 10.6-19.3 21.2-19.3 16 0 26.7 9.7 26.7 19.3 0 9.7-10.6 19.3-26.7 19.3z', fill: '#07C160' },
  ],
}

/** 在 IntelliJ IDEA 中打开：取自官方图标（devicon 1024 viewBox）的多色标志，保持官方配色（不缩放）。 */
const INTELLIJ_IDEA_ICON: OpenActionIcon = {
  viewBox: '0 0 1024 1024',
  paths: [
    { d: 'M301.333333 750.677333l-206.656-162.666666 102.656-190.677334L491.989333 512z', fill: '#F57C00' },
    { d: 'M938.666667 313.344l-16 493.333333L594.666667 938.666667l-197.333334-128 288-298.666667z', fill: '#1E88E5' },
    { d: 'M938.666667 313.344L678.656 620.010667 560 234.666667l113.344-136z', fill: '#2962FF' },
    { d: 'M740.010667 418.666667L496 793.344 154.666667 917.333333l54.677333-192 70.656-237.333333z', fill: '#AB47BC' },
    { d: 'M280 488L85.333333 422.677333 209.344 85.333333l266.666667 32 264 301.333334z', fill: '#E91E63' },
    { d: 'M234.666667 234.666667h533.333333v533.333333H234.666667z', fill: '#000001' },
    { d: 'M298.666667 672h192V704h-192z m138.666666-333.333333V298.666667h-106.666666v40H362.666667v138.666666h-32v40h106.666666v-40h-28.608v-138.666666z m104 184c-40 0-61.248-23.424-69.333333-33.024l30.101333-34.24c5.44 6.016 20.565333 21.930667 39.232 21.930666 24 0 29.333333-24 29.333334-37.333333V298.666667H618.666667v141.333333c0 13.312 0 34.666667-16 56-11.2 14.933333-37.333333 26.666667-61.333334 26.666667z', fill: '#FFFFFF' },
  ],
}

/**
 * 在 DevEco Studio 中打开：取自官方图标（devicon）的 DevEco 标志——斜置四段
 * 「H」造型，currentColor 填充（原始 1024 viewBox，不缩放）。
 */
const DEVECO_STUDIO_ICON: OpenActionIcon = {
  viewBox: '0 0 1024 1024',
  paths: [
    { d: 'M943.157895 635.284211H569.990737v168.650105h273.394526z', fill: '#1296db' },
    { d: 'M615.774316 121.263158H407.403789l-0.458105 0.309895 436.439579 682.361263L943.157895 635.270737z', fill: '#1296db' },
    { d: 'M408.225684 121.263158h208.370527l0.458105 0.309895-436.439579 682.361263L80.842105 635.270737z', fill: '#1296db' },
    { d: 'M80.842105 635.284211h373.167158v168.650105H180.614737z', fill: '#1296db' },
  ],
}

/** WebStorm：取自官方图标（devicon 1024 viewBox）的多色标志，保持官方配色（不缩放）。 */
const WEBSTORM_ICON: OpenActionIcon = {
  viewBox: '0 0 1024 1024',
  paths: [
    { d: 'M0 107.2l137.6 817.6L704 1024 878.4 137.6 568 17.6l-150.4 80L256 1.6 0 107.2z', fill: '#07C3F2' },
    { d: 'M878.4 137.6L704 1024 137.6 924.8 878.4 137.6z', fill: '#C793F3' },
    { d: 'M878.4 137.6L137.6 924.8 0 107.2 256 1.6l161.6 96 150.4-80 310.4 120z', fill: '#0793F3' },
    { d: 'M941.28 144L281.6 355.2 652.8 0l238.4 20.8L941.28 144z', fill: '#FCF84A' },
    { d: 'M912 464l112 209.6L568 944l-187.2-129.6-99.2-459.2L941.28 144 1024 347.2 912 464z', fill: '#0793F3' },
    { d: 'M819.2 297.6L912 464l112-116.8L942.4 144l-123.2 153.6z', fill: '#07C3F2' },
    { d: 'M192 832h640V192H192v640z' },
    { d: 'M566.88 504.48l35.2-42.24a123.84 123.84 0 0 0 80.96 32.8c24.32 0 39.04-9.6 39.04-25.44v-0.8c0-15.04-9.28-22.88-54.56-34.4-54.56-13.92-89.92-29.12-89.92-82.88 0-49.12 39.52-81.76 94.88-81.76a158.08 158.08 0 0 1 100.8 34.24l-31.04 44.96A128 128 0 0 0 672 321.6c-22.88 0-34.88 10.4-34.88 23.68v0.8c0 17.76 11.52 23.68 58.4 35.52 55.04 14.4 85.92 34.08 85.92 81.44 0 53.92-40.96 84-99.52 84a172.48 172.48 0 0 1-114.88-43.2M516.32 272l-39.52 154.88L431.52 272h-44.96l-45.28 154.88L301.92 272H240l75.84 272h49.76l43.52-153.6 42.88 153.6h50.4l75.68-272h-61.76zM256 752h240v-40H256V752z', fill: '#FFFFFF' },
  ],
}

/** PyCharm：取自官方图标（devicon 1024 viewBox）的多色标志，保持官方配色（不缩放）。 */
const PYCHARM_ICON: OpenActionIcon = {
  viewBox: '0 0 1024 1024',
  paths: [
    { d: 'M572.8 579.2h156.8l179.2 49.6 108.8-219.2-299.2-248-145.6 417.6z', fill: '#07C3F2' },
    { d: 'M438.4 0L62.4 156.8 0 819.2l206.4-22.4 147.2-62.4 4.8-105.6L416 323.2 668.8 152 438.4 0z', fill: '#21D789' },
    { d: 'M288 388.8L0 819.2 350.4 1024l94.4-110.4L416 323.2l-128 65.6z', fill: '#FCF84A' },
    { d: 'M761.6 0L448 280h355.2L761.6 0z', fill: '#21D789' },
    { d: 'M464 280l-48 43.2-120 582.4 416 116.8L1024 915.2 896 432l-201.6 78.4L718.4 256 464 280z', fill: '#FCF84A' },
    { d: 'M192 832h640V192H192v640z' },
    { d: 'M256 752h240v-40H256V752zM359.68 409.12A41.12 41.12 0 0 0 405.44 368c0-26.88-17.92-41.12-46.88-41.12h-44.8v83.04zM256 272h107.36c62.72 0 100.64 38.4 100.64 94.08v0.8c0 62.88-47.2 96-106.24 96h-44V544H256z m227.04 136.96a134.72 134.72 0 0 1 138.4-137.12 136.48 136.48 0 0 1 104.48 40.96l-37.12 42.88a97.92 97.92 0 0 0-67.84-29.92A78.56 78.56 0 0 0 544 407.52a78.56 78.56 0 0 0 76.8 83.36 96 96 0 0 0 69.76-31.04l37.12 37.6a135.84 135.84 0 0 1-108.8 48 134.08 134.08 0 0 1-136-136.48', fill: '#FFFFFF' },
  ],
}

/** GoLand：官方「Go」字标图标（单色 path）。 */
const GOLAND_ICON: OpenActionIcon = {
  viewBox: '0 0 1024 1024',
  paths: [
    { d: 'M0 0v1024h1024V0z m288.597333 128a232.448 232.448 0 0 1 166.058667 57.856L396.117333 256.512A155.818667 155.818667 0 0 0 285.696 213.333333c-68.266667 0-121.344 59.733333-121.344 131.413334v1.194666c0 77.312 53.077333 133.973333 128 133.973334a147.968 147.968 0 0 0 87.381333-25.429334V393.728H286.208v-80.213333H469.333333v183.296a274.261333 274.261333 0 0 1-180.394666 67.072c-131.242667 0-221.696-92.330667-221.696-217.258667v-1.194667A216.746667 216.746667 0 0 1 288.597333 128z m445.098667 0c130.218667 0 223.744 97.109333 223.744 217.088v1.194667a218.282667 218.282667 0 0 1-224.938667 218.453333c-130.389333-0.853333-223.914667-97.962667-223.914666-218.112v-1.194667A218.282667 218.282667 0 0 1 733.696 128z m-1.194667 85.333333A126.293333 126.293333 0 0 0 605.866667 344.234667v1.194666a128.341333 128.341333 0 0 0 128 132.778667 126.293333 126.293333 0 0 0 126.464-131.584v-1.194667A128.170667 128.170667 0 0 0 732.501333 213.333333zM96.085333 832h384V896h-384z' },
  ],
}

/** 附加 IDE 的 kind → 专属图标映射；未知 kind 兜底用 IntelliJ 的「I」（不应发生）。 */
function extraOpenIcon(kind: string): OpenActionIcon {
  switch (kind) {
    case 'android-studio': return ANDROID_STUDIO_ICON
    case 'xcode': return XCODE_ICON
    case 'wechat-devtools': return WECHAT_DEVTOOLS_ICON
    case 'intellij-idea': return INTELLIJ_IDEA_ICON
    case 'deveco-studio': return DEVECO_STUDIO_ICON
    case 'webstorm': return WEBSTORM_ICON
    case 'pycharm': return PYCHARM_ICON
    case 'goland': return GOLAND_ICON
    default: return INTELLIJ_IDEA_ICON
  }
}

 /** 三个打开按钮的图标载体（label 在注入时按偏好动态生成）。 */
 const OPEN_ACTIONS: readonly { kind: 'finder' | 'terminal' | 'vscode'; label: string; icon: OpenActionIcon }[] = [
   { kind: 'finder', label: '在 Finder 中打开', icon: FINDER_ICON },
   { kind: 'terminal', label: '在终端中打开', icon: TERMINAL_ICON },
   { kind: 'vscode', label: '在 VSCode 中打开', icon: VSCODE_ICON },
 ]

 /** 创建注入按钮组：分隔线 + 三个按钮，按钮点击后调用 onRequest。 */
 function buildButtonGroup(
  onRequest: (kind: string, path: string) => void,
   path: string,
    labels: readonly { kind: 'finder' | 'terminal' | 'vscode'; label: string; icon: OpenActionIcon }[] = OPEN_ACTIONS,
 ): HTMLElement {
   const group = document.createElement('div')
   group.setAttribute(GROUP_MARK, '')

   const separator = document.createElement('div')
   separator.setAttribute('role', 'separator')
   separator.style.height = '1px'
   separator.style.margin = '4px 2px'
   separator.style.background = 'var(--dsw-alias-border-l1)'
   group.appendChild(separator)

   for (const action of labels) {
     const button = document.createElement('button')
     button.type = 'button'
     button.setAttribute('role', 'menuitem')
     button.setAttribute('data-bga-open-kind', action.kind)
     Object.assign(button.style, itemStyle())
     // 图标容器（16px，颜色 tertiary，与产品 .itemIcon 一致）
     const iconWrap = document.createElement('span')
     iconWrap.style.display = 'inline-flex'
     iconWrap.style.flex = 'none'
     iconWrap.style.width = '16px'
     iconWrap.style.height = '16px'
     iconWrap.style.alignItems = 'center'
     iconWrap.style.justifyContent = 'center'
     iconWrap.style.color = 'var(--dsw-alias-label-tertiary)'
      // 间距由 button 自身的 gap:8px 提供（与产品菜单项一致），勿再加 margin
     iconWrap.appendChild(buildIcon(action.icon))
     button.appendChild(iconWrap)
     // 文本标签占满剩余宽度（对齐产品 .itemLabel，超长省略）
     const label = document.createElement('span')
     label.textContent = action.label
     label.style.flex = '1'
     label.style.minWidth = '0'
     label.style.overflow = 'hidden'
     label.style.textOverflow = 'ellipsis'
     label.style.whiteSpace = 'nowrap'
     button.appendChild(label)
     // hover 高亮与产品菜单项一致
     button.addEventListener('mouseenter', () => {
       button.style.background = 'var(--dsw-alias-interactive-bg-hover)'
     })
     button.addEventListener('mouseleave', () => {
       button.style.background = 'transparent'
     })
     button.addEventListener('click', (event) => {
       event.stopPropagation()
       event.preventDefault()
       onRequest(action.kind, path)
     })
     group.appendChild(button)
   }
   return group
 }


/**
 * 创建「附加 IDE 打开」分组：分隔线 + 每个已开启的附加 IDE 一个按钮。
 * 按钮图标按 kind 取专属图标（尽力贴近各 IDE 官方标志的单色化造型）。
 */
function buildExtraOpenGroup(
  items: readonly { kind: string; label: string }[],
  path: string,
  onRequest: (kind: string, path: string) => void,
): HTMLElement {
  const group = document.createElement('div')
  group.setAttribute(GROUP_MARK, '')

  const separator = document.createElement('div')
  separator.setAttribute('role', 'separator')
  separator.style.height = '1px'
  separator.style.margin = '4px 2px'
  separator.style.background = 'var(--dsw-alias-border-l1)'
  group.appendChild(separator)

  for (const item of items) {
    const button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('role', 'menuitem')
    button.setAttribute('data-bga-open-kind', item.kind)
    Object.assign(button.style, itemStyle())
    const iconWrap = document.createElement('span')
    iconWrap.style.display = 'inline-flex'
    iconWrap.style.flex = 'none'
    iconWrap.style.width = '16px'
    iconWrap.style.height = '16px'
    iconWrap.style.alignItems = 'center'
    iconWrap.style.justifyContent = 'center'
    iconWrap.style.color = 'var(--dsw-alias-label-tertiary)'
    iconWrap.appendChild(buildIcon(extraOpenIcon(item.kind)))
    button.appendChild(iconWrap)
    const label = document.createElement('span')
    label.textContent = item.label
    label.style.flex = '1'
    label.style.minWidth = '0'
    label.style.overflow = 'hidden'
    label.style.textOverflow = 'ellipsis'
    label.style.whiteSpace = 'nowrap'
    button.appendChild(label)
    button.addEventListener('mouseenter', () => {
      button.style.background = 'var(--dsw-alias-interactive-bg-hover)'
    })
    button.addEventListener('mouseleave', () => {
      button.style.background = 'transparent'
    })
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      event.preventDefault()
      onRequest(item.kind, path)
    })
    group.appendChild(button)
  }
  return group
}

 /**
  * 向一个工作区菜单注入打开按钮组（在「重命名」项之前）。
  * 幂等：已注入过的菜单直接跳过；找不到重命名项或非工作区菜单时不注入。
  */
 export function injectOpenButtons(
   menu: Element,
   path: string,
   onRequest: (kind: string, path: string) => void,
   prefs: { terminal?: string; editor?: string } = {},
   openExtra?: { androidStudio?: boolean; xcode?: boolean; wechatDevtools?: boolean; intellijIdea?: boolean; devecoStudio?: boolean; webstorm?: boolean; pycharm?: boolean; goland?: boolean },
   ): boolean {
   if (menu.hasAttribute(INJECTED_MARK)) return false
   if (!isWorkspaceMenu(menu)) return false
   const renameItem = findRenameItem(menu)
   if (renameItem === null || renameItem.parentElement === null) return false
   // 按当前偏好生成按钮文案（如「在 iTerm 中打开」），图标从 OPEN_ACTIONS 按 kind 取
   const labels = openMenuLabels(prefs).map(action => ({
     ...action,
     icon: OPEN_ACTIONS.find(item => item.kind === action.kind)!.icon,
   }))
   // 定位「删除工作区」项：所有打开类分组都插在它之后（菜单尾部下方）
   const deleteItem = findDeleteItem(menu)
   const owner = deleteItem?.parentElement ?? renameItem.parentElement
   if (owner === null) {
     menu.setAttribute(INJECTED_MARK, '')
     return true
   }
   // 1) finder/terminal/vscode 组插在「删除工作区」之后
   const openGroup = buildButtonGroup(onRequest, path, labels)
   owner.insertBefore(openGroup, deleteItem !== null ? deleteItem.nextSibling : null)
   // 2) 附加 IDE 组插在 open 组之后（删除工作区更下方）
   const extraItems = openExtra !== undefined ? extraOpenMenuItems(openExtra) : []
   if (extraItems.length > 0) {
     const extraGroup = buildExtraOpenGroup(extraItems, path, onRequest)
     owner.insertBefore(extraGroup, openGroup.nextSibling)
   }
   menu.setAttribute(INJECTED_MARK, '')
   return true
 }

 /**
  * 安装工作区菜单打开注入器：
  * 1. click 捕获识别工作区「⋯」按钮并记录路径；
  * 2. MutationObserver 观察到工作区菜单出现时注入按钮组；
  * 3. 按钮点击走 fetch 请求宿主 /open 端点。
  * 返回清理函数（随插件卸载调用）。
  */
 /**
  * 读取当前生效的「打开方式」偏好（/config 的 open 字段）。
  * 请求失败或缺省时回退到空串（= 平台默认），保证注入永不中断。
  */
 async function loadOpenPrefs(): Promise<{
   terminal: string
   editor: string
   openExtra?: { androidStudio?: boolean; xcode?: boolean; wechatDevtools?: boolean; intellijIdea?: boolean; devecoStudio?: boolean; webstorm?: boolean; pycharm?: boolean; goland?: boolean }
 }> {
   try {
     const response = await fetch(CONFIG_URL, { cache: 'no-store' })
     if (!response.ok) return { terminal: '', editor: '', openExtra: {} }
     const value = await response.json() as {
       open?: { terminal?: unknown; editor?: unknown }
       openExtra?: { androidStudio?: unknown; xcode?: unknown; wechatDevtools?: unknown; intellijIdea?: unknown; devecoStudio?: unknown; webstorm?: unknown; pycharm?: unknown; goland?: unknown }
     }
     const open = value.open ?? {}
     const openExtra = value.openExtra ?? {}
     return {
       terminal: typeof open.terminal === 'string' ? open.terminal : '',
       editor: typeof open.editor === 'string' ? open.editor : '',
       openExtra: {
         androidStudio: typeof openExtra.androidStudio === 'boolean' ? openExtra.androidStudio : true,
         xcode: typeof openExtra.xcode === 'boolean' ? openExtra.xcode : true,
         wechatDevtools: typeof openExtra.wechatDevtools === 'boolean' ? openExtra.wechatDevtools : true,
         intellijIdea: typeof openExtra.intellijIdea === 'boolean' ? openExtra.intellijIdea : true,
         devecoStudio: typeof openExtra.devecoStudio === 'boolean' ? openExtra.devecoStudio : true,
         webstorm: typeof openExtra.webstorm === 'boolean' ? openExtra.webstorm : true,
         pycharm: typeof openExtra.pycharm === 'boolean' ? openExtra.pycharm : true,
         goland: typeof openExtra.goland === 'boolean' ? openExtra.goland : true,
       },
     }
   } catch {
     return { terminal: '', editor: '', openExtra: {} }
   }
 }

 export function mountWorkspaceOpenMenu(ctx: ClientContext): () => void {
   const workspaces = ctx.workspaces as unknown as IWorkspaces | undefined
   // 最近一次点击的工作区目录路径；菜单出现时用它注入
   let currentPath: string | undefined

   // 点击捕获：工作区「⋯」按钮打开菜单的路径来源。
   // 先解析 aria-label（带工作区显示名），失败时回退到所在行的标题文本。
   const onCaptureClick = (event: MouseEvent): void => {
     const target = event.target
     if (!(target instanceof Element)) return
     const button = target.closest('button[aria-label]')
     if (button === null) return
     const aria = button.getAttribute('aria-label') ?? ''
     let label = workspaceLabelFromAria(aria)
     if (label === undefined) {
       label = workspaceLabelFromRow(button.closest('[role="treeitem"]'))
     }
     // 只有当按钮来自工作区行（解析得出显示名）时才解析路径；
     // 会话「⋯」等其它按钮会清空残留路径，避免误注入到错误菜单。
     if (label === undefined) {
       currentPath = undefined
       return
     }
     const items = workspaces?.list.getSnapshot().items ?? []
     currentPath = resolveWorkspacePath(items, label)
     if (currentPath === undefined) {
       console.warn(`[bga-dsh-workbench] could not resolve workspace path for label "${label}"`)
     }
   }
   document.addEventListener('click', onCaptureClick, true)

  /**
   * 在页面右下角弹出一条轻量 toast（自包含，必要时重复使用同一节点）。
   * 用于把「打开失败 / 未安装」等错误直接呈现给用户，而非只写控制台。
   */
  let toastEl: HTMLDivElement | null = null
  let toastTimer: ReturnType<typeof setTimeout> | undefined
  function showToast(message: string, displayName: string): void {
    if (toastEl === null) {
      toastEl = document.createElement('div')
      toastEl.setAttribute('role', 'status')
      toastEl.style.cssText = [
        'position: fixed',
        'z-index: 2147483647',
        'right: 16px',
        'bottom: 16px',
        'max-width: 360px',
        'padding: 10px 14px',
        'border-radius: 8px',
        'background: #cf222e',
        'color: #ffffff',
        'font: 13px/1.5 -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
        'box-shadow: 0 4px 16px rgba(0,0,0,0.28)',
      ].join(';')
      document.body.appendChild(toastEl)
    }
    toastEl.textContent = `「${displayName}」打开失败：${message}`
    toastEl.style.display = 'block'
    if (toastTimer !== undefined) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      if (toastEl !== null) toastEl.style.display = 'none'
    }, 6000)
  }

  // 请求宿主打开目录；失败时弹 toast 并在控制台给出可读原因
  const requestOpen = (kind: string, path: string): void => {
    void fetch(OPEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, path }),
    }).then(async (response) => {
      const value = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
      if (value?.ok !== true) {
        const reason = value?.error ?? `HTTP ${response.status}`
        console.warn(`[bga-dsh-workbench] open ${kind} ${path} failed:`, reason)
        showToast(reason, openDisplayName(kind))
      }
    }).catch((error: unknown) => {
      const reason = String(error instanceof Error ? error.message : error)
      console.warn(`[bga-dsh-workbench] open ${kind} ${path} failed:`, error)
      showToast(reason, openDisplayName(kind))
    })
  }

   // 菜单出现时注入按钮组（菜单关闭时产品组件会卸载整个节点，无需手动清理）。
   // 注入前异步读取当前偏好，让按钮文案反映用户配置（如「在 iTerm 中打开」）。
   let prefLoading = false // 防抖：同一菜单一次只发一个 /config 请求
   const observer = new MutationObserver(() => {
     if (currentPath === undefined) return
     if (prefLoading) return
     prefLoading = true
     void loadOpenPrefs().then(prefs => {
       prefLoading = false
      if (currentPath === undefined) return // 菜单已关闭或目标已变，放弃注入
       for (const menu of document.querySelectorAll<Element>('[role="menu"]')) {
         injectOpenButtons(menu, currentPath, requestOpen, prefs, prefs.openExtra)
       }
     })
   })
   observer.observe(document.body, { childList: true, subtree: true })

   return () => {
     document.removeEventListener('click', onCaptureClick, true)
     observer.disconnect()
     if (toastTimer !== undefined) clearTimeout(toastTimer)
     if (toastEl !== null) {
       toastEl.remove()
       toastEl = null
     }
   }
 }