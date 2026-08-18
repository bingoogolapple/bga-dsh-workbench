// ============================================================================
// 文件：open-prefs.ts —— 「打开方式」偏好共享定义（客户端）
//
// 职责：
//   统一维护「打开方式」的一组共享数据，供设置页下拉与工作区菜单注入共用，
//   避免两处各维护一份偏好表导致漂移：
//     - TERMINAL_OPTIONS / EDITOR_OPTIONS：设置页下拉的可用项（含平台限定）；
//     - currentPlatform / terminalOptionsFor：平台判定与终端选项过滤；
//     - terminalLabel / editorLabel：偏好 ID → 菜单按钮文案中的应用名；
//     - prefLabels：把当前生效偏好转成菜单按钮的三行文案。
//   偏好 ID 白名单与宿主 src/open-app.ts 保持手工同步（规模小）。
// ============================================================================

// 终端偏好选项：{ id, label, platforms }。platforms 只出现在特定平台的项上；
// 缺省 platforms 的项（id 为空串 = 系统默认）恒在。
export interface TerminalPreferenceOption {
  readonly id: string
  readonly label: string
  readonly platforms?: readonly string[]
}

// 编辑器偏好选项（三平台通用）。
export interface EditorPreferenceOption {
  readonly id: string
  readonly label: string
}

/** 终端偏好选项表（设置页下拉与菜单文案共用）。 */
export const TERMINAL_OPTIONS: readonly TerminalPreferenceOption[] = [
  { id: 'terminal-default', label: '系统默认' },
  { id: 'terminal-iterm', label: 'iTerm', platforms: ['darwin'] },
  { id: 'terminal-wterm', label: 'Windows Terminal', platforms: ['win32'] },
  { id: 'terminal-gnome', label: 'GNOME 终端', platforms: ['linux'] },
  { id: 'terminal-konsole', label: 'Konsole', platforms: ['linux'] },
  { id: 'terminal-xfce', label: 'XFCE 终端', platforms: ['linux'] },
]

/** 编辑器偏好选项表（设置页下拉与菜单文案共用）。 */
export const EDITOR_OPTIONS: readonly EditorPreferenceOption[] = [
  { id: 'editor-default', label: 'VS Code（code）' },
  { id: 'editor-insiders', label: 'VS Code Insiders（code-insiders）' },
  { id: 'editor-cursor', label: 'Cursor（cursor）' },
  { id: 'editor-codebuddy', label: 'CodeBuddy（buddy）' },
  { id: 'editor-codebuddycn', label: 'CodeBuddyCN（buddycn）' },
  { id: 'editor-catpaw', label: 'CatPaw（catpaw）' },
  { id: 'editor-catpawai', label: 'CatPawAI（catpawai）' },
  { id: 'editor-trae', label: 'Trae（trae）' },
  { id: 'editor-traecn', label: 'TraeCN（trae-cn）' },
  { id: 'editor-qoder', label: 'Qoder（qoder）' },
  { id: 'editor-qodercn', label: 'QoderCN（qoder-cn）' },
]

/** 空串/未配置的终端偏好归一化为显式默认 ID（保证下拉 value 与保存值一致）。 */
export function normalizeTerminalId(id: string | undefined): string {
  return typeof id === 'string' && id !== '' ? id : 'terminal-default'
}

/** 空串/未配置的编辑器偏好归一化为显式默认 ID（保证下拉 value 与保存值一致）。 */
export function normalizeEditorId(id: string | undefined): string {
  return typeof id === 'string' && id !== '' ? id : 'editor-default'
}

/** 当前平台判定（浏览器 userAgent，仅用于过滤可用选项展示）。 */
export function currentPlatform(): string {
  const ua = navigator.userAgent
  if (/Macintosh|Mac OS X/iu.test(ua)) return 'darwin'
  if (/Windows/iu.test(ua)) return 'win32'
  return 'linux'
}

/** 按平台过滤终端选项：默认项恒在；平台不匹配的项剔除。 */
export function terminalOptionsFor(platform: string): readonly TerminalPreferenceOption[] {
  return TERMINAL_OPTIONS.filter(option => {
    if (option.id === 'terminal-default') return true
    return (option.platforms ?? []).includes(platform)
  })
}

/** 偏好 ID → 菜单文案中的终端应用名；空串/未知 ID 回退「默认终端」。 */
export function terminalLabel(id: string): string {
  switch (id) {
    case 'terminal-iterm': return 'iTerm'
    case 'terminal-wterm': return 'Windows Terminal'
    case 'terminal-gnome': return 'GNOME 终端'
    case 'terminal-konsole': return 'Konsole'
    case 'terminal-xfce': return 'XFCE 终端'
    default: return '默认终端'
  }
}

/** 偏好 ID → 菜单文案中的编辑器应用名；空串/未知 ID 回退「VSCode」。 */
export function editorLabel(id: string): string {
  switch (id) {
    case 'editor-insiders': return 'VS Code Insiders'
    case 'editor-cursor': return 'Cursor'
    case 'editor-codebuddy': return 'CodeBuddy'
    case 'editor-codebuddycn': return 'CodeBuddyCN'
    case 'editor-catpaw': return 'CatPaw'
    case 'editor-catpawai': return 'CatPawAI'
    case 'editor-trae': return 'Trae'
    case 'editor-traecn': return 'TraeCN'
    case 'editor-qoder': return 'Qoder'
    case 'editor-qodercn': return 'QoderCN'
    default: return 'VSCode'
  }
}

/**
 * 菜单中的应用名包裹规则：名词性应用名用空格包裹（「在 iTerm 中打开」、
 * 「在 Cursor 中打开」、默认「在 VSCode 中打开」）；「终端」为动词性称谓
 * 直接贴合（「在终端中打开」，与产品原文一致）。附加 IDE 中的微信开发者工具
 * 亦按工具名直接贴合（「在微信开发者工具中打开」），见 extraOpenMenuItems。
 */
function wrapAppName(name: string): string {
  return name === '默认终端' ? name : ` ${name} `
}

/** 菜单中三个打开按钮的行文案（finder 固定；terminal/vscode 均显示应用名）。 */
export function openMenuLabels(prefs: { terminal?: string; editor?: string }): readonly {
  kind: 'finder' | 'terminal' | 'vscode'
  label: string
}[] {
  return [
    { kind: 'finder', label: '在 Finder 中打开' },
    // 终端：应用名（如「在 iTerm 中打开」）；系统默认 → 「终端」
    { kind: 'terminal', label: `在${wrapAppName(terminalLabel(prefs.terminal ?? ''))}中打开` },
    // 编辑器：应用名（「在 Cursor 中打开」等）
    { kind: 'vscode', label: `在${wrapAppName(editorLabel(prefs.editor ?? ''))}中打开` },
  ]
}

/**
 * 「附加 IDE」打开的 kind 集合（与宿主 open-app.ts 的 EXTRA_OPEN_KINDS 保持一致）。
 * 每个 kind 对应设置页的一个展示开关与菜单尾部的一个打开按钮。
 */
export const EXTRA_OPEN_KINDS: readonly string[] = [
  'xcode',
  'android-studio',
  'deveco-studio',
  'wechat-devtools',
  'webstorm',
  'intellij-idea',
  'pycharm',
  'goland',
]

/** 附加 IDE 的可读应用名（菜单按钮文案与设置页开关标签共用）。 */
export function extraOpenLabel(kind: string): string {
  switch (kind) {
    case 'android-studio': return 'Android Studio'
    case 'xcode': return 'Xcode'
    case 'wechat-devtools': return '微信开发者工具'
    case 'intellij-idea': return 'IntelliJ IDEA'
    case 'deveco-studio': return 'DevEco Studio'
    case 'webstorm': return 'WebStorm'
    case 'pycharm': return 'PyCharm'
    case 'goland': return 'GoLand'
    default: return kind
  }
}

/**
 * 附加 IDE 的展示开关 key（设置项字段名 ↔ kind 的映射）。
 * 开关存于设置 openExtra 对象（routing 校验白名单）。
 */
export function extraSettingKey(kind: string): string {
  switch (kind) {
    case 'android-studio': return 'androidStudio'
    case 'xcode': return 'xcode'
    case 'wechat-devtools': return 'wechatDevtools'
    case 'intellij-idea': return 'intellijIdea'
    case 'deveco-studio': return 'devecoStudio'
    case 'webstorm': return 'webstorm'
    case 'pycharm': return 'pycharm'
    case 'goland': return 'goland'
    default: return kind
  }
}

/**
 * 生成菜单尾部「附加 IDE 打开」分组的文案。
 * 仅返回已开启（开关 true）且当前平台可用的 IDE；find 对应的按钮由 workspace-open 注入。
 */
export function extraOpenMenuItems(
  openExtra: Record<string, boolean | undefined>,
): readonly { kind: string; label: string }[] {
  const items: { kind: string; label: string }[] = []
  for (const kind of EXTRA_OPEN_KINDS) {
    const key = extraSettingKey(kind)
    const on = openExtra[key as keyof typeof openExtra] ?? true // 缺省视为开启（默认全开）
    if (!on) continue
    // 微信开发者工具按「终端」式动词性/工具名直接贴合，不加空格包裹（在微信开发者工具中打开）
    const spaced = kind === 'wechat-devtools'
    items.push({ kind, label: spaced ? `在${extraOpenLabel(kind)}中打开` : `在 ${extraOpenLabel(kind)} 中打开` })
  }
  return items
}
