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
import { type ReactNode } from 'react';
import type { CardShell } from './settings-form.ts';
/**
* 通用设置卡片自身硬编码需要翻译的文案 key 清单。
*
* 这些文案不属于插件自己的命名空间 locale（标题/描述等由调用方通过
* titleKey/descriptionKey 提供），而是卡片外壳固定使用的通用文案
* （展开 / 收起 / 未暴露提示 / 未保存 / 只读 / 保存失败 / 保存 / 放弃等），
* 由 t() 统一从字典取出。
*/
export declare const CARD_COPY_KEYS: readonly ["settings.collapse", "settings.expand", "settings.notExposed", "settings.unsaved", "settings.readOnly", "settings.saveFailed", "settings.discard", "settings.save", "settings.saving"];
/**
* 通用卡片文案 key 的联合类型：由 CARD_COPY_KEYS 数组推导。
*/
export type CardCopyKey = (typeof CARD_COPY_KEYS)[number];
/**
* 设置卡片可接受的文案 key 类型：插件自定义 key（TKey）或通用卡片 key。
*/
export type SettingsCardKey<TKey extends string = string> = TKey | CardCopyKey;
/**
* 设置卡片外壳组件的 props。
*
* @param TKey 插件自定义文案 key 的类型参数，用于约束 titleKey/descriptionKey。
*/
export interface PluginSettingsCardProps<TKey extends string = string> {
    t: (key: SettingsCardKey<TKey>, params?: Record<string, string | number>) => string;
    titleKey: TKey;
    descriptionKey: TKey;
    state: CardShell;
    onSave: () => void;
    onDiscard: () => void;
    children: ReactNode;
}
/**
* 通用设置卡片外壳。
*
* 默认收起只显示标题与描述（可点击展开）；展开后渲染 children，
* 并按状态显示未保存标记、只读提示、保存失败原因与保存 / 放弃按钮。
* 当 state.exposed=false 时只渲染「命名空间未暴露」的提示形态。
*/
export declare function PluginSettingsCard<TKey extends string = string>(props: PluginSettingsCardProps<TKey>): import("react").JSX.Element | null;
/**
* 字段控件的公共 props（ValueField / BooleanField / ChoiceField 共用）。
*/
export interface FieldProps {
    id: string;
    label: string;
    hint: string;
    text: string;
    overridden: boolean;
    invalid: boolean;
    overriddenLabel: string;
    resetLabel: string;
    invalidLabel: string;
    disabled: boolean;
    onEdit: (text: string) => void;
    onReset: () => void;
}
/**
* 文本输入型字段控件。
*
* 额外支持 numeric（数字键盘提示）与 placeholder；非法时切换错误样式。
*/
export declare function ValueField(props: FieldProps & {
    numeric?: boolean;
    placeholder?: string;
}): import("react").JSX.Element;
/**
* 布尔字段控件：三态下拉（空 = 继承，true = 开，false = 关）。
*
* 值为文本 `''` / `'true'` / `'false'`，与 BooleanField 的 parse 语义对应。
*/
export declare function BooleanField(props: FieldProps & {
    inheritLabel: string;
    onLabel: string;
    offLabel: string;
}): import("react").JSX.Element;
/**
* 选项字段控件：下拉选择，空值 = 继承，其余从 choices 里选。
*/
export declare function ChoiceField(props: FieldProps & {
    inheritLabel: string;
    choices: ReadonlyArray<{
        value: string;
        label: string;
    }>;
}): import("react").JSX.Element;
