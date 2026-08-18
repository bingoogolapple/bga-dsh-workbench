 
 
 /**
 * locales.ts —— 任务看板的文案字典（i18n）。
 *
 * 提供中英文案：
 * - zh：中文默认文案；en：英文翻译，且通过类型约束保证 key 集合与 zh 完全一致；
 * - 字典 key 采用「作用域.名称」的分段命名（如 board.title、detail.schedule.cron），
 *   便于按模块归位；value 支持 {placeholder} 形式的插值占位符，由 t() 运行时替换；
 * - 页面语言依据 <html lang> 判定（en 开头走英文，其余走中文），
 *   非浏览器环境（SSR / 测试）缺省使用中文。
 * 注意：字典的 key 与 value 都是界面文案，修改会直接影响界面显示，请谨慎。
 */

// ===== 中文文案字典（zh） =====
 export const zh = {
   'entry.label': 'BGA 任务看板',
   // ===== 看板主界面：标题 / 关闭 / 新建 / 搜索 / 快速添加 / 空态 / 归档视图 =====
   'board.title': 'BGA 任务看板',
   'board.close': '返回对话',
   'board.new': '新建任务',
   'board.search': '筛选任务…',
  'board.quickAdd': '输入后回车快速添加待办',
   'board.empty': '暂无任务',
   'board.filterAll': '全部',
   'board.archive': '归档',
   'board.archiveView': '归档 ({count})',
   'board.backToBoard': '返回看板',
   'archive.empty': '没有已归档的任务',
   'board.status': '状态',
   // ===== 看板列：状态标签 / 状态名 / 执行次数 / 更新时间 =====
   'board.status.backlog': '待规划',
   'board.status.todo': '待办',
   'board.status.running': '进行中',
   'board.status.done': '已完成',
   'board.status.failed': '已失败',
   'board.runs': '次执行',
   'board.updated': '更新于',
   'board.created': '创建于',
   // ===== 新建任务弹窗：标题 / 描述 / 执行 Prompt 及校验提示 =====
   'new.title': '标题',
   'new.titlePlaceholder': '一句话描述要做什么',
   'new.description': '描述',
   'new.descriptionPlaceholder': '补充背景、范围与验收（可选）',
   'new.prompt': '执行 Prompt',
   'new.promptPlaceholder': '发给 agent 的完整指令（留空则使用标题）',
   'new.submit': '创建',
   'new.cancel': '取消',
   'new.required': '标题不能为空',
   // ===== 任务详情：标题 / 关闭 / 执行记录 / 运行结果 =====
   'detail.title': '任务详情',
   'detail.close': '关闭',
   'detail.prompt': '执行 Prompt',
   'detail.description': '描述',
   'detail.execution': '执行记录',
   'detail.noExecution': '尚未执行',
   'detail.run': '执行',
   'detail.rerun': '重新执行',
   'detail.delete': '删除',
   'detail.archive': '归档',
   'detail.restore': '恢复',
   'detail.archivedAt': '已归档 · {time}',
   'detail.viewSession': '查看会话',
   'detail.noSession': '暂无会话',
   'detail.executionStarted': '已启动',
   'detail.executionEnded': '已结束',
   'detail.result.succeeded': '成功',
   'detail.result.failed': '失败',
   'detail.result.cancelled': '已取消',
   'detail.result.running': '进行中',
   // ===== 删除确认弹窗 =====
   'delete.title': '删除任务',
   'delete.confirm': '确定删除「{name}」吗？删除后不可恢复。',
   'delete.ok': '删除',
   'delete.cancel': '取消',
   // ===== 状态移动按钮 =====
   'status.move.backlog': '移到待规划',
   'status.move.todo': '移到待办',
   // ===== 执行错误与运行失败提示 =====
   'exec.error.noWorkspace': '没有可用工作区，无法执行任务',
   'exec.error.promptRejected': 'Prompt 被拒绝',
   'run.failed': '执行失败：{error}',
   // ===== 相对时间显示 =====
   'time.justNow': '刚刚',
   // ===== 定时执行：开关 / Cron 输入 / 预设 / 下次与上次运行 =====
   'detail.schedule': '定时运行',
   'detail.schedule.enable': '启用定时执行',
   'detail.schedule.cron': 'Cron 表达式',
   'detail.schedule.presets': '预设',
   'detail.schedule.preset.daily9': '每天 09:00',
   'detail.schedule.preset.hourly': '每小时',
   'detail.schedule.preset.tenMin': '每 10 分钟',
   'detail.schedule.preset.weeklyMon9': '每周一 09:00',
   'detail.schedule.nextRun': '下次运行',
   'detail.schedule.lastTriggered': '上次触发',
   'detail.schedule.invalid': 'Cron 表达式无效',
   'detail.schedule.notScheduled': '尚未排程',
   'detail.schedule.dueSoon': '即将运行',
   // ===== 看板卡片角标 =====
   'card.scheduled': '定时',
  'card.delete': '删除任务',
   // ===== 执行设置：工作区 / 模式（agent 预设）/ 权限（新建任务与任务详情共用） =====
   'new.workspace': '工作区',
   'new.mode': '模式',
   'new.permission': '权限',
   'exec.workspace.recent': '最近使用（默认）',
   'exec.mode.default': '部署默认',
   'exec.mode.defaultSuffix': '（默认）',
   'exec.mode.brokenSuffix': '（不可用）',
   'exec.mode.removed': '（已移除）',
   'exec.permission.default': '会话默认',
   'exec.permission.read-only': '只读',
   'exec.permission.workspace-write': '工作区可写',
   'exec.permission.danger-full-access': '完全访问',
   'detail.executionSettings': '执行设置',
   // 执行设置的说明文案：解释三个选项在执行时如何生效。
   'exec.hint': '执行时生效：工作区决定执行会话落在哪个工作区；模式决定会话的 agent 预设；权限经 /permission 命令应用到会话。留空则使用运行时默认。',
   
   // ===== 设置页：插件设置卡片 =====
   
   'settings.title': 'BGA 任务看板',
   'settings.description': '控制看板在 agent 系统提示中的播报行为。',
   'settings.enabled': '启用任务看板',
   'settings.enabledHint': '关闭后隐藏侧边栏入口与看板视图。',
   'settings.announceToAgent': '向 agent 播报任务看板',
   'settings.announceToAgentHint': '开启：每条 agent 系统提示都会包含本看板的说明；关闭：不播报，agent 仅在用户主动提及时了解看板。',
   'settings.inherit': '继承',
   'settings.on': '开',
   'settings.off': '关',
   'settings.overridden': '已覆盖',
   'settings.reset': '恢复默认',
   'settings.notExposed': '当前 DSH 版本未向设置页暴露本插件的配置命名空间，表单不可用。可编辑 ~/.dsh/settings.yaml 直接配置，或为 dsh-host-apiproxy 的 WEB_SETTINGS_NAMESPACES 白名单补充本命名空间后重启。',
   'settings.readOnly': '当前部署的设置只读。',
   'settings.expand': '展开设置',
   'settings.collapse': '收起设置',
   'settings.save': '保存',
   'settings.saving': '保存中…',
   'settings.discard': '放弃',
   'settings.unsaved': '未保存',
   'settings.saveFailed': '部署未接受这些值，已保留供你修改。',
   'settings.invalidNumber': '请输入数字，留空则使用默认值。',
 } satisfies Record<string, string>
 
 // ===== 英文文案字典（en） =====
 // 所有 key 必须与 zh 完全一致（由类型 keyof typeof zh 约束），
 // 值为对应英文翻译；同样支持 {name} 插值占位符。
 export const en: Record<keyof typeof zh, string> = {
   'entry.label': 'BGA Task Board',
   // ===== Board main UI =====
   'board.title': 'BGA Task Board',
   'board.close': 'Back to chat',
   'board.new': 'New Task',
   'board.search': 'Filter tasks…',
  'board.quickAdd': 'Enter to add to To-do',
   'board.empty': 'No tasks in this column',
   'board.filterAll': 'All',
   'board.archive': 'Archive',
   'board.archiveView': 'Archived ({count})',
   'board.backToBoard': 'Back to board',
   'archive.empty': 'No archived tasks',
   'board.status': 'Status',
   // ===== Board columns: status labels / counts / time =====
   'board.status.backlog': 'Backlog',
   'board.status.todo': 'To Do',
   'board.status.running': 'In Progress',
   'board.status.done': 'Done',
   'board.status.failed': 'Failed',
   'board.runs': 'runs',
   'board.updated': 'Updated',
   'board.created': 'Created',
   // ===== New task dialog =====
   'new.title': 'Title',
   'new.titlePlaceholder': 'What should be done, in one line',
   'new.description': 'Description',
   'new.descriptionPlaceholder': 'Background, scope, acceptance criteria (optional)',
   'new.prompt': 'Run Prompt',
   'new.promptPlaceholder': 'The full instruction sent to the agent (title is used when blank)',
   'new.submit': 'Create',
   'new.cancel': 'Cancel',
   'new.required': 'Title is required',
   // ===== Task detail =====
   'detail.title': 'Task Detail',
   'detail.close': 'Close',
   'detail.prompt': 'Run Prompt',
   'detail.description': 'Description',
   'detail.execution': 'Execution History',
   'detail.noExecution': 'Not executed yet',
   'detail.run': 'Run',
   'detail.rerun': 'Run Again',
   'detail.delete': 'Delete',
   'detail.archive': 'Archive',
   'detail.restore': 'Restore',
   'detail.archivedAt': 'Archived · {time}',
   'detail.viewSession': 'View Session',
   'detail.noSession': 'No session',
   'detail.executionStarted': 'Started',
   'detail.executionEnded': 'Ended',
   'detail.result.succeeded': 'Succeeded',
   'detail.result.failed': 'Failed',
   'detail.result.cancelled': 'Cancelled',
   'detail.result.running': 'Running',
   // ===== Delete confirmation =====
   'delete.title': 'Delete Task',
   'delete.confirm': 'Delete "{name}"? This cannot be undone.',
   'delete.ok': 'Delete',
   'delete.cancel': 'Cancel',
   'status.move.backlog': 'Move to Backlog',
   'status.move.todo': 'Move to To Do',
   // ===== Execution errors / run failures =====
   'exec.error.noWorkspace': 'No workspace is available to run the task',
   'exec.error.promptRejected': 'Prompt rejected',
   'run.failed': 'Run failed: {error}',
   // ===== Relative time =====
   'time.justNow': 'just now',
   // ===== Scheduled runs =====
   'detail.schedule': 'Scheduled Runs',
   'detail.schedule.enable': 'Enable scheduled runs',
   'detail.schedule.cron': 'Cron expression',
   'detail.schedule.presets': 'Presets',
   'detail.schedule.preset.daily9': 'Every day 09:00',
   'detail.schedule.preset.hourly': 'Every hour',
   'detail.schedule.preset.tenMin': 'Every 10 minutes',
   'detail.schedule.preset.weeklyMon9': 'Every Monday 09:00',
   'detail.schedule.nextRun': 'Next run',
   'detail.schedule.lastTriggered': 'Last triggered',
   'detail.schedule.invalid': 'Invalid cron expression',
   'detail.schedule.notScheduled': 'Not scheduled yet',
   'detail.schedule.dueSoon': 'Due soon',
   'card.scheduled': 'scheduled',
  'card.delete': 'Delete task',
   // ===== Execution settings: workspace / mode / permission =====
   'new.workspace': 'Workspace',
   'new.mode': 'Mode',
   'new.permission': 'Permission',
   'exec.workspace.recent': 'Most recent (default)',
   'exec.mode.default': 'Deployment default',
   'exec.mode.defaultSuffix': ' (default)',
   'exec.mode.brokenSuffix': ' (unavailable)',
   'exec.mode.removed': ' (removed)',
   'exec.permission.default': 'Session default',
   'exec.permission.read-only': 'Read-only',
   'exec.permission.workspace-write': 'Workspace Write',
   'exec.permission.danger-full-access': 'Full Access',
   'detail.executionSettings': 'Execution Settings',
   'exec.hint': 'Applied when the task runs: the workspace decides where the execution session lands; the mode composes the session\'s agent preset; the permission is applied through the /permission command. Blank = runtime default.',
   
   // ===== Settings page: plugin settings card =====
   'settings.title': 'BGA Task Board',
   'settings.description': 'How the board announces itself in each agent system prompt.',
   'settings.enabled': 'Enable the task board',
   'settings.enabledHint': 'When off, the sidebar entry and board view are hidden.',
   'settings.announceToAgent': 'Announce the task board to agents',
   'settings.announceToAgentHint': 'On: every agent system prompt includes a note about this board. Off: no announcement; agents learn about the board only when you mention it.',
   'settings.inherit': 'Inherit',
   'settings.on': 'On',
   'settings.off': 'Off',
   'settings.overridden': 'Overridden',
   'settings.reset': 'Reset to default',
   'settings.notExposed': 'This DSH version does not expose this plugin\'s settings namespace to the configuration page, so the form is unavailable. Edit ~/.dsh/settings.yaml directly, or add the namespace to dsh-host-apiproxy\'s WEB_SETTINGS_NAMESPACES allowlist and restart.',
   'settings.readOnly': 'This deployment stores settings read-only.',
   'settings.expand': 'Show settings',
   'settings.collapse': 'Hide settings',
   'settings.save': 'Save',
   'settings.saving': 'Saving…',
   'settings.discard': 'Discard',
   'settings.unsaved': 'Unsaved',
   'settings.saveFailed': 'The deployment did not accept these values; they were left for you to correct.',
   'settings.invalidNumber': 'Enter a number, or leave blank to use the default.',
 }
 
 /**
 * 全部文案 key 的联合类型：由 zh 字典的 key 集合推导而来。
 *
 * 供 t() / dictionary() 使用，在编译期约束字典键名，防止写错 key。
 */
 export type TaskBoardKey = keyof typeof zh
 
 /**
  * 设置卡片文案的 key 类型：目前与 TaskBoardKey 完全相同。
  *
  * 单独命名以表达「设置页文案」的语义，便于将来给设置页扩展自己独立的 key。
  */
 export type SettingsCardKey = TaskBoardKey
 
 /**
  * 依据当前页面语言取回要使用的文案字典。
  *
  * 浏览器环境下读取 <html lang>：以 en 开头（如 en / en-US）返回英文，
  * 否则返回中文；非浏览器环境（SSR / 测试）缺省使用中文。
  *
  * @returns 中或英文字典（Record<TaskBoardKey, string>）。
  */
 export function dictionary(): Record<TaskBoardKey, string> {
   const lang = typeof document !== 'undefined' ? document.documentElement.lang : 'zh'
   return lang.toLowerCase().startsWith('en') ? en : zh
 }
 
 /**
  * 取一条文案并进行 {placeholder} 插值。
  *
  * 从当前语言字典中取出 key 对应的文本；若传入 params，则把文本里出现的
  * 所有 {name} 依次替换成 params[name]。
  *
  * @param key 文案 key（受 TaskBoardKey 类型约束）。
  * @param params 可选的插值参数表，如 { name: 'xxx' }。
  * @returns 处理后的文案字符串。
  */
 export function t(key: TaskBoardKey, params?: Record<string, string>): string {
   let text: string = dictionary()[key]
   // 执行 {placeholder} 插值：遍历参数表，逐个替换文本中的占位符。
   if (params !== undefined) {
     for (const [name, value] of Object.entries(params)) {
       text = text.replaceAll(`{${name}}`, value)
     }
   }
   return text
 }