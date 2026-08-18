// ============================================================
 // banner.client.spec.tsx —— WorkbenchBanner（Hero 横幅）组件测试
 // ============================================================
 // 测试对象：src/client/Banner.tsx 导出的 WorkbenchBanner React 组件。
 // 覆盖范围：
 //   - 根据宿主下发的横幅配置（text / show）决定渲染横幅与否；
 //   - 通过 window 事件 'bga-dsh-workbench:config-changed' 实时刷新横幅显隐；
 //   - 配置拉取失败（离线）时回退到默认文案并保持横幅展示；
 //   - 当 hero 阶段出现 takeover 面板（显示区域坍缩）时隐藏横幅，
 //     面板消失后自动恢复。
 // 测试环境：vitest + @testing-library/react（jsdom）。
 import { act, cleanup, render, waitFor } from '@testing-library/react'
 import { afterEach, describe, expect, it, vi } from 'vitest'
 import { WorkbenchBanner } from '../src/client/Banner.tsx'

 // 每个用例结束后统一清理：
 //   - cleanup() 卸载已渲染的组件；
 //   - vi.unstubAllGlobals() 恢复被 stub 的全局对象（fetch 等）；
 //   - 移除测试中残留的 [data-phase] hero 容器，避免影响后续用例。
 afterEach(() => {
   cleanup()
   vi.unstubAllGlobals()


   document.querySelectorAll('[data-phase]').forEach(el => el.remove())
 })

 // 将全局 fetch 替换为固定应答的 mock，用于模拟宿主下发的横幅配置。
 // responder 回调在每次调用时重新求值，因此可通过闭包变量动态控制应答内容。
 function stubConfig(responder: () => unknown): ReturnType<typeof vi.fn> {
   const fetchMock = vi.fn(async (): Promise<unknown> => ({
     ok: true,
     json: async () => responder(),
   }))
   vi.stubGlobal('fetch', fetchMock)
   return fetchMock // 返回 mock 实例，供后续断言 fetch 调用的次数
 }

 // 横幅容器元素的选择器常量
 const BANNER = '[data-bga-banner]'

 // WorkbenchBanner 组件行为测试
 describe('WorkbenchBanner', () => {
   // 宿主返回 show: true 时，横幅应当渲染出来并显示对应的文案
   it('renders the banner when the host says show: true', async () => {
     stubConfig(() => ({ banner: { text: 'hello', show: true } }))
     const { container } = render(<WorkbenchBanner />)
     // 等待异步 fetch 完成后横幅容器出现
     await waitFor(() => expect(container.querySelector(BANNER)).not.toBeNull())
     // 验证横幅内展示的文本与配置一致
     expect(container.querySelector('[data-bga-banner] span')?.textContent).toBe('hello')
   })

   // 宿主返回 show: false 时，横幅应完全不渲染
   it('renders nothing when the host says show: false', async () => {
     stubConfig(() => ({ banner: { text: 'hidden', show: false } }))
     const { container } = render(<WorkbenchBanner />)
     // 先确认 fetch 确实被调用过（配置已被拉取），再断言横幅始终不存在
     await waitFor(() => expect(fetch).toHaveBeenCalled())
     await waitFor(() => expect(container.querySelector(BANNER)).toBeNull())
   })

   // 设置页广播 config-changed 事件后，横幅应实时刷新（本例验证“显示 → 隐藏”）
   it('live-refreshes when the settings section broadcasts config-changed', async () => {
     let serveShow = true // 可变标志：控制 mock 应答中 show 的值
     const fetchMock = stubConfig(() => ({ banner: { text: 'live', show: serveShow } }))
     const { container } = render(<WorkbenchBanner />)
     await waitFor(() => expect(container.querySelector(BANNER)).not.toBeNull())

     // 关闭开关，并向 window 派发 config-changed 事件，模拟设置页保存后的广播
     serveShow = false
     act(() => { window.dispatchEvent(new Event('bga-dsh-workbench:config-changed')) })
     await waitFor(() => expect(container.querySelector(BANNER)).toBeNull())
     // 首屏加载 1 次 + 事件触发的重新拉取 1 次，共 2 次
     expect(fetchMock).toHaveBeenCalledTimes(2)
   })

   // 反向切换（off → on）：横幅应重新出现并恢复显示
   it('survives an off→on toggle: the banner comes back and is positioned', async () => {
     let serveShow = false
     const fetchMock = stubConfig(() => ({ banner: { text: 'toggle', show: serveShow } }))
     const { container } = render(<WorkbenchBanner />)
     await waitFor(() => expect(container.querySelector(BANNER)).toBeNull())

     // 打开开关并广播事件，横幅应重新渲染
     serveShow = true
     act(() => { window.dispatchEvent(new Event('bga-dsh-workbench:config-changed')) })
     await waitFor(() => expect(container.querySelector(BANNER)).not.toBeNull())
     expect(fetchMock).toHaveBeenCalledTimes(2)
   })

   // fetch 抛错（离线）时，横幅应保持默认文案而不崩溃
   it('keeps its defaults when the config fetch fails', async () => {
     // 让 fetch 直接 reject
     vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
     const { container } = render(<WorkbenchBanner />)
     await waitFor(() => expect(fetch).toHaveBeenCalled())
     // 拉取失败后仍渲染默认横幅，并展示默认问候文案
     expect(container.querySelector(BANNER)).not.toBeNull()
     expect(container.querySelector('[data-bga-banner] span')?.textContent).toBe('的 Harness 工作台')
   })

   // takeover 面板隐藏 hero 显示区域时隐藏横幅，面板消失后恢复横幅
   it('hides the whole banner while a takeover panel hides the hero, then restores it', async () => {
     stubConfig(() => ({ banner: { text: 'takeover', show: true } }))

     // 手工搭建 hero 阶段 DOM：根容器（data-phase=hero）+ 输入区（data-composer-seat）
     const root = document.createElement('div')
     root.setAttribute('data-phase', 'hero')
     const seat = document.createElement('div')
     seat.setAttribute('data-composer-seat', '')
     root.appendChild(seat)
     document.body.appendChild(root)

     // stub 各元素的布局几何：横幅可见性依赖 hero 根容器与输入区的可见区域。
     // box 变量可在后续被改写，以模拟 takeover 面板挤压 hero 显示区域。
     let box: Partial<DOMRect> = { left: 120, top: 60, width: 800, height: 500 }
     root.getBoundingClientRect = (() => box) as typeof root.getBoundingClientRect
     seat.getBoundingClientRect = () => ({
       left: 120, top: 320, width: 800, height: 60, top: 320, bottom: 380,
       right: 920, x: 120, y: 320, toJSON: () => {},
     }) as DOMRect

     const { container } = render(<WorkbenchBanner />)
     await waitFor(() => expect(container.querySelector(BANNER)?.style.display).toBe('flex'))

     // 模拟 takeover 接管：hero 根容器显示区域坍缩为 0（宽高均为 0），
     // 同时宿主在 <html> 上打上 data-bga-kb-open 标记，横幅应被隐藏
     box = { left: 0, top: 0, width: 0, height: 0 }
     act(() => { document.documentElement.setAttribute('data-bga-kb-open', '') })
     await waitFor(() => expect(container.querySelector(BANNER)?.style.display).toBe('none'))

     // 移除 takeover 标记并恢复 hero 显示区域，横幅应重新显示
     act(() => { document.documentElement.removeAttribute('data-bga-kb-open') })
     box = { left: 120, top: 60, width: 800, height: 500 }
     await waitFor(() => expect(container.querySelector(BANNER)?.style.display).toBe('flex'))
   })
 })