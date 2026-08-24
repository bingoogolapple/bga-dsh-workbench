 /**
 * 插件宿主入口（Host 端）。
 *
 * 本文件是 bga-dsh-workbench 插件的总装配点，负责：
 * 1. 声明插件对 DSH 工具箱（tools）服务的依赖；
 * 2. 读取并校验用户配置（Config），提供默认值；
 * 3. 注册「工作台设置」命名空间，并据此构建运行时（WorkbenchRuntime），
 *    供 HTTP 路由（横幅头像/配置/设置/任务持久化）读写；
 * 4. 向 agent 的 system prompt 注入任务看板的使用指引。
 */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { mkdir, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { createWorkbenchRoutes, sniffImageType, type WorkbenchRuntime } from './routes.ts'
import { createEnglishRoutes } from './english/routes.ts'
import { generateEnglishText, listEnglishModels } from './english/generate.ts'
import { registerWorkbenchSettings, type WorkbenchSettings } from './settings.ts'
import { registerTaskBoardPrompt } from './task-board-host.ts'

 /** 插件对外注册名：bga-dsh-workbench */
 export const name = 'bga-dsh-workbench'
 /** 插件声明依赖 DSH 提供的 tools（工具箱）服务 */
 export const inject = ['tools']

 /**
  * 横幅（banner）配置。
  * 控制 hero 空态顶部横幅的显示内容与行为。
  */
 export interface BannerConfig {

   /** 头像图片文件路径（空串表示使用内置默认头像） */
   avatarPath?: string

   /** 横幅问候语文本 */
   text?: string

   /** 是否显示横幅 */
   show?: boolean

   /** 是否启用完成回合时的庆祝音效 */
   sound?: boolean

   /** 头像/任务等数据的宿主存储目录 */
   storageDir?: string
 }

 /** 插件完整配置：横幅配置 */
 export interface Config extends BannerConfig {}

 /** 插件配置的 schema 声明（含默认值），供 DSH 校验用户配置 */
 export const Config: z<Config> = z.object({
   avatarPath: z.string().default(''),
   text: z.string().default('的专属 Harness 工作台'),
   show: z.boolean().default(true),
   sound: z.boolean().default(true),
   storageDir: z.string().default(defaultStorageDir()),
 })

 /** 横幅问候语的默认文本 */
 export const DEFAULT_TEXT = '的专属 Harness 工作台'

 /** 计算默认存储目录：优先 DSH_HOME 环境变量，否则使用 ~/.dsh 下的 bga-dsh-workbench */
 function defaultStorageDir(): string {
   return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'bga-dsh-workbench')
 }

 /**
  * 插件主入口：在 Cordis 上下文中装配所有能力。
  * 1. 注册工作台设置命名空间并构建运行时，将横幅/头像/任务持久化路由挂到 webServer；
  * 2. 向 agent 的 system prompt 注入任务看板指引。
  */
 export function apply(ctx: Context, config: Config): void {

   // 由配置构建的「基础设置」：当设置命名空间未覆盖某字段时作为回退值使用
   const base: WorkbenchSettings = {
     banner: {
       avatarPath: config.avatarPath ?? '',
       text: config.text ?? DEFAULT_TEXT,
       show: config.show ?? true,
     },
     confetti: {
       show: config.show ?? true,
       sound: config.sound ?? true,
     },
     english: {
       enabled: true,
     },
      open: {
        terminal: '',
        editor: '',
      },
      openExtra: {
        androidStudio: true,
        xcode: true,
        wechatDevtools: true,
        intellijIdea: true,
        devecoStudio: true,
        webstorm: true,
        pycharm: true,
        goland: true,
      },
   }

   // 存储目录必须为绝对路径
   const storageDir = resolve(config.storageDir ?? defaultStorageDir())
   // 等待 webServer 与 settings 两个宿主服务就绪后再注册路由（避免空指针）
   ctx.inject(['webServer', 'settings'], child => {
     const scope = registerWorkbenchSettings(child, base)
     const baseBanner = base.banner ?? {}
     const baseConfetti = base.confetti ?? {}
      const baseOpen = base.open ?? {}
       const baseOpenExtra = base.openExtra ?? {}
     const runtime: WorkbenchRuntime = {
       // 读取当前生效的配置：先看设置命名空间里的值，非字符串/非布尔或为空时回退到基础配置
       resolve: () => {
         const resolved = scope.get()
         const banner = resolved.banner ?? {}
         const confetti = resolved.confetti ?? {}
          const open = resolved.open ?? {}
          const extraCfg = resolved.openExtra ?? {}
          return {
           banner: {
             avatarPath: typeof banner.avatarPath === 'string' && banner.avatarPath.length > 0
               ? banner.avatarPath
               : (baseBanner.avatarPath ?? ''),
             text: typeof banner.text === 'string' && banner.text.length > 0
               ? banner.text
               : (baseBanner.text ?? ''),
             show: typeof banner.show === 'boolean' ? banner.show : (baseBanner.show ?? true),
           },
           confetti: {
             show: typeof confetti.show === 'boolean' ? confetti.show : (baseConfetti.show ?? true),
             sound: typeof confetti.sound === 'boolean' ? confetti.sound : (baseConfetti.sound ?? true),
           },
           english: {
             enabled: typeof (resolved.english as { enabled?: unknown } | undefined)?.enabled === 'boolean'
               ? (resolved.english as { enabled: boolean }).enabled
               : true,
           },
            open: {
              terminal: typeof open.terminal === 'string' ? open.terminal : (baseOpen.terminal ?? ''),
              editor: typeof open.editor === 'string' ? open.editor : (baseOpen.editor ?? ''),
            },
            openExtra: {
              androidStudio: typeof extraCfg.androidStudio === 'boolean' ? extraCfg.androidStudio : (baseOpenExtra.androidStudio ?? true),
              xcode: typeof extraCfg.xcode === 'boolean' ? extraCfg.xcode : (baseOpenExtra.xcode ?? true),
              wechatDevtools: typeof extraCfg.wechatDevtools === 'boolean' ? extraCfg.wechatDevtools : (baseOpenExtra.wechatDevtools ?? true),
              intellijIdea: typeof extraCfg.intellijIdea === 'boolean' ? extraCfg.intellijIdea : (baseOpenExtra.intellijIdea ?? true),
              devecoStudio: typeof extraCfg.devecoStudio === 'boolean' ? extraCfg.devecoStudio : (baseOpenExtra.devecoStudio ?? true),
              webstorm: typeof extraCfg.webstorm === 'boolean' ? extraCfg.webstorm : (baseOpenExtra.webstorm ?? true),
              pycharm: typeof extraCfg.pycharm === 'boolean' ? extraCfg.pycharm : (baseOpenExtra.pycharm ?? true),
              goland: typeof extraCfg.goland === 'boolean' ? extraCfg.goland : (baseOpenExtra.goland ?? true),
            },
         }
       },
       // 更新设置命名空间中的横幅/彩带配置
       updateSettings: patch => scope.update(patch),
       // 保存上传的头像字节流：嗅探图片类型，写入存储目录并更新设置记录新路径
       saveAvatar: async buffer => {
         const ext = sniffImageType(buffer)
         if (ext === undefined) throw new Error('unsupported image type (png, jpg, gif, webp supported)')
         await mkdir(storageDir, { recursive: true })
         const target = join(storageDir, `avatar${ext}`)
         await writeFile(target, buffer)
         await scope.update({ banner: { avatarPath: target } })
         return target
       },
       storageDir,
     }
     // 注册全部网页路由，并把每个路由的注销函数收集起来，便于在插件卸载时统一清理
     const disposers = createWorkbenchRoutes(runtime).map(route => child.webServer.register(route))
     for (const route of createEnglishRoutes({
        storageDir,
        generateText: (topic, selection, nativeLang, targetLang) => generateEnglishText(child, topic, selection, nativeLang, targetLang),
        listModels: () => listEnglishModels(child),
        currentSelection: () => (child.get('agentDefaultModel') as { currentSelection(): { provider?: string; model?: string } } | undefined)?.currentSelection() ?? { provider: undefined, model: undefined },
        saveSelection: async (selection) => { await (child.get('agentDefaultModel') as { saveSelection(sel: { provider: string; model: string }): Promise<void> } | undefined)?.saveSelection(selection) },
      })) {
       disposers.push(child.webServer.register(route))
     }
     return () => {
       for (const dispose of disposers) dispose()
     }
   })


  // 向 agent 系统提示注入任务看板指引
  registerTaskBoardPrompt(ctx)
}
