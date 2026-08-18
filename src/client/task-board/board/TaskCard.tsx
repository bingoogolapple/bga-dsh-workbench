/**
 * TaskCard.tsx —— 看板列中的单张任务卡片。
 *
 * 以「按钮语义」渲染（role=button + tabIndex + 回车/空格激活）：
 * - 点击卡片打开任务详情；卡片右上角提供删除按钮（阻止冒泡，避免误触发打开）；
 * - 元信息行显示：更新时间、定时标记（schedule 启用时）、执行次数与最近结果
 *   （data-result 着色）、会话锚点、运行中 spinner；
 * - 最近一次执行仍在进行时会显示「进行中…」横条。
 * 最外层用 React.memo 包装（配合本文件外部的稳定回调）以减少无谓重渲染。
 */
import { memo } from 'react'
import type { TaskRecord } from '../../../core/tasks.ts'
import { executionLabel } from '../../../core/tasks.ts'
import { t } from '../locales.ts'
import css from '../kanban.module.css'

/**
 * 把毫秒时间戳格式化为友好展示。
 *
 * 规则：1 分钟内 -> 「刚刚」；1 小时内 -> Nm；1 天内 -> Nh；
 * 更早 -> 日期（YYYY-MM-DD）。
 *
 * @param ms 时间戳（毫秒）。
 * @returns 格式化后的时间文本。
 */
export function formatTime(ms: number): string {
  const date = new Date(ms)
  const now = Date.now()
  const minutes = Math.floor((now - ms) / 60000)
  if (minutes < 1) return t('time.justNow')
  if (minutes < 60) return `${minutes}m`
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h`
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 删除按钮的垃圾桶图标（内联 SVG，随文字颜色渲染）。
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
)

/**
 * 任务卡片内部实现（未 memo 的版本）。
 *
 * @param props.task 任务记录。
 * @param props.onClick 点击卡片（打开详情）。
 * @param props.onDelete 删除请求回调（携带任务 id）。
 */
function TaskCardInner({ task, onClick, onDelete }: { task: TaskRecord; onClick: () => void; onDelete: (id: string) => void }) {
  // 最近一次执行（数组最后一个）；runs 为累计执行次数。
  const latest = task.executions[task.executions.length - 1]
  const runs = task.executions.length
  return (
    <div
      className={css["bga-kb-card"]}
      data-status={task.status}
      // 卡片以按钮语义呈现：可 Tab 聚焦，回车 / 空格触发打开。
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      // 悬浮提示：有描述显示描述，否则显示标题。
      title={task.description !== '' ? task.description : task.title}
    >
      <span className={css["bga-kb-card-top"]}>
        <span className={css["bga-kb-card-title"]}>{task.title}</span>
        {/* 删除按钮：阻止冒泡与默认行为，避免触发卡片的打开逻辑 */}
        <button
          type="button"
          className={css["bga-kb-card-delete"]}
          aria-label={t('card.delete')}
          onClick={event => {
            event.preventDefault()
            event.stopPropagation()
            onDelete(task.id)
          }}
        >
          <TrashIcon />
        </button>
      </span>
      {/* 描述摘录（有描述时才渲染） */}
      {task.description !== '' && <span className={css["bga-kb-card-excerpt"]}>{task.description}</span>}
      <span className={css["bga-kb-card-meta"]}>
        <span className={css["bga-kb-card-time"]}>{t('board.updated')} {formatTime(task.updatedAt)}</span>
        {/* 定时标记：任务启用了定时执行时展示（可悬浮显示下次运行时间） */}
        {task.schedule?.enabled === true && (
          <span
            className={css["bga-kb-card-schedule"]}
            title={task.schedule.nextRunAt !== undefined
              ? `${t('card.scheduled')} · ${new Date(task.schedule.nextRunAt).toLocaleString()}`
              : t('card.scheduled')}
          >
            {t('card.scheduled')}
          </span>
        )}
        {/* 执行次数徽标（data-result 用于按最近结果着色） */}
        {latest !== undefined && (
          <span className={css["bga-kb-card-run"]} data-result={latest.result}>
            {runs} {t('board.runs')}
          </span>
        )}
        {/* 会话锚点：最近一次执行有会话时显示链接标记（可悬浮显示会话 id） */}
        {latest?.sessionId !== undefined && (
          <span className={css["bga-kb-card-session"]} title={latest.sessionId}>⌁</span>
        )}
        {/* 运行中 spinner：任务状态为 running 时显示加载动画 */}
        {task.status === 'running' && <span className={css["bga-kb-card-spinner"]} aria-hidden="true" />}
      </span>
      {/* 最近执行仍在进行时：单独的「进行中…」提示条 */}
      {latest !== undefined && executionLabel(latest) === 'running' && (
        <span className={css["bga-kb-card-running"]}>{t('detail.result.running')}…</span>
      )}
    </div>
  )
}

/**
 * 对外导出的任务卡片：用 memo 包装 TaskCardInner。
 */
export const TaskCard = memo(TaskCardInner)