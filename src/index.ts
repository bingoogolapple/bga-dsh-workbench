import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type {} from '@deepseek-ai/dsh-settings'
import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import {
  currentEnglishModel,
  generateEnglishText,
  listEnglishModels,
  saveEnglishDefaultModel,
} from './english/generate.ts'
import { createEnglishRoutes } from './english/routes.ts'
import { createWorkbenchRoutes, sniffImageType, type WorkbenchRuntime } from './routes.ts'
import { WORKBENCH_ENTRY_ID, defaultStorageDir, resolveWorkbenchSettings, type Config } from './settings.ts'
import { registerTaskBoardPrompt } from './task-board-host.ts'

export { Config, DEFAULT_TEXT } from './settings.ts'
export const name = WORKBENCH_ENTRY_ID

export function apply(ctx: Context, config: Config): void {
  const storageDir = resolve(config.storageDir ?? defaultStorageDir())

  ctx.inject(['webServer', 'settings'], child => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
    const runtime: WorkbenchRuntime = {
      resolve: () => resolveWorkbenchSettings(config),
      updateSettings: patch => child.settings.update(WORKBENCH_ENTRY_ID, { preferences: patch }),
      saveAvatar: async buffer => {
        const ext = sniffImageType(buffer)
        if (ext === undefined) throw new Error('unsupported image type (png, jpg, gif, webp supported)')
        await mkdir(storageDir, { recursive: true })
        const target = join(storageDir, `avatar${ext}`)
        await writeFile(target, buffer)
        await child.settings.update(WORKBENCH_ENTRY_ID, { preferences: { banner: { avatarPath: target } } })
        return target
      },
      storageDir,
    }
    const routes = [
      ...createWorkbenchRoutes(runtime),
      ...createEnglishRoutes({
        storageDir,
        generateText: (topic, selection, nativeLang, targetLang) =>
          generateEnglishText(child, topic, selection, nativeLang, targetLang),
        listModels: () => listEnglishModels(child),
        currentSelection: () => currentEnglishModel(child) ?? {},
        saveSelection: selection => saveEnglishDefaultModel(child, selection),
      }),
    ]
    for (const route of routes) child.effect(() => child.webServer.register(route))
  })

  registerTaskBoardPrompt(ctx)
}
