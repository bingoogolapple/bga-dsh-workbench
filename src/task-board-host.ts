/**
 * 任务看板 system prompt 注入（宿主端）。
 *
 * 把任务看板的使用指引注册为 system prompt 的一个 section，
 * 使每个 agent 会话都知道本部署内置了任务看板并能据此协作。
 */
 import type { Context } from '@deepseek-ai/cordis'

 /** section 排序权重（越大越靠后） */
 const SECTION_ORDER = 200

 /** 任务看板指引的固定文案（中英混合说明） */
 export const TASK_BOARD_GUIDANCE = 'bga-dsh-workbench 内置任务看板（侧边栏「任务看板」入口）：多列看板管理任务；任务可真实执行（驱动 agent 会话）；任务可钉住执行目标——工作区 / 模式（agent 预设）/ 权限（read-only / workspace-write / danger-full-access），缺省用运行时默认；任务支持 5 段 cron 定时执行（如 0 23 * * *）；任务数据由宿主持久化到存储目录（tasks.json）。限制：定时调度在浏览器端，需 GUI 标签页打开，错过即跳过；执行消耗 API 额度。用户提到「任务看板 / 看板 / 定时任务」时即指本工作台的看板，请据此协作。'

 /**
  * 注册任务看板指引 section。
  * 若部署未提供 systemPrompt 服务则静默跳过。
  */
 export function registerTaskBoardPrompt(ctx: Context): void {
   const sp = ctx.get('systemPrompt')
   if (sp === undefined) return
   sp.section({
     name: 'plugin:bga-dsh-workbench-task-board',
     order: SECTION_ORDER,
     text: TASK_BOARD_GUIDANCE,
   })
 }