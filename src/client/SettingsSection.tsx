 // ============================================================================
 // 文件：SettingsSection.tsx —— 「设置页」中的 BGA 工作台设置区块
 //
 // 职责：
 //   在 Harness 设置页渲染横幅 / 彩带 / 打开方式配置表单：
 //     - 「工作台横幅」：横幅总开关、头像上传/恢复默认、问候语文案（输入后自动保存）；
 //     - 「彩带配置」：音效开关与“试听”按钮；
 //     - 「打开方式」：终端与编辑器下拉（偏好 ID 白名单，按平台过滤可用项）。
 //   所有数据读写都通过注入的 WorkbenchSectionInjected 桥接（由 index.tsx 提供实现，
 //   内部走 /bga-dsh-workbench/* 接口），本组件不直接发起网络请求，便于复用与测试。
 // ============================================================================
 import { useEffect, useRef, useState, type CSSProperties, type ChangeEvent } from 'react'
 import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

 import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
 import { playConfettiSound } from './confetti-sound.ts'
import { EnglishSettings } from './english/EnglishSettings.tsx'
import {
  EXTRA_OPEN_KINDS,
  EDITOR_OPTIONS,
  currentPlatform,
  normalizeEditorId,
  normalizeTerminalId,
  extraOpenLabel,
  extraSettingKey,
  terminalOptionsFor,
} from './open-prefs.ts'

 // 横幅配置的状态形状（对应后端 banner 字段，与 banner-config.ts 的 BannerConfig 对齐）。
 export interface WorkbenchSectionState {
   /** 当前头像路径（空字符串表示尚未设置） */
   readonly avatarPath: string
   /** 横幅问候语文案 */
   readonly text: string
   /** 是否显示横幅 */
   readonly show: boolean
 }
 
 // 彩带配置的状态形状。
 export interface ConfettiSectionState {
   /** 整轮完成时是否播放庆祝音效 */
   readonly sound: boolean
 }
 
 // 宿主注入给本区块的数据访问接口（实际实现见 index.tsx 的 slots.register）。
 export interface WorkbenchSectionInjected {
 
   /** 读取横幅 + 彩带配置（内部做默认值回退） */
   load: () => Promise<WorkbenchSectionState & ConfettiSectionState & OpenPrefsSectionState>
 
   /** 保存横幅配置：text / show / avatarPath 均可选，按需局部更新 */
   save: (patch: { text?: string; show?: boolean; avatarPath?: string }) => Promise<void>
 
   /** 保存彩带配置（总开关 + 音效开关） */
   saveConfetti: (patch: { show?: boolean; sound?: boolean }) => Promise<void>
 
   /** 上传头像图片，返回服务端保存后的头像路径 */
   uploadAvatar: (file: File) => Promise<{ avatarPath: string }>
 
   /** 恢复默认头像 */
   resetAvatar: () => Promise<void>
 
   /** 保存「打开方式」偏好（局部更新） */
   saveOpenPrefs: (patch: OpenPrefsPatch) => Promise<void>

   /** 保存「附加 IDE」展示开关（局部更新） */
   saveExtraOpen: (patch: ExtraOpenSettingsPatch) => Promise<void>

  /** 英语学习区块（内置在下方，直接调用宿主 /english/* 路由） */
 }
 
 // 区块组件的完整 props = 运行时注入的插槽 props（PropsRuntime）+ 上述数据接口（InjectFace）。
 export type WorkbenchSectionProps = PropsRuntime<'settings.section'> & InjectFace<WorkbenchSectionInjected>

 // —— 区块内联样式（少量样式直接写死，避免引入复杂 CSS 依赖）——
 const rowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }
 const labelStyle: CSSProperties = { minWidth: 72, fontWeight: 400, fontSize: 14 }
 const captionStyle: CSSProperties = { fontSize: 12, color: 'var(--dsw-alias-label-tertiary, #888)' }
 const buttonStyle: CSSProperties = {
   padding: '4px 12px', borderRadius: 8, border: '1px solid var(--dsw-alias-border-l2, #ccc)',
   background: 'transparent', cursor: 'pointer', fontSize: 13,
 }
 const inputStyle: CSSProperties = {
   padding: '4px 8px', borderRadius: 8, border: '1px solid var(--dsw-alias-border-l2, #ccc)',
   fontSize: 13, minWidth: 220,
 }
  /** 更窄的下拉输入样式：用于「默认终端」等短文本选择项 */
  const narrowInputStyle: CSSProperties = { ...inputStyle, minWidth: 160 }
 const errorStyle: CSSProperties = { color: 'var(--dsw-alias-state-error-primary, #c00000)', fontSize: 13 }
 const okStyle: CSSProperties = { color: 'var(--dsw-alias-state-success-primary, #2e8e52)', fontSize: 13 }

 // 问候语自动保存的防抖时长（毫秒）：停止输入 500ms 后才真正发请求
 const AUTO_SAVE_DELAY_MS = 500

 // 「BGA 工作台设置」区块组件：表单状态全部本地管理，数据读写走注入接口。
 // 问候语采用“500ms 防抖自动保存”，失焦时立即保存，组件卸载时补存尚未保存的内容。
 export function SettingsSection({ load, save, saveConfetti, uploadAvatar, resetAvatar, saveOpenPrefs, saveExtraOpen }: WorkbenchSectionProps) {
   const fileRef = useRef<HTMLInputElement>(null) // 隐藏的文件选择框引用（点击“更换图片”触发）
   const [avatarPath, setAvatarPath] = useState('') // 当前头像路径（仅用于展示）
   const [text, setText] = useState('') // 问候语文案（输入框受控值）
   const [show, setShow] = useState(true) // 横幅总开关
   const [sound, setSound] = useState(true) // 彩带音效开关
   const [confettiShow, setConfettiShow] = useState(true) // 彩带总开关
   const [revision, setRevision] = useState(0) // 头像 URL 的 ?t= 版本号：上传后 +1 强制重新加载
   const [busy, setBusy] = useState(false) // 是否有耗时操作进行中（禁用按钮、避免重复提交）
   const [terminal, setTerminal] = useState('') // 终端偏好 ID（空串 = 系统默认）
   const [editor, setEditor] = useState('') // 编辑器偏好 ID（空串 = VS Code）
    const [openExtra, setOpenExtra] = useState<Record<string, boolean>>({})
   const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null) // 操作结果提示（成功/失败）
 
   // 用 ref 保存注入回调：异步/定时器闭包里始终能拿到最新函数，避免闭包捕获过期引用
   const callbacks = useRef({ load, save, saveConfetti, uploadAvatar, resetAvatar, saveOpenPrefs, saveExtraOpen })
   callbacks.current = { load, save, saveConfetti, uploadAvatar, resetAvatar, saveOpenPrefs, saveExtraOpen }
 
   // 服务端已确认保存的文案（用于判断是否还有未保存的差异）
   const savedTextRef = useRef('')
   // 用户当前输入的最新文案（实时值，防抖期间暂存于此）
   const latestTextRef = useRef('')
   // 自动保存的防抖定时器句柄
   const saveTimerRef = useRef<number | undefined>(undefined)
   // “已自动保存”提示的自动消失定时器句柄
   const flashTimerRef = useRef<number | undefined>(undefined)
 
   // 挂载时读取已保存的配置，填充表单初始值
   useEffect(() => {
     callbacks.current.load().then(state => {
       // 逐字段类型兜底，避免后端返回异常数据导致表单绑定失败
       const nextText = typeof state.text === 'string' ? state.text : ''
       setAvatarPath(typeof state.avatarPath === 'string' ? state.avatarPath : '')
       setText(nextText)
       savedTextRef.current = nextText
       latestTextRef.current = nextText
       setShow(typeof state.show === 'boolean' ? state.show : true)
       setSound(typeof state.sound === 'boolean' ? state.sound : true)
        setTerminal(normalizeTerminalId(typeof state.terminal === 'string' ? state.terminal : ''))
        setEditor(normalizeEditorId(typeof state.editor === 'string' ? state.editor : ''))
        // 「附加 IDE」开关回填（缺省字段视为开启）
        setOpenExtra(state.openExtra ?? {})
     }, () => {
       setMessage({ kind: 'error', text: '读取工作台设置失败' })
     })
   }, [])

   // 卸载清理：清除两类定时器；若还有未保存的文案则尝试补存（best effort）
   useEffect(() => {
     return () => {
       if (saveTimerRef.current !== undefined) window.clearTimeout(saveTimerRef.current)
       if (flashTimerRef.current !== undefined) window.clearTimeout(flashTimerRef.current)
       const pending = latestTextRef.current
       if (pending !== savedTextRef.current) {
         void callbacks.current.save({ text: pending }).catch(() => {  })
       }
     }
   }, [])

   // 用户选择了新图片：上传成功后更新头像展示路径并使 URL 版本号 +1
   const onPick = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
     const file = event.target.files?.[0]
     if (file === undefined) return
     setBusy(true)
     setMessage(null)
     try {
       const { avatarPath: next } = await callbacks.current.uploadAvatar(file)
       setAvatarPath(next)
       setRevision(value => value + 1)
       setMessage({ kind: 'ok', text: '头像已更新' })
     } catch (error) {
       setMessage({ kind: 'error', text: (error as Error).message })
     } finally {
       setBusy(false)
       event.target.value = ''
     }
   }

   // 恢复默认头像
   const onReset = async (): Promise<void> => {
     setBusy(true)
     setMessage(null)
     try {
       await callbacks.current.resetAvatar()
       setAvatarPath('')
       setRevision(value => value + 1)
       setMessage({ kind: 'ok', text: '已恢复默认头像' })
     } catch (error) {
       setMessage({ kind: 'error', text: (error as Error).message })
     } finally {
       setBusy(false)
     }
   }

   // 实际执行自动保存：与已保存的文案一致则跳过；成功后更新基线并短暂显示提示
   const autosaveText = async (): Promise<void> => {
     const value = latestTextRef.current
     if (value === savedTextRef.current) return
     setMessage(null)
     try {
       await callbacks.current.save({ text: value })
       savedTextRef.current = value
       setMessage({ kind: 'ok', text: '问候语已自动保存' })
       // 成功提示 1.8 秒后自动消失（避免残留误导用户）
       if (flashTimerRef.current !== undefined) window.clearTimeout(flashTimerRef.current)
       flashTimerRef.current = window.setTimeout(() => {
         setMessage(current => current?.text === '问候语已自动保存' ? null : current)
       }, 1800)
     } catch (error) {
       setMessage({ kind: 'error', text: (error as Error).message })
     }
   }

   // 输入变化：更新实时文案与表单，并重置 500ms 防抖定时器——
   // 连续输入会不断推迟保存，停止输入片刻后才真正落库
   const onTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
     const next = event.target.value
     latestTextRef.current = next
     setText(next)
     if (saveTimerRef.current !== undefined) window.clearTimeout(saveTimerRef.current)
     saveTimerRef.current = window.setTimeout(() => {
       saveTimerRef.current = undefined
       void autosaveText()
     }, AUTO_SAVE_DELAY_MS)
   }

   // 失焦：取消防抖定时器并立即保存（保证用户离开输入框时内容已落库）
   const onTextBlur = (): void => {
     if (saveTimerRef.current !== undefined) {
       window.clearTimeout(saveTimerRef.current)
       saveTimerRef.current = undefined
       void autosaveText()
     }
   }

   // 切换横幅总开关；保存失败时回滚开关状态并提示错误
   const onToggleShow = async (next: boolean): Promise<void> => {
     setShow(next)
     setBusy(true)
     setMessage(null)
     try {
       await callbacks.current.save({ show: next })
       setMessage({ kind: 'ok', text: next ? '横幅已显示' : '横幅已隐藏' })
     } catch (error) {
       setShow(!next)
       setMessage({ kind: 'error', text: (error as Error).message })
     } finally {
       setBusy(false)
     }
   }

   // 切换彩带音效开关；保存失败时回滚
   const onToggleSound = async (next: boolean): Promise<void> => {
     setSound(next)
     setBusy(true)
     setMessage(null)
     try {
       await callbacks.current.saveConfetti({ sound: next })
       setMessage({ kind: 'ok', text: next ? '彩带音效已打开' : '彩带音效已关闭' })
     } catch (error) {
       setSound(!next)
       setMessage({ kind: 'error', text: (error as Error).message })
     } finally {
       setBusy(false)
     }
   }

   // 切换彩带总开关；保存失败时回滚
   const onToggleConfettiShow = async (next: boolean): Promise<void> => {
     setConfettiShow(next)
     setBusy(true)
     setMessage(null)
     try {
       await callbacks.current.saveConfetti({ show: next })
       setMessage({ kind: 'ok', text: next ? '彩带已启用' : '彩带已关闭' })
     } catch (error) {
       setConfettiShow(!next)
       setMessage({ kind: 'error', text: (error as Error).message })
     } finally {
       setBusy(false)
     }
   }

   // 试听彩带音效（不改变任何配置）
   const onPreviewSound = (): void => {

     setMessage(null)
     playConfettiSound()
   }
 
   // 切换终端偏好：选择后立即保存；失败时回滚下拉值并提示错误。
   const onTerminalChange = async (next: string): Promise<void> => {
     const previous = terminal
     setTerminal(next)
     setBusy(true)
     setMessage(null)
     try {
       await callbacks.current.saveOpenPrefs({ terminal: next })
       setMessage({ kind: 'ok', text: '终端偏好已保存' })
     } catch (error) {
       setTerminal(previous)
       setMessage({ kind: 'error', text: (error as Error).message })
     } finally {
       setBusy(false)
     }
   }
 
   // 切换编辑器偏好：选择后立即保存；失败时回滚下拉值并提示错误。
   const onEditorChange = async (next: string): Promise<void> => {
     const previous = editor
     setEditor(next)
     setBusy(true)
     setMessage(null)
     try {
       await callbacks.current.saveOpenPrefs({ editor: next })
       setMessage({ kind: 'ok', text: '编辑器偏好已保存' })
     } catch (error) {
       setEditor(previous)
       setMessage({ kind: 'error', text: (error as Error).message })
     } finally {
       setBusy(false)
     }
   }

    const onExtraToggle = async (key: string, checked: boolean): Promise<void> => {
      const previous = openExtra
      const next = { ...openExtra, [key]: checked }
      setOpenExtra(next)
      setBusy(true)
      setMessage(null)
      try {
        await callbacks.current.saveExtraOpen({ [key]: checked } as ExtraOpenSettingsPatch)
        setMessage({ kind: 'ok', text: '已更新打开方式' })
      } catch (error) {
        setOpenExtra(previous)
        setMessage({ kind: 'error', text: (error as Error).message })
      } finally {
        setBusy(false)
      }
    }


   return (
     <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          background: 'var(--dsw-alias-bg-layer, #fff)', border: '1px solid var(--dsw-alias-border-l2, #ddd)',
          borderRadius: 10, padding: '10px 12px', marginTop: 8,
        }}>
     <h3 style={{ fontSize: 15, margin: '0 0 8px' }}>工作台横幅</h3>
  
     <div style={rowStyle}>
       <span style={labelStyle}>横幅总开关</span>
       <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
         <input type="checkbox" checked={show} disabled={busy} onChange={event => onToggleShow(event.target.checked)} />
         在空态顶部显示横幅
       </label>
     </div>
  
     <div style={rowStyle}>
       <span style={labelStyle}>头像</span>
       <img
         src={`/bga-dsh-workbench/avatar?t=${revision}`}
         alt=""
         width={44}
         height={44}
         style={{ borderRadius: '50%', objectFit: 'cover' }}
       />
       <button type="button" style={buttonStyle} disabled={busy} onClick={() => fileRef.current?.click()}>
         更换图片
       </button>
       <input
         ref={fileRef}
         type="file"
         accept="image/png,image/jpeg,image/gif,image/webp"
         style={{ display: 'none' }}
         onChange={onPick}
       />
       <button type="button" style={buttonStyle} disabled={busy} onClick={onReset}>
         恢复默认
       </button>
     </div>
     {avatarPath.length > 0 && <div style={{ ...rowStyle, paddingTop: 0 }}><span style={captionStyle}>{avatarPath}</span></div>}
  
     <div style={rowStyle}>
       <span style={labelStyle}>问候语</span>
       <input
         style={inputStyle}
         value={text}
         onChange={onTextChange}
         onBlur={onTextBlur}
       />
       <span style={captionStyle}>输入后自动保存</span>
     </div>
        </div>

        <div style={{
          background: 'var(--dsw-alias-bg-layer, #fff)', border: '1px solid var(--dsw-alias-border-l2, #ddd)',
          borderRadius: 10, padding: '10px 12px', marginTop: 8,
        }}>
     <h3 style={{ fontSize: 15, margin: '0 0 8px' }}>彩带配置</h3>
  
     <div style={rowStyle}>
       <span style={labelStyle}>彩带总开关</span>
       <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
         <input type="checkbox" checked={confettiShow} disabled={busy} onChange={event => onToggleConfettiShow(event.target.checked)} />
         启用彩带特效（关闭后不播放特效与音效）
       </label>
     </div>

     <div style={rowStyle}>
       <span style={labelStyle}>彩带音效</span>
       <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
         <input type="checkbox" checked={sound} disabled={busy} onChange={event => onToggleSound(event.target.checked)} />
         整轮完成时播放庆祝音效
       </label>
       <button type="button" style={buttonStyle} disabled={busy} onClick={onPreviewSound}>
         试听
       </button>
     </div>
        </div>

 
       <EnglishSettings />
       {message !== null && (
         <div style={message.kind === 'ok' ? okStyle : errorStyle}>{message.text}</div>
       )}
        <div style={{
          background: 'var(--dsw-alias-bg-layer, #fff)', border: '1px solid var(--dsw-alias-border-l2, #ddd)',
          borderRadius: 10, padding: '10px 12px', marginTop: 8,
        }}>
          <h3 style={{ fontSize: 15, margin: '0 0 8px' }}>工作区打开方式</h3>

          <div style={rowStyle}>
            <span style={labelStyle}>默认终端</span>
            <select
              style={narrowInputStyle}
              value={terminal}
              disabled={busy}
              onChange={event => void onTerminalChange(event.target.value)}
            >
              {terminalOptionsFor(currentPlatform()).map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
            <span style={captionStyle}>打开目录时使用的终端（仅显示当前平台可用项）</span>
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>默认编辑器</span>
            <select
              style={inputStyle}
              value={editor}
              disabled={busy}
              onChange={event => void onEditorChange(event.target.value)}
            >
              {EDITOR_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
            <span style={captionStyle}>打开目录时使用的编辑器</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0 0' }}>
            <h3 style={{ fontSize: 13, margin: 0, fontWeight: 600 }}>附加打开方式</h3>
            <span style={captionStyle}>勾选后展示在工作区菜单尾部（默认全开）</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
            {EXTRA_OPEN_KINDS.map((kind, _index) => {
              const key = extraSettingKey(kind)
              const checked = openExtra[key] ?? true
              return (
                <label
                  key={kind}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={busy}
                    onChange={event => void onExtraToggle(key, event.target.checked)}
                  />
                  {extraOpenLabel(kind)}
                </label>
              )
            })}
          </div>
        </div>

     </div>
   )
 } 
 // 「打开方式」偏好的状态形状（对应后端 open 字段，空串 = 平台默认）。
 export interface OpenPrefsSectionState {
   /** 终端偏好 ID（空串 = 平台默认终端） */
   readonly terminal: string
   /** 编辑器偏好 ID（空串 = VS Code） */
   readonly editor: string
  /** 附加 IDE 展示开关（true = 展示在菜单尾部），字段对应后端 settings.openExtra */
  readonly openExtra: Record<string, boolean>
 }
 
 // 「打开方式」偏好的局部更新。
 export interface OpenPrefsPatch {
   readonly terminal?: string
   readonly editor?: string
}

// 「附加 IDE」展示开关的部分更新（与后端 settings.openExtra 字段对应）。
export interface ExtraOpenSettingsPatch {
  readonly androidStudio?: boolean
  readonly xcode?: boolean
  readonly wechatDevtools?: boolean
  readonly intellijIdea?: boolean
  readonly devecoStudio?: boolean
  readonly webstorm?: boolean
  readonly pycharm?: boolean
  readonly goland?: boolean
}
 
