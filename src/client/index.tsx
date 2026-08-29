 
 
 // ============================================================================
 // 文件：index.tsx —— bga-dsh-workbench 浏览器端（Client）入口模块
 //
 // 职责：
 //   1. 作为浏览器端代码的入口：向页面 body 挂载「工作台横幅」WorkbenchBanner
 //      与「彩带彩纸特效层」ConfettiLayer 两个 React 组件；
 //   2. 通过 slots 系统在「设置」页注册「BGA 工作台设置」区块（SettingsSection），
 //      并注入读写横幅/彩带配置、上传/重置头像等后端 API；
 //   3. 调用 applyTaskBoard() 把任务看板整套逻辑挂载到运行时页面。
 //
 // 说明：本文件只包含浏览器端（Client）代码，所有 /bga-dsh-workbench/* 接口
 // 由宿主（Host）进程提供。
 // ============================================================================
 import type { Context as ClientContext } from '@deepseek-ai/cordis'
 import { createRoot } from 'react-dom/client'
 import { WorkbenchBanner } from './Banner.tsx'
 import { ConfettiLayer } from './ConfettiLayer.tsx'
import { EnglishLearningLayer } from './english/EnglishLearningLayer.tsx'
 import { SettingsSection, type WorkbenchSectionInjected, type WorkbenchSectionState, type OpenPrefsSectionState, type ConfettiSectionState } from './SettingsSection.tsx'
 import { applyTaskBoard } from './task-board-apply.ts'
 import { mountWorkspaceOpenMenu } from './workspace-open.ts'
 
 // 声明本插件运行需要注入的运行时服务（由 Cordis 按名称注入到 ctx）：
 // - slots：slot 注册能力，用于向设置页等位置注册 UI 区块
 // - sessions / workspaces：会话与会话列表 / 工作区能力
 // - connection：与宿主进程的连接句柄（提供 agent 预设等高级 API）
 // - settingsScope：设置作用域；locale：多语言支持
 //
 // ⚠️ 兼容性硬约束：本列表**只能放新旧 DSH 都存在的服务**。
 // inject 里的服务若在当前版本不存在，Cordis 会一直等待它，插件将卡在
 // `pending (waiting for service: xxx)` 而永不激活——这是加载期故障，不是功能降级。
 // 例如 `uiWorkspace` 仅新版存在（旧版的 connectWorkspace 在 workspaces 上），
 // 因此**绝不能**出现在这里；新版需要它时由 compat/host-bridge.ts 在调用时惰性取用。
 import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'

 export const inject: readonly string[] = ['slots', 'sessions', 'workspaces', 'connection', 'settingsScope', 'locale']
 
 // 后端（Host）提供的 HTTP 接口地址（相对当前页面路径）
 const CONFIG_URL = '/bga-dsh-workbench/config' // 读取配置（横幅/彩带）
 const SETTINGS_URL = '/bga-dsh-workbench/settings' // 写回配置
 const AVATAR_URL = '/bga-dsh-workbench/avatar' // 头像的上传（POST）与读取（GET）
 
 // 把后端 HTTP 失败统一转换为带中文说明的 Error 对象。
 // @param status    后端返回的 HTTP 状态码
 // @param operation 本次操作的中文名称（如「读取设置」「保存」），用于拼装报错文案
 // @returns 描述失败的 Error 对象
 function apiFailure(status: number, operation: string): Error {
   // 404/405 说明宿主插件仍是旧版本、还没提供这套接口：给出可操作的升级提示
   if (status === 404 || status === 405) {
     return new Error(`${operation}失败：宿主插件为旧版本，请重启 Harness 后重试`)
   }
   return new Error(`${operation}失败 (${status})`)
 }
 
 // 自定义事件名：横幅/彩带配置一旦在设置页被修改并保存，就在 window 上广播此事件，
 // 好让横幅、彩带层、任务看板欢迎行等组件监听到后重新拉取最新配置。
 export const CONFIG_CHANGED_EVENT = 'bga-dsh-workbench:config-changed'
 
 // 在 window 上广播“配置已变更”事件（全局配置刷新通知）。
 function notifyConfigChanged(): void {
   window.dispatchEvent(new Event(CONFIG_CHANGED_EVENT))
 }
 
 // 插件浏览器端入口：由运行时在页面加载完成后调用，负责挂载全部浏览器端 UI 与逻辑。
 // @param ctx ClientContext —— 客户端运行时上下文（服务的注入与事件的订阅都经由它）
 export function apply(ctx: ClientContext): void {
   // 在页面 body 尾部追加一个挂载容器，渲染横幅与彩带层；
   // ctx.effect 的返回函数会在插件卸载时执行，负责卸挂载与移除容器。
   ctx.effect(() => {
     const container = document.createElement('div')
     document.body.appendChild(container)
     const root = createRoot(container)
     root.render(<>
       <WorkbenchBanner />
       <ConfettiLayer />
      <EnglishLearningLayer />
     </>)
     return () => {
       root.unmount()
       container.remove()
     }
   }, 'bga-dsh-workbench: banner')
 
   // 向「设置」页注册本工作台的配置区块（settings.section）；
   // 区块视图组件为 SettingsSection，inject 为其注入全部数据读写能力。
   ctx.slots.inject('settings.section', () => ctx.slots.register({
     name: 'settings.section',
     id: 'bga-dsh-workbench',
     order: 60, // 区块在同页内容中的排序权重（数值越大越靠后）
     label: () => 'BGA 工作台设置',
     inject: (): WorkbenchSectionInjected => ({
       // 读取当前配置：请求 /config 并做逐字段类型校验，
       // 类型不符或缺省的字段回退到默认值，避免后端数据结构变化导致前端崩溃。
       load: async (): Promise<WorkbenchSectionState & ConfettiSectionState & OpenPrefsSectionState> => {
         const response = await fetch(CONFIG_URL, { cache: 'no-store' }) // no-store：实时拉取，不命中缓存
         if (!response.ok) throw apiFailure(response.status, '读取设置')
         
         
          const value = await response.json() as {
           banner?: Partial<WorkbenchSectionState>
           confetti?: { sound?: unknown; theme?: unknown; intensity?: unknown; trigger?: unknown }
            open?: { terminal?: unknown; editor?: unknown }
            openExtra?: { androidStudio?: unknown; xcode?: unknown; wechatDevtools?: unknown; intellijIdea?: unknown; devecoStudio?: unknown; webstorm?: unknown; pycharm?: unknown; goland?: unknown }
          }
          const banner = value.banner ?? {}
          return {
           avatarPath: typeof banner.avatarPath === 'string' ? banner.avatarPath : '',
           text: typeof banner.text === 'string' ? banner.text : '',
           show: typeof banner.show === 'boolean' ? banner.show : true,
           sound: typeof value.confetti?.sound === 'boolean' ? value.confetti.sound : true,
           theme: (typeof value.confetti?.theme === 'string'
             && ['default', 'gold', 'ocean', 'sakura', 'neon'].includes(value.confetti.theme as string)
             ? (value.confetti.theme as 'default' | 'gold' | 'ocean' | 'sakura' | 'neon')
             : 'default'),
           intensity: (typeof value.confetti?.intensity === 'string'
             && ['small', 'medium', 'large', 'epic'].includes(value.confetti.intensity as string)
             ? (value.confetti.intensity as 'small' | 'medium' | 'large' | 'epic')
             : 'large'),
           trigger: (typeof value.confetti?.trigger === 'string'
             && ['success', 'every', 'task'].includes(value.confetti.trigger as string)
             ? (value.confetti.trigger as 'success' | 'every' | 'task')
             : 'success'),
            terminal: typeof value.open?.terminal === 'string' ? value.open.terminal : '',
            editor: typeof value.open?.editor === 'string' ? value.open.editor : '',
            openExtra: {
              androidStudio: typeof value.openExtra?.androidStudio === 'boolean' ? value.openExtra.androidStudio : true,
              xcode: typeof value.openExtra?.xcode === 'boolean' ? value.openExtra.xcode : true,
              wechatDevtools: typeof value.openExtra?.wechatDevtools === 'boolean' ? value.openExtra.wechatDevtools : true,
              intellijIdea: typeof value.openExtra?.intellijIdea === 'boolean' ? value.openExtra.intellijIdea : true,
              devecoStudio: typeof value.openExtra?.devecoStudio === 'boolean' ? value.openExtra.devecoStudio : true,
              webstorm: typeof value.openExtra?.webstorm === 'boolean' ? value.openExtra.webstorm : true,
              pycharm: typeof value.openExtra?.pycharm === 'boolean' ? value.openExtra.pycharm : true,
              goland: typeof value.openExtra?.goland === 'boolean' ? value.openExtra.goland : true,
            },
          }
       },
       // 保存横幅配置（局部更新），成功后广播配置变更，让横幅等组件立即刷新。
       save: async (patch): Promise<void> => {
         const response = await fetch(SETTINGS_URL, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           
           body: JSON.stringify({ banner: patch }),
         })
         if (!response.ok) throw apiFailure(response.status, '保存')
         notifyConfigChanged()
       },
       // 保存彩带配置（目前只有音效开关）。音效开关由本区块内部状态管理，无需广播。
       saveConfetti: async (patch): Promise<void> => {
         const response = await fetch(SETTINGS_URL, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           
           body: JSON.stringify({ confetti: patch }),
         })
         if (!response.ok) throw apiFailure(response.status, '保存')
       },
       // 上传头像图片：请求体即文件二进制；后端返回新的头像路径。
       // 校验响应里的 ok 与 avatarPath，成功后再通知全局刷新（让横幅头像立即生效）。
       uploadAvatar: async (file): Promise<{ avatarPath: string }> => {
         const response = await fetch(AVATAR_URL, {
           method: 'POST',
           headers: { 'Content-Type': file.type || 'application/octet-stream' },
           body: file,
         })
         const value = await response.json() as { ok: boolean; avatarPath?: string; error?: string }
         if (!response.ok || value.ok !== true || typeof value.avatarPath !== 'string') {
           throw new Error(value.error ?? apiFailure(response.status, '上传').message)
         }
         notifyConfigChanged()
         return { avatarPath: value.avatarPath }
       },
       // 恢复默认头像：向后端写空头像路径，并广播配置变更。
       resetAvatar: async (): Promise<void> => {
         const response = await fetch(SETTINGS_URL, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ banner: { avatarPath: '' } }),
         })
         if (!response.ok) throw apiFailure(response.status, '恢复默认')
         notifyConfigChanged()
       },
        saveOpenPrefs: async (patch: { terminal?: string; editor?: string }): Promise<void> => {
          const response = await fetch(SETTINGS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ open: patch }),
          })
          if (!response.ok) throw apiFailure(response.status, '保存')
          // 终端/编辑器偏好只影响工作区打开菜单（点击时实时拉取），无需广播刷新横幅，
          // 否则每次切换都会触发 bga-dsh-workbench:config-changed 导致整页重渲染。
        },
        saveExtraOpen: async (patch: { androidStudio?: boolean; xcode?: boolean; wechatDevtools?: boolean; intellijIdea?: boolean; devecoStudio?: boolean; webstorm?: boolean; pycharm?: boolean; goland?: boolean }): Promise<void> => {
          const response = await fetch(SETTINGS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ openExtra: patch }),
          })
          if (!response.ok) throw apiFailure(response.status, '保存')
          // 附加打开方式只影响工作区打开菜单（点击时实时拉取），无需广播刷新横幅，
          // 否则每次勾选都会触发 bga-dsh-workbench:config-changed 导致整页重渲染。
        },
      }),
   }, SettingsSection))
 
   
   // 装配并挂载任务看板（详见 ./task-board-apply.ts 的依赖装配说明）。
   applyTaskBoard(ctx)

   // 工作区「⋯」菜单注入「在 Finder/终端/VSCode 中打开」按钮；
   // ctx.effect 返回的清理函数在插件卸载时解绑监听与观察器。
   ctx.effect(() => mountWorkspaceOpenMenu(ctx), 'bga-dsh-workbench: workspace open menu')
 }