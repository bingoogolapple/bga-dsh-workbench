import z from '@deepseek-ai/schemastery'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { WorkbenchConfig } from './routes.ts'

export const WORKBENCH_ENTRY_ID = 'bga-dsh-workbench'
export const DEFAULT_TEXT = '的专属 Harness 工作台'

export function defaultStorageDir(): string {
  return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), WORKBENCH_ENTRY_ID)
}

const workbenchPreferences = z.object({
  banner: z.object({
    avatarPath: z.string(),
    text: z.string(),
    show: z.boolean(),
  }),
  confetti: z.object({
    show: z.boolean(),
    sound: z.boolean(),
    theme: z.union(['default', 'gold', 'ocean', 'sakura', 'neon'] as const),
    intensity: z.union(['small', 'medium', 'large', 'epic'] as const),
    trigger: z.union(['success', 'every', 'task'] as const),
  }),
  english: z.object({
    enabled: z.boolean(),
  }),
  open: z.object({
    terminal: z.string(),
    editor: z.string(),
  }),
  openExtra: z.object({
    androidStudio: z.boolean(),
    xcode: z.boolean(),
    wechatDevtools: z.boolean(),
    intellijIdea: z.boolean(),
    devecoStudio: z.boolean(),
    webstorm: z.boolean(),
    pycharm: z.boolean(),
    goland: z.boolean(),
  }),
})

export const Config = z.object({
  avatarPath: z.string().default(''),
  text: z.string().default(DEFAULT_TEXT),
  show: z.boolean().default(true),
  sound: z.boolean().default(true),
  storageDir: z.string().default(defaultStorageDir()),
  preferences: workbenchPreferences.default({}).volatile(),
  taskBoard: z.object({
    enabled: z.boolean(),
    announceToAgent: z.boolean(),
  }).default({}).volatile(),
})

export type Config = ReturnType<typeof Config>

export function resolveWorkbenchSettings(config: Config): WorkbenchConfig {
  const { banner, confetti, english, open, openExtra } = config.preferences.get() ?? {}
  return {
    banner: {
      avatarPath: banner?.avatarPath || (config.avatarPath ?? ''),
      text: banner?.text || (config.text ?? DEFAULT_TEXT),
      show: banner?.show ?? config.show ?? true,
    },
    confetti: {
      show: confetti?.show ?? config.show ?? true,
      sound: confetti?.sound ?? config.sound ?? true,
      theme: confetti?.theme ?? 'default',
      intensity: confetti?.intensity ?? 'large',
      trigger: confetti?.trigger ?? 'success',
    },
    english: { enabled: english?.enabled ?? true },
    open: {
      terminal: open?.terminal ?? '',
      editor: open?.editor ?? '',
    },
    openExtra: {
      androidStudio: openExtra?.androidStudio ?? true,
      xcode: openExtra?.xcode ?? true,
      wechatDevtools: openExtra?.wechatDevtools ?? true,
      intellijIdea: openExtra?.intellijIdea ?? true,
      devecoStudio: openExtra?.devecoStudio ?? true,
      webstorm: openExtra?.webstorm ?? true,
      pycharm: openExtra?.pycharm ?? true,
      goland: openExtra?.goland ?? true,
    },
  }
}
