/**
 * NewTaskModal.tsx —— 「新建任务」弹窗。
 *
 * 通过 createPortal 渲染到 document.body 的模态框，收集新任务信息：
 * 标题（必填）、描述、执行 Prompt、分类 / 日期 / 优先级 / 形态（轻量待办 | 可执行），
 * 以及可选的执行设置（工作区 / 模式（agent 预设）/ 权限）。
 * - 提交：调用 controller.createTask()，返回 undefined 表示标题为空，显示校验错误；
 *   成功则关闭弹窗；
 * - 可选入参 prefill：矩阵内新建时预填 分类 + 归属日期（reportDate）；
 * - 执行选项（可选工作区与预设清单）订阅控制器快照实时更新；
 * - Esc 或点击遮罩关闭；标题输入框自动聚焦。
 */

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { BoardController } from '../../../core/controller.ts'
import { TASK_PERMISSIONS, type TaskCategory, type TaskKind, type TaskPermission, type TaskPriority } from '../../../core/tasks.ts'
import { toDateKey } from '../../../core/matrix.ts'
import { categoriesOf } from '../../../core/workbench-meta.ts'
import { t, type TaskBoardKey } from '../locales.ts'
import css from '../kanban.module.css'
import { useDialogFocus } from './useDialogFocus.ts'

/**
 * 新建任务弹窗组件。
 *
 * @param props.controller 看板控制器：创建任务、读取执行选项。
 * @param props.onClose 关闭回调（取消 / 成功创建后触发）。
 * @param props.prefill 矩阵内新建预填（分类 + 归属日期）；缺省 undefined。
 */
export function NewTaskModal({ controller, onClose, prefill }: {
  controller: BoardController
  onClose: () => void
  prefill?: { category?: TaskCategory; reportDate?: string }
}) {
  // 对话框容器 ref：焦点管理（初始聚焦 + focus trap）。
  const dialogRef = useRef<HTMLFormElement>(null)
  useDialogFocus(dialogRef)
  // —— 表单受控状态 ——
  // 标题 / 描述 / 执行 Prompt 三个文本字段。
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState('')
  // 矩阵字段：分类 / 归属日期 / 优先级 / 形态（轻量待办 | 可执行）。
  const [category, setCategory] = useState<TaskCategory | ''>(prefill?.category ?? '')
  // 生效分类配置（含自定义分类）
  const [catDefs, setCatDefs] = useState<readonly import('../../../core/workbench-meta.ts').CategoryDef[]>(() => categoriesOf(controller.getSnapshot().meta))
  const [reportDate, setReportDate] = useState(prefill?.reportDate ?? toDateKey(new Date()))
  const [priority, setPriority] = useState<TaskPriority | ''>('')
  const [kind, setKind] = useState<TaskKind>('todo')
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
    () => controller.subscribe(() => {
      setOptions(controller.getSnapshot().executionOptions)
      setCatDefs(categoriesOf(controller.getSnapshot().meta))
    }),
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
      kind,
      category: category === '' ? undefined : category as TaskCategory,
      reportDate: reportDate === '' ? undefined : reportDate,
      priority: priority === '' ? undefined : priority as TaskPriority,
      // 空字符串统一转 undefined：让执行端使用运行时默认目标。
      workspaceId: workspaceId === '' ? undefined : workspaceId,
      mode: mode === '' ? undefined : mode,
      permission: permission === '' ? undefined : permission as TaskPermission,
    })
    if (task === undefined) {
      setError(t('new.required'))
      return
    }
    // 创建成功：关闭弹窗，回到工作台。
    onClose()
  }

  // 用 createPortal 把整个模态框渲染到 document.body，避免被工作台容器的
  // 定位上下文（absolute 覆盖层）裁剪或层级遮蔽。
  return createPortal(
    // 遮罩：点击遮罩本身（而非弹窗内部）即关闭。
    <div className={css["bga-kb-modal-bg"]} onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <form
        ref={dialogRef}
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
            placeholder={t('new.titlePlaceholder')}
            onChange={event => { setTitle(event.target.value); setError(undefined) }}
          />
        </label>

        {/* —— 矩阵字段：分类 / 归属日期 / 优先级 / 形态 —— */}
        <div className={css["bga-kb-fld-row"]}>
          <label className={css["bga-kb-fld"]}>
            <span className={css["bga-kb-fld-label"]}>{t('new.category')}</span>
            <select
              className={css["bga-kb-select"]}
              value={category}
              onChange={event => { setCategory(event.target.value as TaskCategory | '') }}
            >
              <option value="">{t('new.categoryNone')}</option>
              {catDefs.map(def => (
                <option key={def.id} value={def.id}>{def.label}</option>
              ))}
            </select>
          </label>
          <label className={css["bga-kb-fld"]}>
            <span className={css["bga-kb-fld-label"]}>{t('new.reportDate')}</span>
            <input
              className={css["bga-kb-input"]}
              type="date"
              value={reportDate}
              onChange={event => { setReportDate(event.target.value) }}
            />
          </label>
        </div>
        <div className={css["bga-kb-fld-row"]}>
          <label className={css["bga-kb-fld"]}>
            <span className={css["bga-kb-fld-label"]}>{t('new.priority')}</span>
            <select
              className={css["bga-kb-select"]}
              value={priority}
              onChange={event => { setPriority(event.target.value as TaskPriority | '') }}
            >
              <option value="">{t('new.priorityNone')}</option>
              {(['high', 'medium', 'low'] as const).map(id => (
                <option key={id} value={id}>{t(`new.priority.${id}` as TaskBoardKey)}</option>
              ))}
            </select>
          </label>
          <label className={css["bga-kb-fld"]}>
            <span className={css["bga-kb-fld-label"]}>{t('new.kind')}</span>
            <select
              className={css["bga-kb-select"]}
              value={kind}
              onChange={event => { setKind(event.target.value as TaskKind) }}
            >
              <option value="todo">{t('new.kind.todo')}</option>
              <option value="task">{t('new.kind.task')}</option>
            </select>
          </label>
        </div>


        {/* —— 快捷句式模板：按当前分类一键插入标题 —— */}
        {category !== '' && (
          <div className={css["bga-kb-fld"]}>
            <span className={css["bga-kb-fld-label"]}>{t('new.phrases')}</span>
            <div className={css["bga-kb-phrase-list"]}>
              {phraseTemplates(category).map(phrase => (
                <button
                  key={phrase}
                  type="button"
                  className={css["bga-kb-btn-ghost"]}
                  onClick={() => { setTitle(phrase); setError(undefined) }}
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        )}

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

/** 按分类返回快捷句式模板（M2） */
function phraseTemplates(category: string): string[] {
  switch (category) {
    case 'business': return ['完成需求 X 的技术方案设计', '修复 X bug 并上线', '完成需求 X 的开发与自测']
    case 'ops': return ['发布 vX 到预发环境', '排查并修复线上告警 X', '巡检各服务运行状态']
    case 'management': return ['组织周会并输出纪要', '跟进 X 的进度并同步', '整理迭代计划与排期']
    case 'support': return ['需要 X 组提供权限支持', '需要 X 协助排查问题', '需要 X 提供数据支撑']
    default: return []
  }
}
