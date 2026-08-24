/**
 * 周矩阵领域纯函数。
 *
 * 将任务列表按「日报分类 × 自然周」切分为矩阵单元格（分类配置与周起始
 * 均可配置，缺省兼容 M1：内置四类、周一为一周起始），并派生列头三态
 * （未填写/填写中/已完成）与周/日日报的 Markdown 导出文本。
 * 全部为不依赖运行时的纯函数，供 UI 与测试复用。
 */
import type { CategoryDef, WeekStart } from './workbench-meta.ts';
import type { TaskRecord } from './tasks.ts';
/** 一周 7 天的日期 key（yyyy-mm-dd），按起始日~下一起始日前一天顺序 */
export declare const WEEKDAY_OFFSETS: readonly [0, 1, 2, 3, 4, 5, 6];
/** 生成 yyyy-mm-dd 字符串（本地时区，不补 UTC 偏移） */
export declare function toDateKey(date: Date): string;
/** 从 yyyy-mm-dd 解析回本地日期（避免 UTC 解析产生时区偏移） */
export declare function fromDateKey(key: string): Date;
/**
 * 计算某个日期所在周的起始日（周一或周日，由 weekStart 指定；缺省周一）。
 * @param date 本地日期
 * @param weekStart 周起始（缺省 'monday'，兼容 M1）
 * @returns 该周的起始日（本地日期）
 */
export declare function mondayOf(date: Date, weekStart?: WeekStart): Date;
/** 返回起始日所在周的 7 天日期 key（起始日~下一起始日前一天） */
export declare function weekDays(start: Date): string[];
/** 加减 N 周的日期（N 可为负） */
export declare function addWeeks(date: Date, weeks: number): Date;
/** 日历矩阵单元格：某分类在某天的任务集合 */
export interface MatrixCell {
    category: string;
    date: string;
    tasks: TaskRecord[];
}
/** 列头三态 */
export type DayStatus = 'empty' | 'draft' | 'done';
/** 读取生效的分类定义列表（缺省内置四类） */
export declare function categoriesOf(categories?: readonly CategoryDef[]): readonly CategoryDef[];
/**
 * 派生本周矩阵：返回「分类 × 7 天」的全部单元格（过滤未归档任务）。
 * 分类集合由 categories 决定（缺省内置四类）。
 * 注：当前 MatrixView 使用等价的逐格 filter（需叠加搜索过滤），本函数保留为
 * 规范化领域逻辑与测试基准，供未来按需复用，并非无意遗留的死代码。
 */
export declare function matrixCells(tasks: readonly TaskRecord[], start: Date, categories?: readonly CategoryDef[]): MatrixCell[];
/** 单元格内任务排序：优先级 high→low，再按创建时间升序 */
export declare function byPriorityThenCreatedAt(a: TaskRecord, b: TaskRecord): number;
/** 取某天的全部矩阵任务（未归档、reportDate=date，且带分类） */
export declare function tasksOfDay(tasks: readonly TaskRecord[], date: string): TaskRecord[];
/**
 * 派生某天列头的三态：
 * - empty：当天没有任何任务（未填写）
 * - done：当天所有任务均为 done **且** dayDoneAt 已打卡
 * - draft：其余（有任务但未全 done / 或未打卡）——填写中
 */
export declare function dayStatus(tasks: readonly TaskRecord[], date: string, dayDoneAt: Readonly<Record<string, number>>): DayStatus;
/** 是否为可勾选完成的状态（todo/backlog/failed 可勾为 done；done 可取消） */
export declare function canToggleDone(task: TaskRecord): boolean;
/** 勾选后的目标状态：done → todo（取消）；其余 → done */
export declare function toggleDoneStatus(task: TaskRecord): 'todo' | 'done';
/** 生成日期中文标签：8.18 */
export declare function shortDate(dateKey: string): string;
/**
 * 生成单日日报 Markdown（§PRD 6 模板）。
 * @param categories 分类定义（缺省内置四类）
 */
export declare function dayReportMarkdown(tasks: readonly TaskRecord[], date: string, categories?: readonly CategoryDef[]): string;
/**
 * 生成本周日报 Markdown：按分类聚合 7 天，条目保留日期标注。
 * @param categories 分类定义（缺省内置四类）
 */
export declare function weekReportMarkdown(tasks: readonly TaskRecord[], start: Date, categories?: readonly CategoryDef[]): string;
/** 把 Markdown 日报/周报转成纯文本：去掉行首 `# ` / `## ` / `- `（PRD §5.5「复制纯文本」） */
export declare function toPlainReport(markdown: string): string;
/** 分类 → 展示标签（按配置查询；查不到回退 id；缺省配置兼容内置四类） */
export declare function categoryLabel(category: string, categories?: readonly CategoryDef[]): string;
/** 日期 key → 星期名（周一~周日） */
export declare function weekdayName(dateKey: string): string;
