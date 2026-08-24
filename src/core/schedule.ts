/**
 * 5 段 cron 表达式解析与下一次运行时间计算。
 *
 * 支持标准 5 段格式：分(0-59) 时(0-23) 日(1-31) 月(1-12) 周(0-7，7 视作 0)，
 * 每段支持 `*`、`a-b`、`a-b/step`、通配符加斜杠的步进写法、逗号枚举。
 * 注意：本项目只做浏览器端轻量解析，不引入第三方库。
 */
 export interface CronSchedule {
   /** 命中的分钟集合 */
   minutes: ReadonlySet<number>
   /** 命中的小时集合 */
   hours: ReadonlySet<number>
   /** 命中的日期（月内第几天）集合 */
   days: ReadonlySet<number>
   /** 命中的月份集合 */
   months: ReadonlySet<number>
   /** 命中的星期集合（0=周日） */
   weekdays: ReadonlySet<number>
   /** 日期段是否为通配符 `*`（用于「日或周」的匹配语义） */
   dayWildcard: boolean
   /** 星期段是否为通配符 `*` */
   weekdayWildcard: boolean
 }

 /** 各字段的取值范围：[最小值, 最大值] */
 const FIELD_RANGES: ReadonlyArray<readonly [number, number]> = [
   [0, 59], // 分
   [0, 23], // 时
   [1, 31], // 日
   [1, 12], // 月
   [0, 7],  // 周（7 与 0 都表示周日）
 ]

 /**
  * 解析 cron 表达式为 CronSchedule；格式非法时返回 null。
  * 表达式必须恰好 5 段，且每段都能被 parseField 完整接受。
  */
 export function parseCron(expr: string): CronSchedule | null {
   const fields = expr.trim().split(/\s+/)
   if (fields.length !== 5) return null
   const sets: Set<number>[] = []
   for (let index = 0; index < 5; index++) {
     const [min, max] = FIELD_RANGES[index]
     const set = new Set<number>()
     if (!parseField(fields[index], min, max, set)) return null
     sets.push(set)
   }
   // 星期的 7 归一化为 0（周日）
   const weekdays = new Set<number>()
   for (const day of sets[4]) weekdays.add(day === 7 ? 0 : day)
   return {
     minutes: sets[0],
     hours: sets[1],
     days: sets[2],
     months: sets[3],
     weekdays,
     // 记录日/周是否为通配符，供 matches 判断「日或周」的匹配语义
     dayWildcard: fields[2] === '*',
     weekdayWildcard: fields[4] === '*',
   }
 }

 const MAX_MONTH_DAYS: ReadonlyArray<number> = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

 /**
  * 判断「只依赖日期段」时日期×月份是否永不可能命中（如 2 月 30 日）。
  * 仅当周段为通配符（即日期段是唯一依据）且日期段非通配符时才可能为真；
  * 2 月取闰年的 29 天作为上限，不会误判闰年可达的 2 月 29 日。
  */
 function isImpossibleDate(schedule: CronSchedule): boolean {
   if (!schedule.weekdayWildcard || schedule.dayWildcard) return false
   for (const month of schedule.months) {
     const maxDay = MAX_MONTH_DAYS[month] ?? 31
     for (const day of schedule.days) {
       if (day <= maxDay) return false
     }
   }
   return true
 }

 /** 判断 cron 表达式是否合法 */
 export function isValidCron(expr: string): boolean {
   return parseCron(expr) !== null
 }

 /**
  * 计算从 fromMs 起的下一次匹配时间戳（毫秒）。
  * 从下一分钟起逐分钟扫描，最远搜 366 天；找不到（如 2 月 30 日）返回 undefined。
  */
 export function nextRunAtMs(expr: string, fromMs: number): number | undefined {
   const schedule = parseCron(expr)
   if (schedule === null) return undefined
   // 「日×月」永不可能命中（如 2 月 30 日）时提前返回，避免无谓的满窗扫描
   if (isImpossibleDate(schedule)) return undefined
   const from = new Date(fromMs)
   // 从「下一个整分钟」开始扫描
   const scan = new Date(from.getFullYear(), from.getMonth(), from.getDate(), from.getHours(), from.getMinutes() + 1, 0, 0)
   const limitMs = fromMs + 366 * 24 * 60 * 60 * 1000
   while (scan.getTime() <= limitMs) {
     if (matches(schedule, scan)) return scan.getTime()
     scan.setMinutes(scan.getMinutes() + 1)
   }
   return undefined
 }

 /**
  * 解析单个字段（支持 *、区间、步进、逗号枚举）并把命中值写入 out 集合。
  * 无法解析时返回 false。
  */
 function parseField(field: string, min: number, max: number, out: Set<number>): boolean {
   // 通配符：取满整个取值范围
   if (field === '*') {
     for (let value = min; value <= max; value++) out.add(value)
     return true
   }
   // 逗号分隔的多个部分，逐个解析后并入集合
   for (const part of field.split(',')) {
     if (part === '') return false
     const [range, stepRaw] = part.split('/')
     let low: number
     let high: number
     if (range === '*') {
       low = min
       high = max
     } else if (range.includes('-')) {
       // 区间 a-b
       const [a, b] = range.split('-')
       if (a === '' || b === '' || !isDigits(a) || !isDigits(b)) return false
       low = Number(a)
       high = Number(b)
     } else if (isDigits(range)) {
       // 单值
       low = Number(range)
       high = Number(range)
     } else {
       return false
     }
     if (low < min || high > max || low > high) return false
     // 步进（默认 1）
     const step = stepRaw === undefined ? 1 : isDigits(stepRaw) ? Number(stepRaw) : NaN
     if (!Number.isInteger(step) || step < 1) return false
     for (let value = low; value <= high; value += step) out.add(value)
   }
   return true
 }

 /**
  * 判断某个时刻是否命中 schedule。
  * cron 的「日」与「周」是「或」语义：任一段为 * 时另一段为准，否则取并集。
  */
 function matches(schedule: CronSchedule, date: Date): boolean {
   if (!schedule.minutes.has(date.getMinutes())) return false
   if (!schedule.hours.has(date.getHours())) return false
   if (!schedule.months.has(date.getMonth() + 1)) return false
   const dayMatches = schedule.days.has(date.getDate())
   const weekdayMatches = schedule.weekdays.has(date.getDay())
   if (schedule.dayWildcard) return weekdayMatches
   if (schedule.weekdayWildcard) return dayMatches
   return dayMatches || weekdayMatches
 }

 /** 判断字符串是否全部由数字组成 */
 function isDigits(value: string): boolean {
   return /^\d+$/.test(value)
 }