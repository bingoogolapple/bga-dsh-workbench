import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { useSyncExternalStore, type ReactNode } from 'react'
import { WorkbenchBanner } from './Banner.tsx'
import { CONFIG_CHANGED_EVENT } from './banner-config.ts'
import { ConfettiLayer } from './ConfettiLayer.tsx'
import { EnglishLearningLayer } from './english/EnglishLearningLayer.tsx'
import { SettingsSection, type WorkbenchSectionInjected, type WorkbenchSectionState, type OpenPrefsSectionState, type ConfettiSectionState } from './SettingsSection.tsx'
import { applyTaskBoard, type BoardSource } from './task-board-apply.ts'
import { TaskBoardEmbed } from './task-board/TaskBoardEmbed.tsx'
import { registerWorkspaceOpenMenu } from './workspace-open.ts'
import css from './task-board/embed.module.css'

export const inject: readonly string[] = [
  'slots', 'sessions', 'workspaces', 'uiWorkspace', 'connection', 'configForms', 'locale', 'layout',
  'remote', 'remote.agentPresets', 'remote.commands', 'remote.session',
]

function WorkbenchHero({ hero, children, board }: PropsRuntime<'conversation.hero.frame'> & InjectFace<{ board: BoardSource }> & { children: ReactNode }) {
  const view = useSyncExternalStore(board.subscribe, board.getSnapshot)
  return (
    <div className={css.heroFrame} data-hero={hero || undefined}>
      {hero && (view === undefined ? <WorkbenchBanner /> : <TaskBoardEmbed {...view} />)}
      {children}
    </div>
  )
}

function WorkbenchOverlays() {
  return <><ConfettiLayer /><EnglishLearningLayer /></>
}

 // 后端（Host）提供的 HTTP 接口地址（相对当前页面路径）
 const CONFIG_URL = '/bga-dsh-workbench/config' // 读取配置（横幅/彩带）
 const SETTINGS_URL = '/bga-dsh-workbench/settings' // 写回配置
 const AVATAR_URL = '/bga-dsh-workbench/avatar' // 头像的上传（POST）与读取（GET）
 
 // 把后端 HTTP 失败统一转换为带中文说明的 Error 对象。
 // @param status    后端返回的 HTTP 状态码
 // @param operation 本次操作的中文名称（如「读取设置」「保存」），用于拼装报错文案
 // @returns 描述失败的 Error 对象
 function apiFailure(status: number, operation: string): Error {
   return new Error(`${operation}失败 (${status})`)
 }
 
 // 自定义事件名：横幅/彩带配置一旦在设置页被修改并保存，就在 window 上广播此事件，
 // 好让横幅、彩带层、任务看板欢迎行等组件监听到后重新拉取最新配置。
 
 // 在 window 上广播“配置已变更”事件（全局配置刷新通知）。
 function notifyConfigChanged(): void {
   window.dispatchEvent(new Event(CONFIG_CHANGED_EVENT))
 }
 
 // 插件浏览器端入口：由运行时在页面加载完成后调用，负责挂载全部浏览器端 UI 与逻辑。
 // @param ctx ClientContext —— 客户端运行时上下文（服务的注入与事件的订阅都经由它）
 export function apply(ctx: ClientContext): void {
   const board = applyTaskBoard(ctx)
   ctx.slots.inject('conversation.hero.frame', () => ctx.slots.register({
     name: 'conversation.hero.frame', id: 'bga-dsh-workbench', inject: () => ({ board }),
   }, WorkbenchHero))
   ctx.slots.inject('shell.overlay', () => ctx.slots.register({
     name: 'shell.overlay', id: 'bga-dsh-workbench',
   }, WorkbenchOverlays))

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
           confetti?: { show?: unknown; sound?: unknown; theme?: unknown; intensity?: unknown; trigger?: unknown }
            open?: { terminal?: unknown; editor?: unknown }
            openExtra?: { androidStudio?: unknown; xcode?: unknown; wechatDevtools?: unknown; intellijIdea?: unknown; devecoStudio?: unknown; webstorm?: unknown; pycharm?: unknown; goland?: unknown }
          }
          const banner = value.banner ?? {}
          return {
           avatarPath: typeof banner.avatarPath === 'string' ? banner.avatarPath : '',
           text: typeof banner.text === 'string' ? banner.text : '',
           show: typeof banner.show === 'boolean' ? banner.show : true,
           confettiShow: typeof value.confetti?.show === 'boolean' ? value.confetti.show : true,
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
       // 保存后刷新当前页面上的彩带配置。
       saveConfetti: async (patch): Promise<void> => {
         const response = await fetch(SETTINGS_URL, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           
           body: JSON.stringify({ confetti: patch }),
         })
         if (!response.ok) throw apiFailure(response.status, '保存')
         notifyConfigChanged()
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
 
   
   ctx.inject(['contextMenus'], registerWorkspaceOpenMenu)
 }
