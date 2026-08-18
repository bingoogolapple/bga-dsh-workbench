 /**
 * PluginSettingsCard.tsx —— 通用插件设置卡片外壳与字段控件。
 *
 * 提供可复用的设置卡片 UI 构建块：
 * - PluginSettingsCard：可折叠的卡片外壳（标题 + 描述 + 未保存标记 +
 *   保存 / 放弃按钮 + 保存失败提示），并处理两种特殊形态：
 *   「设置命名空间未暴露」（state.exposed=false，仅显示提示文案）与
 *   「部署只读」（state.writable=false，禁用全部字段与按钮）；
 * - ValueField / BooleanField / ChoiceField：三种字段控件
 *   （文本输入 / 三态下拉「继承-开-关」/ 选项下拉），
 *   共用 FieldProps 接口（标签、提示、当前文本、覆盖标记、校验失败等），
 *   均带「覆盖」徽标与「重置」按钮。
 * 样式由 cfg-card.module.css 提供。
 */
 import { useState, type ReactNode } from 'react'
 import type { CardShell } from './settings-form.ts'
 import css from './cfg-card.module.css'

 /**
 * 通用设置卡片自身硬编码需要翻译的文案 key 清单。
 *
 * 这些文案不属于插件自己的命名空间 locale（标题/描述等由调用方通过
 * titleKey/descriptionKey 提供），而是卡片外壳固定使用的通用文案
 * （展开 / 收起 / 未暴露提示 / 未保存 / 只读 / 保存失败 / 保存 / 放弃等），
 * 由 t() 统一从字典取出。
 */
 export const CARD_COPY_KEYS = [
   'settings.collapse',
   'settings.expand',
   'settings.notExposed',
   'settings.unsaved',
   'settings.readOnly',
   'settings.saveFailed',
   'settings.discard',
   'settings.save',
   'settings.saving',
 ] as const

 /**
 * 通用卡片文案 key 的联合类型：由 CARD_COPY_KEYS 数组推导。
 */
 export type CardCopyKey = (typeof CARD_COPY_KEYS)[number]

 /**
 * 设置卡片可接受的文案 key 类型：插件自定义 key（TKey）或通用卡片 key。
 */
 export type SettingsCardKey<TKey extends string = string> = TKey | CardCopyKey

 /**
 * 设置卡片外壳组件的 props。
 *
 * @param TKey 插件自定义文案 key 的类型参数，用于约束 titleKey/descriptionKey。
 */
 export interface PluginSettingsCardProps<TKey extends string = string> {

   // 文案翻译函数：接受插件 key 或通用卡片 key，可带插值参数。
   t: (key: SettingsCardKey<TKey>, params?: Record<string, string | number>) => string

   // 卡片标题的文案 key。
   titleKey: TKey

   // 卡片描述的文案 key。
   descriptionKey: TKey

   // 卡片外壳状态（可用性 / 暴露 / 可写 / 脏 / 非法 / 保存状态等）。
   state: CardShell

   // 保存回调。
   onSave: () => void

   // 放弃（丢弃未保存编辑）回调。
   onDiscard: () => void

   // 卡片展开后要渲染的字段内容（由调用方提供）。
   children: ReactNode
 }

 /**
 * 通用设置卡片外壳。
 *
 * 默认收起只显示标题与描述（可点击展开）；展开后渲染 children，
 * 并按状态显示未保存标记、只读提示、保存失败原因与保存 / 放弃按钮。
 * 当 state.exposed=false 时只渲染「命名空间未暴露」的提示形态。
 */
 export function PluginSettingsCard<TKey extends string = string>(props: PluginSettingsCardProps<TKey>) {
   // 卡片是否展开（仅影响 UI，不涉及数据）。
   const [open, setOpen] = useState(false)
   const { state } = props
   // 作用域还没加载完成时不渲染任何内容。
   if (!state.available) return null
   const title = props.t(props.titleKey)
   const description = props.t(props.descriptionKey)
   // 保存按钮的禁用条件：无脏编辑、存在非法字段、保存中，任一成立即禁用。
   const blocked = !state.dirty || state.invalid || state.saving
   // 展开时追加 -open 类，驱动 CSS 里的展开样式。
   const cardClass = open ? `${css["bga-kb-cfg--open"]} ${css["bga-kb-cfg"]}` : css["bga-kb-cfg"]

   // —— 形态一：当前 DSH 版本未向设置页暴露本插件的配置命名空间 ——
   // 仅展示一个可展开的提示卡片（不渲染任何可编辑字段）。
   if (!state.exposed) {
     return (
       <li className={cardClass}>
         <button
           type="button"
           className={css["bga-kb-cfg-header"]}
           aria-expanded={open}
           aria-label={`${props.t(open ? 'settings.collapse' : 'settings.expand')}: ${title}`}
           onClick={() => { setOpen(!open) }}
         >
           <span className={css["bga-kb-cfg-head-text"]}>
             <span className={css["bga-kb-cfg-name"]} title={title}>{title}</span>
             <span className={css["bga-kb-cfg-desc"]} title={description}>{description}</span>
           </span>
           <svg
             width="14"
             height="14"
             viewBox="0 0 14 14"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
             className={open ? `${css["bga-kb-cfg-chevron"]} ${css["bga-kb-cfg-chevron--open"]}` : css["bga-kb-cfg-chevron"]}
           >
             <path
               d="M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z"
               fill="currentColor"
             />
           </svg>
         </button>
         {open
           ? (
             <div className={css["bga-kb-cfg-body"]}>
               <p className={css["bga-kb-cfg-hidden"]} role="status">{props.t('settings.notExposed')}</p>
             </div>
           )
           : null}
       </li>
     )
   }
   return (
     <li className={cardClass}>
       <button
         type="button"
         className={css["bga-kb-cfg-header"]}
         aria-expanded={open}
         aria-label={`${props.t(open ? 'settings.collapse' : 'settings.expand')}: ${title}`}
         onClick={() => { setOpen(!open) }}
       >
         <span className={css["bga-kb-cfg-head-text"]}>
           <span className={css["bga-kb-cfg-name"]} title={title}>{title}</span>
           <span className={css["bga-kb-cfg-desc"]} title={description}>{description}</span>
         </span>
         {/* 有未保存编辑时显示「未保存」徽标 */}
        {state.dirty ? <span className={css["bga-kb-cfg-pending"]} title={props.t('settings.unsaved')}>{props.t('settings.unsaved')}</span> : null}
         <svg
           width="14"
           height="14"
           viewBox="0 0 14 14"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
           className={open ? `${css["bga-kb-cfg-chevron"]} ${css["bga-kb-cfg-chevron--open"]}` : css["bga-kb-cfg-chevron"]}
         >
           <path
             d="M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z"
             fill="currentColor"
           />
         </svg>
       </button>
       {open
         ? (
           <div className={css["bga-kb-cfg-body"]}>
             {/* 部署只读提示 */}
            {!state.writable ? <p className={css["bga-kb-cfg-ro"]} role="status">{props.t('settings.readOnly')}</p> : null}
             {props.children}
             {/* 卡片底部操作区：保存失败原因提示 + 放弃 + 保存按钮 */}
            <div className={css["bga-kb-cfg-foot"]}>
               {state.failed
                 ? (
                   <p className={css["bga-kb-cfg-failed"]} role="status">
                     {props.t('settings.saveFailed')}{state.failedReason ? ' - ' + state.failedReason : ''}
                   </p>
                 )
                 : null}
               <button
                 type="button"
                 className={css["bga-kb-cfg-discard"]}
                 disabled={!state.dirty || state.saving}
                 onClick={props.onDiscard}
               >
                 {props.t('settings.discard')}
               </button>
               <button
                 type="button"
                 className={css["bga-kb-cfg-save"]}
                 disabled={blocked}
                 onClick={props.onSave}
               >
                 {props.t(!state.saving ? 'settings.save' : 'settings.saving')}
               </button>
             </div>
           </div>
         )
         : null}
     </li>
   )
 }

 /**
 * 字段控件的公共 props（ValueField / BooleanField / ChoiceField 共用）。
 */
 export interface FieldProps {

   // 控件 DOM id（用于 label 的 htmlFor 关联）。
   id: string

   label: string

   // 提示文案（无错误时显示）。
   // 提示文案（无错误时显示）。
   hint: string

   // 当前文本值（受控值，来自表单状态）。
   text: string

   // 是否被用户覆盖（显示「已覆盖」徽标与重置按钮）。
   overridden: boolean

   // 是否输入非法（切换为错误样式并显示 invalidLabel）。
   invalid: boolean

   // 「已覆盖」徽标的文案。
   overriddenLabel: string

   // 「重置」按钮的文案。
   resetLabel: string

   // 输入非法的提示文案。
   invalidLabel: string

   // 是否禁用（部署只读时全部控件禁用）。
   disabled: boolean

   // 文本变化回调（受控输入把新值交回表单状态）。
   onEdit: (text: string) => void

   // 重置回调（恢复默认值）。
   onReset: () => void
 }

 /**
 * 文本输入型字段控件。
 *
 * 额外支持 numeric（数字键盘提示）与 placeholder；非法时切换错误样式。
 */
 export function ValueField(props: FieldProps & {

   // 是否为数字输入（设置 inputMode='numeric'）。
   numeric?: boolean

   // 输入框占位文案。
   placeholder?: string
 }) {
   return (
     <div className={css["bga-kb-cfg-field"]}>
       <div className={css["bga-kb-cfg-head"]}>
         <label className={css["bga-kb-cfg-label"]} htmlFor={props.id}>{props.label}</label>
         {props.overridden
           ? (
             <span className={css["bga-kb-cfg-badges"]}>
               <span className={css["bga-kb-cfg-badge"]}>{props.overriddenLabel}</span>
               <button
                 type="button"
                 className={css["bga-kb-cfg-reset"]}
                 disabled={props.disabled}
                 onClick={props.onReset}
               >
                 {props.resetLabel}
               </button>
             </span>
           )
           : null}
       </div>
       <input
         id={props.id}
         className={props.invalid ? css["bga-kb-cfg-input--err"] : css["bga-kb-cfg-input"]}
         type="text"
         {...props.numeric === true ? { inputMode: 'numeric' as const } : {}}
         {...props.invalid ? { 'aria-invalid': true } : {}}
         value={props.text}
         placeholder={props.placeholder ?? ''}
         disabled={props.disabled}
         onChange={(event) => { props.onEdit(event.target.value) }}
       />
       <p className={props.invalid ? css["bga-kb-cfg-invalid"] : css["bga-kb-cfg-hint"]}>
         {props.invalid ? props.invalidLabel : props.hint}
       </p>
     </div>
   )
 }

 /**
 * 布尔字段控件：三态下拉（空 = 继承，true = 开，false = 关）。
 *
 * 值为文本 `''` / `'true'` / `'false'`，与 BooleanField 的 parse 语义对应。
 */
 export function BooleanField(props: FieldProps & {

   // 「继承」选项的文案。
   inheritLabel: string

   // 「开」选项的文案。
   onLabel: string

   // 「关」选项的文案。
   offLabel: string
 }) {
   return (
     <div className={css["bga-kb-cfg-field"]}>
       <div className={css["bga-kb-cfg-head"]}>
         <label className={css["bga-kb-cfg-label"]} htmlFor={props.id}>{props.label}</label>
         {props.overridden
           ? (
             <span className={css["bga-kb-cfg-badges"]}>
               <span className={css["bga-kb-cfg-badge"]}>{props.overriddenLabel}</span>
               <button
                 type="button"
                 className={css["bga-kb-cfg-reset"]}
                 disabled={props.disabled}
                 onClick={props.onReset}
               >
                 {props.resetLabel}
               </button>
             </span>
           )
           : null}
       </div>
       <select
         id={props.id}
         className={css["bga-kb-cfg-select"]}
         value={props.text}
         disabled={props.disabled}
         onChange={(event) => { props.onEdit(event.target.value) }}
       >
         <option value="">{props.inheritLabel}</option>
         <option value="true">{props.onLabel}</option>
         <option value="false">{props.offLabel}</option>
       </select>
       <p className={css["bga-kb-cfg-hint"]}>{props.hint}</p>
     </div>
   )
 }

 /**
 * 选项字段控件：下拉选择，空值 = 继承，其余从 choices 里选。
 */
 export function ChoiceField(props: FieldProps & {

   // 「继承」选项的文案。
   inheritLabel: string

   // 可选列表（value 是存储值，label 是展示文案）。
   choices: ReadonlyArray<{ value: string; label: string }>
 }) {
   return (
     <div className={css["bga-kb-cfg-field"]}>
       <div className={css["bga-kb-cfg-head"]}>
         <label className={css["bga-kb-cfg-label"]} htmlFor={props.id}>{props.label}</label>
         {props.overridden
           ? (
             <span className={css["bga-kb-cfg-badges"]}>
               <span className={css["bga-kb-cfg-badge"]}>{props.overriddenLabel}</span>
               <button
                 type="button"
                 className={css["bga-kb-cfg-reset"]}
                 disabled={props.disabled}
                 onClick={props.onReset}
               >
                 {props.resetLabel}
               </button>
             </span>
           )
           : null}
       </div>
       <select
         id={props.id}
         className={css["bga-kb-cfg-select"]}
         value={props.text}
         disabled={props.disabled}
         onChange={(event) => { props.onEdit(event.target.value) }}
       >
         <option value="">{props.inheritLabel}</option>
         {props.choices.map(choice => (
           <option key={choice.value} value={choice.value}>{choice.label}</option>
         ))}
       </select>
       <p className={props.invalid ? css["bga-kb-cfg-invalid"] : css["bga-kb-cfg-hint"]}>
         {props.invalid ? props.invalidLabel : props.hint}
       </p>
     </div>
   )
 }