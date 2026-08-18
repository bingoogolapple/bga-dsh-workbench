/**
 * 跨平台「在外部应用中打开目录」宿主能力。
 *
 * 为工作区条目菜单的「在 Finder 中打开 / 在终端中打开 / 在 VSCode 中打开」
 * 三个按钮提供后端执行：构造当前平台的打开命令（纯函数，便于测试），
 * 再用 spawn 异步启动，进程与插件生命周期解耦（detached + unref）。
 * 命令不存在（如未安装 VSCode CLI）时依次回退候选或返回可读错误。
 *
 * 用户可在设置页通过「偏好 ID」指定默认终端 / 编辑器（见 TERMINAL_PREFERENCES
 * 与 EDITOR_PREFERENCES）。偏好命中时只使用该候选；偏好缺失、非法或当前
 * 平台不支持时回退到平台默认候选链。
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

/** 三种打开方式：文件管理器（Finder） / 终端 / VSCode。 */
export type OpenKind = 'finder' | 'terminal' | 'vscode'

/**
 * 「附加打开方式」kind 集合：设置页可开关、追加在工作区菜单尾部的常用 IDE。
 * 与 OpenKind 隔离，避免干扰 finder/terminal/vscode 的偏好链。
 */
export type ExtraOpenKind =
  | 'android-studio'
  | 'xcode'
  | 'wechat-devtools'
  | 'intellij-idea'
  | 'deveco-studio'
  | 'webstorm'
  | 'pycharm'
  | 'goland'

/** 完整的附加 IDE kind 集合（路由与开关配置校验用）。 */
export const EXTRA_OPEN_KINDS: readonly ExtraOpenKind[] = [
  'android-studio',
  'xcode',
  'wechat-devtools',
  'intellij-idea',
  'deveco-studio',
  'webstorm',
  'pycharm',
  'goland',
]

/** 判断一个未知值是否为合法的附加 IDE kind。 */
export function isExtraOpenKind(value: unknown): value is ExtraOpenKind {
  return EXTRA_OPEN_KINDS.includes(value as ExtraOpenKind)
}

/** 附加 IDE 的可读应用名（菜单按钮文案与设置页开关标签共用）。 */
export function extraOpenLabel(kind: ExtraOpenKind): string {
  switch (kind) {
    case 'android-studio': return 'Android Studio'
    case 'xcode': return 'Xcode'
    case 'wechat-devtools': return '微信开发者工具'
    case 'intellij-idea': return 'IntelliJ IDEA'
    case 'deveco-studio': return 'DevEco Studio'
    case 'webstorm': return 'WebStorm'
    case 'pycharm': return 'PyCharm'
    case 'goland': return 'GoLand'
  }
}

/**
 * 附加 IDE 的打开命令候选链（按平台返回多条候选，openExtraPathIn 依次尝试）。
 *
 * 命令遵循各 IDE 真实的 CLI 用法：
 *   - 微信开发者工具：内置 cli 可执行，用法 `cli open --project <path>`
 *     （需在「设置 → 安全 → 服务端口」开启端口后方可被 CLI 唤起）。
 *   - DevEco Studio：基于 JetBrains 的启动器，直接以项目路径为参数打开
 *     （macOS `<app>/Contents/MacOS/devecostudio <path>`，
 *     Windows `<安装目录>/bin/devecostudio64.exe <path>`）。
 * 每个候选的命令若是绝对路径则指向真实安装位置；openExtraPathIn 会在
 * 执行前用 existsSync 过滤掉磁盘上不存在的绝对路径候选，避免浪费一次 spawn。
 * 平台不提供该 IDE 时返回空数组（如 Xcode/微信开发者工具在非对应平台）。
 */
export function extraOpenCommand(platform: string, kind: ExtraOpenKind, path: string): OpenCommand[] {
  switch (kind) {
    case 'android-studio': {
      // Android Studio 官方 CLI：macOS 用 open -a，Win/Linux 用各自可执行。
      if (platform === 'darwin') return [{ command: 'open', args: ['-a', 'Android Studio', path] }]
      if (platform === 'win32') return [{ command: 'studio64.exe', args: [path] }]
      if (platform === 'linux') return [{ command: 'studio.sh', args: [path] }]
      return []
    }
    case 'xcode':
      // Xcode 仅 macOS 提供。
      if (platform === 'darwin') return [{ command: 'open', args: ['-a', 'Xcode', path] }]
      return []
    case 'wechat-devtools': {
      // 微信开发者工具内置 CLI：`cli open --project <path>`。
      // 官方要求 <path> 必须是小程序项目根目录（含 project.config.json），
      // 且需先在「设置 → 安全设置 → 开启服务端口」后 CLI 才能唤起工具。
      // 不同版本安装目录/应用名不同，给出候选链并按存在性过滤。
      const projectArgs: string[] = ['open', '--project', path]
      if (platform === 'darwin') {
        return [
          { command: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli', args: projectArgs },
          { command: '/Applications/微信开发者工具.app/Contents/MacOS/cli', args: projectArgs },
          // 兼容旧版 CLI：-o <path>（仅兜底）
          { command: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli', args: ['-o', path] },
        ]
      }
      if (platform === 'win32') {
        return [
          { command: 'C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat', args: projectArgs },
          { command: `${process.env.LOCALAPPDATA ?? 'C:\\Users\\%USERNAME%'}\\微信开发者工具\\cli.bat`, args: projectArgs },
          { command: 'cli', args: projectArgs },
        ]
      }
      // 微信开发者工具官方不支持 Linux。
      return []
    }
    case 'intellij-idea':
      // IntelliJ IDEA（JetBrains 系）：macOS 用 open -a，其余平台用命令行启动器 `idea`。
      // 与 WebStorm/PyCharm/GoLand 一致。
      if (platform === 'darwin') return [{ command: 'open', args: ['-a', 'IntelliJ IDEA', path] }]
      return [{ command: 'idea', args: [path] }]
    case 'webstorm':
      // WebStorm（JetBrains 系）：macOS 用 open -a，其余平台用命令行启动器 `webstorm`。
      if (platform === 'darwin') return [{ command: 'open', args: ['-a', 'WebStorm', path] }]
      return [{ command: 'webstorm', args: [path] }]
    case 'pycharm':
      // PyCharm（JetBrains 系）：macOS 用 open -a，其余平台用命令行启动器 `pycharm`。
      if (platform === 'darwin') return [{ command: 'open', args: ['-a', 'PyCharm', path] }]
      return [{ command: 'pycharm', args: [path] }]
    case 'goland':
      // GoLand（JetBrains 系）：macOS 用 open -a，其余平台用命令行启动器 `goland`。
      // 与 WebStorm/PyCharm 一致。
      if (platform === 'darwin') return [{ command: 'open', args: ['-a', 'GoLand', path] }]
      return [{ command: 'goland', args: [path] }]
    case 'deveco-studio':
      // DevEco Studio（华为，JetBrains 系）：macOS 用 open -a，其余平台用命令行启动器 `devecostudio`。
      // 与 WebStorm/PyCharm/GoLand 一致。
      if (platform === 'darwin') return [{ command: 'open', args: ['-a', 'DevEco Studio', path] }]
      return [{ command: 'devecostudio', args: [path] }]
  }
}

/**
 * 过滤候选链：跳过命令为「磁盘绝对路径」但文件不存在的候选（避免无谓 spawn）。
 * PATH 命令（open/code/idea 等）不在此列，保留按原样尝试。
 */
export function filterExistingCandidates(candidates: readonly OpenCommand[]): OpenCommand[] {
  return candidates.filter((candidate) => {
    // 绝对路径（含 / 或盘符 \）才做存在性检查；纯命令名交给 PATH。
    const isAbsolutePath = /^[\/\\]/.test(candidate.command) || /^[A-Za-z]:\\/.test(candidate.command)
    if (!isAbsolutePath) return true
    return existsSync(candidate.command)
  })
}

/** 判断一个未知值是否为合法的 OpenKind。 */
export function isOpenKind(value: unknown): value is OpenKind {
  return value === 'finder' || value === 'terminal' || value === 'vscode'
}

/** 一条待执行的命令：可执行文件 + 参数数组（不经 shell，规避注入）。 */
export interface OpenCommand {
  readonly command: string
  readonly args: readonly string[]
}

/** 打开操作的结果。 */
export interface OpenResult {
  readonly ok: boolean
  readonly error?: string
}

/** 终端偏好集合：设置页下拉的取值。 */
export type TerminalPreference =
  | 'terminal-default'
  | 'terminal-iterm'
  | 'terminal-wterm'
  | 'terminal-gnome'
  | 'terminal-konsole'
  | 'terminal-xfce'

/** 编辑器偏好集合：设置页下拉的取值。 */
export type EditorPreference =
  | 'editor-default'
  | 'editor-insiders'
  | 'editor-cursor'
  | 'editor-codebuddy'
  | 'editor-codebuddycn'
  | 'editor-catpaw'
  | 'editor-catpawai'
  | 'editor-trae'
  | 'editor-traecn'
  | 'editor-qoder'
  | 'editor-qodercn'

/** 用户对「打开方式」的偏好（来自设置页，缺省字段视为默认）。 */
export interface OpenPreference {
  readonly terminal?: string
  readonly editor?: string
}

/** 判断未知字符串是否为合法的终端偏好 ID（白名单校验）。 */
export function isTerminalPreference(value: unknown): value is TerminalPreference {
  return value === 'terminal-default' || value === 'terminal-iterm' || value === 'terminal-wterm'
    || value === 'terminal-gnome' || value === 'terminal-konsole' || value === 'terminal-xfce'
}

/** 判断未知字符串是否为合法的编辑器偏好 ID（白名单校验）。 */
export function isEditorPreference(value: unknown): value is EditorPreference {
  return value === 'editor-default' || value === 'editor-insiders' || value === 'editor-cursor'
    || value === 'editor-codebuddy' || value === 'editor-codebuddycn'
    || value === 'editor-catpaw' || value === 'editor-catpawai'
    || value === 'editor-trae' || value === 'editor-traecn'
    || value === 'editor-qoder' || value === 'editor-qodercn'
}

/** bash 单引号包裹路径：单引号内转义为 '"'"'，保证特殊字符按字面传递。 */
function shSingleQuote(value: string): string {
  return `'${value.replace(/'/gu, `'\\''`)}'`
}

/** macOS 打开候选。 */
function darwinCandidates(kind: OpenKind, path: string): OpenCommand[] {
  switch (kind) {
    case 'finder':
      return [{ command: 'open', args: [path] }]
    case 'terminal':
      // 优先 Terminal.app，其次 iTerm（未安装时前者已足够）。
      return [
        { command: 'open', args: ['-a', 'Terminal', path] },
        { command: 'open', args: ['-a', 'iTerm', path] },
      ]
    case 'vscode':
      return [
        { command: 'code', args: [path] },
        { command: 'code-insiders', args: [path] },
      ]
  }
}

/** Windows 打开候选。 */
function win32Candidates(kind: OpenKind, path: string): OpenCommand[] {
  switch (kind) {
    case 'finder':
      return [{ command: 'explorer', args: [path] }]
    case 'terminal':
      // 优先 Windows Terminal（Win11 自带）；回退 PowerShell（Win10+ 必有）。
      return [
        { command: 'wt', args: ['-d', path] },
        { command: 'powershell.exe', args: ['-NoExit', '-Command', `Set-Location -LiteralPath '${path.replace(/'/gu, "''")}'`] },
      ]
    case 'vscode':
      return [
        { command: 'code', args: [path] },
        { command: 'code-insiders', args: [path] },
      ]
  }
}

/** Linux 打开候选。 */
function linuxCandidates(kind: OpenKind, path: string): OpenCommand[] {
  switch (kind) {
    case 'finder':
      return [{ command: 'xdg-open', args: [path] }]
    case 'terminal':
      // x-terminal-emulator 是 Debian 系通用入口；随后按常见桌面终端回退。
      return [
        { command: 'x-terminal-emulator', args: ['-e', 'sh', '-c', `cd ${shSingleQuote(path)} && exec sh`] },
        { command: 'gnome-terminal', args: [`--working-directory=${path}`] },
        { command: 'konsole', args: ['--workdir', path] },
        { command: 'xfce4-terminal', args: ['--working-directory', path] },
      ]
    case 'vscode':
      return [
        { command: 'code', args: [path] },
        { command: 'code-insiders', args: [path] },
      ]
  }
}

/** 平台默认候选（未配置偏好或偏好不可用时回退到这里）。 */
function defaultCandidates(platform: string, kind: OpenKind, path: string): OpenCommand[] {
  switch (platform) {
    case 'darwin': return darwinCandidates(kind, path)
    case 'win32': return win32Candidates(kind, path)
    case 'linux': return linuxCandidates(kind, path)
    default: return []
  }
}

/** 解析终端偏好：命中返回该平台下对应的唯一候选；不支持或非法返回 undefined。 */
function resolveTerminalPreference(platform: string, id: string, path: string): OpenCommand[] | undefined {
  switch (id) {
    // default：交给默认候选链
    case 'terminal-default':
      return undefined
    case 'terminal-iterm':
      // iTerm 仅 macOS 提供 .app；其它平台回退默认。
      if (platform === 'darwin') return [{ command: 'open', args: ['-a', 'iTerm', path] }]
      return undefined
    case 'terminal-wterm':
      // Windows Terminal 仅 Windows 可用。
      if (platform === 'win32') return [{ command: 'wt', args: ['-d', path] }]
      return undefined
    case 'terminal-gnome':
      if (platform === 'linux') return [{ command: 'gnome-terminal', args: [`--working-directory=${path}`] }]
      return undefined
    case 'terminal-konsole':
      if (platform === 'linux') return [{ command: 'konsole', args: ['--workdir', path] }]
      return undefined
    case 'terminal-xfce':
      if (platform === 'linux') return [{ command: 'xfce4-terminal', args: ['--working-directory', path] }]
      return undefined
    default:
      return undefined
  }
}

/** 解析编辑器偏好：命中返回对应候选；不支持或非法返回 undefined。 */
function resolveEditorPreference(_platform: string, id: string, path: string): OpenCommand[] | undefined {
  switch (id) {
    case 'editor-default':
      return undefined
    case 'editor-insiders':
      // code-insiders 三平台通用（VS Code Insiders 的 CLI）。
      return [{ command: 'code-insiders', args: [path] }]
    case 'editor-cursor':
      return [{ command: 'cursor', args: [path] }]
    case 'editor-codebuddy':
      // CodeBuddy（国际版）CLI：buddy <path>。
      return [{ command: 'buddy', args: [path] }]
    case 'editor-codebuddycn':
      // CodeBuddyCN（中国版）CLI：buddycn <path>。
      return [{ command: 'buddycn', args: [path] }]
    case 'editor-catpaw':
      // CatPaw CLI：catpaw <path>。
      return [{ command: 'catpaw', args: [path] }]
    case 'editor-catpawai':
      // CatPawAI CLI：catpawai <path>。
      return [{ command: 'catpawai', args: [path] }]
    case 'editor-trae':
      // Trae CLI：trae <path>。
      return [{ command: 'trae', args: [path] }]
    case 'editor-traecn':
      // TraeCN CLI：trae-cn <path>。
      return [{ command: 'trae-cn', args: [path] }]
    case 'editor-qoder':
      // Qoder CLI：qoder <path>。
      return [{ command: 'qoder', args: [path] }]
    case 'editor-qodercn':
      // QoderCN CLI：qoder-cn <path>。
      return [{ command: 'qoder-cn', args: [path] }]
    default:
      return undefined
  }
}

/**
 * 为指定平台与打开方式生成命令候选列表（纯函数，测试友好）。
 * 传入偏好时：偏好命中 → 只返回该候选；偏好缺失/非法/平台不支持 → 返回默认链。
 * 不支持的平台返回空数组。
 */
export function openCommandCandidates(
  platform: string,
  kind: OpenKind,
  path: string,
  preference?: OpenPreference,
): OpenCommand[] {
  if (preference !== undefined) {
    if (kind === 'terminal') {
      const id = preference.terminal
      if (id !== undefined && isTerminalPreference(id)) {
        const resolved = resolveTerminalPreference(platform, id, path)
        if (resolved !== undefined) return resolved
      }
    } else if (kind === 'vscode') {
      const id = preference.editor
      if (id !== undefined && isEditorPreference(id)) {
        const resolved = resolveEditorPreference(platform, id, path)
        if (resolved !== undefined) return resolved
      }
    }
    // finder 与偏好无关；偏好不可用则落入默认候选。
  }
  return defaultCandidates(platform, kind, path)
}

/** spawn 的窄接口，测试可注入替身。 */
export type SpawnFn = (
  command: string,
  args: readonly string[],
  options: { detached: boolean; stdio: 'ignore' },
) => {
  on(event: 'error', listener: (error: NodeJS.ErrnoException) => void): unknown
  on(event: 'spawn', listener: () => void): unknown
  unref(): void
}

/** 真正的 spawn 工厂（生产实现）。 */
export const defaultSpawn: SpawnFn = (command, args, options) =>
  spawn(command, [...args], options) as ReturnType<SpawnFn>

/**
 * 依次尝试命令候选：第一个能成功启动（触发 spawn 事件）即视为打开成功；
 * ENOENT 等启动错误（如命令未安装）则尝试下一个；全部失败返回最后的错误。
 * 偏好候选失败时错误信息会携带偏好 ID，便于设置页诊断。
 */
export async function openPathIn(
  kind: OpenKind,
  path: string,
  options: { platform?: string; spawnFn?: SpawnFn; preference?: OpenPreference } = {},
): Promise<OpenResult> {
  const platform = options.platform ?? process.platform
  const spawnFn = options.spawnFn ?? defaultSpawn
  // 当前偏好 ID（仅 terminal / vscode 有偏好；finder 总是 undefined）。
  const prefId = kind === 'terminal' ? options.preference?.terminal
    : kind === 'vscode' ? options.preference?.editor : undefined
  const candidates = openCommandCandidates(platform, kind, path, options.preference)
  // 偏好是否真正生效：偏好 ID 合法且平台支持时，候选列表只含该偏好候选（长度 1）。
  const prefValid = prefId !== undefined
    && (kind === 'terminal' ? isTerminalPreference(prefId) : isEditorPreference(prefId))
  const usedPreference = prefValid && candidates.length === 1 && prefId !== 'terminal-default' && prefId !== 'editor-default'
  if (candidates.length === 0) {
    return { ok: false, error: `unsupported platform "${platform}"` }
  }
  let lastError = 'no candidate command found'
  for (const candidate of candidates) {
    try {
      const opened = await new Promise<OpenResult>((resolve) => {
        const child = spawnFn(candidate.command, candidate.args, { detached: true, stdio: 'ignore' })
        child.on('error', (error) => {
          resolve({ ok: false, error: error.message })
        })
        child.on('spawn', () => {
          child.unref()
          resolve({ ok: true })
        })
      })
      if (opened.ok) return opened
      lastError = opened.error ?? lastError
    } catch (error) {
      // spawn 同步抛错（罕见）：记录并继续尝试下一个候选。
      lastError = error instanceof Error ? error.message : String(error)
    }
  }
  if (usedPreference) {
    // 偏好候选（只有 1 条）启动失败：标注偏好 ID，便于设置页诊断。
    return { ok: false, error: `preferred "${prefId}" not available: ${lastError}` }
  }
  return { ok: false, error: lastError }
}
/**
 * 用附加 IDE 打开目录：取该 kind 的候选命令链，依次尝试直到一个成功启动。
 * 绝对路径候选会先用 existsSync 过滤（未安装则跳过），全部失败返回可读错误。
 * 平台不提供该 IDE（候选为空）时直接返回错误。
 */
export async function openExtraPathIn(
  kind: ExtraOpenKind,
  path: string,
  options: { platform?: string; spawnFn?: SpawnFn } = {},
): Promise<OpenResult> {
  const platform = options.platform ?? process.platform
  const spawnFn = options.spawnFn ?? defaultSpawn
  // 微信开发者工具前置校验：官方要求 <path> 必须是含 project.config.json 的小程序
  // 项目根目录，否则 cli open --project 会静默失败。提前给出明确错误，避免无谓 spawn。
  if (kind === 'wechat-devtools') {
    const configJson = join(path, 'project.config.json')
    if (!existsSync(configJson)) {
      return {
        ok: false,
        error: `微信开发者工具只能用小程序项目根目录打开：${path} 下未找到 project.config.json（请选择含 project.config.json 的小程序项目目录）`,
      }
    }
  }
  const candidates = filterExistingCandidates(extraOpenCommand(platform, kind, path))
  if (candidates.length === 0) {
    return { ok: false, error: `"${extraOpenLabel(kind)}" is not available on platform "${platform}"` }
  }
  let lastError = 'no candidate command found'
  for (const candidate of candidates) {
    try {
      const opened = await new Promise<OpenResult>((resolve) => {
        const child = spawnFn(candidate.command, candidate.args, { detached: true, stdio: 'ignore' })
        child.on('error', (error) => {
          resolve({ ok: false, error: error.message })
        })
        child.on('spawn', () => {
          child.unref()
          resolve({ ok: true })
        })
      })
      if (opened.ok) return opened
      lastError = opened.error ?? lastError
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }
  }
  if (kind === 'wechat-devtools') {
    // 命令可能已成功启动但工具未实际打开：官方要求先在「设置 → 安全设置 →
    // 开启服务端口」。这种静默失败无法靠退出码判断，给出针对性提示。
    return {
      ok: false,
      error: `未能唤起微信开发者工具：${lastError}（若命令已执行但工具未打开，请先在微信开发者工具「设置 → 安全设置 → 开启服务端口」）`,
    }
  }
  return { ok: false, error: `"${extraOpenLabel(kind)}" failed: ${lastError}` }
}
