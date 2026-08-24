/**
 * MatrixView.tsx —— 周矩阵工作台视图（分类 × 周一到周日 / 周日起始可配）。
 *
 * M2 能力：
 * - 周起始可配置（monday/sunday，取自 meta.weekStart，缺省 monday）；
 * - 分类行头/落格/导出全部读取 meta.categories 配置（缺省内置四类）；
 * - 「期望支持」闭环：support 类任务显示 待响应/处理中/已解决 徽标，详情可推进；
 * - 统计面板：本周各分类任务量与完成率（自绘条形，无第三方依赖）；
 * - 日报提醒：meta.reminder 启用时，到点且当日未完成 → 横幅提醒；
 * - 备份导出：tasks + meta 一键 JSON 下载；
 * - 分类管理弹窗：增删分类（id + label）。
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { selectedTaskOf, type BoardController } from '../../../core/controller.ts'
import {
  byPriorityThenCreatedAt, categoriesOf, dayReportMarkdown, dayStatus, mondayOf,
  toDateKey, toPlainReport, weekDays, weekReportMarkdown, weekdayName,
  type DayStatus,
} from '../../../core/matrix.ts'
import { isValidCron, nextRunAtMs } from '../../../core/schedule.ts'
import {
  categoryLabelOf, weekStartOf,
  type CategoryDef,
} from '../../../core/workbench-meta.ts'
import { t } from '../locales.ts'
import css from '../kanban.module.css'
import mcss from '../matrix.module.css'
import { NewTaskModal } from './NewTaskModal.tsx'
import { TaskDetail } from './TaskDetail.tsx'
import { useDialogFocus } from './useDialogFocus.ts'

/** 今天的 yyyy-mm-dd（本地时区） */
export function todayKeyOf(now: Date = new Date()): string {
  return toDateKey(now)
}

/** 列头三态 → 徽标文案 key */
const DAY_STATUS_KEY: Record<DayStatus, string> = {
  empty: 'matrix.day.empty',
  draft: 'matrix.day.draft',
  done: 'matrix.day.done',
}

/** support 闭环状态 → 徽标文案 key */
const SUPPORT_KEY: Record<string, string> = {
  pending: 'matrix.support.pending',
  processing: 'matrix.support.processing',
  resolved: 'matrix.support.resolved',
}

/**
 * 单个任务行（单元格内）。
 */
function CellTaskRow({ controller, task, onOpen }: { controller: BoardController; task: import('../../../core/tasks.ts').TaskRecord; onOpen: (id: string) => void }) {
  const running = task.status === 'running'
  const done = task.status === 'done'
  const toggle = (): void => {
    if (running) return
    controller.moveTask(task.id, done ? 'todo' : 'done')
  }
  return (
    <div
      className={mcss['bga-mx-task']}
      data-status={task.status}
      onClick={event => { event.stopPropagation(); onOpen(task.id) }}
      title={task.description !== '' ? task.description : task.title}
    >
      <input
        type="checkbox"
        className={mcss['bga-mx-task-check']}
        checked={done}
        disabled={running}
        aria-label={t('matrix.task.toggleDone')}
        onClick={event => { event.stopPropagation() }}
        onChange={toggle}
      />
      {/* 标题作为真正的按钮：可键盘聚焦回车打开，且不与复选框形成按钮嵌套 */}
      <button
        type="button"
        className={mcss['bga-mx-task-title']}
        onClick={event => { event.stopPropagation(); onOpen(task.id) }}
      >
        {task.title}
      </button>
      {/* 期望支持闭环徽标 */}
      {task.category === 'support' && task.supportStatus !== undefined && task.status !== 'done' && (
        <span className={mcss['bga-mx-support']} data-status={task.supportStatus}>
          {t((SUPPORT_KEY[task.supportStatus] ?? 'matrix.support.pending') as never)}
        </span>
      )}
      {task.dueDate !== undefined && <span className={mcss['bga-mx-task-due']}>{t('matrix.task.due')} {task.dueDate.slice(5)}</span>}
      {task.priority === 'high' && <span className={mcss['bga-mx-prio']} data-prio="high" />}
      {task.executions.length > 0 && (
        <span className={mcss['bga-mx-task-exec']} data-result={task.executions[task.executions.length - 1]?.result}>
          {task.executions.length}x
        </span>
      )}
      {running && <span className={mcss['bga-mx-task-spinner']} aria-hidden="true" />}
    </div>
  )
}

/**
 * 矩阵视图。
 */
export function MatrixView({ controller }: { controller: BoardController }) {
  const [snapshot, setSnapshot] = useState(controller.getSnapshot())
  const [weekOffset, setWeekOffset] = useState(0)
  const [prefill, setPrefill] = useState<{ category: string; date: string } | undefined>(undefined)
  const [showNew, setShowNew] = useState(false)
  const [filter, setFilter] = useState('')
  // 周汇总导出菜单展开态 + 复制反馈文案
  const [exportOpen, setExportOpen] = useState(false)
  const [exportHint, setExportHint] = useState('')
  // 统计面板 / 分类管理 / 提醒设置 弹窗展开态
  const [statsOpen, setStatsOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [reminderOpen, setReminderOpen] = useState(false)
  // 提醒横幅（本会话内「知道了」后不再显示）
  const [snoozedReminder, setSnoozedReminder] = useState(false)

  // 周汇总导出菜单容器 ref：用于「点击菜单外部空白即关闭」
  const exportRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!exportOpen) return
    const onMouseDown = (event: MouseEvent): void => {
      if (exportRef.current !== null && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => { document.removeEventListener('mousedown', onMouseDown) }
  }, [exportOpen])

  // 订阅控制器快照
  useEffect(() => controller.subscribe(() => setSnapshot(controller.getSnapshot())), [controller])

  // 生效配置：周起始 / 分类定义
  const weekStart = weekStartOf(snapshot.meta)
  const categories = categoriesOf(snapshot.meta.categories)
  const categoryLabel = useCallback((id: string): string => categoryLabelOf(snapshot.meta, id), [snapshot.meta])

  // 当前周基准（起始日），按生效周起始计算
  const anchor = useMemo(() => {
    const now = new Date()
    now.setDate(now.getDate() + weekOffset * 7)
    return mondayOf(now, weekStart)
  }, [weekOffset, weekStart])
  const days = weekDays(anchor)
  const isCurrentWeek = weekOffset === 0

  // 选中任务（详情弹窗）
  const selected = selectedTaskOf(snapshot)

  // 过滤词
  const needle = filter.trim().toLowerCase()
  const matches = (task: import('../../../core/tasks.ts').TaskRecord): boolean =>
    needle === '' || task.title.toLowerCase().includes(needle) || task.description.toLowerCase().includes(needle)

  const openTask = useCallback((id: string): void => { controller.openTask(id) }, [controller])

  const addInCell = (category: string, date: string): void => {
    setPrefill({ category, date })
    setShowNew(true)
  }

  const toggleDay = (date: string): void => { controller.toggleDayDone(date) }

  // 复制 Markdown 到剪贴板（带失败反馈）
  const copyText = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setExportHint(t('matrix.export.copied'))
    } catch {
      setExportHint(t('matrix.export.failed'))
    }
    window.setTimeout(() => { setExportHint('') }, 2000)
  }, [])

  // 导出：整周 / 指定单日（本周内）/ 纯文本 / JSON 备份
  const copyWeek = useCallback((): void => {
    void copyText(weekReportMarkdown(snapshot.tasks, anchor, snapshot.meta.categories))
    setExportOpen(false)
  }, [copyText, snapshot.tasks, anchor, snapshot.meta.categories])
  const copyDay = useCallback((date: string): void => {
    void copyText(dayReportMarkdown(snapshot.tasks, date, snapshot.meta.categories))
    setExportOpen(false)
  }, [copyText, snapshot.tasks, snapshot.meta.categories])
  const copyPlain = useCallback((): void => {
    void copyText(toPlainReport(weekReportMarkdown(snapshot.tasks, anchor, snapshot.meta.categories)))
    setExportOpen(false)
  }, [copyText, snapshot.tasks, anchor, snapshot.meta.categories])
  // JSON 备份导出：tasks + meta 合并下载
  const exportBackup = useCallback(async (): Promise<void> => {
    try {
      const blob = new Blob([JSON.stringify({ tasks: snapshot.tasks, meta: snapshot.meta }, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bga-workbench-backup-${todayKeyOf()}.json`
      document.body.append(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setExportHint(t('matrix.backup.done'))
    } catch {
      setExportHint(t('matrix.backup.fail'))
    }
    setExportOpen(false)
  }, [snapshot.tasks, snapshot.meta])

  const dayMeta = snapshot.meta
  const dayStatusOf = (date: string): DayStatus => dayStatus(snapshot.tasks, date, dayMeta.dayDoneAt)

  // —— 日报提醒逻辑 ——
  // 是否已启用提醒、今日 cron 触发时刻，以及今日是否「未完成」
  const reminder = snapshot.meta.reminder
  const reminderEnabled = reminder?.enabled === true && isValidCron(reminder.cron)
  const todayStr = todayKeyOf()
  const todayPending = dayStatusOf(todayStr) !== 'done'
  // 每分钟 tick 一次，驱动日报提醒横幅在 cron 到点时自动出现（否则仅靠其它状态变化被动重渲染）
  const [, setReminderTick] = useState(0)
  useEffect(() => {
    if (!reminderEnabled) return
    const timer = setInterval(() => { setReminderTick(value => value + 1) }, 60_000)
    return () => { clearInterval(timer) }
  }, [reminderEnabled])
  const reminderDue = ((): boolean => {
    if (!reminderEnabled || todayPending === false) return false
    // 今日 cron 触发时刻 = 从今日 00:00 起的下一次匹配
    const from = new Date()
    from.setHours(0, 0, 0, 0)
    const next = nextRunAtMs(reminder!.cron, from.getTime())
    return next !== undefined && Date.now() >= next
  })()
  // 「知道了」后持久化的 lastTriggeredAt 即为去重依据：今天已触发过则不再弹（刷新/重开页面也生效）
  const reminderTriggeredToday = reminder?.lastTriggeredAt !== undefined
    && toDateKey(new Date(reminder.lastTriggeredAt)) === todayStr
  const showReminderBanner = reminderDue && !snoozedReminder && !reminderTriggeredToday

  // —— 分类管理 ——
  const [draftCategories, setDraftCategories] = useState<CategoryDef[]>([])
  const openCategoryManager = (): void => {
    setDraftCategories(categories.map(def => ({ ...def })))
    setCategoryOpen(true)
  }
  const saveCategories = (): void => {
    controller.setCategories(draftCategories)
    setCategoryOpen(false)
  }

  return (
    <div className={mcss['bga-mx']}>
      {/* —— 日报提醒横幅 —— */}
      {showReminderBanner && (
        <div className={mcss['bga-mx-reminder']}>
          <div>
            <strong>{t('matrix.reminder.title')}</strong>
            <span>{t('matrix.reminder.body')}</span>
          </div>
          <button
            type="button"
            className={css['bga-kb-btn-primary']}
            onClick={() => {
              setSnoozedReminder(true)
              controller.markReminderTriggered()
            }}
          >
            {t('matrix.reminder.gotIt')}
          </button>
        </div>
      )}

      {/* —— 工具栏 —— */}
      <header className={mcss['bga-mx-toolbar']}>
        <div className={mcss['bga-mx-week-nav']}>
          <button type="button" className={css['bga-kb-btn-ghost']} onClick={() => { setWeekOffset(weekOffset - 1) }} aria-label={t('matrix.prevWeek')}>‹</button>
          <button
            type="button"
            className={css['bga-kb-btn-ghost']}
            onClick={() => { setWeekOffset(0) }}
            title={t('matrix.backToThisWeek')}
          >
            {isCurrentWeek ? t('matrix.thisWeek') : ''} {formatWeekRange(days)}
          </button>
          <button type="button" className={css['bga-kb-btn-ghost']} onClick={() => { setWeekOffset(weekOffset + 1) }} aria-label={t('matrix.nextWeek')}>›</button>
          {!isCurrentWeek && (
            <button type="button" className={css['bga-kb-btn-primary']} onClick={() => { setWeekOffset(0) }}>{t('matrix.today')}</button>
          )}
          {/* 周起始切换 */}
          <span className={mcss['bga-mx-weekstart']}>
            {t('matrix.weekStart')}:
            <button
              type="button"
              className={weekStart === 'monday' ? css['bga-kb-btn-primary'] : css['bga-kb-btn-ghost']}
              onClick={() => { controller.setWeekStart('monday') }}
            >
              {t('matrix.weekStart.monday')}
            </button>
            <button
              type="button"
              className={weekStart === 'sunday' ? css['bga-kb-btn-primary'] : css['bga-kb-btn-ghost']}
              onClick={() => { controller.setWeekStart('sunday') }}
            >
              {t('matrix.weekStart.sunday')}
            </button>
          </span>
        </div>
        <div className={mcss['bga-mx-toolbar-right']}>
          <input
            className={css['bga-kb-search']}
            type="search"
            placeholder={t('board.search')}
            value={filter}
            onChange={event => { setFilter(event.target.value) }}
            aria-label={t('board.search')}
          />
          {/* 统计面板 */}
          <button type="button" className={css['bga-kb-btn-ghost']} onClick={() => { setStatsOpen(!statsOpen) }}>
            {t('matrix.stats')}
          </button>
          {/* 分类管理 */}
          <button type="button" className={css['bga-kb-btn-ghost']} onClick={openCategoryManager}>
            {t('matrix.categoryManage')}
          </button>
          {/* 提醒设置 */}
          <button type="button" className={css['bga-kb-btn-ghost']} onClick={() => { setReminderOpen(true) }}>
            {t('matrix.reminder.setting')}
          </button>
          {/* 周汇总导出 */}
          <div ref={exportRef} className={mcss['bga-mx-export']}>
            <button
              type="button"
              className={css['bga-kb-btn-ghost']}
              onClick={() => { setExportOpen(!exportOpen) }}
            >
              {t('matrix.export')} ▾
            </button>
            {exportOpen && (
              <div className={mcss['bga-mx-export-menu']}>
                <button type="button" onClick={copyWeek}>{t('matrix.export.week')}</button>
                <button type="button" onClick={copyPlain}>{t('matrix.export.plain')}</button>
                <button type="button" onClick={() => { void exportBackup() }}>{t('matrix.backup')}</button>
                {days.map(date => (
                  <button key={date} type="button" onClick={() => { copyDay(date) }}>
                    {t('matrix.export.day')} · {weekdayName(date)} {Number(date.slice(8))}
                  </button>
                ))}
              </div>
            )}
            {exportHint !== '' && <span className={mcss['bga-mx-export-hint']}>{exportHint}</span>}
          </div>
          <button type="button" className={css['bga-kb-btn-primary']} onClick={() => { setPrefill(undefined); setShowNew(true) }}>
            + {t('board.new')}
          </button>
        </div>
      </header>

      {/* —— 统计面板（本周概览） —— */}
      {statsOpen && <StatsPanel tasks={snapshot.tasks} days={days} categories={categories} categoryLabel={categoryLabel} onClose={() => { setStatsOpen(false) }} />}

      {/* —— 矩阵主体 —— */}
      <div className={mcss['bga-mx-grid' as never]} data-week={isCurrentWeek ? 'current' : 'other'}>
        {/* 行头列 */}
        <div className={mcss['bga-mx-rowhead']}>
          <div className={mcss['bga-mx-corner']} />
          {categories.map(def => {
            const count = snapshot.tasks.filter(task => task.category === def.id && task.archivedAt === undefined).length
            return (
              <div key={def.id} className={mcss['bga-mx-rowhead-cell']}>
                <span className={mcss['bga-mx-rowhead-name']}>{def.label}</span>
                <span className={mcss['bga-mx-rowhead-count']}>{count}</span>
              </div>
            )
          })}
        </div>

        {/* 7 天列 */}
        {days.map(date => {
          const status = dayStatusOf(date)
          const today = date === todayKeyOf()
          return (
            <div key={date} className={mcss['bga-mx-daycol']} data-today={today || undefined}>
              {/* 列头 */}
              <div className={mcss['bga-mx-dayhead']} data-status={status}>
                <div className={mcss['bga-mx-dayhead-date']}>
                  <span className={mcss['bga-mx-dayhead-num']}>{Number(date.slice(8))}</span>
                  <span className={mcss['bga-mx-dayhead-week']}>{weekdayName(date)}</span>
                  {today && <span className={mcss['bga-mx-dayhead-today']}>{t('matrix.today')}</span>}
                </div>
                <button
                  type="button"
                  className={mcss['bga-mx-dayhead-badge']}
                  data-status={status}
                  disabled={status === 'empty'}
                  title={status === 'done' ? t('matrix.day.unmark') : t('matrix.day.mark')}
                  onClick={() => { toggleDay(date) }}
                >
                  {t(DAY_STATUS_KEY[status] as never)}
                </button>
              </div>
              {/* 单元格（分类配置驱动） */}
              {categories.map(def => {
                const tasks = snapshot.tasks
                  .filter(task => matches(task) && task.category === def.id && task.reportDate === date && task.archivedAt === undefined)
                  .sort(byPriorityThenCreatedAt)
                return (
                  <div
                    key={def.id}
                    className={mcss['bga-mx-cell']}
                    data-has-tasks={tasks.length > 0 || undefined}
                  >
                    {tasks.map(task => (
                      <CellTaskRow key={task.id} controller={controller} task={task} onOpen={openTask} />
                    ))}
                    {/* 「在此新建」按钮：占据单元格空白区域（空单元格显示＋），键盘回车可达 */}
                    <button
                      type="button"
                      className={mcss['bga-mx-cell-add']}
                      aria-label={t('matrix.cell.addHere')}
                      title={t('matrix.cell.addHere')}
                      onClick={() => { addInCell(def.id, date) }}
                    >
                      {tasks.length === 0 ? '＋' : ''}
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* —— 分类管理弹窗 —— */}
      {categoryOpen && (
        <CategoryManager
          initial={draftCategories}
          onChange={setDraftCategories}
          onCancel={() => { setCategoryOpen(false) }}
          onSave={saveCategories}
        />
      )}

      {/* —— 日报提醒设置弹窗 —— */}
      {reminderOpen && (
        <ReminderSettings
          controller={controller}
          onClose={() => { setReminderOpen(false) }}
        />
      )}

      {/* —— 新建任务弹窗（预填分类/日期） —— */}
      {showNew && (
        <NewTaskModal
          controller={controller}
          onClose={() => { setShowNew(false) }}
          prefill={prefill === undefined ? undefined : { category: prefill.category, reportDate: prefill.date }}
        />
      )}

      {/* 任务详情（复用全屏模态） */}
      {selected !== undefined && <TaskDetail controller={controller} task={selected} />}
    </div>
  )
}

/** 周范围标签：8.18 – 8.24 */
function formatWeekRange(days: string[]): string {
  const short = (key: string): string => key.slice(5).replace('-', '.')
  return `${short(days[0]!)} – ${short(days[6]!)}`
}

/**
 * 统计面板：本周各分类任务量 / 完成数 / 完成率（自绘条形）。
 */
function StatsPanel({ tasks, days, categories, categoryLabel, onClose }: {
  tasks: readonly import('../../../core/tasks.ts').TaskRecord[]
  days: string[]
  categories: readonly CategoryDef[]
  categoryLabel: (id: string) => string
  onClose: () => void
}) {
  // 对话框容器 ref：焦点管理（初始聚焦 + focus trap）。
  const dialogRef = useRef<HTMLDivElement>(null)
  useDialogFocus(dialogRef)
  // Esc 关闭（与其他模态保持一致）。
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])
  const daySet = new Set(days)
  const rows = categories.map(def => {
    const weekTasks = tasks.filter(task =>
      task.category === def.id
      && task.archivedAt === undefined
      && task.reportDate !== undefined
      && daySet.has(task.reportDate),
    )
    const done = weekTasks.filter(task => task.status === 'done').length
    return { id: def.id, label: categoryLabel(def.id), total: weekTasks.length, done }
  })
  const total = rows.reduce((sum, row) => sum + row.total, 0)
  const doneAll = rows.reduce((sum, row) => sum + row.done, 0)
  const maxTotal = Math.max(1, ...rows.map(row => row.total))

  return createPortal(
    <div className={css['bga-kb-modal-bg']} onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={dialogRef} className={mcss['bga-mx-stats']} role="dialog" aria-label={t('matrix.stats.title')}>
        <h2 className={css['bga-kb-modal-title']}>{t('matrix.stats.title')}</h2>
        {total === 0 && <p className={mcss['bga-mx-stats-empty']}>{t('matrix.stats.noData')}</p>}
        {rows.map(row => (
          <div key={row.id} className={mcss['bga-mx-stats-row']}>
            <span className={mcss['bga-mx-stats-label']}>{row.label}</span>
            <span className={mcss['bga-mx-stats-bar']}>
              <span
                className={mcss['bga-mx-stats-fill']}
                style={{ width: `${Math.round((row.total / maxTotal) * 100)}%` }}
                data-full={row.total >= maxTotal && row.total > 0 || undefined}
              />
            </span>
            <span className={mcss['bga-mx-stats-num']}>
              {row.done}/{row.total}{row.total > 0 ? ` · ${Math.round((row.done / row.total) * 100)}%` : ''}
            </span>
          </div>
        ))}
        {total > 0 && (
          <div className={mcss['bga-mx-stats-total']}>
            {t('matrix.stats.total')}: {doneAll}/{total} · {Math.round((doneAll / total) * 100)}%
          </div>
        )}
        <footer className={css['bga-kb-modal-foot']}>
          <button type="button" className={mcss['bga-mx-stats-close']} onClick={onClose}>{t('new.cancel')}</button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}

/**
 * 分类管理弹窗：编辑 id + label 列表（含增删）。
 */
function CategoryManager({ initial, onChange, onCancel, onSave }: {
  initial: CategoryDef[]
  onChange: (next: CategoryDef[]) => void
  onCancel: () => void
  onSave: () => void
}) {
  // 对话框容器 ref：焦点管理（初始聚焦 + focus trap）。
  const dialogRef = useRef<HTMLDivElement>(null)
  useDialogFocus(dialogRef)
  const [id, setId] = useState('')
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  // Esc 关闭（与其他模态保持一致）
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  const add = (): void => {
    const trimmedId = id.trim().toLowerCase()
    const trimmedLabel = label.trim()
    if (trimmedId === '' || trimmedLabel === '') { setError(t('matrix.category.emptyLabel')); return }
    if (initial.some(def => def.id === trimmedId)) { setError(t('matrix.category.dupId')); return }
    onChange([...initial, { id: trimmedId, label: trimmedLabel }])
    setId(''); setLabel(''); setError('')
  }
  const remove = (defId: string): void => {
    if (initial.length <= 1) return
    onChange(initial.filter(def => def.id !== defId))
  }

  return createPortal(
    <div className={css['bga-kb-modal-bg']} onMouseDown={event => { if (event.target === event.currentTarget) onCancel() }}>
      <div ref={dialogRef} className={css['bga-kb-modal']} role="dialog" aria-label={t('matrix.categoryManage')}>
        <h2 className={css['bga-kb-modal-title']}>{t('matrix.categoryManage')}</h2>
        <div className={mcss['bga-mx-cat-list']}>
          {initial.map(def => (
            <div key={def.id} className={mcss['bga-mx-cat-item']}>
              <span className={mcss['bga-mx-cat-id']}>{def.id}</span>
              <span className={mcss['bga-mx-cat-name']}>{def.label}</span>
              <button
                type="button"
                className={css['bga-kb-btn-danger']}
                disabled={initial.length <= 1}
                title={initial.length <= 1 ? t('matrix.category.keepOne') : undefined}
                onClick={() => { remove(def.id) }}
              >
                {t('matrix.category.remove')}
              </button>
            </div>
          ))}
        </div>
        <div className={mcss['bga-mx-cat-new']}>
          <input className={css['bga-kb-input']} placeholder={t('matrix.category.id')} value={id} onChange={event => { setId(event.target.value); setError('') }} />
          <input className={css['bga-kb-input']} placeholder={t('matrix.category.label')} value={label} onChange={event => { setLabel(event.target.value); setError('') }} />
          <button type="button" className={css['bga-kb-btn-primary']} onClick={add}>{t('matrix.category.add')}</button>
        </div>
        {error !== '' && <p className={css['bga-kb-fld-error']}>{error}</p>}
        <p className={mcss['bga-mx-cat-note']}>{t('matrix.category.removedNote')}</p>
        <footer className={css['bga-kb-modal-foot']}>
          <button type="button" className={css['bga-kb-btn-ghost']} onClick={onCancel}>{t('new.cancel')}</button>
          <button type="button" className={css['bga-kb-btn-primary']} onClick={onSave}>{t('settings.save')}</button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}

/**
 * 日报提醒设置弹窗：启用开关 + cron 输入。
 */
function ReminderSettings({ controller, onClose }: { controller: BoardController; onClose: () => void }) {
  // 对话框容器 ref：焦点管理（初始聚焦 + focus trap）。
  const dialogRef = useRef<HTMLDivElement>(null)
  useDialogFocus(dialogRef)
  const [snapshot, setSnapshot] = useState(controller.getSnapshot())
  useEffect(() => controller.subscribe(() => setSnapshot(controller.getSnapshot())), [controller])
  const reminder = snapshot.meta.reminder
  const [enabled, setEnabled] = useState(reminder?.enabled ?? false)
  const [cron, setCron] = useState(reminder?.cron ?? '0 21 * * *')
  const cronValid = isValidCron(cron)

  // Esc 关闭（与其他模态保持一致）
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return createPortal(
    <div className={css['bga-kb-modal-bg']} onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={dialogRef} className={css['bga-kb-modal']} role="dialog" aria-label={t('matrix.reminder.setting')}>
        <h2 className={css['bga-kb-modal-title']}>{t('matrix.reminder.setting')}</h2>
        <label className={css['bga-kb-fld']}>
          <span className={css['bga-kb-fld-label']}>
            <input type="checkbox" checked={enabled} onChange={event => { setEnabled(event.target.checked) }} /> {t('matrix.reminder.enable')}
          </span>
        </label>
        <label className={css['bga-kb-fld']}>
          <span className={css['bga-kb-fld-label']}>{t('matrix.reminder.cron')}</span>
          <input className={css['bga-kb-input']} value={cron} onChange={event => { setCron(event.target.value) }} placeholder="0 21 * * *" />
        </label>
        <p className={mcss['bga-mx-cat-note']}>{t('matrix.reminder.cronHint')}</p>
        {!cronValid && <p className={css['bga-kb-fld-error']}>{t('detail.schedule.invalid')}</p>}
        <footer className={css['bga-kb-modal-foot']}>
          <button type="button" className={css['bga-kb-btn-ghost']} onClick={onClose}>{t('new.cancel')}</button>
          <button
            type="button"
            className={css['bga-kb-btn-primary']}
            disabled={!cronValid}
            onClick={() => {
              controller.setReminder({ enabled: enabled && cronValid, cron })
              onClose()
            }}
          >
            {t('settings.save')}
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}