 // ============================================================================
 // 文件：ConfettiLayer.tsx —— 「彩带彩纸特效层」组件
 //
 // 职责：
 //   在整轮对话完成时（assistant 回合结束、输出到达末尾）触发彩带彩纸爆炸特效与
 //   庆祝音效。核心机制是 MutationObserver：监听对话流 DOM 的新增节点，识别代表
 //   “整轮完成”的末尾标记（turn-tail），并依据批次内是否出现用户消息/错误等条件
 //   做门控过滤，避免把过程中的增量输出也误当成整轮完成而重复放特效。
 // ============================================================================
 import { useEffect, useRef } from 'react'
 import { runConfettiBurst, type BurstRect } from './confetti.ts'
 import { armConfettiSound, playConfettiSound } from './confetti-sound.ts'

 // 「彩带彩纸特效层」的注入 props：均为可选，方便测试时替换具体实现。
 export interface ConfettiLayerProps {
 
   // 发射彩带特效的函数；默认用 runConfettiBurst。返回值为可提前中断特效的清理函数。
   fire?: typeof runConfettiBurst
 
   // 播放庆祝音效的函数；默认用 playConfettiSound。
   playSound?: () => void
 
   // 异步读取“是否启用音效”的函数；默认从 /config 读取，返回 boolean。
   loadSoundEnabled?: () => Promise<boolean>

   // 异步读取"彩带总开关"的函数；默认从 /config 读取，返回 boolean。
   loadConfettiEnabled?: () => Promise<boolean>

   // 异步读取彩带完整配置（主题/强度/触发时机）的函数；默认从 /config 读取。
   loadConfettiConfig?: () => Promise<ConfettiConfig>
   }

   /** 彩带运行时配置（来自 /config 的 confetti 字段） */
   export interface ConfettiConfig {
   /** 彩带配色主题 */
   theme: 'default' | 'gold' | 'ocean' | 'sakura' | 'neon'
   /** 彩带强度 */
   intensity: 'small' | 'medium' | 'large' | 'epic'
   /** 触发时机 */
   trigger: 'success' | 'every' | 'task'
   }

 // —— 与运行时页面 DOM 约定对应的选择器 ——
 // 对话滚动容器：用于计算彩带爆发区域
 const SCROLL_SELECTOR = '[data-conversation-scroll]'
 
 // 对话流容器：包含一个会话内的全部消息
 const FLOW_SELECTOR = '[data-chat-flow]'
 
 // 单条消息行（每行带唯一的 data-chat-flow-key）
 const ROW_SELECTOR = '[data-chat-flow-key]'
 
 // 整轮完成的“末尾标记”行：出现在一轮最后一条助手输出之后
 const TAIL_SELECTOR = '[data-chat-flow-kind="turn-tail"]'
 
 // 用户消息行
 const USER_SELECTOR = '[data-chat-flow-kind="user"]'
 
 // 错误消息行
 const ERROR_SELECTOR = '[data-chat-flow-kind="turn-error"]'
 
 // 助手逐步输出行
 const ASSISTANT_SELECTOR = '[data-chat-flow-kind="assistant-step"]'
 
 // 用来判定回合“已停止”的文案正则：命中即不庆祝
 const STOPPED_MARKER = /(?:已停止|Stopped)/u
 
 // 配置读取地址（读取彩带音效开关）
 const CONFIG_URL = '/bga-dsh-workbench/config'
  // 「整轮完成」广播事件名：彩带层的其余联动方（如英语学习层）监听它触发自己的庆祝逻辑。
  export const TURN_COMPLETE_EVENT = 'bga-dsh-workbench:turn-complete'
  // 「任务执行完成」广播事件名：监听任务执行结果，触发对应强度的彩带。
  export const TASK_EXECUTION_EVENT = 'bga-dsh-workbench:task-execution'

 // 从后端读取“彩带音效”开关；任何异常（网络错误、接口不存在）都回退返回 true（允许播放）。
 // @returns 是否启用音效
 export async function fetchConfettiSound(): Promise<boolean> {
   try {
     if (typeof fetch === 'undefined') return true // 极端环境下没有 fetch 时默认允许播放
     const response = await fetch(CONFIG_URL, { cache: 'no-store' })
     if (!response.ok) return true
     const value = await response.json() as { confetti?: { sound?: unknown } }
     return typeof value.confetti?.sound === 'boolean' ? value.confetti.sound : true
   } catch {
     return true // 后端不可用：保持默认开启，不阻塞特效播放
   }
 }

 // 从后端读取"彩带总开关"；关闭时不播放特效与音效。
 // @returns 是否启用彩带
 export async function fetchConfettiEnabled(): Promise<boolean> {
   try {
     if (typeof fetch === 'undefined') return true
     const response = await fetch(CONFIG_URL, { cache: 'no-store' })
     if (!response.ok) return true
     const value = await response.json() as { confetti?: { show?: unknown } }
     return typeof value.confetti?.show === 'boolean' ? value.confetti.show : true
   } catch {
     return true
   }
 }

 // 从后端读取彩带完整配置（主题/强度/触发时机）；异常时回退到默认值。
 export async function fetchConfettiConfig(): Promise<ConfettiConfig> {
   const fallback: ConfettiConfig = { theme: 'default', intensity: 'large', trigger: 'success' }
   try {
     if (typeof fetch === 'undefined') return fallback
     const response = await fetch(CONFIG_URL, { cache: 'no-store' })
     if (!response.ok) return fallback
     const value = await response.json() as {
       confetti?: { theme?: unknown; intensity?: unknown; trigger?: unknown }
     }
     const c = value.confetti ?? {}
     const theme = (typeof c.theme === 'string' && ['default', 'gold', 'ocean', 'sakura', 'neon'].includes(c.theme))
       ? (c.theme as ConfettiConfig['theme'])
       : fallback.theme
     const intensity = (typeof c.intensity === 'string' && ['small', 'medium', 'large', 'epic'].includes(c.intensity))
       ? (c.intensity as ConfettiConfig['intensity'])
       : fallback.intensity
     const trigger = (typeof c.trigger === 'string' && ['success', 'every', 'task'].includes(c.trigger))
       ? (c.trigger as ConfettiConfig['trigger'])
       : fallback.trigger
     return { theme, intensity, trigger }
   } catch {
     return fallback
   }
 }

 // 从 MutationRecord 的 addedNodes 中收集“消息行”元素：
 // 节点自身命中行选择器或其后代命中都算，并用 Set 去重，保证同一行只被处理一次。
 function collectRows(added: NodeList): Element[] {
   const rows: Element[] = []
   const seen = new Set<Element>()
   for (const node of added) {
     if (!(node instanceof Element)) continue
     for (const candidate of node.matches(ROW_SELECTOR)
       ? [node, ...node.querySelectorAll<Element>(ROW_SELECTOR)]
       : [...node.querySelectorAll<Element>(ROW_SELECTOR)]) {
       if (!seen.has(candidate)) {
         seen.add(candidate)
         rows.push(candidate)
       }
     }
   }
   return rows
 }

 // 计算彩带爆发区域：优先取对话滚动容器，其次取对话流容器，
 // 返回其相对视口的包围矩形；宽高为 0（尚未布局）时返回 null。
 function burstRect(): BurstRect | null {
   const scope = document.querySelector(SCROLL_SELECTOR) ?? document.querySelector(FLOW_SELECTOR)
   if (scope === null) return null
   const rect = scope instanceof HTMLElement
     ? scope.getBoundingClientRect()
     : { left: 0, top: 0, width: 0, height: 0 }

   if (rect.width <= 0 || rect.height <= 0) return null
   return { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
 }

 // 判断该“末尾标记”是否属于被中途停止的回合：
 // 从它向前回溯，先遇到用户消息、或先遇到“空白/含已停止字样”的助手输出，
 // 都说明上一回合没有正常完成，不应庆祝。
 function isStoppedTurn(tail: Element): boolean {
   const flow = tail.closest(FLOW_SELECTOR)
   if (flow === null) return false
   const rows = flow.querySelectorAll(ROW_SELECTOR)
   let hitTail = false
   for (let i = rows.length - 1; i >= 0; i--) {
     const row = rows[i]!
     if (!hitTail) {
       if (row.isSameNode(tail)) hitTail = true
       continue
     }
 
     if (row.matches(USER_SELECTOR)) return true // 先碰到用户消息：上一轮被打断，算停止
     if (row.matches(ASSISTANT_SELECTOR)) {
       const text = row.textContent ?? ''
       // 助手输出为空或带“已停止”文案：判定该回合确实被用户中途停止
       if (text.trim() === '' || STOPPED_MARKER.test(text)) return true
       return false // 有实际内容：判定为正常完成的回合
     }
   }
   return false
 }

 // 判断该末尾标记是否位于所在对话流的最后一行（确系刚结束的那一轮）。
 function isBottomMost(tail: Element): boolean {
   const flow = tail.closest(FLOW_SELECTOR)
   if (flow === null) return false
   const rowsInFlow = flow.querySelectorAll(ROW_SELECTOR)
   return rowsInFlow.length > 0 && rowsInFlow[rowsInFlow.length - 1].isSameNode(tail)
 }

 // 「彩带彩纸特效层」组件：自身不渲染任何可见 DOM（恒返回 null），
 // 只在“整轮对话完成”时触发彩带爆炸特效与庆祝音效。
 // 通过 props 可注入特效/音效的替代实现（便于测试与自定义）。
 export function ConfettiLayer({
   fire = runConfettiBurst,
   playSound = playConfettiSound,
   loadSoundEnabled = fetchConfettiSound,
   loadConfettiEnabled = fetchConfettiEnabled,
   loadConfettiConfig = fetchConfettiConfig,
   }: ConfettiLayerProps): null {
   const fireRef = useRef(fire)
   fireRef.current = fire
   const playSoundRef = useRef(playSound)
   playSoundRef.current = playSound
   const loadSoundRef = useRef(loadSoundEnabled)
   loadSoundRef.current = loadSoundEnabled
   const loadConfettiRef = useRef(loadConfettiEnabled)
   loadConfettiRef.current = loadConfettiEnabled
   const loadConfigRef = useRef(loadConfettiConfig)
   loadConfigRef.current = loadConfettiConfig

   useEffect(() => {
     // 记录已触发过特效的末尾标记（WeakSet：不产生强引用，GC 友好），避免同一轮被重复庆祝
     const seenTails = new WeakSet<Element>()
     // 是否已经出现过至少一轮“用户消息”（作为可庆祝的软门槛）
     let seenUserRow = false
     // 组件是否已卸载/停止：异步回调（如音效配置加载）用它判断还能否安全操作
     let disposed = false
     // 正在播放中的特效清理函数集合：组件卸载时统一调用以中断所有动画
     const active = new Set<() => void>()

     // 停止观测并中断所有进行中的特效
     const stop = (): void => {
       disposed = true
       observer.disconnect()
       for (const dispose of [...active]) dispose()
       active.clear()
     }

     // 彩带总开关：默认开启；异步读取配置后按结果更新
     let confettiEnabled = true
     void loadConfettiRef.current().then((enabled: boolean) => {
       if (!disposed) confettiEnabled = enabled
     })
     // 音效开关：默认开启；异步读取配置后按结果更新（读取完成前不阻塞特效）
     let soundEnabled = true
     void loadSoundRef.current().then(enabled => {
       if (!disposed) soundEnabled = enabled
     })
     // 彩带完整配置（主题/强度/触发时机）：默认 success + gold-large 行为回退
     let confettiTheme: ConfettiConfig['theme'] = 'gold'
     let confettiIntensity: ConfettiConfig['intensity'] = 'large'
     let confettiTrigger: ConfettiConfig['trigger'] = 'success'
     void loadConfigRef.current().then(config => {
       if (!disposed) {
         confettiTheme = config.theme
         confettiIntensity = config.intensity
         confettiTrigger = config.trigger
       }
     })

     // MutationObserver 核心回调：对话 AI 的输出是逐步 append 到 DOM 的，
     // 每次有新增节点就解析其中的消息行，判断是否有“整轮完成”可以庆祝。
     const observer = new MutationObserver((records) => {
       if (disposed) return
       const rows: Element[] = []
       let batchHasUser = false
       let batchHasError = false
       for (const record of records) {
         for (const row of collectRows(record.addedNodes)) {
           rows.push(row)
           if (row.matches(USER_SELECTOR)) batchHasUser = true
           if (row.matches(ERROR_SELECTOR)) batchHasError = true
         }
       }
       if (rows.length === 0) return

       // 收集“新出现”的末尾标记并把它们记入 seenTails（同一标记只庆祝一次）
       const freshTails = rows.filter(row => row.matches(TAIL_SELECTOR) && !seenTails.has(row))
       for (const tail of freshTails) seenTails.add(tail)

       // —— 门控逻辑 ——
       // 只有当本批次没有新增用户消息、没有错误、且在此之前至少出现过一轮用户消息时，
       // 才允许庆祝。也就是说：只有“用户提问之后的助手完成回合”值得放彩带；
       // 用户正在输入、出现报错或历史里还没有任何用户回合时都直接跳过。
       const gateSkipped = batchHasUser || batchHasError || !seenUserRow
       // 触发时机过滤：
       //   - 'task'：普通对话回合不撒彩带（交由任务执行事件处理）
       //   - 'every'：每一轮都庆祝（忽略错误门控）
       //   - 'success'：仅成功回合庆祝（错误时不庆祝，沿用原有门控）
       let eligible: Element[] = []
       if (confettiTrigger === 'task') {
         eligible = []
       } else if (confettiTrigger === 'every') {
         eligible = gateSkipped
           ? []
           : freshTails.filter(tail => isBottomMost(tail) && !isStoppedTurn(tail))
       } else {
         eligible = !gateSkipped
           ? freshTails.filter(tail => isBottomMost(tail) && !isStoppedTurn(tail))
           : []
       }

       // 有合格回合完成：计算爆发区域、发射特效；若特效返回清理函数则登记到 active
       if (eligible.length > 0 && confettiEnabled) {
         const rect = burstRect()
         if (rect !== null) {
           const disposeBurst = fireRef.current(rect, { theme: confettiTheme, intensity: confettiIntensity })
           if (typeof disposeBurst === 'function') active.add(disposeBurst)
            // 通知同源庆祝方：整轮对话完成（英语学习层据此触发一轮答题）
            window.dispatchEvent(new CustomEvent(TURN_COMPLETE_EVENT))

            // 音效开启时同步播放庆祝音效
            if (soundEnabled) playSoundRef.current()
         }
       }

       // 本批次出现过用户消息则记下“见过用户回合”，放开后续批次的庆祝门槛
       if (batchHasUser) seenUserRow = true
     })
     // 监听全页面节点新增（AI 输出是逐步 append 的，处理子级变化即可）
     observer.observe(document.body, { childList: true, subtree: true })
     // 挂载全局手势监听，用于预热/解锁 AudioContext（浏览器自动播放策略）
     const disarmSound = armConfettiSound()
     // 监听任务执行完成事件：根据执行结果触发不同强度的彩带
     const onTaskExecution = (e: Event): void => {
       const detail = (e as CustomEvent).detail as { outcome?: string } | undefined
       const rect = burstRect()
       if (rect === null) return
       if (detail?.outcome === 'succeeded') {
         const dispose = fireRef.current(rect, { intensity: confettiIntensity, theme: confettiTheme })
         if (typeof dispose === 'function') active.add(dispose)
         if (soundEnabled) playSoundRef.current()
       } else if (detail?.outcome === 'failed') {
         const dispose = fireRef.current(rect, { intensity: 'small', theme: 'default' })
         if (typeof dispose === 'function') active.add(dispose)
       }
     }
     window.addEventListener(TASK_EXECUTION_EVENT, onTaskExecution)
     return () => {
       // 卸载清理：先解除手势监听，再停止观测并中断所有特效
       window.removeEventListener(TASK_EXECUTION_EVENT, onTaskExecution)
       disarmSound()
       stop()
     }
   }, [])

   return null
 }