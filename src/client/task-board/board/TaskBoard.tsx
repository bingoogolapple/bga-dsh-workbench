/**
 * TaskBoard.tsx —— 任务看板主视图（列表列 + 搜索 + 快速添加 + 详情/新建/删除）。
 *
 * 看板的核心界面组件：
 * - 订阅看板控制器（BoardController）快照，驱动任务列表渲染；
 * - 顶部工具区：筛选框（按标题/描述模糊匹配）、归档视图切换、
 *   新建任务按钮、快速添加输入框（回车即建「待办」）、（非内嵌时）返回对话按钮；
 * - 中央列区：默认按 COLUMNS 五列渲染（待规划/待办/进行中/已完成/已失败），
 *   归档视图则渲染单个「归档」列；
 * - 下方挂载任务详情（TaskDetail，全屏模态）、新建任务弹窗（NewTaskModal，
 *   同样模态）与删除确认框（ConfirmDialog，createPortal 到 body）。
 * - MemoTaskCard 用 memo 包装 TaskCard，避免列表重渲染时卡片整体重绘。
 */
import { memo, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { selectedTaskOf, type BoardController } from '../../../core/controller.ts'
import { COLUMNS, type TaskRecord, type TaskStatus } from '../../../core/tasks.ts'
import { t, type TaskBoardKey } from '../locales.ts'
import css from '../kanban.module.css'
import { ConfirmDialog } from './ConfirmDialog.tsx'
import { MatrixView } from './MatrixView.tsx'
import { NewTaskModal } from './NewTaskModal.tsx'
import { TaskCard } from './TaskCard.tsx'
import { TaskDetail } from './TaskDetail.tsx'

/** 工作台视图：周矩阵（默认，三合一主视图） / 五列看板（执行流水线） */
export type WorkbenchView = 'matrix' | 'board'

// 任务状态 -> 列标题文案 key 的映射（渲染各列标题用）。
const STATUS_KEY: Record<TaskStatus, TaskBoardKey> = {
  backlog: 'board.status.backlog',
  todo: 'board.status.todo',
  running: 'board.status.running',
  done: 'board.status.done',
  failed: 'board.status.failed',
}

/**
 * 判断任务是否命中筛选：筛选词为空时全部命中；
 * 否则按标题 / 描述做大小写不敏感的包含匹配。
 */
function matchesFilter(task: TaskRecord, filter: string): boolean {
  if (filter.trim() === '') return true
  const needle = filter.trim().toLowerCase()
  return task.title.toLowerCase().includes(needle) || task.description.toLowerCase().includes(needle)
}

/**
 * 用 React.memo 包装的任务卡片：仅当 task / 回调引用变化时重渲染，
 * 配合 useCallback 稳定回调，避免列内每张卡片跟随整个列表刷新。
 */
const MemoTaskCard = memo(function MemoTaskCard({ task, onOpen, onDelete }: { task: TaskRecord; onOpen: (id: string) => void; onDelete: (id: string) => void }) {
  // 用 useCallback 固定「打开 / 删除」的引用，保证 memo 深度比较生效。
  const onClick = useCallback(() => { onOpen(task.id) }, [task.id, onOpen])
  const onDeleteTask = useCallback(() => { onDelete(task.id) }, [task.id, onDelete])
  return <TaskCard task={task} onClick={onClick} onDelete={onDeleteTask} />
})

/**
 * 看板主视图。
 *
 * @param props.controller 看板控制器（读取快照、订阅、执行各种操作）。
 * @param props.embedded 是否处于内嵌模式（隐藏「返回对话」按钮）。
 */
export function TaskBoard({ controller, embedded = false }: { controller: BoardController; embedded?: boolean }) {
  // 订阅控制器快照：任务/打开状态/归档视图等变化都会重渲染工作台。
  const [snapshot, setSnapshot] = useState(controller.getSnapshot())
  useEffect(
    () => controller.subscribe(() => setSnapshot(controller.getSnapshot())),
    [controller],
  )
  // —— 本地 UI 状态 ——
  // 当前视图：周矩阵（全屏工作台默认，三合一主视图） / 五列看板（嵌入式默认，执行流水线）。
  const [view, setView] = useState<WorkbenchView>(embedded ? 'board' : 'matrix')
  // 筛选词。
  const [filter, setFilter] = useState('')
  // 快速添加输入框的文本。
  const [quick, setQuick] = useState('')
  // 是否显示「新建任务」弹窗。
  const [showNew, setShowNew] = useState(false)
  // 待删除确认的任务 id（undefined 表示当前没有删除确认框）。
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | undefined>(undefined)
  // 当前被选中的任务（用于渲染右侧/模态详情）。
  const selected = selectedTaskOf(snapshot)
  // 是否处于「归档」视图。
  const archiveView = snapshot.archiveView
  // 删除确认框的目标任务（在快照里按 id 反查）。
  const confirmTarget = confirmDeleteId === undefined
    ? undefined
    : snapshot.tasks.find(task => task.id === confirmDeleteId)

  // 可见任务：按归档视图过滤 归档/非归档，再叠加关键词筛选。
  const visible = snapshot.tasks.filter(task =>
    (archiveView ? task.archivedAt !== undefined : task.archivedAt === undefined)
    && matchesFilter(task, filter),
  )
  // 打开任务详情。
  const openTask = useCallback((id: string): void => { controller.openTask(id) }, [controller])
  // 请求删除：先弹确认框（记录目标 id）。
  const requestDelete = useCallback((id: string): void => { setConfirmDeleteId(id) }, [])
  // 快速添加：回车时用输入框文字直接创建一个「待办」任务并清空输入。
  const quickAdd = useCallback((): void => {
    const title = quick.trim()
    if (title === '') return
    controller.createTask({ title, description: '', prompt: '', kind: 'todo' })
    setQuick('')
  }, [quick, controller])

  return (
    <div className={css["bga-kb-board"]} data-bga-kb-root="">
      {/* 顶部视图切换条：周矩阵 / 看板 +（非内嵌时）返回对话 */}
      <div className={css["bga-kb-viewbar"]}>
        <div className={css["bga-kb-viewbar-tabs"]}>
          <button
            type="button"
            className={view === 'matrix' ? css["bga-kb-btn-primary"] : css["bga-kb-btn-ghost"]}
            onClick={() => { setView('matrix') }}
          >
            {t('board.view.matrix')}
          </button>
          <button
            type="button"
            className={view === 'board' ? css["bga-kb-btn-primary"] : css["bga-kb-btn-ghost"]}
            onClick={() => { setView('board') }}
          >
            {t('board.view.board')}
          </button>
        </div>
        {!embedded && (
          <button
            type="button"
            className={css["bga-kb-btn-ghost"]}
            onClick={() => { controller.closeBoard() }}
          >
            {t('board.close')}
          </button>
        )}
      </div>

      {/* —— 周矩阵视图（默认主视图：分类 × 周一~周日） —— */}
      {view === 'matrix' ? (
        <MatrixView controller={controller} />
      ) : (
      /* —— 五列看板视图（执行流水线 + 归档） —— */
      <>
      {/* 顶部工具区：搜索 / 归档切换 / 新建 / 快速添加 */}
      <header className={css["bga-kb-board-header"]}>
        {/* 按标题/描述筛选任务 */}
        <input
          className={css["bga-kb-search"]}
          type="search"
          placeholder={t('board.search')}
          value={filter}
          onChange={event => { setFilter(event.target.value) }}
          aria-label={t('board.search')}
        />
        {/* 在「看板视图」与「归档视图」之间切换，显示归档数量 */}
        <button
          type="button"
          className={archiveView ? css["bga-kb-btn-primary"] : css["bga-kb-btn-ghost"]}
          onClick={() => { controller.toggleArchiveView() }}
        >
          {archiveView
            ? t('board.backToBoard')
            : t('board.archiveView', { count: String(snapshot.tasks.filter(task => task.archivedAt !== undefined).length) })}
        </button>
        {/* 打开新建任务弹窗 */}
        <button
          type="button"
          className={css["bga-kb-btn-primary"]}
          onClick={() => { setShowNew(true) }}
        >
          + {t('board.new')}
        </button>
        {/* 快速添加：输入后按 Enter 直接创建待办任务 */}
        <input
          className={css["bga-kb-quick"]}
          type="text"
          placeholder={t('board.quickAdd')}
          value={quick}
          onChange={event => { setQuick(event.target.value) }}
          onKeyDown={event => { if (event.key === 'Enter') quickAdd() }}
          aria-label={t('board.quickAdd')}
        />
      </header>

      {/* —— 列区 —— */}
      <div className={css["bga-kb-cols"]}>
        {/* 归档视图：单列展示所有已归档任务 */}
        {archiveView ? (
          <section className={css["bga-kb-col"]} data-status="archived">
            <header className={css["bga-kb-col-header"]}>
              <h3 className={css["bga-kb-col-title"]}>{t('board.archive')}</h3>
              <span className={css["bga-kb-col-count"]}>{visible.length}</span>
            </header>
            <div className={css["bga-kb-cards"]}>
              {visible.map(task => (
                <MemoTaskCard key={task.id} task={task} onOpen={openTask} onDelete={requestDelete} />
              ))}
              {visible.length === 0 && <div className={css["bga-kb-col-empty"]}>{t('archive.empty')}</div>}
            </div>
          </section>
        ) : (
          COLUMNS.map(column => {
            // 看板视图：按 COLUMNS 渲染五列（待规划/待办/进行中/已完成/已失败）。
            // 每列只取属于该状态的任务（叠加归档/筛选过滤）。
            const tasks = visible.filter(task => task.status === column.status)
            return (
              <section key={column.status} className={css["bga-kb-col"]} data-status={column.status}>
                <header className={css["bga-kb-col-header"]}>
                  {/* 列状态色点（着色由 CSS data-status 决定） */}
                  <span className={css["bga-kb-dot"]} data-status={column.status} aria-hidden="true" />
                  <h3 className={css["bga-kb-col-title"]}>{t(STATUS_KEY[column.status])}</h3>
                  <span className={css["bga-kb-col-count"]}>{tasks.length}</span>
                </header>
                <div className={css["bga-kb-cards"]}>
                  {tasks.map(task => (
                    <MemoTaskCard key={task.id} task={task} onOpen={openTask} onDelete={requestDelete} />
                  ))}
                  {/* 空列提示 */}
                  {tasks.length === 0 && <div className={css["bga-kb-col-empty"]}>{t('board.empty')}</div>}
                </div>
              </section>
            )
          })
        )}
      </div>

      {/* 有选中任务时渲染任务详情（模态） */}
      {selected !== undefined && (
        <TaskDetail controller={controller} task={selected} />
      )}
      {/* 新建任务弹窗 */}
      {showNew && (
        <NewTaskModal
          controller={controller}
          onClose={() => { setShowNew(false) }}
        />
      )}
      {/* 删除确认框：createPortal 到 body，避免被看板定位上下文遮蔽 */}
      {confirmTarget !== undefined && createPortal(
        <ConfirmDialog
          title={t('delete.title')}
          message={t('delete.confirm', { name: confirmTarget.title })}
          confirmLabel={t('delete.ok')}
          danger
          onCancel={() => { setConfirmDeleteId(undefined) }}
          onConfirm={() => {
            // 用户确认删除：真正删除任务并关闭确认框。
            controller.deleteTask(confirmTarget.id)
            setConfirmDeleteId(undefined)
          }}
        />,
        document.body,
      )}
      </>
      )}
    </div>
  )
}