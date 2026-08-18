 /**
 * TaskDetail.tsx —— 任务详情（全屏模态）。
 *
 * createPortal 渲染到 document.body 的模态对话框，展示并编辑单个任务：
 * - 头部：任务标题 + 状态徽标 + 关闭按钮；
 * - 正文：描述、执行 Prompt、执行设置小节（ExecutionSettingsSection：
 *   工作区 / 模式 / 权限，修改即调用 controller.updateTask 实时落库）、
 *   定时小节（ScheduleSection：启用开关 + Cron 表达式 + 预设 + 下次/上次运行）、
 *   执行记录列表（ExecutionRow，倒序展示每次执行的起止时间、结果、错误与
 *   会话跳转）、状态移动按钮（MANUAL_STATUSES：待规划 / 待办）；
 * - 底部动作：执行 / 重新执行、恢复或归档、删除（带确认框）。
 * 组件通过「latest 状态快照 + task 同步」在任务被外部更新（如执行结果回流）
 * 时即时刷新详情内容。
 */
 import { useEffect, useState } from 'react'
 import { createPortal } from 'react-dom'
 import type { BoardController } from '../../../core/controller.ts'
 import { isValidCron } from '../../../core/schedule.ts'
 import { MANUAL_STATUSES, TASK_PERMISSIONS, type ExecutionRecord, type TaskPermission, type TaskRecord, type TaskStatus } from '../../../core/tasks.ts'
 import { t, type TaskBoardKey } from '../locales.ts'
 import css from '../kanban.module.css'
 import { ConfirmDialog } from './ConfirmDialog.tsx'
 import { formatTime } from './TaskCard.tsx'

 // 执行结果（result）-> 结果文案 key 的映射（result 非空时使用）。
 const RESULT_KEY: Record<NonNullable<ExecutionRecord['result']>, TaskBoardKey> = {
   succeeded: 'detail.result.succeeded',
   failed: 'detail.result.failed',
   cancelled: 'detail.result.cancelled',
 }

 // 任务状态 -> 状态文案 key 的映射（状态徽标用）。
 const STATUS_KEY: Record<TaskStatus, TaskBoardKey> = {
   backlog: 'board.status.backlog',
   todo: 'board.status.todo',
   running: 'board.status.running',
   done: 'board.status.done',
   failed: 'board.status.failed',
 }

 /**
 * 单条执行记录行：展示结果徽标、起止时间、（可选）错误信息与「查看会话」入口。
 *
 * @param props.execution 一条执行记录。
 * @param props.onOpen 打开会话的回调（携带会话 id）。
 */
 function ExecutionRow({ execution, onOpen }: { execution: ExecutionRecord; onOpen: (sessionId: string) => void }) {
   const result = execution.result
   return (
     // 整行带 data-result 属性：行与徽标的颜色由 CSS 按结果（succeeded/failed/…）决定。
     <li className={css["bga-kb-ex-row"]} data-result={result}>
       <span className={css["bga-kb-ex-badge"]} data-result={result}>
         {/* result 为空表示执行仍在进行中 */}
         {result === undefined ? t('detail.result.running') : t(RESULT_KEY[result])}
       </span>
       <span className={css["bga-kb-ex-times"]}>
         {t('detail.executionStarted')} {formatTime(execution.startedAt)}
         {/* 已结束时追加结束时间 */}
         {execution.endedAt !== undefined && ` · ${t('detail.executionEnded')} ${formatTime(execution.endedAt)}`}
       </span>
       {/* 有会话时提供「查看会话」跳转按钮 */}
       {execution.sessionId !== undefined && (
         <button
           type="button"
           className={css["bga-kb-btn-link"]}
           onClick={() => { onOpen(execution.sessionId as string) }}
           title={execution.sessionId}
         >
           {t('detail.viewSession')} ⌁
         </button>
       )}
       {/* 失败/取消时展示错误信息 */}
       {execution.error !== undefined && execution.error !== '' && (
         <span className={css["bga-kb-ex-error"]}>{execution.error}</span>
       )}
     </li>
   )
 }

 // 定时预设：常用 Cron 表达式及其文案 key（用户可一键套用）。
// 四项分别为：每天 09:00 / 每小时 / 每 10 分钟 / 每周一 09:00。
 const SCHEDULE_PRESETS: ReadonlyArray<{ cron: string; label: TaskBoardKey }> = [
   { cron: '0 9 * * *', label: 'detail.schedule.preset.daily9' },
   { cron: '0 * * * *', label: 'detail.schedule.preset.hourly' },
   { cron: '*/10 * * * *', label: 'detail.schedule.preset.tenMin' },
   { cron: '0 9 * * 1', label: 'detail.schedule.preset.weeklyMon9' },
 ]

 /**
 * 执行设置小节：展示并编辑任务钉住的执行目标（工作区 / 模式 / 权限）。
 *
 * 三个下拉都直接调用 controller.updateTask 实时落库（无暂存、无保存按钮）。
 * 当任务引用的工作区/预设已不存在（被移除）时，会补一个带「(已移除)」后缀的
 * 选项让用户仍然能看到并改掉旧值。
 *
 * @param props.controller 看板控制器。
 * @param props.task 当前任务。
 */
 function ExecutionSettingsSection({ controller, task }: { controller: BoardController; task: TaskRecord }) {
   // 跟踪可用的执行选项（工作区 / 预设），订阅控制器快照自动刷新。
   const [options, setOptions] = useState(controller.getSnapshot().executionOptions)
   useEffect(
     () => controller.subscribe(() => setOptions(controller.getSnapshot().executionOptions)),
     [controller],
   )
   // 任务当前钉住的目标（空字符串 = 未钉住，使用运行时默认）。
   const workspaceId = task.workspaceId ?? ''
   const mode = task.mode ?? ''
   const permission = task.permission ?? ''

   // 当前钉住的值是否还在可选清单里（不在则说明已被移除）。
   const workspaceKnown = workspaceId === '' || options.workspaces.some(item => item.workspaceId === workspaceId)
   const modeKnown = mode === '' || options.presets.some(item => item.id === mode)
   return (
     <section className={css["bga-kb-det-section"]}>
       <h4>{t('detail.executionSettings')}</h4>
       <p className={css["bga-kb-det-text"]}>{t('exec.hint')}</p>
       <label className={css["bga-kb-fld"]}>
         <span className={css["bga-kb-fld-label"]}>{t('new.workspace')}</span>
         <select
           className={css["bga-kb-select"]}
           value={workspaceId}
           onChange={event => { controller.updateTask(task.id, { workspaceId: event.target.value }) }}
         >
           <option value="">{t('exec.workspace.recent')}</option>
           {/* 已被移除的工作区：保留为可选项以便识别和改掉 */}
           {!workspaceKnown && <option value={workspaceId}>{workspaceId}{t('exec.mode.removed')}</option>}
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
           onChange={event => { controller.updateTask(task.id, { mode: event.target.value }) }}
         >
           <option value="">{t('exec.mode.default')}</option>
           {/* 已被移除的预设：保留为可选项以便识别和改掉 */}
           {!modeKnown && <option value={mode}>{mode}{t('exec.mode.removed')}</option>}
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
           onChange={event => { controller.updateTask(task.id, { permission: event.target.value === '' ? undefined : event.target.value as TaskPermission }) }}
         >
           <option value="">{t('exec.permission.default')}</option>
           {TASK_PERMISSIONS.map(id => (
             <option key={id} value={id}>{t(`exec.permission.${id}` as TaskBoardKey)}</option>
           ))}
         </select>
       </label>
     </section>
   )
 }

 /**
 * 定时小节：启用定时执行 + 编辑 Cron 表达式 + 预设套用 + 运行概览。
 *
 * 交互细节：
 * - cron 输入框「失焦 / 回车」时校验并保存（saveCron）；校验失败只在本地
 *   出示错误，不落库；
 * - 启用开关：开启前先校验 cron；开启时会先保存当前 cron（若与已存值不同），
 *   再写入 enabled；
 * - 预设下拉：选中即把预设 cron 写入任务；
 * - 「下次运行 / 上次触发」由 controller 基于 Cron 计算/记录，这里仅展示：
 *   未启用或未排程显示「尚未排程」，已过期显示「即将运行」。
 *
 * @param props.controller 看板控制器。
 * @param props.task 当前任务。
 */
 function ScheduleSection({ controller, task }: { controller: BoardController; task: TaskRecord }) {
   const schedule = task.schedule
   // —— 本地编辑状态（初始值来自任务快照，保存动作才落库） ——
   const [cron, setCron] = useState(schedule?.cron ?? '0 9 * * *')
   const [enabled, setEnabled] = useState(schedule?.enabled ?? false)
   const [nextRunAt, setNextRunAt] = useState<number | undefined>(schedule?.nextRunAt)
   const [lastTriggeredAt, setLastTriggeredAt] = useState<number | undefined>(schedule?.lastTriggeredAt)
   const [error, setError] = useState<string | undefined>(undefined)

   // 任务快照变化（外部保存/计算回流）时，把本地编辑状态与任务保持同步。
   useEffect(() => {
     setCron(schedule?.cron ?? '0 9 * * *')
     setEnabled(schedule?.enabled ?? false)
     setNextRunAt(schedule?.nextRunAt)
     setLastTriggeredAt(schedule?.lastTriggeredAt)
     setError(undefined)
   }, [task.id, schedule?.enabled, schedule?.cron, schedule?.nextRunAt, schedule?.lastTriggeredAt])

   // 保存 cron：去空白后校验（非空且 isValidCron），合法才写入任务。
   const saveCron = (value: string): void => {
     const trimmed = value.trim()
     setCron(trimmed)
     if (trimmed === '' || !isValidCron(trimmed)) {
       setError(t('detail.schedule.invalid'))
       return
     }
     setError(undefined)
     controller.setSchedule(task.id, { cron: trimmed })
   }

   // 切换启用状态：开启前必须保证 cron 合法；若本地 cron 与已存值不同，
   // 先把 cron 写入，再写 enabled（保证启用的永远是当前编辑的表达式）。
   const toggleEnabled = (next: boolean): void => {
     const trimmed = cron.trim()
     if (next && (trimmed === '' || !isValidCron(trimmed))) {
       setError(t('detail.schedule.invalid'))
       return
     }
     setError(undefined)
     if (next && trimmed !== schedule?.cron) controller.setSchedule(task.id, { cron: trimmed })
     // setSchedule 返回 true 才同步本地 enabled（写入被拒则保持原状）。
     if (controller.setSchedule(task.id, { enabled: next })) setEnabled(next)
   }

   // 套用预设：非空时直接把预设 cron 写入任务，并同步本地编辑状态。
   const applyPreset = (preset: string): void => {
     if (preset === '') return
     setCron(preset)
     setError(undefined)
     controller.setSchedule(task.id, { cron: preset })
   }

   // 「下次运行」的展示逻辑：未启用/无排程 -> 尚未排程；
   // 已过期（<= now）-> 即将运行；否则显示本地化时间。
   const nextLabel = !enabled || nextRunAt === undefined
     ? t('detail.schedule.notScheduled')
     : nextRunAt <= Date.now()
       ? t('detail.schedule.dueSoon')
       : new Date(nextRunAt).toLocaleString()
   // 「上次触发」：无记录时用占位符「—」。
   const lastLabel = lastTriggeredAt === undefined ? '—' : new Date(lastTriggeredAt).toLocaleString()

   return (
     <section className={css["bga-kb-det-section"]}>
       <h4>{t('detail.schedule')}</h4>
       {/* 定时开关：开启前校验 Cron 合法性（由 toggleEnabled 处理） */}
       <label className={css["bga-kb-sch-toggle"]}>
         <input
           type="checkbox"
           checked={enabled}
           onChange={event => { toggleEnabled(event.target.checked) }}
         />
         <span>{t('detail.schedule.enable')}</span>
       </label>
       <div className={css["bga-kb-sch-row"]}>
         {/* Cron 输入：失焦 / 回车保存；非法时加错误样式 */}
         <input
           className={`${css["bga-kb-input"]} ${css["bga-kb-sch-input"]}${error !== undefined ? ` ${css["bga-kb-sch-input--err"]}` : ''}`}
           value={cron}
           placeholder="0 9 * * *"
           spellCheck={false}
           aria-label={t('detail.schedule.cron')}
           onChange={event => { setCron(event.target.value); setError(undefined) }}
           onBlur={() => { saveCron(cron) }}
           onKeyDown={event => { if (event.key === 'Enter') saveCron(cron) }}
         />
         {/* 预设下拉：选中即套用 */}
         <select
           className={css["bga-kb-sch-preset"]}
           value=""
           aria-label={t('detail.schedule.presets')}
           onChange={event => { applyPreset(event.target.value) }}
         >
           <option value="">{t('detail.schedule.presets')}…</option>
           {SCHEDULE_PRESETS.map(preset => (
             <option key={preset.cron} value={preset.cron}>{t(preset.label)}</option>
           ))}
         </select>
       </div>
       {error !== undefined && <p className={css["bga-kb-fld-error"]}>{error}</p>}
       <p className={css["bga-kb-sch-meta"]}>
         {t('detail.schedule.nextRun')} {nextLabel}
         {' · '}{t('detail.schedule.lastTriggered')} {lastLabel}
       </p>
     </section>
   )
 }

 /**
 * 任务详情组件（全屏模态）。
 *
 * createPortal 渲染到 document.body。内部维护两个要点：
 * - confirmDelete：控制删除确认框是否显示；
 * - latest/current：「latest 快照」保存当前展示的任务对象，task prop 变化
 *   时同步进去——这样当任务在后台被更新（例如执行结果回流、定时状态刷新）
 *   时，详情内容能跟随快照实时刷新。
 *
 * @param props.controller 看板控制器。
 * @param props.task 当前任务对象（受控输入）。
 */
 export function TaskDetail({ controller, task }: { controller: BoardController; task: TaskRecord }) {
   // 是否显示删除确认框。
   const [confirmDelete, setConfirmDelete] = useState(false)
  // 让当前聚焦元素失焦（关闭后清除残留焦点）。
  const blurActive = (): void => {
    const el = document.activeElement
    if (el instanceof HTMLElement && el !== document.body) el.blur()
  }

  // 挂载期间监听键盘：Esc 关闭详情（删除确认框打开时保留 Esc 给确认框用）。
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && !confirmDelete) {
        controller.closeTask()
        blurActive()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [controller, confirmDelete])
   // 任务是否「运行中」（决定执行/移动按钮的禁用态）。
   const running = task.status === 'running'

   // latest 快照：初始化取传入任务；task 变化时同步，使详情随快照刷新。
   const [latest, setLatest] = useState(task)
   useEffect(() => { setLatest(task) }, [task])
   const current = latest

   // 用 createPortal 把详情渲染到 document.body，避免被看板定位上下文裁剪/遮蔽。
   return createPortal(
     // 遮罩：点击遮罩本身（而非详情面板）即关闭。
     <div className={css["bga-kb-modal-bg"]} onMouseDown={event => { if (event.target === event.currentTarget) controller.closeTask() }}>
       <div className={css["bga-kb-det"]} role="dialog" aria-label={t('detail.title')}>
         {/* 标题 + 状态徽标 + 关闭按钮 */}
        <header className={css["bga-kb-det-header"]}>
           <h2 className={css["bga-kb-det-title"]}>{current.title}</h2>
           <span className={css["bga-kb-badge"]} data-status={current.status}>{t(STATUS_KEY[current.status])}</span>
           <button
             type="button"
             className={css["bga-kb-btn-icon"]}
             aria-label={t('detail.close')}
             onClick={() => { controller.closeTask() }}
           >
             ×
           </button>
         </header>

         <div className={css["bga-kb-det-body"]}>
           {/* 描述（空时显示占位符 —） */}
           <section className={css["bga-kb-det-section"]}>
             <h4>{t('detail.description')}</h4>
             <p className={css["bga-kb-det-text"]}>{current.description !== '' ? current.description : '—'}</p>
           </section>

           {/* 执行 Prompt（空时回落到标题） */}
           <section className={css["bga-kb-det-section"]}>
             <h4>{t('detail.prompt')}</h4>
             <pre className={css["bga-kb-prompt"]}>{current.prompt !== '' ? current.prompt : current.title}</pre>
           </section>

           <ExecutionSettingsSection controller={controller} task={current} />

           <ScheduleSection controller={controller} task={current} />

           {/* 执行记录：倒序显示（最新在前） */}
           <section className={css["bga-kb-det-section"]}>
             <h4>{t('detail.execution')}</h4>
             {current.executions.length === 0 ? (
               <p className={css["bga-kb-det-text"]}>{t('detail.noExecution')}</p>
             ) : (
               <ul className={css["bga-kb-ex-list"]}>
                 {[...current.executions].reverse().map(execution => (
                   <ExecutionRow
                     key={execution.id}
                     execution={execution}
                     onOpen={sessionId => { controller.openSession(sessionId) }}
                   />
                 ))}
               </ul>
             )}
           </section>

           {/* 状态移动：仅提供「待规划 / 待办」两个手动状态（运行中或已是该状态时禁用） */}
           <section className={css["bga-kb-det-section"]}>
             <h4>{t('board.status')}</h4>
             <div className={css["bga-kb-move"]}>
               {MANUAL_STATUSES.map(status => (
                 <button
                   key={status}
                   type="button"
                   className={css["bga-kb-btn-ghost"]}
                   disabled={current.status === status || running}
                   onClick={() => { controller.moveTask(current.id, status) }}
                 >
                   {t(`status.move.${status}` as TaskBoardKey)}
                 </button>
               ))}
             </div>
           </section>
         </div>

         <footer className={css["bga-kb-det-foot"]}>
           <button
             type="button"
             className={css["bga-kb-btn-primary"]}
             disabled={running}
             onClick={() => {

               controller.closeTask()
               void controller.rerunTask(current.id)
             }}
           >
             {current.executions.length === 0 ? t('detail.run') : t('detail.rerun')}
           </button>
           {/* 已归档任务提供「恢复」；未归档且处于终态（已完成/已失败）提供「归档」 */}
           {current.archivedAt !== undefined ? (
             <button
               type="button"
               className={css["bga-kb-btn-primary"]}
               onClick={() => {
                 controller.restoreTask(current.id)
                 controller.closeTask()
               }}
             >
               {t('detail.restore')}
             </button>
           ) : (
            (current.status === 'done' || current.status === 'failed') && (
               <button
                 type="button"
                 className={css["bga-kb-btn-ghost"]}
                 onClick={() => {
                   controller.archiveTask(current.id)
                   controller.closeTask()
                 }}
               >
                 {t('detail.archive')}
               </button>
             )
           )}
           {/* 删除：打开删除确认框 */}
           <button
             type="button"
             className={css["bga-kb-btn-danger"]}
             onClick={() => { setConfirmDelete(true) }}
           >
             {t('detail.delete')}
           </button>
           {/* 创建时间 / 归档时间（若已归档） */}
          <span className={css["bga-kb-det-meta"]}>
             {t('board.created')} {formatTime(current.createdAt)}
             {current.archivedAt !== undefined && ` · ${t('detail.archivedAt', { time: formatTime(current.archivedAt) })}`}
           </span>
         </footer>
       </div>

       {/* 删除确认框（二级确认后才真正删除） */}
      {confirmDelete && (
         <ConfirmDialog
           title={t('delete.title')}
           message={t('delete.confirm', { name: current.title })}
           confirmLabel={t('delete.ok')}
           danger
           onCancel={() => { setConfirmDelete(false) }}
           onConfirm={() => {
             setConfirmDelete(false)
             controller.deleteTask(current.id)
             controller.closeTask()
           }}
         />
       )}
     </div>,
     document.body,
   )
 }