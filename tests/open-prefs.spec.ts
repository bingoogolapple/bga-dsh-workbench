// ============================================================
// open-prefs.spec.ts —— 「打开方式」偏好共享定义测试
// ============================================================
// 测试对象：src/client/open-prefs.ts
//   - terminalLabel：偏好 ID → 菜单文案中的终端名；
//   - openMenuLabels：把偏好转成菜单三行文案（默认名回退）；
//   - terminalOptionsFor：平台过滤不破坏默认项。
// 测试环境：vitest（node，纯函数无需 DOM）。
import { describe, expect, it } from 'vitest'
import {
  TERMINAL_OPTIONS,
  normalizeTerminalId,
  openMenuLabels,
  terminalLabel,
  terminalOptionsFor,
} from '../src/client/open-prefs.ts'

describe('terminalLabel', () => {
  it('偏好 ID 映射为终端应用名', () => {
    expect(terminalLabel('terminal-iterm')).toBe('iTerm')
    expect(terminalLabel('terminal-wterm')).toBe('Windows Terminal')
    expect(terminalLabel('terminal-gnome')).toBe('GNOME 终端')
    expect(terminalLabel('terminal-konsole')).toBe('Konsole')
    expect(terminalLabel('terminal-xfce')).toBe('XFCE 终端')
  })

  it('空串 / 未知 ID 回退「默认终端」', () => {
    expect(terminalLabel('')).toBe('默认终端')
    expect(terminalLabel('terminal-default')).toBe('默认终端')
    expect(terminalLabel('whatever')).toBe('默认终端')
    expect(terminalLabel(undefined as unknown as string)).toBe('默认终端')
  })
})


describe('openMenuLabels（终端应用名 / 编辑器应用名）', () => {
  it('未配置偏好时使用默认文案', () => {
    expect(openMenuLabels({})).toEqual([
      { kind: 'finder', label: '在 Finder 中打开' },
      { kind: 'terminal', label: '在默认终端中打开' },
      { kind: 'vscode', label: '在 VSCode 中打开' },
    ])
  })

  it('配置终端偏好后 terminal 文案显示命令名', () => {
    const labels = openMenuLabels({ terminal: 'terminal-iterm' })
    const terminal = labels.find(item => item.kind === 'terminal')
    expect(terminal?.label).toBe('在 iTerm 中打开')
    // finder / vscode 不受终端偏好影响
    expect(labels[0].label).toBe('在 Finder 中打开')
    expect(labels[2].label).toBe('在 VSCode 中打开')
  })

  it('各终端偏好都显示对应命令名', () => {
    expect(openMenuLabels({ terminal: 'terminal-wterm' })[1].label).toBe('在 Windows Terminal 中打开')
    expect(openMenuLabels({ terminal: 'terminal-gnome' })[1].label).toBe('在 GNOME 终端 中打开')
    expect(openMenuLabels({ terminal: 'terminal-konsole' })[1].label).toBe('在 Konsole 中打开')
    expect(openMenuLabels({ terminal: 'terminal-xfce' })[1].label).toBe('在 XFCE 终端 中打开')
  })

})

describe('terminalOptionsFor', () => {
  it('各平台过滤：默认项恒在，平台不匹配项剔除', () => {
    const darwin = terminalOptionsFor('darwin')
    expect(darwin.map(option => option.id)).toEqual(['terminal-default', 'terminal-iterm'])
    const win32 = terminalOptionsFor('win32')
    expect(win32.map(option => option.id)).toEqual(['terminal-default', 'terminal-wterm'])
    const linux = terminalOptionsFor('linux')
    expect(linux.map(option => option.id)).toEqual(['terminal-default', 'terminal-gnome', 'terminal-konsole', 'terminal-xfce'])
  })

})

describe('normalizeTerminalId / normalizeEditorId', () => {
  it('空串 / 缺省归一化为显式默认 ID', () => {
    expect(normalizeTerminalId('')).toBe('terminal-default')
    expect(normalizeTerminalId(undefined)).toBe('terminal-default')
  })

  it('非空偏好保持原值', () => {
    expect(normalizeTerminalId('terminal-iterm')).toBe('terminal-iterm')
  })
})

