// ============================================================
// open-app.spec.ts —— 跨平台「打开目录」命令构造与执行测试
// ============================================================
// 测试对象：src/open-app.ts
//   - openCommandCandidates：按平台/打开方式生成命令候选（纯函数）；
//   - openPathIn：候选依次尝试、ENOENT 回退、全部失败返回可读错误。
// 覆盖范围：
//   - 三平台（darwin / win32 / linux）× 三方式（finder / terminal / vscode）
//     的命令候选正确性；
//   - 不支持平台返回空候选；
//   - spawn 成功（spawn 事件）即视为打开成功并 unref；
//   - 命令缺失（error 事件）时回退到下一候选；
//   - 全部候选失败时返回最后的错误信息。
// 测试环境：vitest（node）。
import { describe, expect, it } from 'vitest'
import {
  filterExistingCandidates,
  isOpenKind,
  isTerminalPreference,
  openCommandCandidates,
  openPathIn,
  type OpenCommand,
  type OpenPreference,
  type OpenResult,
  type SpawnFn,
} from '../src/open-app.ts'

/** 断言某条候选命令的命令名与参数。 */
function expectCommand(candidate: OpenCommand, command: string, args: readonly string[]): void {
  expect(candidate.command).toBe(command)
  expect(candidate.args).toEqual([...args])
}

describe('isOpenKind', () => {
  it('接受三种合法打开方式', () => {
    expect(isOpenKind('finder')).toBe(true)
    expect(isOpenKind('terminal')).toBe(true)
    expect(isOpenKind('vscode')).toBe(true)
  })

  it('拒绝非法值', () => {
    expect(isOpenKind('editor')).toBe(false)
    expect(isOpenKind('')).toBe(false)
    expect(isOpenKind(undefined)).toBe(false)
    expect(isOpenKind(null)).toBe(false)
  })
})

describe('openCommandCandidates', () => {
  const path = '/Users/tester/project'

  it('darwin: finder 用 open，terminal 用 open -a Terminal，vscode 用 code', () => {
    const finder = openCommandCandidates('darwin', 'finder', path)
    expectCommand(finder[0], 'open', [path])

    const terminal = openCommandCandidates('darwin', 'terminal', path)
    expectCommand(terminal[0], 'open', ['-a', 'Terminal', path])
    expectCommand(terminal[1], 'open', ['-a', 'iTerm', path])

    const vscode = openCommandCandidates('darwin', 'vscode', path)
    expectCommand(vscode[0], 'code', [path])
    expectCommand(vscode[1], 'code-insiders', [path])
  })

  it('win32: finder 用 explorer，terminal 优先 wt 回退 powershell，vscode 用 code', () => {
    const finder = openCommandCandidates('win32', 'finder', path)
    expectCommand(finder[0], 'explorer', [path])

    const terminal = openCommandCandidates('win32', 'terminal', path)
    expectCommand(terminal[0], 'wt', ['-d', path])
    expect(terminal[1].command).toBe('powershell.exe')
    expect(terminal[1].args[0]).toBe('-NoExit')
    expect(terminal[1].args[2]).toContain(path)

    const vscode = openCommandCandidates('win32', 'vscode', path)
    expectCommand(vscode[0], 'code', [path])
  })

  it('linux: finder 用 xdg-open，terminal 有多个桌面终端候选，vscode 用 code', () => {
    const finder = openCommandCandidates('linux', 'finder', path)
    expectCommand(finder[0], 'xdg-open', [path])

    const terminal = openCommandCandidates('linux', 'terminal', path)
    expectCommand(terminal[0], 'x-terminal-emulator', ['-e', 'sh', '-c', `cd '${path}' && exec sh`])
    expect(terminal[1].command).toBe('gnome-terminal')
    expect(terminal[2].command).toBe('konsole')
    expect(terminal[3].command).toBe('xfce4-terminal')

    const vscode = openCommandCandidates('linux', 'vscode', path)
    expectCommand(vscode[0], 'code', [path])
  })

  it('不支持的平台返回空候选', () => {
    expect(openCommandCandidates('freebsd', 'finder', path)).toEqual([])
    expect(openCommandCandidates('aix', 'terminal', path)).toEqual([])
  })

  it('路径带单引号时 linux 终端命令正确转义', () => {
    const path = "/tmp/it's here"
    const terminal = openCommandCandidates('linux', 'terminal', path)
    // 参数结构：['-e', 'sh', '-c', <script>]
    expect(terminal[0].args[3]).toBe(`cd '/tmp/it'\\''s here' && exec sh`)
  })
})

describe('openPathIn', () => {
  const path = '/some/workspace'

  /** 运行替身 spawn：首命令成功 / 首命令失败其余成功 / 全部失败三种模式。 */
  function runWithStub(config: {
    mode: 'first-success' | 'first-error-others-success' | 'all-error'
  }): { result: Promise<OpenResult>; calls: Array<{ command: string; args: string[] }> } {
    const calls: Array<{ command: string; args: string[] }> = []
    const spawnFn: SpawnFn = (command, args, _options) => {
      calls.push({ command, args: [...args] })
      const listeners: Record<string, (value?: unknown) => void> = {}
      const fake = {
        on(event: string, listener: (value?: unknown) => void) {
          listeners[event] = listener
          return fake
        },
        unref() {},
      }
      // 模拟异步事件：成功或失败的触发由配置决定
      queueMicrotask(() => {
        if (config.mode === 'first-success' && calls.length === 1) {
          listeners.spawn?.()
        } else if (config.mode === 'first-error-others-success') {
          // 只有第一次调用触发 error（命令名相同的候选也只失败一次）
          if (calls.length === 1) listeners.error?.({ message: `spawn ${command} ENOENT` })
          else listeners.spawn?.()
        } else {
          listeners.error?.({ message: `spawn ${command} ENOENT` })
        }
      })
      return fake
    }
    const result = openPathIn('terminal', path, { platform: 'darwin', spawnFn })
    return { result, calls }
  }

  it('第一个候选成功即返回 ok', async () => {
    const { result } = runWithStub({ mode: 'first-success' })
    await expect(result).resolves.toEqual({ ok: true })
  })

  it('首个候选 ENOENT 时回退到下一候选并成功', async () => {
    const { result, calls } = runWithStub({ mode: 'first-error-others-success' })
    await expect(result).resolves.toEqual({ ok: true })
    expect(calls.length).toBeGreaterThanOrEqual(2)
  })

  it('全部候选失败时返回可读错误', async () => {
    const { result } = runWithStub({ mode: 'all-error' })
    const value = await result
    expect(value.ok).toBe(false)
    expect(value.error).toContain('ENOENT')
  })

  it('不支持平台直接返回错误且不调用 spawn', async () => {
    const spawnFn: SpawnFn = () => {
      throw new Error('should not be called')
    }
    const result = await openPathIn('finder', path, { platform: 'freebsd', spawnFn })
    expect(result).toEqual({ ok: false, error: 'unsupported platform "freebsd"' })
  })
})


describe('偏好白名单校验', () => {
  it('isTerminalPreference 接受全部终端偏好 ID', () => {
    expect(isTerminalPreference('terminal-default')).toBe(true)
    expect(isTerminalPreference('terminal-iterm')).toBe(true)
    expect(isTerminalPreference('terminal-wterm')).toBe(true)
    expect(isTerminalPreference('terminal-gnome')).toBe(true)
    expect(isTerminalPreference('terminal-konsole')).toBe(true)
    expect(isTerminalPreference('terminal-xfce')).toBe(true)
  })

  it('isTerminalPreference 拒绝未知 ID 与非字符串', () => {
    expect(isTerminalPreference('terminal-foo')).toBe(false)
    expect(isTerminalPreference('iterm')).toBe(false)
    expect(isTerminalPreference('')).toBe(false)
    expect(isTerminalPreference(undefined)).toBe(false)
  })
})

describe('openCommandCandidates 偏好解析', () => {
  const path = '/data/project'

  it('darwin 配 iTerm：terminal 只返回 open -a iTerm，vscode 不受影响', () => {
    const pref: OpenPreference = { terminal: 'terminal-iterm' }
    const terminal = openCommandCandidates('darwin', 'terminal', path, pref)
    expect(terminal.length).toBe(1)
    expectCommand(terminal[0], 'open', ['-a', 'iTerm', path])

    const vscode = openCommandCandidates('darwin', 'vscode', path, pref)
    expect(vscode.length).toBe(2) // 编辑器偏好未设置，仍走默认链
  })

  it('win32 配 Windows Terminal：terminal 只返回 wt -d', () => {
    const pref: OpenPreference = { terminal: 'terminal-wterm' }
    const terminal = openCommandCandidates('win32', 'terminal', path, pref)
    expect(terminal.length).toBe(1)
    expectCommand(terminal[0], 'wt', ['-d', path])
  })

  it('linux 配 GNOME / Konsole / XFCE 分别命中各自命令', () => {
    const gnome = openCommandCandidates('linux', 'terminal', path, { terminal: 'terminal-gnome' })
    expectCommand(gnome[0], 'gnome-terminal', [`--working-directory=${path}`])

    const konsole = openCommandCandidates('linux', 'terminal', path, { terminal: 'terminal-konsole' })
    expectCommand(konsole[0], 'konsole', ['--workdir', path])

    const xfce = openCommandCandidates('linux', 'terminal', path, { terminal: 'terminal-xfce' })
    expectCommand(xfce[0], 'xfce4-terminal', ['--working-directory', path])
  })

  it('偏好平台错配（linux 配 iTerm）回退默认链且不报错', () => {
    const pref: OpenPreference = { terminal: 'terminal-iterm' }
    const terminal = openCommandCandidates('linux', 'terminal', path, pref)
    expect(terminal.length).toBe(4) // 完整 Linux 默认链
    expect(terminal[0].command).toBe('x-terminal-emulator')
  })

  it('终端默认偏好（terminal-default）与不传偏好等价', () => {
    const withDefault = openCommandCandidates('darwin', 'terminal', path, { terminal: 'terminal-default' })
    const without = openCommandCandidates('darwin', 'terminal', path)
    expect(withDefault).toEqual(without)
  })

  it('非法偏好 ID 回退默认链', () => {
    const pref = { terminal: 'terminal-nope', editor: 'editor-nope' } as OpenPreference
    const terminal = openCommandCandidates('darwin', 'terminal', path, pref)
    expect(terminal.length).toBe(2)
    expect(terminal[0].command).toBe('open')

    const vscode = openCommandCandidates('darwin', 'vscode', path, pref)
    expect(vscode.length).toBe(2)
    expect(vscode[0].command).toBe('code')
  })

  it('finder 与偏好无关：传了偏好也返回默认候选人', () => {
    const pref: OpenPreference = { terminal: 'terminal-iterm', editor: 'editor-cursor' }
    const finder = openCommandCandidates('darwin', 'finder', path, pref)
    expectCommand(finder[0], 'open', [path])
  })
})

describe('openPathIn 偏好执行', () => {
  const path = '/some/workspace'

  /** 运行替身 spawn：全部失败 + 记录调用，用于验证偏好候选的行为。 */
  function stubAllError(calls: Array<{ command: string; args: string[] }>): SpawnFn {
    return (command, args) => {
      calls.push({ command, args: [...args] })
      const listeners: Record<string, (value?: unknown) => void> = {}
      const fake = {
        on(event: string, listener: (value?: unknown) => void) {
          listeners[event] = listener
          return fake
        },
        unref() {},
      }
      queueMicrotask(() => {
        listeners.error?.({ message: `spawn ${command} ENOENT` })
      })
      return fake
    }
  }

  it('偏好候选失败时错误信息携带偏好 ID', async () => {
    const calls: Array<{ command: string; args: string[] }> = []
    const result = await openPathIn('terminal', path, {
      platform: 'darwin',
      preference: { terminal: 'terminal-iterm' },
      spawnFn: stubAllError(calls),
    })
    expect(result.ok).toBe(false)
    expect(result.error).toContain('terminal-iterm')
    expect(calls.length).toBe(1) // 只尝试偏好候选，不回退默认链
  })

  it('默认偏好（terminal-default）失败时仍走完整默认回退链', async () => {
    const calls: Array<{ command: string; args: string[] }> = []
    const result = await openPathIn('terminal', path, {
      platform: 'darwin',
      preference: { terminal: 'terminal-default' },
      spawnFn: stubAllError(calls),
    })
    expect(result.ok).toBe(false)
    expect(result.error).not.toContain('terminal-default')
    // darwin 默认链有 2 个候选（Terminal / iTerm），都失败
    expect(calls.length).toBe(2)
  })
})


describe('filterExistingCandidates', () => {
  const path = '/Users/tester/project'

  it('保留 PATH 命令（非绝对路径），过滤掉不存在的绝对路径', () => {
    const candidates: OpenCommand[] = [
      { command: 'idea', args: [path] },
      { command: '/Applications/不存在的.app/Contents/MacOS/tool', args: [path] },
    ]
    const kept = filterExistingCandidates(candidates)
    expect(kept).toHaveLength(1)
    expect(kept[0].command).toBe('idea')
  })

  it('真实存在的绝对路径命令被保留（如 macOS 系统 open）', () => {
    const candidates: OpenCommand[] = [
      { command: '/bin/ls', args: [path] },
      { command: 'code', args: [path] },
    ]
    const kept = filterExistingCandidates(candidates)
    expect(kept.map(c => c.command)).toEqual(['/bin/ls', 'code'])
  })
})
