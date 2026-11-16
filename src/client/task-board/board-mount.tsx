import type { Context } from '@deepseek-ai/cordis'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type { InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import type { BoardController } from '../../core/controller.ts'
import { TaskBoard, type TaskBoardDraft } from './board/TaskBoard.tsx'
import css from './embed.module.css'

export const PANEL_ID = 'bga-dsh-workbench-task-board' as MainPanelId

function BoardPanel({ controller, draft }: InjectFace<{ controller: BoardController; draft: TaskBoardDraft }>) {
  return <div className={css.panel} data-bga-kb-view=""><TaskBoard controller={controller} draft={draft} /></div>
}

export function mountBoard(ctx: Context, controller: BoardController): () => void {
  const draft: TaskBoardDraft = {}
  const disposePanel = ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main', key: PANEL_ID, inject: () => ({ controller, draft }),
  }, BoardPanel))
  const panelInfo = ctx.layout.panelInfo
  const selected = () => panelInfo.getSnapshot().activePanelId === PANEL_ID
  const syncBoard = () => {
    if (selected()) controller.openBoard()
    else controller.closeBoard()
  }
  const offPanel = panelInfo.subscribe(syncBoard)
  syncBoard()
  const offBoard = controller.subscribe(() => {
    if (selected() && !controller.getSnapshot().boardOpen) ctx.layout.selectPanel(null)
  })
  return () => {
    offBoard()
    offPanel()
    if (selected()) ctx.layout.selectPanel(null)
    disposePanel()
  }
}
