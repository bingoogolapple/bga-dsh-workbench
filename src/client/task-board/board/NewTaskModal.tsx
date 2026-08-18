 
 /**
 * NewTaskModal.tsx —— 「新建任务」弹窗。
 *
 * 通过 createPortal 渲染到 document.body 的模态框，收集新任务信息：
 * 标题（必填）、描述、执行 Prompt、以及可选的执行设置
 * （工作区 / 模式（agent 预设）/ 权限），统称为「钉住的执行目标」。
 * - 提交：调用 controller.createTask()，返回 undefined 表示标题为空，
 *   显示校验错误；成功则关闭弹窗；
 * - 执行选项（可选工作区与预设清单）订阅控制器快照实时更新；
 * - Esc 或点击遮罩关闭；标题输入框自动聚焦。
 */
 
 import { useEffect, useState } from 'react'
 import { createPortal } from 'react-dom'
 import type { BoardController } from '../../../core/controller.ts'
 import { TASK_PERMISSIONS, type TaskPermission } from '../../../core/tasks.ts'
 import { t, type TaskBoardKey } from '../locales.ts'
 import css from '../kanban.module.css'
 
 /**
 * 新建任务弹窗组件。
 *
 * @param props.controller 看板控制器：创建任务、读取执行选项。
 * @param props.onClose 关闭回调（取消 / 成功创建后触发）。
 */
 export function NewTaskModal({ controller, onClose }: { controller: BoardController; onClose: () => void }) {
   // —— 表单受控状态 ——
   // 标题 / 描述 / 执行 Prompt 三个文本字段。
   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const [prompt, setPrompt] = useState('')
   // 执行设置：工作区 id / 模式（预设）id / 权限；空字符串表示「用运行时默认」。
   const [workspaceId, setWorkspaceId] = useState('')
   const [mode, setMode] = useState('')
   const [permission, setPermission] = useState('')
   // 校验错误信息（标题为空时显示）。
   const [error, setError] = useState<string | undefined>(undefined)
   // 执行选项（可选工作区 / 预设清单），初始化取当前快照。
   const [options, setOptions] = useState(controller.getSnapshot().executionOptions)
 
   
   
   // 订阅控制器：执行选项变化（如工作区列表刷新）时同步到本地状态。
   useEffect(
     () => controller.subscribe(() => setOptions(controller.getSnapshot().executionOptions)),
     [controller],
   )

  // 让当前聚焦元素失焦（关闭弹窗后清除残留焦点）。
  const blurActive = (): void => {
    const el = document.activeElement
    if (el instanceof HTMLElement && el !== document.body) el.blur()
  }

  // 挂载期间监听键盘：Esc 键关闭弹窗并失焦。
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose()
        blurActive()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])
 
   // 提交表单：下发创建命令；标题为空时 createTask 返回 undefined -> 显示错误。
   const submit = (): void => {
     const task = controller.createTask({
       title,
       description,
       prompt,
       // 空字符串统一转 undefined：让执行端使用运行时默认目标。
       workspaceId: workspaceId === '' ? undefined : workspaceId,
       mode: mode === '' ? undefined : mode,
       permission: permission === '' ? undefined : permission as TaskPermission,
     })
     if (task === undefined) {
       setError(t('new.required'))
       return
     }
     // 创建成功：关闭弹窗，回到看板。
     onClose()
   }
 
   // 用 createPortal 把整个模态框渲染到 document.body，避免被看板容器的
   // 定位上下文（absolute 覆盖层）裁剪或层级遮蔽。
   return createPortal(
     // 遮罩：点击遮罩本身（而非弹窗内部）即关闭。
     <div className={css["bga-kb-modal-bg"]} onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
       <form
         className={css["bga-kb-modal"]}
         role="dialog"
         aria-label={t('board.new')}
         // 表单提交：阻止默认刷新，走 submit() 创建任务。
         onSubmit={event => { event.preventDefault(); submit() }}
       >
         <h2 className={css["bga-kb-modal-title"]}>{t('board.new')}</h2>
 
         <label className={css["bga-kb-fld"]}>
           <span className={css["bga-kb-fld-label"]}>{t('new.title')}</span>
           <input
             className={css["bga-kb-input"]}
             value={title}
             autoFocus
             placeholder={t('new.titlePlaceholder')}
             // 标题输入：自动聚焦；输入时清除上一轮的错误提示。
            onChange={event => { setTitle(event.target.value); setError(undefined) }}
           />
         </label>
 
         <label className={css["bga-kb-fld"]}>
           <span className={css["bga-kb-fld-label"]}>{t('new.description')}</span>
           <textarea
             className={css["bga-kb-input"]}
             rows={3}
             value={description}
             placeholder={t('new.descriptionPlaceholder')}
             onChange={event => { setDescription(event.target.value) }}
           />
         </label>
 
         <label className={css["bga-kb-fld"]}>
           <span className={css["bga-kb-fld-label"]}>{t('new.prompt')}</span>
           <textarea
             className={css["bga-kb-input"]}
             rows={4}
             value={prompt}
             placeholder={t('new.promptPlaceholder')}
             onChange={event => { setPrompt(event.target.value) }}
           />
         </label>
 
         <label className={css["bga-kb-fld"]}>
           <span className={css["bga-kb-fld-label"]}>{t('new.workspace')}</span>
           <select
             className={css["bga-kb-select"]}
             value={workspaceId}
             onChange={event => { setWorkspaceId(event.target.value) }}
           >
             // 工作区选择：空值 = 最近使用（默认）。
            <option value="">{t('exec.workspace.recent')}</option>
             {options.workspaces.map(workspace => (
               <option key={workspace.workspaceId} value={workspace.workspaceId}>{workspace.title}</option>
             ))}
           </select>
         </label>
 
         <label className={css["bga-kb-fld"]}>
           <span className={css["bga-kb-fld-label"]}>{t('new.mode')}</span>
           <select
             className={css["bga-kb-select"]}
             value={mode}
             onChange={event => { setMode(event.target.value) }}
           >
             <option value="">{t('exec.mode.default')}</option>
             // 模式选择：空值 = 部署默认；isDefault 预设追加「(默认)」，
            // broken 的预设（配置文件失效）禁用并标注「(不可用)」。
            {options.presets.map(preset => (
               <option key={preset.id} value={preset.id} disabled={preset.broken !== undefined}>
                 {preset.name ?? preset.id}
                 {preset.isDefault ? t('exec.mode.defaultSuffix') : ''}
                 {preset.broken !== undefined ? t('exec.mode.brokenSuffix') : ''}
               </option>
             ))}
           </select>
         </label>
 
         <label className={css["bga-kb-fld"]}>
           <span className={css["bga-kb-fld-label"]}>{t('new.permission')}</span>
           <select
             className={css["bga-kb-select"]}
             value={permission}
             onChange={event => { setPermission(event.target.value) }}
           >
             <option value="">{t('exec.permission.default')}</option>
             // 权限选择：空值 = 会话默认；枚举来自 TASK_PERMISSIONS。
            {TASK_PERMISSIONS.map(id => (
               <option key={id} value={id}>{t(`exec.permission.${id}` as TaskBoardKey)}</option>
             ))}
           </select>
         </label>
 
         {error !== undefined && <p className={css["bga-kb-fld-error"]}>{error}</p>}
 
         <footer className={css["bga-kb-modal-foot"]}>
           <button type="button" className={css["bga-kb-btn-ghost"]} onClick={onClose}>
             {t('new.cancel')}
           </button>
           <button type="submit" className={css["bga-kb-btn-primary"]}>
             {t('new.submit')}
           </button>
         </footer>
       </form>
     </div>,
     document.body,
   )
 }