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
import type { SettingsScope, SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
/**
 * 单个字段的「写回动作」：由 parse 解析文本框文本后得到的落库指令。
 *
 * - { kind: 'set'; value }：把字段设置为 value；
 * - { kind: 'clear' }：清空用户层的覆盖，恢复继承 / 默认值。
 */
export type FieldWrite = {
    kind: 'set';
    value: unknown;
} | {
    kind: 'clear';
};
/**
 * 字段规格（schema）：描述单个设置字段如何格式化展示、如何解析输入。
 */
export interface FieldSpec {
    field: string;
    secret?: boolean;
    format: (value: unknown) => string;
    parse: (text: string) => FieldWrite | undefined;
}
/**
 * 字段的可订阅状态：供 UI 渲染文本框的值、覆盖标记与非法标记。
 */
export interface FieldState {
    text: string;
    overridden: boolean;
    invalid: boolean;
}
/**
 * 卡片外壳状态：描述整张设置卡片的可用性、可编辑性、脏标记与保存状态。
 */
export interface CardShell {
    available: boolean;
    exposed: boolean;
    writable: boolean;
    dirty: boolean;
    invalid: boolean;
    saving: boolean;
    failed: boolean;
    failedReason?: string;
}
/**
 * 卡片可暴露给 UI 的动作集合（对设置作用域操作的薄封装）。
 */
export interface CardActions {
    edit: (field: string, text: string) => void;
    resetField: (field: string) => void;
    save: () => void;
    discard: () => void;
}
/**
* 批量写操作的单个条目：字段名 + set / unset 指令（+ 可选值）。
*
* 供支持批量写入作用域的 mutate() 使用。
*/
export interface BatchedWrite {
    field: string;
    op: 'set' | 'unset';
    value?: unknown;
}
/**
 * 批量写入结果中对单个字段的反馈：是否真正落库。
 */
export interface BatchedFieldResult {
    field: string;
    landed: boolean;
}
/**
 * 批量写入的整体结果：ok 表示批次是否被接受，fields 报告逐字段落库情况，
 * code / message 携带失败时的错误信息。
 */
export interface BatchResult {
    ok: boolean;
    fields: BatchedFieldResult[];
    code?: string;
    message?: string;
}
/**
 * 数字字段的约束条件。
 */
export interface NumberConstraints {
    integer?: boolean;
    min?: number;
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
export declare function numberField(field: string, constraints?: NumberConstraints): FieldSpec;
/**
* 生成「文本字段」的 FieldSpec。
*
* 文本去首尾空白后为空 -> 清除；否则原样写入。
*
* @param field 字段名。
* @returns 文本字段规格。
*/
export declare function textField(field: string): FieldSpec;
/**
* 生成「敏感（密文）字段」的 FieldSpec：即文本字段 + secret 标记。
*
* secret 标记影响 store() 的成功判定：敏感字段保存后不比对回读值，
* 直接视为成功（避免密文回显 / 明文比对）。
*
* @param field 字段名。
* @returns 敏感字段规格。
*/
export declare function secretField(field: string): FieldSpec;
/**
* 生成「布尔字段」的 FieldSpec：文本只接受 'true' / 'false'。
*
* @param field 字段名。
* @returns 布尔字段规格（空文本 -> 清除；其他文本 -> 解析失败）。
*/
export declare function booleanField(field: string): FieldSpec;
/**
* 生成「选项字段」的 FieldSpec：文本必须命中 choices 之一。
*
* 空文本 -> 清除；命中选项 -> 写入；未命中 -> 解析失败。
*
* @param field 字段名。
* @param choices 合法的选项值列表。
* @returns 选项字段规格。
*/
export declare function choiceField(field: string, choices: readonly string[]): FieldSpec;
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
export declare class CardForm<T> {
    private readonly scope;
    private readonly specs;
    private readonly staged;
    private readonly listeners;
    private saving;
    private failed;
    private failedReason;
    /**
     * @param scope 该卡片对应的设置作用域（读写入口 + 变更订阅源）。
     * @param specs 本卡片管理的字段规格列表。
     */
    constructor(scope: SettingsScope<T>, specs: FieldSpec[]);
    /**
     * 把一段「投影函数」绑定为一个可订阅的 SnapshotStore。
     *
     * 投影函数读取表单状态（如 shell() + field() 的组合）；每次内部状态
     * 发布时自动更新 store，React 组件订阅 store 即可被动刷新。
     *
     * @param project 投影函数。
     * @returns 初始值为 project() 结果的 SnapshotStore。
     */
    bind<S>(project: () => S): SnapshotStore<S>;
    /**
     * 计算卡片外壳状态（CardShell）。
     *
     * 通过 plan() 判断是否存在脏编辑与非法字段；并透传作用域的
     * 加载状态、暴露状态与可写性。
     */
    shell(): CardShell;
    /**
     * 读取单个字段的可订阅状态（FieldState）。
     *
     * 有暂存编辑时，以暂存文本为准并重新解析出 overridden / invalid；
     * 没有暂存编辑时，回落到当前作用域值格式化出的文本。
     */
    field(field: string): FieldState;
    /**
     * 暴露给 UI 的动作集合（CardActions）。
     *
     * 所有动作仅操作内部状态并发布通知，真正的落库只在 save() 里发生。
     */
    actions(): CardActions;
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
    save(): Promise<void>;
    /**
     * 探测作用域是否支持批量写入；不支持时返回 undefined。
     */
    private batchedScope;
    /**
     * 生成写入计划：逐个字段把暂存编辑翻译成 BatchWrite 与回写函数。
     *
     * 规则：
     * - 暂存为 clear：若该字段当前确实有用户覆盖，则计划 unset + 删除回写；
     * - 暂存文本与当前生效值相同：无变化，跳过；
     * - 解析成功：set（或 clear）写入；
     * - 解析失败：计划仍产生一项但 run 为 undefined（作为 invalid 标记）。
     */
    private plan;
    /**
     * 清除某字段的用户覆盖（unset），返回是否成功（该字段不再被覆盖）。
     */
    private clear;
    /**
     * 写入某字段的值（set），返回是否成功落库。
     *
     * 敏感字段（secret）不做回读比对、直接视为成功；
     * 普通字段通过与用户层（user）当前值比对来确认落库。
     */
    private store;
    /**
     * 写入暂存区并发布（同时清除上次的失败标记）。
     */
    private stage;
    /**
     * 按字段名取出规格，不存在时抛错（配置错误）。
     */
    private specOf;
    /**
     * 取当前作用域快照。
     */
    private snapshotOf;
    /**
     * 取当前生效值（覆盖用户叠加后的最终值）中的某字段。
     */
    private sectionValue;
    /**
     * 取基值（部署默认值）中的某字段。
     */
    private baseValue;
    /**
     * 取用户层（用户自己的覆盖项）字典。
     */
    private userLayer;
    /**
     * 判断某字段当前是否被用户显式覆盖过。
     */
    private stored;
    /**
     * 发布状态变更：通知所有订阅的监听器（bind 出的 store 随之更新）。
     */
    private publish;
}
