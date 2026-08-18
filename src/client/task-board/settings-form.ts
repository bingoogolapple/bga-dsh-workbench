 /**
 * settings-form.ts —— 设置表单的状态封装（CardForm）。
 *
 * 为「插件设置卡片」提供一套与 DSH 设置作用域（SettingsScope<T>）对接的
 * 编辑暂存 / 校验 / 保存机制：
 * - 每个字段由 FieldSpec 描述：如何把当前值格式化成文本框文本（format）、
 *   如何把文本框文本解析成写回动作（parse，{ kind: 'set' } 或 { kind: 'clear' }）；
 * - 用户的每次编辑先进入 staged 暂存区（dirty 数据），并不直接落库；
 * - save() 时先通过 plan() 把暂存内容翻译成「写入计划」：作用域具备批量写
 *   能力（mutate）时走一次批量写入，否则退化为逐字段 set/unset；
 *   解析失败的字段（invalid）会阻止整批保存；
 * - scope 变化（外部修改设置）时通过订阅自动重算，并经 bind() 投影出的
 *   SnapshotStore 通知 React 侧刷新。
 * 该模块与具体 UI 框架解耦，可被任意设置卡片（React 或其他）复用。
 */
 import type { SettingsScope, SettingsScopeSnapshot, SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
 import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'

/**
 * 单个字段的「写回动作」：由 parse 解析文本框文本后得到的落库指令。
 *
 * - { kind: 'set'; value }：把字段设置为 value；
 * - { kind: 'clear' }：清空用户层的覆盖，恢复继承 / 默认值。
 */
 export type FieldWrite =
   | { kind: 'set'; value: unknown }
   | { kind: 'clear' }

/**
 * 字段规格（schema）：描述单个设置字段如何格式化展示、如何解析输入。
 */
 export interface FieldSpec {

   // 字段名（即设置对象里的 key）。
   field: string

   // 是否为敏感字段：保存成功性判定对敏感字段直接放行，
   // 不做「已落库值 == 提交值」的比对（避免回读明文）。
   secret?: boolean

   // 把设置当前值格式化为文本框文本（value 非目标类型时返回空串）。
   format: (value: unknown) => string

   // 把文本框文本解析为写回动作；解析失败（非法输入）返回 undefined，
   // 调用方将据此把该字段标记为 invalid。
   parse: (text: string) => FieldWrite | undefined
 }

/**
 * 字段的可订阅状态：供 UI 渲染文本框的值、覆盖标记与非法标记。
 */
 export interface FieldState {

   // 文本框当前显示的文本。
   text: string

   // 是否处于「用户已覆盖」状态（存在非空的落库写入）。
   overridden: boolean

   // 当前文本是否解析失败（非法值）。
   invalid: boolean
 }

/**
 * 卡片外壳状态：描述整张设置卡片的可用性、可编辑性、脏标记与保存状态。
 */
 export interface CardShell {

   // 设置作用域是否已加载完成（loading 中为 false，此时卡片不渲染）。
   available: boolean

   // 当前 DSH 版本是否向设置页暴露了本插件的配置命名空间
   // （status 为 ready 时 true；未暴露时卡片显示提示文案）。
   exposed: boolean

   // 当前部署是否允许写入设置（false 时表单整体禁用）。
   writable: boolean

   // 是否存在未保存的编辑（暂存区非空）。
   dirty: boolean

   // 是否存在解析失败的字段（有则禁止保存）。
   invalid: boolean

   // 是否正在保存中。
   saving: boolean

   // 上次保存是否失败。
   failed: boolean

   // 保存失败时携带的原因（可选）。
   failedReason?: string
 }

/**
 * 卡片可暴露给 UI 的动作集合（对设置作用域操作的薄封装）。
 */
 export interface CardActions {

   // 编辑某字段：把输入文本写入暂存区（不落库）。
   edit: (field: string, text: string) => void

   // 重置某字段：恢复为部署默认值（base）并标记为待清除。
   resetField: (field: string) => void

   // 保存所有暂存编辑。
   save: () => void

   // 放弃所有未保存的编辑。
   discard: () => void
 }

 // 暂存中的一次编辑：记录文本框原文与是否需要清除（恢复默认）。
 interface StagedEdit {

   text: string

   clear: boolean
 }

 // 写入计划中的一项：字段名、批量写操作（op）与逐字段写回函数（run）。
 // run 为 undefined 表示该项非法（解析失败），会标记为 invalid 并阻止整批保存。
 interface PlannedWrite {

   field: string

   op: BatchedWrite

   run: (() => Promise<boolean>) | undefined
 }

 /**
 * 批量写操作的单个条目：字段名 + set / unset 指令（+ 可选值）。
 *
 * 供支持批量写入作用域的 mutate() 使用。
 */
 export interface BatchedWrite {

   field: string

   op: 'set' | 'unset'

   value?: unknown
 }

/**
 * 批量写入结果中对单个字段的反馈：是否真正落库。
 */
 export interface BatchedFieldResult {

   field: string

   landed: boolean
 }

/**
 * 批量写入的整体结果：ok 表示批次是否被接受，fields 报告逐字段落库情况，
 * code / message 携带失败时的错误信息。
 */
 export interface BatchResult {

   ok: boolean

   fields: BatchedFieldResult[]

   code?: string

   message?: string
 }

 // 支持批量写入的设置作用域的可选形态：若 scope 上存在 mutate 方法，
 // CardForm 保存时优先走批量写入，否则退化为逐字段写入。
 interface BatchedSettingsScope {

   mutate: (writes: BatchedWrite[]) => Promise<BatchResult>
 }

/**
 * 数字字段的约束条件。
 */
 export interface NumberConstraints {

   // 是否必须为整数。
   integer?: boolean

   // 允许的最小值（含）。
   min?: number
 }

 /**
 * 生成「数字字段」的 FieldSpec。
 *
 * 空文本（去空白后）解析为清除；非有限数字、非整数（要求整数时）
 * 或小于 min 的值解析失败（返回 undefined）。
 *
 * @param field 字段名。
 * @param constraints 可选约束。
 * @returns 数字字段规格。
 */
 export function numberField(field: string, constraints: NumberConstraints = {}): FieldSpec {
   const { integer = false, min } = constraints
   return {
     field,
     format: value => typeof value === 'number' ? String(value) : '',
     parse: (text) => {
       const trimmed = text.trim()
       if (trimmed === '') return { kind: 'clear' }
       const parsed = Number(trimmed)
       if (!Number.isFinite(parsed)) return undefined
       if (integer && !Number.isInteger(parsed)) return undefined
       if (min !== undefined && parsed < min) return undefined
       return { kind: 'set', value: parsed }
     },
   }
 }

 /**
 * 生成「文本字段」的 FieldSpec。
 *
 * 文本去首尾空白后为空 -> 清除；否则原样写入。
 *
 * @param field 字段名。
 * @returns 文本字段规格。
 */
 export function textField(field: string): FieldSpec {
   return {
     field,
     format: value => typeof value === 'string' ? value : '',
     parse: (text) => {
       const trimmed = text.trim()
       return trimmed === '' ? { kind: 'clear' } : { kind: 'set', value: trimmed }
     },
   }
 }

 /**
 * 生成「敏感（密文）字段」的 FieldSpec：即文本字段 + secret 标记。
 *
 * secret 标记影响 store() 的成功判定：敏感字段保存后不比对回读值，
 * 直接视为成功（避免密文回显 / 明文比对）。
 *
 * @param field 字段名。
 * @returns 敏感字段规格。
 */
 export function secretField(field: string): FieldSpec {
   return { ...textField(field), secret: true }
 }

 /**
 * 生成「布尔字段」的 FieldSpec：文本只接受 'true' / 'false'。
 *
 * @param field 字段名。
 * @returns 布尔字段规格（空文本 -> 清除；其他文本 -> 解析失败）。
 */
 export function booleanField(field: string): FieldSpec {
   return {
     field,
     format: value => typeof value === 'boolean' ? String(value) : '',
     parse: (text) => {
       const trimmed = text.trim()
       if (trimmed === '') return { kind: 'clear' }
       if (trimmed === 'true') return { kind: 'set', value: true }
       if (trimmed === 'false') return { kind: 'set', value: false }
       return undefined
     },
   }
 }

 /**
 * 生成「选项字段」的 FieldSpec：文本必须命中 choices 之一。
 *
 * 空文本 -> 清除；命中选项 -> 写入；未命中 -> 解析失败。
 *
 * @param field 字段名。
 * @param choices 合法的选项值列表。
 * @returns 选项字段规格。
 */
 export function choiceField(field: string, choices: readonly string[]): FieldSpec {
   return {
     field,
     format: value => typeof value === 'string' && choices.includes(value) ? value : '',
     parse: (text) => {
       if (text === '') return { kind: 'clear' }
       return choices.includes(text) ? { kind: 'set', value: text } : undefined
     },
   }
 }

 /**
 * 设置表单状态封装（核心类）。
 *
 * 以 SettingsScope<T> 为数据源，内部维护：
 * - specs：字段名 -> FieldSpec 的索引，用于 format/parse；
 * - staged：每个字段的暂存编辑（已编辑、未落库的「脏」数据）；
 * - listeners：bind() 投影出的 SnapshotStore 的刷新回调集合；
 * - 保存流程：plan() 生成写入计划 -> 批量 mutate（或逐字段回退写入）
 *   -> 按落库结果清空对应暂存项，并对外发布新状态。
 */
 export class CardForm<T> {
   private readonly specs: Map<string, FieldSpec>
   private readonly staged = new Map<string, StagedEdit>()
   private readonly listeners = new Set<() => void>()
   private saving = false
   private failed = false
   private failedReason: string | undefined

   /**
    * @param scope 该卡片对应的设置作用域（读写入口 + 变更订阅源）。
    * @param specs 本卡片管理的字段规格列表。
    */
   constructor(
     private readonly scope: SettingsScope<T>,
     specs: FieldSpec[],
   ) {
     // 用 Map 索引字段规格，供后续按字段名 O(1) 查找。
     this.specs = new Map(specs.map(spec => [spec.field, spec]))
     // 订阅作用域变化：外部改设置时重算并通知所有 bind 出的 store。
     scope.subscribe(() => { this.publish() })
   }

   /**
    * 把一段「投影函数」绑定为一个可订阅的 SnapshotStore。
    *
    * 投影函数读取表单状态（如 shell() + field() 的组合）；每次内部状态
    * 发布时自动更新 store，React 组件订阅 store 即可被动刷新。
    *
    * @param project 投影函数。
    * @returns 初始值为 project() 结果的 SnapshotStore。
    */
   bind<S>(project: () => S): SnapshotStore<S> {
     const store = createSnapshotStore(project())
     this.listeners.add(() => { store.set(project()) })
     return store
   }

   /**
    * 计算卡片外壳状态（CardShell）。
    *
    * 通过 plan() 判断是否存在脏编辑与非法字段；并透传作用域的
    * 加载状态、暴露状态与可写性。
    */
   shell(): CardShell {
     const snapshot = this.scope.getSnapshot()
     const plan = this.plan()
     return {
       // 作用域还在加载中时不可用（UI 不渲染卡片）。
       available: snapshot.status !== 'loading',
       // 只有 ready 才说明命名空间对设置页暴露了。
       exposed: snapshot.status === 'ready',
       writable: snapshot.writable,
       // 存在任何待执行的写入计划即为「脏」。
       dirty: plan.length > 0,
       // 计划中存在 run 为 undefined 的非法项即为 invalid。
       invalid: plan.some(item => item.run === undefined),
       saving: this.saving,
       failed: this.failed,
       // 仅在确有失败原因时带上 failedReason，避免多余字段。
       ...this.failedReason === undefined ? {} : { failedReason: this.failedReason },
     }
   }

   /**
    * 读取单个字段的可订阅状态（FieldState）。
    *
    * 有暂存编辑时，以暂存文本为准并重新解析出 overridden / invalid；
    * 没有暂存编辑时，回落到当前作用域值格式化出的文本。
    */
   field(field: string): FieldState {
     const spec = this.specOf(field)
     const staged = this.staged.get(field)
     if (staged === undefined) {
       return { text: spec.format(this.sectionValue(field)), overridden: this.stored(field), invalid: false }
     }
     // 暂存的清除操作翻译成一个「clear 写入」；否则重新解析暂存文本。
     const write = staged.clear ? { kind: 'clear' as const } : spec.parse(staged.text)
     return {
       text: staged.text,
       // 解析出 set 写入才意味着用户覆盖了一个真实值。
       overridden: write?.kind === 'set',
       // 解析失败 -> invalid。
       invalid: write === undefined,
     }
   }

   /**
    * 暴露给 UI 的动作集合（CardActions）。
    *
    * 所有动作仅操作内部状态并发布通知，真正的落库只在 save() 里发生。
    */
   actions(): CardActions {
     return {
       // 编辑：写入暂存区（非清除）。
       edit: (field, text) => { this.stage(field, { text, clear: false }) },
       // 重置：把字段文本设为基值（base，部署默认）并标记为待清除。
       resetField: (field) => {
         this.stage(field, { text: this.specOf(field).format(this.baseValue(field)), clear: true })
       },
       // 保存：fire-and-forget 触发异步保存流程。
       save: () => { void this.save() },
       // 放弃：无暂存且未失败时无事可做；否则清空暂存与失败标记。
       discard: () => {
         if (this.staged.size === 0 && !this.failed) return
         this.staged.clear()
         this.failed = false
         this.failedReason = undefined
         this.publish()
       },
     }
   }

   /**
    * 保存所有暂存编辑。
    *
    * 流程：1) 生成写入计划，过滤出合法的部分（run 未定义视为非法）；
    * 2) 无计划 / 正在保存 / 存在非法项时不动作；3) 优先走批量 mutate，
    * 否则逐字段执行 run 回写；4) 对每个字段记录是否真正落库（landed）；
    * 5) 清掉已落库字段的暂存，按「落库数 == 计划数」判定整体成败并发布。
    *
    * @returns 无返回值（异步完成后通过状态/通知让 UI 感知结果）。
    */
   async save(): Promise<void> {
     const plan = this.plan()
     const valid = plan.filter(item => item.run !== undefined)
     // 提前退出条件：无可保存内容、保存中或存在非法字段。
     if (plan.length === 0 || this.saving || valid.length !== plan.length) return
     // 批量写入用的 op 列表（所有合法项）。
     const plannedWrites = valid.map(item => item.op)

     // 进入 saving 态，先发布一次让 UI 禁用保存按钮。
     const fields = new Set(plan.map(item => item.field))
     this.saving = true
     this.failed = false
     this.failedReason = undefined
     this.publish()
     const landed = new Set<string>()
     const batch = this.batchedScope()
     if (batch !== undefined) {
       // 首选路径：一次性批量写入所有字段。
       const result = await batch.mutate(plannedWrites)
       if (result.ok) {
         // 记下真正落库的字段。
         for (const field of result.fields) {
           if (field.landed) landed.add(field.field)
         }
       } else {
         // 整批被拒绝：记录失败原因。
         this.failedReason = result.message
       }
     } else {
       // 回退路径：逐字段写入（按写入结果判定是否落库）。
       for (const item of valid) {
         if (await item.run!()) landed.add(item.field)
       }
     }
     // 已落库的字段清掉暂存（未落库的保留，供用户修改后重试）。
     for (const field of fields) {
       if (landed.has(field)) this.staged.delete(field)
     }
     this.saving = false
     // 只要还有字段没落库，就视为整体失败。
     this.failed = landed.size !== fields.size
     this.publish()
   }

   /**
    * 探测作用域是否支持批量写入；不支持时返回 undefined。
    */
   private batchedScope(): BatchedSettingsScope | undefined {
     // 用鸭子类型判断：存在可调用的 mutate 即当作批量作用域。
     const candidate = this.scope as unknown as BatchedSettingsScope | undefined
     return typeof candidate?.mutate === 'function' ? candidate : undefined
   }

   /**
    * 生成写入计划：逐个字段把暂存编辑翻译成 BatchWrite 与回写函数。
    *
    * 规则：
    * - 暂存为 clear：若该字段当前确实有用户覆盖，则计划 unset + 删除回写；
    * - 暂存文本与当前生效值相同：无变化，跳过；
    * - 解析成功：set（或 clear）写入；
    * - 解析失败：计划仍产生一项但 run 为 undefined（作为 invalid 标记）。
    */
   private plan(): PlannedWrite[] {
     const plan: PlannedWrite[] = []
     for (const [field, staged] of this.staged) {
       const spec = this.specOf(field)
       if (staged.clear) {
         // 清除项：仅当确实存在用户覆盖时才产生写入计划。
         if (this.stored(field)) plan.push({ field, op: { field, op: 'unset' }, run: () => this.clear(field) })
         continue
       }
       // 文本没变化 -> 无需写入。
       if (staged.text === spec.format(this.sectionValue(field))) continue
       const write = spec.parse(staged.text)
       if (write === undefined) {
         // 解析失败：计划占位（run 为 undefined），用于 invalid 判定。
         plan.push({ field, op: { field, op: 'unset' }, run: undefined })
       } else if (write.kind === 'clear') {
         plan.push({ field, op: { field, op: 'unset' }, run: () => this.clear(field) })
       } else {
         plan.push({ field, op: { field, op: 'set', value: write.value }, run: () => this.store(field, write.value) })
       }
     }
     return plan
   }

   /**
    * 清除某字段的用户覆盖（unset），返回是否成功（该字段不再被覆盖）。
    */
   private async clear(field: string): Promise<boolean> {
     await this.scope.unset(field)
     return !this.stored(field)
   }

   /**
    * 写入某字段的值（set），返回是否成功落库。
    *
    * 敏感字段（secret）不做回读比对、直接视为成功；
    * 普通字段通过与用户层（user）当前值比对来确认落库。
    */
   private async store(field: string, value: unknown): Promise<boolean> {
     await this.scope.set(field, value)

     if (this.specOf(field).secret) return true
     return this.userLayer()?.[field] === value
   }

   /**
    * 写入暂存区并发布（同时清除上次的失败标记）。
    */
   private stage(field: string, edit: StagedEdit): void {
     this.staged.set(field, edit)
     this.failed = false
     this.failedReason = undefined
     this.publish()
   }

   /**
    * 按字段名取出规格，不存在时抛错（配置错误）。
    */
   private specOf(field: string): FieldSpec {
     const spec = this.specs.get(field)

     if (spec === undefined) throw new Error(`settings card has no field ${field}`)
     return spec
   }

   /**
    * 取当前作用域快照。
    */
   private snapshotOf(): SettingsScopeSnapshot<T> {
     return this.scope.getSnapshot()
   }

   /**
    * 取当前生效值（覆盖用户叠加后的最终值）中的某字段。
    */
   private sectionValue(field: string): unknown {
     return (this.snapshotOf().value as Record<string, unknown> | undefined)?.[field]
   }

   /**
    * 取基值（部署默认值）中的某字段。
    */
   private baseValue(field: string): unknown {
     return (this.snapshotOf().base as Record<string, unknown> | undefined)?.[field]
   }

   /**
    * 取用户层（用户自己的覆盖项）字典。
    */
   private userLayer(): Record<string, unknown> | undefined {
     return this.snapshotOf().user as Record<string, unknown> | undefined
   }

   /**
    * 判断某字段当前是否被用户显式覆盖过。
    */
   private stored(field: string): boolean {
     const user = this.userLayer()
     return user !== undefined && Object.hasOwn(user, field)
   }

   /**
    * 发布状态变更：通知所有订阅的监听器（bind 出的 store 随之更新）。
    */
   private publish(): void {
     for (const listener of this.listeners) listener()
   }
 }