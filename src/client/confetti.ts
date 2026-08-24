 // ============================================================================
 // 文件：confetti.ts —— 彩带彩纸粒子特效（Canvas 实现）
 //
 // 职责：
 //   用 Canvas + requestAnimationFrame 在指定区域内播放一场“彩带爆炸”粒子动画：
 //   每个粒子做带重力（竖直加速）、空气阻力（速度指数衰减）、横向摆动与自转的
 //   抛物运动，寿命结束时淡出消失。对外只暴露 runConfettiBurst()，
 //   它返回一个可提前终止动画并回收画布的清理函数。
 // ============================================================================
 // 彩带爆发区域：以像素为单位、相对于视口（viewport）的包围矩形。
 export interface BurstRect {
   /** 区域左边缘（视口坐标系） */
   readonly left: number
   /** 区域上边缘（视口坐标系） */
   readonly top: number
   /** 区域宽度（px） */
   readonly width: number
   /** 区域高度（px） */
   readonly height: number
 }

 // 动画时钟抽象：把“时间来源 / 帧调度 / 随机数”做成可注入接口，
 // 便于在测试环境中用假时钟确定性驱动动画，而不依赖真实浏览器环境。
 export interface BurstClock {
 
   /** 返回当前时间（毫秒） */
   now: () => number
 
   /** 注册下一帧回调，返回帧 id */
   raf: (callback: (timestamp: number) => void) => number
 
   /** 取消已注册的帧回调 */
   cancelRaf: (id: number) => void
 
   /** 随机数发生器（默认 Math.random）；注入固定实现可获得可复现的动画 */
   random?: () => number
 }

 // 单个粒子的运动学状态（内部数据结构，不对外导出）：
 //   - round = true 时是圆形碎片，否则是长条纸屑；
 //   - 只读字段在生成时确定（颜色/尺寸/最大寿命/摆动频率）；
 //   - 可变字段每帧更新（位置/速度/旋转/摆动相位/寿命）。
 interface Particle {
   /** true=圆形碎片 / false=长条纸屑 */
   readonly round: boolean
   /** 粒子颜色（取自调色板） */
   readonly color: string
   /** 粒子宽度（圆形为直径 / 条状为厚度） */
   readonly width: number
   /** 粒子高度（圆形为直径 / 条状为长度） */
   readonly height: number
   /** 最大存活时长（秒）：超过后粒子淡出并消亡 */
   readonly maxLife: number
   /** 横向摆动的角速度（弧度/秒） */
   readonly swaySpeed: number
   /** 水平位置（画布坐标，px） */
   x: number
   /** 垂直位置（画布坐标，px） */
   y: number
   /** 水平速度（px/秒） */
   vx: number
   /** 垂直速度（px/秒；重力每帧叠加在它上面） */
   vy: number
   /** 当前旋转角（弧度） */
   rotation: number
   /** 旋转角速度（弧度/秒） */
   vr: number
   /** 摆动相位偏移（弧度）：决定粒子在摆动循环中的起步位置 */
   swayPhase: number
   /** 已存活时长（秒） */
   life: number
 }

 // 彩带强度：控制粒子数量与动画规模
 export type ConfettiIntensity = 'small' | 'medium' | 'large' | 'epic'

 // 彩带主题：不同场景的配色方案
 export type ConfettiTheme = 'default' | 'gold' | 'ocean' | 'sakura' | 'neon'

 // 主题配色表
 const THEME_COLORS: Record<ConfettiTheme, readonly string[]> = {
   default: ['#0070f3', '#111111', '#f5f5f5', '#00d4ff', '#ff0080', '#ffbd00', '#7928ca', '#34d399'],
   gold: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B', '#FFF8DC', '#FFE4B5', '#FFEFD5'],
   ocean: ['#006994', '#00B4D8', '#48CAE4', '#90E0EF', '#023E8A', '#0077B6', '#ADE8F4', '#CAF0F8'],
   sakura: ['#FFB7C5', '#FF69B4', '#FF1493', '#C71585', '#DB7093', '#FFF0F5', '#FFE4E1', '#FFC0CB'],
   neon: ['#FF00FF', '#00FF00', '#FF3300', '#00FFFF', '#FFFF00', '#FF00AA', '#00FF88', '#FF6600'],
 }

 // 强度系数表：粒子数量倍率
 const INTENSITY_MULTIPLIER: Record<ConfettiIntensity, number> = {
   small: 0.4,
   medium: 1,
   large: 2,
   epic: 3.5,
 }

 // 重力加速度（px/秒²）：数值越大粒子下落越快
 const GRAVITY = 880
 // 空气阻力系数（单位：每秒）：通过 Math.exp(-DRAG_PER_SECOND * dt) 对速度做指数衰减
 const DRAG_PER_SECOND = 0.42

 // 动画总时长上限（毫秒）：超过后强制结束，兜底防止动画无限运行
 const MAX_DURATION_MS = 3200

 // 淡出时长（秒）：粒子寿命剩余最后 0.35 秒时透明度线性过渡到 0
 const FADE_SECONDS = 0.35

 // 浏览器环境的默认时钟实现：performance.now 提供高精度时间，rAF 提供帧调度
 const BROWSER_CLOCK: BurstClock = {
   now: () => performance.now(),
   raf: callback => window.requestAnimationFrame(callback),
   cancelRaf: id => window.cancelAnimationFrame(id),
 }

 // 在 [min, max] 区间内按均匀分布取一个随机数
 function randomBetween(random: () => number, min: number, max: number): number {
   return min + random() * (max - min)
 }

 // 生成 count 个初始粒子：全部从爆发区域顶部附近“喷出”，
 // 初始速度方向大致朝上（-π/2 为绝对向上）并在左右 ±1.15 弧度内散开。
 function spawnParticles(rect: BurstRect, count: number, random: () => number, colors: readonly string[]): Particle[] {
 
   const originX = rect.width / 2 // 爆发原点：水平方向取区域中线
   const originY = Math.max(rect.height * 0.25, 88) // 垂直方向取高度 1/4 处，至少 88px 避免过矮区域贴顶
   const particles: Particle[] = []
   for (let index = 0; index < count; index += 1) {
 
     // 朝上方喷射并叠加随机的横向扩散角；初速在 360~860 px/s 之间随机
     const angle = -Math.PI / 2 + randomBetween(random, -1.15, 1.15)
     const speed = randomBetween(random, 360, 860)
     const round = random() < 0.28 // 约 28% 概率生成圆形碎片，其余为长条纸屑
     particles.push({
       round,
       color: colors[Math.floor(random() * colors.length)],
       width: round ? randomBetween(random, 4, 7) : randomBetween(random, 5, 9),
       height: round ? randomBetween(random, 4, 7) : randomBetween(random, 12, 20),
       maxLife: randomBetween(random, 1.6, 2.4),
       swaySpeed: randomBetween(random, 3, 7),
       x: originX,
       y: originY,
       // 水平分速度再叠 ±15% 随机波动，让喷射更有层次；垂直分速度即初速的竖直投影
       vx: Math.cos(angle) * speed * randomBetween(random, 0.6, 1.15),
       vy: Math.sin(angle) * speed,
       rotation: randomBetween(random, 0, Math.PI * 2),
       vr: randomBetween(random, -9, 9),
       swayPhase: randomBetween(random, 0, Math.PI * 2),
       life: 0,
     })
   }
   return particles
 }

 // 在指定区域内播放一场彩带爆炸特效。
 // @param rect    爆发区域（视口坐标，像素）
 // @param options 可选参数：count 为粒子数量（默认 180）；intensity 控制规模；theme 控制配色
 // @returns 清理函数：调用后立即终止动画并移除画布元素
 export function runConfettiBurst(
   rect: BurstRect,
   options: Partial<BurstClock> & { count?: number; intensity?: ConfettiIntensity; theme?: ConfettiTheme } = {},
 ): () => void {
   const intensity = options.intensity ?? 'medium'
   const theme = options.theme ?? 'default'
   const baseCount = options.count ?? 180
   const count = Math.round(baseCount * INTENSITY_MULTIPLIER[intensity])
   // 组装时钟：未注入的字段回退到浏览器默认实现（Math.random / performance.now / rAF）
   const clock: BurstClock = {
     random: options.random ?? Math.random,
     now: options.now ?? BROWSER_CLOCK.now,
     raf: options.raf ?? BROWSER_CLOCK.raf,
     cancelRaf: options.cancelRaf ?? BROWSER_CLOCK.cancelRaf,
   }
   // 空区域（宽或高 <= 0）时不做任何事：返回空清理函数以保持调用方接口一致
   const disposeImmediately = (): void => {  }
   if (rect.width <= 0 || rect.height <= 0) return disposeImmediately

   // 画布在爆发区域四周扩展一圈（上 96 / 左右 48 / 下 24），
   // 给飞出去的粒子预留可视空间，避免一出区域就被裁剪。
   const PAD_TOP = 96
   const PAD_SIDE = 48
   const PAD_BOTTOM = 24
   const surfaceWidth = rect.width + PAD_SIDE * 2
   const surfaceHeight = rect.height + PAD_TOP + PAD_BOTTOM
   const canvas = document.createElement('canvas')
   canvas.width = Math.ceil(surfaceWidth)
   canvas.height = Math.ceil(surfaceHeight)
   // 画布以 fixed 覆盖在页面最顶层：zIndex 取最大整数值，pointer-events:none 保证绝不拦截鼠标
   canvas.style.position = 'fixed'
   canvas.style.left = `${rect.left - PAD_SIDE}px`
   canvas.style.top = `${rect.top - PAD_TOP}px`
   canvas.style.width = `${surfaceWidth}px`
   canvas.style.height = `${surfaceHeight}px`
   canvas.style.zIndex = '2147483647'
   canvas.style.pointerEvents = 'none'
   canvas.setAttribute('data-bga-confetti', '')
   const context = canvas.getContext('2d')
   // 拿不到 2D 绘图上下文（如极端环境）则直接放弃
   if (context === null) return disposeImmediately
   document.body.appendChild(canvas)

   const particles = spawnParticles(rect, count, clock.random as () => number, THEME_COLORS[theme])
   let running = true // 动画是否仍在运行
   let frameId = 0 // 当前待执行的 rAF 帧 id
   let lastTime: number | undefined // 上一帧的时间戳（毫秒），用于计算帧间隔 dt
   const startTime = clock.now() // 动画启动时间（毫秒）

   // 终止动画：取消待执行帧并把画布从页面移除；running 标志保证幂等（只清理一次）
   const stop = (): void => {
     if (!running) return
     running = false
     clock.cancelRaf(frameId)
     canvas.remove()
   }

   // —— 粒子物理模拟：每一帧的运动更新 ——
   // dt 为距上一帧的秒数（clamp 到 [0, 0.05]），保证帧率波动或卡顿时动画依然平滑稳定。
   const frame = (timestamp: number): void => {
     if (!running) return
     const nowMs = clock.now()
     const elapsed = nowMs - startTime
     if (elapsed >= MAX_DURATION_MS) { // 超过总时长上限：兜底强制结束
       stop()
       return
     }
     // 首帧无上一帧时间，按 60fps 估算 0.016s；后续帧按真实时间差计算并做上下限钳制
     const dt = lastTime === undefined ? 0.016 : Math.min(0.05, Math.max(0, (nowMs - lastTime) / 1000))
     lastTime = nowMs
     void timestamp
     // 空气阻力：速度按指数衰减，dt 越大本帧阻力越明显
     const drag = Math.exp(-DRAG_PER_SECOND * dt)

     context.clearRect(0, 0, canvas.width, canvas.height)
     context.save()

     // 平移坐标系：粒子坐标以爆发区域（不含 padding）为基准，
     // 绘制时整体偏移回画布原点，保证与页面的 fixed 定位一致。
     context.translate(-PAD_SIDE, -PAD_TOP)
     let alive = 0 // 本帧仍然存活的粒子数
     // 逐粒子更新：寿命累加 → 超龄跳过 → 重力与阻力叠加 → 摆动相位推进 → 位移与旋转
     for (const particle of particles) {
       particle.life += dt
       if (particle.life >= particle.maxLife) continue // 寿命耗尽：该粒子“死亡”，跳过绘制
       alive += 1
       particle.vy += GRAVITY * dt // 重力：垂直速度每帧累加一个增量
       particle.vx *= drag // 阻力：水平速度指数衰减
       particle.vy *= drag // 阻力：垂直速度指数衰减
       particle.swayPhase += particle.swaySpeed * dt // 摆动相位随时间推进
       // 水平位移 = 惯性位移 + 正弦摆动量（幅度 26px），使纸屑飘落时左右摇曳
       particle.x += particle.vx * dt + Math.sin(particle.swayPhase) * 26 * dt
       particle.y += particle.vy * dt
       particle.rotation += particle.vr * dt // 自转

       // 淡出：剩余寿命少于 FADE_SECONDS 秒时，透明度按剩余比例线性降至 0
       const remaining = particle.maxLife - particle.life
       context.globalAlpha = remaining < FADE_SECONDS ? Math.max(0, remaining / FADE_SECONDS) : 1
       context.fillStyle = particle.color
       // 移动到粒子位置并旋转后绘制：圆形画弧填充，条状画中心锚定的矩形
       context.save()
       context.translate(particle.x, particle.y)
       context.rotate(particle.rotation)
       if (particle.round) {
         context.beginPath()
         context.arc(0, 0, particle.width / 2, 0, Math.PI * 2)
         context.fill()
       } else {
         context.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height)
       }
       context.restore()
     }
     context.restore()
     context.globalAlpha = 1 // 恢复默认不透明度，避免影响后续帧

     // 还有存活粒子则调度下一帧，否则结束动画并回收画布
     if (alive > 0) {
       frameId = clock.raf(frame)
     } else {
       stop()
     }
   }

   // 启动第一帧
   frameId = clock.raf(frame)
   return stop
 }