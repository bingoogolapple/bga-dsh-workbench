/**
 * 5 段 cron 表达式解析与下一次运行时间计算。
 *
 * 支持标准 5 段格式：分(0-59) 时(0-23) 日(1-31) 月(1-12) 周(0-7，7 视作 0)，
 * 每段支持 `*`、`a-b`、`a-b/step`、通配符加斜杠的步进写法、逗号枚举。
 * 注意：本项目只做浏览器端轻量解析，不引入第三方库。
 */
export interface CronSchedule {
    /** 命中的分钟集合 */
    minutes: ReadonlySet<number>;
    /** 命中的小时集合 */
    hours: ReadonlySet<number>;
    /** 命中的日期（月内第几天）集合 */
    days: ReadonlySet<number>;
    /** 命中的月份集合 */
    months: ReadonlySet<number>;
    /** 命中的星期集合（0=周日） */
    weekdays: ReadonlySet<number>;
    /** 日期段是否为通配符 `*`（用于「日或周」的匹配语义） */
    dayWildcard: boolean;
    /** 星期段是否为通配符 `*` */
    weekdayWildcard: boolean;
}
/**
 * 解析 cron 表达式为 CronSchedule；格式非法时返回 null。
 * 表达式必须恰好 5 段，且每段都能被 parseField 完整接受。
 */
export declare function parseCron(expr: string): CronSchedule | null;
/** 判断 cron 表达式是否合法 */
export declare function isValidCron(expr: string): boolean;
/**
 * 计算从 fromMs 起的下一次匹配时间戳（毫秒）。
 * 从下一分钟起逐分钟扫描，最远搜 366 天；找不到（如 2 月 30 日）返回 undefined。
 */
export declare function nextRunAtMs(expr: string, fromMs: number): number | undefined;
