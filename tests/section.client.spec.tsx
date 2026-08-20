// ============================================================
 // section.client.spec.tsx —— 设置页区块（SettingsSection）组件测试
 // ============================================================
 // 测试对象：src/client/SettingsSection.tsx 的 SettingsSection 组件，
 // 它是 Harness 设置页面上的工作台配置区块，通过注入的 service 接口工作。
 // 覆盖范围：
 //   - 加载配置后渲染横幅模块控件（文案输入、总开关、空态开关、头像操作、自动保存提示）；
 //   - 加载失败时展示错误信息而非空面板；
 //   - 配置仍在加载时就绪前静态控件先渲染；
 //   - 兼容缺少 avatarPath 字段的旧宿主配置；
 //   - 彩带模块（音效开关）的渲染、切换持久化与试听；
 //   - 问候语的防抖自动保存、失焦即时刷新、内容未变化时跳过保存。
 // 测试环境：vitest + @testing-library/react（jsdom）。
 import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
 import { afterEach, describe, expect, it, vi } from 'vitest'
 import { SettingsSection, type WorkbenchSectionInjected } from '../src/client/SettingsSection.tsx'

 // 每个用例结束后卸载组件
 afterEach(() => { cleanup() })

 // 构造一组默认的注入 service mock（load/save/saveConfetti/uploadAvatar/resetAvatar），
 // 可用 overrides 局部覆盖以模拟各种场景
 function face(overrides: Partial<WorkbenchSectionInjected> = {}): WorkbenchSectionInjected {
   return {
     load: vi.fn(async () => ({ avatarPath: '/a/avatar.png', text: '的专属 Harness 工作台', show: true, sound: true, terminal: '', editor: '' })),
     save: vi.fn(async () => {}),
     saveConfetti: vi.fn(async () => {}),
     uploadAvatar: vi.fn(async () => ({ avatarPath: '/b/avatar.png' })),
     resetAvatar: vi.fn(async () => {}),
     saveOpenPrefs: vi.fn(async () => {}),
     ...overrides,
   }
 }

 // SettingsSection 组件行为测试
 describe('SettingsSection', () => {
   // 加载到当前配置后，横幅模块的所有控件应正确渲染
   it('renders the banner controls after loading the current options', async () => {
     const injected = face()
     render(<SettingsSection {...(injected as unknown as Record<string, unknown>)} /> as never)
     // 等 load 完成后再检查各控件标题是否出现
     await waitFor(() => expect(screen.getByText('工作台横幅')).toBeTruthy())
     expect(screen.getByText('横幅总开关')).toBeTruthy()
     expect(screen.getByText('在空态顶部显示横幅')).toBeTruthy()
     expect(screen.getByText('更换图片')).toBeTruthy()
     expect(screen.getByText('恢复默认')).toBeTruthy()
     expect(screen.getByText('输入后自动保存')).toBeTruthy()
     // 输入框回填了加载到的默认问候文案
     const input = screen.getByDisplayValue('的专属 Harness 工作台') as HTMLInputElement
     expect(input).toBeTruthy()
     // load 只调用一次；纯渲染不应触发任何保存
     expect(injected.load).toHaveBeenCalledTimes(1)

     expect(injected.save).not.toHaveBeenCalled()
   })

   // load 抛错时展示错误提示，而不是渲染一个空面板
   it('surfaces a load failure as an error message instead of an empty panel', async () => {
     render(<SettingsSection
       {...(face({ load: vi.fn(async () => { throw new Error('boom') }) }) as unknown as Record<string, unknown>)}
     /> as never)
     await waitFor(() => expect(screen.getByText('读取工作台设置失败')).toBeTruthy())
   })

   // 配置仍在加载（pending Promise）时，静态控件也应先渲染出来
   it('still renders the static controls while options are loading', () => {
     // 构造一个由我们手动 resolve 的 pending promise 来模拟慢加载
     let resolveLoad!: (value: { avatarPath: string; text: string; show: boolean }) => void
     const pending = new Promise<{ avatarPath: string; text: string; show: boolean }>(resolve => { resolveLoad = resolve })
     render(<SettingsSection
       {...(face({ load: vi.fn(() => pending) }) as unknown as Record<string, unknown>)}
     /> as never)
     // 立即检查静态标题存在（不需要等待 resolve）
     expect(screen.getByText('工作台横幅')).toBeTruthy()
     resolveLoad({ avatarPath: '', text: '', show: true }) // 收尾 resolve，避免悬挂 promise
   })

   // 兼容重启前的旧宿主：配置缺 avatarPath 字段时组件不崩溃，文案仍回填
   it('survives a config missing avatarPath (restart-less older host) without crashing', async () => {
     // load 返回的对象故意缺省 avatarPath
     render(<SettingsSection
       {...(face({ load: vi.fn(async () => ({ text: '的专属 Harness 工作台', show: true } as never)) }) as unknown as Record<string, unknown>)}
     /> as never)
     await waitFor(() => expect(screen.getByText('更换图片')).toBeTruthy())
     expect((screen.getByDisplayValue('的专属 Harness 工作台') as HTMLInputElement).value).toBe('的专属 Harness 工作台')
   })

   // 彩带模块：渲染音效开关，且开关初始状态来自解析后的配置（默认开启）
   it('renders the confetti module with the resolved sound toggle', async () => {
     const injected = face()
     render(<SettingsSection {...(injected as unknown as Record<string, unknown>)} /> as never)
     await waitFor(() => expect(screen.getByText('彩带配置')).toBeTruthy())
     expect(screen.getByText('彩带音效')).toBeTruthy()
     expect(screen.getByText('整轮完成时播放庆祝音效')).toBeTruthy()
     expect(screen.getByText('试听')).toBeTruthy()
     const toggle = screen.getByRole('checkbox', { name: /整轮完成时播放庆祝音效/ }) as HTMLInputElement
     expect(toggle.checked).toBe(true) // 默认音效开启
   })

   // 点击音效开关：应通过 saveConfetti 持久化关闭音效并显示提示
   it('persists a sound toggle through saveConfetti', async () => {
     const injected = face()
     render(<SettingsSection {...(injected as unknown as Record<string, unknown>)} /> as never)
     await waitFor(() => expect(screen.getByText('彩带配置')).toBeTruthy())
     const toggle = screen.getByRole('checkbox', { name: /整轮完成时播放庆祝音效/ }) as HTMLInputElement
     fireEvent.click(toggle) // 切换开关
     // 保存调用应带上“关闭音效”的补丁
     await waitFor(() => expect(injected.saveConfetti).toHaveBeenCalledWith({ sound: false }))
     await waitFor(() => expect(screen.getByText('彩带音效已关闭')).toBeTruthy())
     expect(toggle.checked).toBe(false)
   })

   // 点击“试听”应触发试听预览，且不产生任何保存操作
   it('previews the jingle on demand without crashing', async () => {
     const injected = face()
     render(<SettingsSection {...(injected as unknown as Record<string, unknown>)} /> as never)
     await waitFor(() => expect(screen.getByText('彩带配置')).toBeTruthy())
     fireEvent.click(screen.getByText('试听'))

     // 试听是纯客户端行为，不应调用任何保存接口
     expect(injected.saveConfetti).not.toHaveBeenCalled()
   })

   // 问候语编辑有防抖自动保存：输入后不立即保存，停顿后再保存
   it('auto-saves the greeting after a typing pause (debounced)', async () => {
     const injected = face()
     render(<SettingsSection {...(injected as unknown as Record<string, unknown>)} /> as never)
     await waitFor(() => expect(screen.getByDisplayValue('的专属 Harness 工作台')).toBeTruthy())
     const input = screen.getByDisplayValue('的专属 Harness 工作台') as HTMLInputElement
     fireEvent.change(input, { target: { value: '新问候语' } })

     // 刚输入完尚未停顿，不应触发保存
     expect(injected.save).not.toHaveBeenCalled()
     // 等待防抖超时（上限 2s）后应持久化新文案
     await waitFor(() => expect(injected.save).toHaveBeenCalledWith({ text: '新问候语' }), { timeout: 2000 })
     await waitFor(() => expect(screen.getByText('问候语已自动保存')).toBeTruthy())
   })

   // 输入框失焦（blur）时，把待保存的编辑立即刷新（不等防抖）
   it('flushes a pending greeting edit immediately on blur', async () => {
     const injected = face()
     render(<SettingsSection {...(injected as unknown as Record<string, unknown>)} /> as never)
     await waitFor(() => expect(screen.getByDisplayValue('的专属 Harness 工作台')).toBeTruthy())
     const input = screen.getByDisplayValue('的专属 Harness 工作台') as HTMLInputElement
     fireEvent.change(input, { target: { value: '模糊保存' } })
     fireEvent.blur(input) // 失焦触发立即保存
     await waitFor(() => expect(injected.save).toHaveBeenCalledWith({ text: '模糊保存' }))
   })

   // 输入值与最近一次持久化值相同时，跳过保存
   it('skips a save when the typed value matches the last persisted value', async () => {
     const injected = face()
     render(<SettingsSection {...(injected as unknown as Record<string, unknown>)} /> as never)
     await waitFor(() => expect(screen.getByDisplayValue('的专属 Harness 工作台')).toBeTruthy())
     const input = screen.getByDisplayValue('的专属 Harness 工作台') as HTMLInputElement

     // 改成与回填值相同的文案再失焦
     fireEvent.change(input, { target: { value: '的专属 Harness 工作台' } })
     fireEvent.blur(input)
     // 等待超过防抖/刷新时间窗，确认没有多余保存发生
     await new Promise(resolve => setTimeout(resolve, 600))
     expect(injected.save).not.toHaveBeenCalled()
   })
 })

describe('SettingsSection 打开方式分组', () => {
   function renderSection(injected: WorkbenchSectionInjected): void {
     render(<SettingsSection {...(injected as unknown as Record<string, unknown>)} /> as never)
   }

   // 按选项值定位某个下拉。打开方式被挪到英语学习区块之后，DOM 里 combobox 的顺序
   // 是 [英语学习的模式/掌握规则, 终端, 编辑器]，因此用「含该选项值」来定位终端/编辑器更稳。
   function selectByValue(value: string): HTMLSelectElement {
     const selects = screen.getAllByRole('combobox') as HTMLSelectElement[]
     const found = selects.find(sel => Array.from(sel.options).some(option => option.value === value))
     if (found === undefined) throw new Error(`no combobox contains option "${value}"`)
     return found
   }

   it('渲染「打开方式」分组与终端/编辑器下拉，初始值来自 load', async () => {
     const injected = face()
     renderSection(injected)
     await waitFor(() => expect(screen.getByText('工作区打开方式')).toBeTruthy())
     expect(screen.getByText('默认终端')).toBeTruthy()
     expect(screen.getByText('默认编辑器')).toBeTruthy()
     // load 未配置偏好（空串）→ 归一化为显式默认 ID（保证保存值能通过后端白名单）
     expect(selectByValue('terminal-default').value).toBe('terminal-default')
     expect(selectByValue('editor-default').value).toBe('editor-default')
   })

   it('终端下拉回填当前偏好值并渲染平台可见选项', async () => {
     // jsdom 的 userAgent 无平台标识 → currentPlatform 判定为 linux，
     // 终端可见选项为：系统默认 / GNOME 终端 / Konsole / XFCE 终端（无 iterm/wterm）
     const injected = face({ load: vi.fn(async () => ({ avatarPath: '', text: '', show: true, sound: true, terminal: 'terminal-gnome', editor: '' })) })
     renderSection(injected)
     await waitFor(() => expect(screen.getAllByRole('combobox').length).toBe(6))
     const terminal = selectByValue('terminal-gnome')
     expect(terminal.value).toBe('terminal-gnome')
     // 平台过滤：iterm/wterm 不在选项中，gnome 在
     const opts = Array.from(terminal.querySelectorAll('option')).map(option => option.value)
     expect(opts).toContain('terminal-gnome')
     expect(opts).not.toContain('terminal-iterm')
     expect(opts).not.toContain('terminal-wterm')
   })

   it('切换终端下拉立即保存并显示成功提示', async () => {
     const saveOpenPrefs = vi.fn(async () => {})
     const injected = face({ saveOpenPrefs })
     renderSection(injected)
     await waitFor(() => expect(screen.getAllByRole('combobox').length).toBe(6))
     fireEvent.change(selectByValue('terminal-default'), { target: { value: 'terminal-gnome' } })
     await waitFor(() => expect(saveOpenPrefs).toHaveBeenCalledWith({ terminal: 'terminal-gnome' }))
     await waitFor(() => expect(screen.getByText('终端偏好已保存')).toBeTruthy())
   })


   it('保存失败时回滚下拉值并显示错误但不崩溃', async () => {
     const saveOpenPrefs = vi.fn(async () => { throw new Error('boom') })
     const injected = face({ saveOpenPrefs })
     renderSection(injected)
     await waitFor(() => expect(screen.getAllByRole('combobox').length).toBe(6))
     const editor = selectByValue('editor-default')
     fireEvent.change(editor, { target: { value: 'editor-insiders' } })
     await waitFor(() => expect(screen.getByText('boom')).toBeTruthy())
     // 失败后回滚到加载值（空串 = 默认）
     expect(editor.value).toBe('editor-default')
   })
 })
