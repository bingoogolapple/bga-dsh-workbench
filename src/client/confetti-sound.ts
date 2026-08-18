 // ============================================================================
 // 文件：confetti-sound.ts —— 彩带庆祝音效（Web Audio API 合成）
 //
 // 职责：
 //   不依赖任何音频文件，纯靠 Web Audio API 实时合成一段“爆裂声 + 上行琶音”的
 //   庆祝音效：
 //     (1) 一段随机白噪声经低通滤波与快速增益包络，模拟彩带“嘭”的爆裂；
 //     (2) 四个按音阶排列的三角波短音（C5→E5→G5→C6）模拟华丽的上升音。
 //   同时处理浏览器“自动播放策略”限制：先挂载手势监听，用户一旦点击/按键就尝试
 //   唤醒 AudioContext，使得之后播放音效不会被浏览器静音拦截。
 // ============================================================================
 // 页面级共享的 AudioContext 单例：整个插件只创建一个音频上下文，
 // 避免同时存在多个上下文导致浏览器资源竞争与性能开销。
 let sharedContext: AudioContext | undefined
 
 // 惰性获取共享 AudioContext：环境不支持或创建失败时返回 undefined（调用方安全跳过）。
 function ensureContext(): AudioContext | undefined {
   if (typeof AudioContext === 'undefined') return undefined
   if (sharedContext === undefined) {
     try {
       sharedContext = new AudioContext()
     } catch {
       // 某些环境（隐私模式 / 旧版浏览器）创建会抛错：静默降级为“无音效”
       return undefined
     }
   }
   return sharedContext
 }
 
 // 解除浏览器对 AudioContext 的自动播放限制：处于 suspended（等待手势）时尝试恢复。
 function unlockConfettiAudio(): void {
   const context = ensureContext()
   if (context === undefined) return
   if (context.state === 'suspended') void context.resume()
 }
 
 // 注册全局手势监听以“解锁”音频：用户在页面上的首次点击/按键会尝试唤醒 AudioContext，
 // 之后 playConfettiSound 播放的音效才不会因自动播放策略被拦截。
 // @returns 清理函数：移除这些监听（组件卸载时调用）
 export function armConfettiSound(): () => void {
   const onGesture = (): void => { unlockConfettiAudio() }
   window.addEventListener('pointerdown', onGesture)
   window.addEventListener('keydown', onGesture)
   return () => {
     window.removeEventListener('pointerdown', onGesture)
     window.removeEventListener('keydown', onGesture)
   }
 }
 
 // 播放庆祝音效：纯 Web Audio 合成，无外部音频文件。结构分两层，最后都汇入 master 总增益：
 //   1. “爆裂声”——0.08 秒白噪声经低通滤波（3kHz→700Hz）快速衰减，模拟“嘭”声；
 //   2. “琶音”——C5/E5/G5/C6 四个三角波短音，每 70ms 依次奏响，营造上升的庆祝感。
 // @param context 可传入自定义 AudioContext（测试用）；缺省用共享单例
 export function playConfettiSound(context?: AudioContext): void {
   const ctx = context ?? ensureContext()
   if (ctx === undefined) return
   // 若上下文仍处于 pending（未激活），先恢复运行
   if (ctx.state === 'suspended') void ctx.resume()
   const now = ctx.currentTime
 
   // 总增益节点：起始极小值→0.35 极快爬升→约 1.1 秒后指数衰减到静音，控制整段音效音量
   const master = ctx.createGain()
   master.gain.setValueAtTime(0.0001, now)
   master.gain.exponentialRampToValueAtTime(0.35, now + 0.02)
   master.gain.exponentialRampToValueAtTime(0.0001, now + 1.1)
   master.connect(ctx.destination)
 
   // 生成 0.08 秒的白噪声缓冲（样本值线性递减形成衰减包络），作为爆裂音素材
   const popLength = Math.floor(ctx.sampleRate * 0.08)
   const popBuffer = ctx.createBuffer(1, popLength, ctx.sampleRate)
   const popData = popBuffer.getChannelData(0)
   for (let index = 0; index < popData.length; index += 1) {
     popData[index] = (Math.random() * 2 - 1) * (1 - index / popData.length)
   }
   const noise = ctx.createBufferSource()
   noise.buffer = popBuffer
   // 低通滤波器：频率从 3kHz 滑到 700Hz，让噪声听感从“脆”变“闷”，更像彩带爆开的尾音
   const lowpass = ctx.createBiquadFilter()
   lowpass.type = 'lowpass'
   lowpass.frequency.setValueAtTime(3000, now)
   lowpass.frequency.exponentialRampToValueAtTime(700, now + 0.08)
   const popGain = ctx.createGain()
   popGain.gain.setValueAtTime(0.3, now)
   popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)
   noise.connect(lowpass).connect(popGain).connect(master)
 
   // 上行琶音音高：C5、E5、G5、C6（频率单位 Hz）
   const notes = [523.25, 659.25, 783.99, 1046.5]
   for (const [index, frequency] of notes.entries()) {
     const start = now + index * 0.07 // 每个音相隔 70ms 依次奏响
     const oscillator = ctx.createOscillator()
     oscillator.type = 'triangle' // 三角波：柔和明亮，适合庆祝氛围
     oscillator.frequency.setValueAtTime(frequency, start)
     const noteGain = ctx.createGain()
     noteGain.gain.setValueAtTime(0.0001, start)
     noteGain.gain.exponentialRampToValueAtTime(0.4, start + 0.02)
     noteGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45)
     oscillator.connect(noteGain).connect(master)
     oscillator.start(start)
     oscillator.stop(start + 0.5)
   }
 
   // 最后启动噪声源（爆裂声与琶音叠加播放）
   noise.start(now)
 }