// ============================================================
 // confetti.client.spec.tsx —— 完成回合彩带彩纸特效测试
 // ============================================================
 // 测试对象：
 //   - src/client/ConfettiLayer.tsx 的 ConfettiLayer 组件：监视对话消息流，
 //     在“完整回合结束”时触发彩带爆发（fire），并按配置门控音效；
 //   - ConfettiLayer.tsx 的 fetchConfettiSound：读取彩带音效开关配置；
 //   - src/client/confetti.ts 的 runConfettiBurst：Canvas 彩带动画引擎本体。
 // 覆盖范围：
 //   - 活回合结束（出现 turn-tail 且满足完成条件）触发且只触发一次彩带；
 //   - 历史渲染、错误回合、被停止回合、尾行重复移动/重渲染等不误触发；
 //   - 音效开关门控：开启播放、关闭静默、配置读取失败默认开启；
 //   - 彩带动画的开始、结束清理与 dispose 取消。
 // 测试环境：vitest + @testing-library/react（jsdom）。
 import { cleanup, render } from '@testing-library/react'
 import { afterEach, describe, expect, it, vi } from 'vitest'
 import { ConfettiLayer, fetchConfettiSound } from '../src/client/ConfettiLayer.tsx'
 import { runConfettiBurst, type BurstRect } from '../src/client/confetti.ts'

 // 假定的消息列表可视区域矩形，彩带触发时应把该矩形上报给 fire 回调
 const RECT: BurstRect = { left: 10, top: 20, width: 500, height: 400 }

 // 等待一个宏任务，让 MutationObserver 有机会处理新追加的 DOM
 function flush(): Promise<void> {
   return new Promise(resolve => setTimeout(resolve, 0))
 }

 // 搭建一个假的对话容器：scroll 带 data-conversation-scroll，
 // 并 stub 其 getBoundingClientRect 返回固定可视区（与 RECT 一致）
 function mountChat(): { scroll: HTMLDivElement; flow: HTMLDivElement } {
   const scroll = document.createElement('div')
   scroll.setAttribute('data-conversation-scroll', '')
   Object.defineProperty(scroll, 'getBoundingClientRect', {
     value: () => ({
       left: RECT.left, top: RECT.top, width: RECT.width, height: RECT.height,
       right: RECT.left + RECT.width, bottom: RECT.top + RECT.height, x: RECT.left, y: RECT.top,
       toJSON: () => ({}),
     }),
   })
   const flow = document.createElement('div')
   flow.setAttribute('data-chat-flow', '')
   scroll.appendChild(flow)
   document.body.appendChild(scroll)
   return { scroll, flow }
 }

 // 创建一个对话内容行（seat）元素，带 kind 与唯一 key 属性
 function seat(kind: string, key: string): HTMLDivElement {
   const el = document.createElement('div')
   el.setAttribute('data-chat-flow-key', key)
   el.setAttribute('data-chat-flow-kind', kind)
   return el
 }

 // 模拟一个完整回合：追加用户气泡并等待一次 flush，
 // 再追加 assistant-step 回复行（可自定义文案，默认“回复 n”），再次 flush
 async function startTurn(flow: HTMLElement, n: number, replyText = `回复 ${n}`): Promise<void> {
   flow.append(seat('user', `u${n}`))
   await flush()
   const reply = seat('assistant-step', `a${n}`)
   reply.textContent = replyText
   flow.append(reply)
   await flush()
 }

 // 每个用例结束后卸载组件并清理对话容器，避免影响后续用例
 afterEach(() => {
   cleanup()
   for (const scroll of document.querySelectorAll('[data-conversation-scroll]')) scroll.remove()
 })

 // ------ ConfettiLayer 回合监视行为 ------
 describe('ConfettiLayer watcher', () => {
   // 一次完整活回合结束后，应以消息列表矩形触发一次彩带
   it('fires once with the message-list rect for a live completed turn', async () => {
     const fire = vi.fn(() => () => {}) // fire 返回清理函数，模拟上层拿到清理句柄
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     await startTurn(flow, 1)
     flow.append(seat('turn-tail', 't1')) // 追加回合尾行，向监视器发出“回合已结束”信号
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(1))
     // 上报参数应等于消息列表的可视矩形 RECT
     expect(fire).toHaveBeenCalledWith(RECT)
   })

   // 后续每个完整回合都应再次触发彩带（每回合各庆祝一次）
   it('fires again for each subsequent completed turn', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     await startTurn(flow, 1)
     flow.append(seat('turn-tail', 't1'))
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(1))

     await startTurn(flow, 2)
     flow.append(seat('turn-tail', 't2'))
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(2))
   })

   // 同一个尾行被移动 / 重渲染时，不应再次触发彩带（已观察过的元素会被记住）
   it('never refires for an already-observed tail element (move/re-render)', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     await startTurn(flow, 1)
     const tail = seat('turn-tail', 't1')
     flow.append(tail)
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(1))

     // 同一元素再次 append（模拟 DOM 移动），flush 后仍应保持只触发一次
     flow.append(tail)
     await flush()
     expect(fire).toHaveBeenCalledTimes(1)
   })

   // 回合带终止错误座位（turn-error）时不应庆祝（这是失败回合）
   it('does not fire when the completed turn carries a terminal error seat', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     flow.append(seat('user', 'u1'))
     await flush()

     // 错误尾座 + 回合尾行同时出现，表示整轮以错误终止
     flow.append(seat('turn-error', 'e1'))
     flow.append(seat('turn-tail', 't1'))
     await flush()
     expect(fire).not.toHaveBeenCalled()

     // 下一个干净回合仍能正常庆祝
     await startTurn(flow, 2)
     flow.append(seat('turn-tail', 't2'))
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(1))
   })

   // 历史渲染：用户气泡与回合尾行一次性批量出现，不触发彩带
   it('does not fire on history render (user + tail lands in one batch)', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     // 历史消息在同一批次中被全部追加，模拟一次性渲染历史记录
     flow.append(seat('user', 'h1'))
     flow.append(seat('turn-tail', 'ht1'))
     flow.append(seat('user', 'h2'))
     flow.append(seat('turn-tail', 'ht2'))
     await flush()
     expect(fire).not.toHaveBeenCalled()
   })

   // 尾行不是最后一行（历史翻页往中间插入）时不应触发
   it('does not fire for a tail that is not the last row (history paging)', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     flow.append(seat('user', 'u1'))
     await flush()
     flow.append(seat('assistant-step', 'a1'))
     await flush()

     // 把旧回合的尾行插入到最前面，此时它不是最后一行，不应触发彩带
     flow.insertBefore(seat('turn-tail', 'old'), flow.firstChild!)
     await flush()
     expect(fire).not.toHaveBeenCalled()
   })

   // 挂载后若尚未观察到任何用户气泡就先出现尾行，不触发彩带
   it('does not fire until a user bubble has been observed since mount', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     flow.append(seat('turn-tail', 'late'))
     await flush()
     expect(fire).not.toHaveBeenCalled()

     // 之后出现完整回合则正常庆祝
     await startTurn(flow, 1)
     flow.append(seat('turn-tail', 't1'))
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(1))
   })

   // 回合被停止：只有 user + 尾行、没有收尾的 assistant 座位 → 不庆祝
   it('does not fire when the turn was stopped (no closing assistant seat)', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     flow.append(seat('user', 'u1'))
     await flush()
     flow.append(seat('turn-tail', 't1'))
     await flush()
     expect(fire).not.toHaveBeenCalled()
   })

   // 工具调用步骤后被停止（收尾座位为空内容）→ 不庆祝
   it('does not fire when stopped after a tool-call step (empty closing seat)', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     // 空回复文案的 assistant-step，即停止时的空占用位
     await startTurn(flow, 1, '')
     flow.append(seat('tool', 't1'))
     await flush()
     flow.append(seat('turn-tail', 'tt1'))
     await flush()
     expect(fire).not.toHaveBeenCalled()
   })

   // 保留的助手回复携带“已停止”标记文案 → 视为停止回合，不庆祝
   it('does not fire when the retained assistant carries the stopped label', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     // 中英文两种“已停止”标记都不应触发彩带
     await startTurn(flow, 1, '部分回复…已停止')
     flow.append(seat('turn-tail', 't1'))
     await flush()
     expect(fire).not.toHaveBeenCalled()

     await startTurn(flow, 2, 'Partial reply… Stopped')
     flow.append(seat('turn-tail', 't2'))
     await flush()
     expect(fire).not.toHaveBeenCalled()
   })

   // 停止回合之后的第一个干净回合应正常庆祝
   it('celebrates again on the next clean turn after a stopped one', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     // 先制造一个被停止的回合：user + 无 assistant 回复的尾行
     flow.append(seat('user', 'u1'))
     await flush()
     flow.append(seat('turn-tail', 't1'))
     await flush()
     expect(fire).not.toHaveBeenCalled()

     // 下一个有完整回复的回合应触发庆祝
     await startTurn(flow, 2)
     flow.append(seat('turn-tail', 't2'))
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(1))
   })

   // 只有工具行带“已停止”标记、但最终有完整回复时，仍应庆祝
   it('still celebrates when only a tool row shows the stopped label', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     flow.append(seat('user', 'u1'))
     await flush()
     const tool = seat('tool', 't1')
     tool.textContent = 'bash 已停止' // 工具行显示停止标记
     flow.append(tool)
     await flush()
     const reply = seat('assistant-step', 'a1')
     reply.textContent = '完整回复'
     flow.append(reply)
     await flush()
     flow.append(seat('turn-tail', 'tt1'))
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(1))
   })

   // 完整工具循环回合（最终有文本回复步骤）应庆祝
   it('celebrates a completed tool-loop turn (final text step)', async () => {
     const fire = vi.fn(() => () => {})
     const { flow } = mountChat()
     render(<ConfettiLayer fire={fire} />)

     await startTurn(flow, 1, '') // 无文本的过渡步骤（工具循环内）
     flow.append(seat('tool', 'run1'))
     await flush()
     const finalReply = seat('assistant-step', 'a2')
     finalReply.textContent = '最终回复'
     flow.append(finalReply)
     await flush()
     flow.append(seat('turn-tail', 't1'))
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(1))
   })
 })

 // ------ ConfettiLayer 音效门控 ------
 describe('ConfettiLayer sound gating', () => {
   // 音效开关打开时，每次活回合完成播放一次音效
   it('plays the sound once per live completion when enabled', async () => {
     const fire = vi.fn(() => () => {})
     const playSound = vi.fn()
     const { flow } = mountChat()
     render(<ConfettiLayer
       fire={fire}
       playSound={playSound}
       loadSoundEnabled={async () => true} // 模拟配置读取：音效开启
     />)

     await startTurn(flow, 1)
     flow.append(seat('turn-tail', 't1'))
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(1))
     expect(playSound).toHaveBeenCalledTimes(1)
   })

   // 音效关闭时：彩带仍然触发，但不播放音效
   it('keeps firing bursts but stays silent when the sound toggle is off', async () => {
     const fire = vi.fn(() => () => {})
     const playSound = vi.fn()
     const { flow } = mountChat()
     render(<ConfettiLayer
       fire={fire}
       playSound={playSound}
       loadSoundEnabled={async () => false} // 模拟配置读取：音效关闭
     />)

     await startTurn(flow, 1)
     flow.append(seat('turn-tail', 't1'))
     await vi.waitFor(() => expect(fire).toHaveBeenCalledTimes(1))
     expect(playSound).not.toHaveBeenCalled()
   })

   // 音效开关配置在挂载时只读取一次
   it('queries the sound toggle once on mount', async () => {
     const loadSoundEnabled = vi.fn(async () => true)
     render(<ConfettiLayer fire={vi.fn(() => () => {})} loadSoundEnabled={loadSoundEnabled} />)
     await vi.waitFor(() => expect(loadSoundEnabled).toHaveBeenCalledTimes(1))
   })

   // 配置读取失败时回退到乐观默认值：音效开启
   it('defaults to the happy path (sound on) when the config fetch fails', async () => {
     // 全局 fetch 在 jsdom 中默认不可用；fetchConfettiSound 内部应容错并返回 true
     await expect(fetchConfettiSound()).resolves.toBe(true)
   })
 })

 // ------ runConfettiBurst 彩带动画引擎 ------
 describe('runConfettiBurst engine', () => {
   // 空矩形（0×0）时不创建画布，直接无操作
   it('no-ops on an empty rect without creating a canvas', () => {
     const dispose = runConfettiBurst({ left: 0, top: 0, width: 0, height: 0 })
     dispose()
     // 断言没有留下任何彩带画布元素
     expect(document.querySelectorAll('[data-bga-confetti]')).toHaveLength(0)
   })

   // 拿不到 2d 上下文（jsdom 默认）时同样不创建画布
   it('no-ops when the 2d context is unavailable (jsdom default) and leaves no canvas', () => {
     const dispose = runConfettiBurst(RECT)
     dispose()
     expect(document.querySelectorAll('[data-bga-confetti]')).toHaveLength(0)
   })

   // 在注入的假 2d 上下文与假时钟（now/raf/cancelRaf）驱动下：
   // 创建画布 → 逐帧动画 → 结束时移除画布；dispose 立即停止后续帧
   it('animates on a provided context, removes its canvas at the end, and stops on dispose', () => {
     // 假 2D 上下文：记录所有绘制调用
     const context = {
       globalAlpha: 1,
       fillStyle: '',
       clearRect: vi.fn(),
       save: vi.fn(),
       translate: vi.fn(),
       rotate: vi.fn(),
       beginPath: vi.fn(),
       arc: vi.fn(),
       fill: vi.fn(),
       fillRect: vi.fn(),
       restore: vi.fn(),
     }
     vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as never)

     // 手工时钟：手动推进时间并执行当前待处理的动画帧回调
     let time = 0
     let frames: Array<{ callback: (t: number) => void; id: number }> = []
     let nextId = 1
     const clock = {
       now: () => time,
       raf: (callback: (t: number) => void) => {
         frames.push({ callback, id: nextId })
         return nextId++
       },
       cancelRaf: (id: number) => { frames = frames.filter(frame => frame.id !== id) },
     }
     // 前进 ms 毫秒并逐个执行当前所有待处理帧
     const step = (ms: number): void => {
       time += ms
       const pending = frames
       frames = []
       for (const frame of pending) frame.callback(time)
     }

     // 启动一次彩带爆发，应立即创建一个画布
     const dispose = runConfettiBurst(RECT, { count: 12, random: () => 0.5, ...clock })
     expect(document.querySelectorAll('[data-bga-confetti]')).toHaveLength(1)

     // 手动推进一帧后 dispose：画布应立即被移除，且后续推进不再产生新帧
     step(100)
     dispose()
     expect(document.querySelectorAll('[data-bga-confetti]')).toHaveLength(0)
     step(100)
     expect(frames).toHaveLength(0)

     // 完整跑动画循环：随机值固定为 0.5 以便确定性地推进，
     // 动画应在 1000 帧内自然结束（guard 上限同时作为死循环保护）
     runConfettiBurst(RECT, { count: 12, random: () => 0.5, ...clock })
     let guard = 0
     while (frames.length > 0 && guard < 1000) {
       step(16)
       guard += 1
     }
     expect(guard).toBeLessThan(1000)
     // 结束后画布应已从 DOM 中移除
     expect(document.querySelectorAll('[data-bga-confetti]')).toHaveLength(0)

     vi.restoreAllMocks()
   })
 })