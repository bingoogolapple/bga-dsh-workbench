import type { BoardController } from '../../core/controller.ts'
import { WelcomeBannerRow } from '../WelcomeBannerRow.tsx'
import { TaskBoard, type TaskBoardDraft } from './board/TaskBoard.tsx'
import css from './embed.module.css'

export function TaskBoardEmbed({ controller, draft }: { controller: BoardController; draft?: TaskBoardDraft }) {
  return (
    <div className={css['bga-kb-embed']} data-bga-kb-embed-view="">
      <WelcomeBannerRow />
      <div className={css['bga-kb-embed-body']}>
        <TaskBoard controller={controller} embedded draft={draft} />
      </div>
    </div>
  )
}
