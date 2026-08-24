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
export declare const zh: {
    'entry.label': string;
    'board.title': string;
    'board.close': string;
    'board.new': string;
    'board.search': string;
    'board.quickAdd': string;
    'board.empty': string;
    'board.filterAll': string;
    'board.archive': string;
    'board.archiveView': string;
    'board.backToBoard': string;
    'archive.empty': string;
    'board.status': string;
    'board.status.backlog': string;
    'board.status.todo': string;
    'board.status.running': string;
    'board.status.done': string;
    'board.status.failed': string;
    'board.runs': string;
    'board.updated': string;
    'board.created': string;
    'new.title': string;
    'new.titlePlaceholder': string;
    'new.description': string;
    'new.descriptionPlaceholder': string;
    'new.prompt': string;
    'new.promptPlaceholder': string;
    'new.submit': string;
    'new.cancel': string;
    'new.required': string;
    'new.category': string;
    'new.categoryNone': string;
    'new.reportDate': string;
    'new.priority': string;
    'new.priorityNone': string;
    'new.priority.high': string;
    'new.priority.medium': string;
    'new.priority.low': string;
    'new.kind': string;
    'new.kind.todo': string;
    'new.kind.task': string;
    'new.phrases': string;
    'detail.title': string;
    'detail.close': string;
    'detail.prompt': string;
    'detail.description': string;
    'detail.execution': string;
    'detail.noExecution': string;
    'detail.run': string;
    'detail.rerun': string;
    'detail.delete': string;
    'detail.archive': string;
    'detail.restore': string;
    'detail.archivedAt': string;
    'detail.viewSession': string;
    'detail.noSession': string;
    'detail.executionStarted': string;
    'detail.executionEnded': string;
    'detail.result.succeeded': string;
    'detail.result.failed': string;
    'detail.result.cancelled': string;
    'detail.result.running': string;
    'delete.title': string;
    'delete.confirm': string;
    'delete.ok': string;
    'delete.cancel': string;
    'status.move.backlog': string;
    'status.move.todo': string;
    'exec.error.noWorkspace': string;
    'exec.error.promptRejected': string;
    'run.failed': string;
    'time.justNow': string;
    'time.minutesAgo': string;
    'time.hoursAgo': string;
    'detail.schedule': string;
    'detail.schedule.enable': string;
    'detail.schedule.cron': string;
    'detail.schedule.presets': string;
    'detail.schedule.preset.daily9': string;
    'detail.schedule.preset.hourly': string;
    'detail.schedule.preset.tenMin': string;
    'detail.schedule.preset.weeklyMon9': string;
    'detail.schedule.nextRun': string;
    'detail.schedule.lastTriggered': string;
    'detail.schedule.invalid': string;
    'detail.schedule.notScheduled': string;
    'detail.schedule.dueSoon': string;
    'card.scheduled': string;
    'card.delete': string;
    'new.workspace': string;
    'new.mode': string;
    'new.permission': string;
    'exec.workspace.recent': string;
    'exec.mode.default': string;
    'exec.mode.defaultSuffix': string;
    'exec.mode.brokenSuffix': string;
    'exec.mode.removed': string;
    'exec.permission.default': string;
    'exec.permission.read-only': string;
    'exec.permission.workspace-write': string;
    'exec.permission.danger-full-access': string;
    'detail.executionSettings': string;
    'exec.hint': string;
    'settings.title': string;
    'settings.description': string;
    'settings.enabled': string;
    'settings.enabledHint': string;
    'settings.announceToAgent': string;
    'settings.announceToAgentHint': string;
    'settings.inherit': string;
    'settings.on': string;
    'settings.off': string;
    'settings.overridden': string;
    'settings.reset': string;
    'settings.notExposed': string;
    'settings.readOnly': string;
    'settings.expand': string;
    'settings.collapse': string;
    'settings.save': string;
    'settings.saving': string;
    'settings.discard': string;
    'settings.unsaved': string;
    'settings.saveFailed': string;
    'settings.invalidNumber': string;
    'matrix.category.business': string;
    'matrix.category.ops': string;
    'matrix.category.management': string;
    'matrix.category.support': string;
    'matrix.thisWeek': string;
    'matrix.backToThisWeek': string;
    'matrix.today': string;
    'matrix.prevWeek': string;
    'matrix.nextWeek': string;
    'matrix.day.empty': string;
    'matrix.day.draft': string;
    'matrix.day.done': string;
    'matrix.day.mark': string;
    'matrix.day.unmark': string;
    'matrix.task.toggleDone': string;
    'matrix.task.due': string;
    'matrix.cell.addHere': string;
    'matrix.weekStart': string;
    'matrix.weekStart.monday': string;
    'matrix.weekStart.sunday': string;
    'matrix.categoryManage': string;
    'matrix.category.new': string;
    'matrix.category.id': string;
    'matrix.category.label': string;
    'matrix.category.add': string;
    'matrix.category.remove': string;
    'matrix.category.dupId': string;
    'matrix.category.emptyLabel': string;
    'matrix.category.removedNote': string;
    'matrix.category.keepOne': string;
    'matrix.support.pending': string;
    'matrix.support.processing': string;
    'matrix.support.resolved': string;
    'matrix.support.advance': string;
    'matrix.stats': string;
    'matrix.stats.title': string;
    'matrix.stats.tasks': string;
    'matrix.stats.done': string;
    'matrix.stats.rate': string;
    'matrix.stats.total': string;
    'matrix.stats.noData': string;
    'matrix.reminder.title': string;
    'matrix.reminder.body': string;
    'matrix.reminder.gotIt': string;
    'matrix.reminder.enable': string;
    'matrix.reminder.cron': string;
    'matrix.reminder.setting': string;
    'matrix.reminder.cronHint': string;
    'matrix.backup': string;
    'matrix.backup.done': string;
    'matrix.backup.fail': string;
    'board.view.matrix': string;
    'board.view.board': string;
    'matrix.export': string;
    'matrix.export.week': string;
    'matrix.export.day': string;
    'matrix.export.plain': string;
    'matrix.export.copied': string;
    'matrix.export.failed': string;
    'confetti.intensity': string;
    'confetti.intensity.small': string;
    'confetti.intensity.medium': string;
    'confetti.intensity.large': string;
    'confetti.intensity.epic': string;
    'confetti.theme': string;
    'confetti.theme.default': string;
    'confetti.theme.gold': string;
    'confetti.theme.ocean': string;
    'confetti.theme.sakura': string;
    'confetti.theme.neon': string;
    'confetti.trigger': string;
    'confetti.trigger.success': string;
    'confetti.trigger.every': string;
    'confetti.trigger.task': string;
    'english.frequency': string;
    'english.frequency.every-turn': string;
    'english.frequency.every-2': string;
    'english.frequency.every-5': string;
    'english.frequency.every-10': string;
    'english.frequency.manual': string;
    'english.dailyLimit': string;
    'english.wrongWords': string;
    'english.wrongWords.empty': string;
    'english.wrongWords.clear': string;
    'english.wrongWords.remove': string;
    'english.dashboard': string;
    'english.dashboard.totalXP': string;
    'english.dashboard.streak': string;
    'english.dashboard.mastered': string;
    'english.dashboard.wrong': string;
    'english.dashboard.accuracy': string;
};
export declare const en: Record<keyof typeof zh, string>;
/**
* 全部文案 key 的联合类型：由 zh 字典的 key 集合推导而来。
*
* 供 t() / dictionary() 使用，在编译期约束字典键名，防止写错 key。
*/
export type TaskBoardKey = keyof typeof zh;
/**
 * 设置卡片文案的 key 类型：目前与 TaskBoardKey 完全相同。
 *
 * 单独命名以表达「设置页文案」的语义，便于将来给设置页扩展自己独立的 key。
 */
export type SettingsCardKey = TaskBoardKey;
/**
 * 依据当前页面语言取回要使用的文案字典。
 *
 * 浏览器环境下读取 <html lang>：以 en 开头（如 en / en-US）返回英文，
 * 否则返回中文；非浏览器环境（SSR / 测试）缺省使用中文。
 *
 * @returns 中或英文字典（Record<TaskBoardKey, string>）。
 */
export declare function dictionary(): Record<TaskBoardKey, string>;
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
export declare function t(key: TaskBoardKey, params?: Record<string, string>): string;
