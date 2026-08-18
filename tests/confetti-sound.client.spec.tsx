// ============================================================
 // confetti-sound.client.spec.tsx —— 完成回合庆祝音效测试
 // ============================================================
 // 测试对象：src/client/confetti-sound.ts 导出的
 //   - playConfettiSound：基于 Web Audio API 合成发射“砰”声与上行琶音；
 //   - armConfettiSound：注册浏览器手势监听（pointerdown / keydown），
 //     为后续播放解锁音频上下文，并返回可销毁监听器的 dispose 函数。
 // 覆盖范围：
 //   - 无 Web Audio（jsdom 默认环境）时静默降级、不抛异常；
 //   - 在注入的假 AudioContext 上正确创建振荡器/缓冲节点并连接、播放；
 //   - 挂起（suspended）的上下文在播放前先 resume；
 //   - 手势监听只注册一次，dispose 后全部移除。
 // 测试环境：vitest（jsdom）。
 import { afterEach, describe, expect, it, vi } from 'vitest'
 import { armConfettiSound, playConfettiSound } from '../src/client/confetti-sound.ts'

 // 假音频节点：记录对 Web Audio 接口的调用，便于后续断言
 interface FakeNode {
   connect: ReturnType<typeof vi.fn>
   gain?: { setValueAtTime: ReturnType<typeof vi.fn>; exponentialRampToValueAtTime: ReturnType<typeof vi.fn> }
   frequency?: { setValueAtTime: ReturnType<typeof vi.fn>; exponentialRampToValueAtTime: ReturnType<typeof vi.fn> }
   type?: string
   buffer?: unknown
   start?: ReturnType<typeof vi.fn>
   stop?: ReturnType<typeof vi.fn>
 }

 // 构造一个最小可用的假 AudioContext：每次工厂方法创建的节点都会记录到
 // nodes 数组，从而可以统一检查节点的连接与播放行为。
 function fakeContext(): { context: unknown; nodes: FakeNode[] } {
   const nodes: FakeNode[] = []
   // 参数对象：暴露 gain / frequency 常用的两个音量包络方法
   const param = () => ({ setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() })
   // 创建并记录一个假节点；connect 返回自身以模拟音频图链式调用
   const node = (): FakeNode => {
     const n: FakeNode = { connect: vi.fn() }
     n.connect = vi.fn(() => n)
     nodes.push(n)
     return n
   }
   const context = {
     destination: { id: 'destination' }, // 输出目标，用于断言节点最终连接到它
     sampleRate: 44100,
     currentTime: 0,
     state: 'running',
     resume: vi.fn(() => Promise.resolve()), // 播放前可被调用的恢复函数
     createGain: vi.fn(() => {
       const n = node()
       n.gain = param()
       return n
     }),
     createOscillator: vi.fn(() => {
       const n = node()
       n.type = ''
       n.frequency = param()
       n.start = vi.fn()
       n.stop = vi.fn()
       return n
     }),
     createBiquadFilter: vi.fn(() => {
       const n = node()
       n.type = ''
       n.frequency = param()
       return n
     }),
     createBuffer: vi.fn(() => ({ getChannelData: vi.fn(() => new Float32Array(100)) })),
     createBufferSource: vi.fn(() => {
       const n = node()
       n.buffer = null
       n.start = vi.fn()
       return n
     }),
   }
   return { context, nodes }
 }

 // 恢复所有被 vi.fn / vi.spyOn 替换的实现，避免状态泄露到其他用例
 afterEach(() => {
   vi.restoreAllMocks()
 })

 // playConfettiSound：在 Web Audio 上下文中合成实际音效的行为
 describe('playConfettiSound', () => {
   // jsdom 环境没有 Web Audio API，函数应静默降级而不是抛出异常
   it('no-ops without Web Audio (jsdom default) instead of throwing', () => {
     expect(() => playConfettiSound()).not.toThrow()
   })

   // 在注入的假上下文上合成“发射爆响 + 上行琶音”：
   // 应创建多个振荡器（琶音音符）、一个缓冲源（爆响噪声）等节点并连接播放
   it('synthesizes the launch pop and the rising arpeggio on an injected context', () => {
     const { context, nodes } = fakeContext()
     playConfettiSound(context as never)

     // 琶音由 4 个振荡器组成
     expect((context as { createOscillator: ReturnType<typeof vi.fn> }).createOscillator).toHaveBeenCalledTimes(4)
     // 爆响噪声由一个 BufferSource 承担
     expect((context as { createBufferSource: ReturnType<typeof vi.fn> }).createBufferSource).toHaveBeenCalledTimes(1)
     expect((context as { createBuffer: ReturnType<typeof vi.fn> }).createBuffer).toHaveBeenCalledTimes(1)

     // 断言至少有一个节点被连接到 destination（构成最终播放链路）
     const connectedToDestination = nodes.some(node =>
       node.connect.mock.calls.some(([target]) => target === (context as { destination: unknown }).destination))
     expect(connectedToDestination).toBe(true)

     // 断言至少有 5 个节点被调用过 start（振荡器 + 缓冲源开始发声）
     const started = nodes.filter(node => node.start !== undefined && node.start.mock.calls.length > 0)
     expect(started.length).toBeGreaterThanOrEqual(5)

     // 所有带 gain 的节点都应做过指数衰减（音量渐弱收尾）
     for (const node of nodes) {
       if (node.gain !== undefined) expect(node.gain.exponentialRampToValueAtTime).toHaveBeenCalled()
     }
   })

   // 播放前应先把挂起的音频上下文恢复为 running，否则浏览器可能忽略发声
   it('resumes a suspended context before playing', () => {
     const { context } = fakeContext()
     ;(context as { state: string }).state = 'suspended'
     playConfettiSound(context as never)
     expect((context as { resume: ReturnType<typeof vi.fn> }).resume).toHaveBeenCalled()
   })
 })

 // armConfettiSound：注册/注销鼠标与键盘手势监听
 describe('armConfettiSound', () => {
   // 监听只注册一次（pointerdown + keydown），dispose 后全部移除
   it('registers one-time gesture listeners and removes them on dispose', () => {
     const addSpy = vi.spyOn(window, 'addEventListener')
     const removeSpy = vi.spyOn(window, 'removeEventListener')
     const dispose = armConfettiSound()
     expect(addSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function))
     expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
     dispose()
     expect(removeSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function))
     expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
   })
 })