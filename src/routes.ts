/**
 * 宿主网页路由（HTTP 层）。
 *
 * 为浏览器端提供四类 JSON/二进制接口：
 * 1. GET/POST /bga-dsh-workbench/avatar —— 读取头像图片 / 上传新头像；
 * 2. GET  /bga-dsh-workbench/config   —— 读取当前横幅+彩带配置；
 * 3. POST /bga-dsh-workbench/settings —— 更新横幅/彩带设置（带逐字段校验）；
 * 4. GET/POST/DELETE /bga-dsh-workbench/tasks —— 任务看板数据的持久化读写（tasks.json）。
 */
 import { readFile, stat, writeFile, unlink, mkdir, rename } from 'node:fs/promises'
 import { extname, join, isAbsolute } from 'node:path'
 import type { IncomingMessage } from 'node:http'
 import type { WebRoute } from '@deepseek-ai/dsh-host-webserver'
 import { DEFAULT_AVATAR_BYTES, DEFAULT_AVATAR_CONTENT_TYPE } from './default-avatar.ts'
 import {
  isExtraOpenKind,
  openExtraPathIn,
   isOpenKind,
   isTerminalPreference,
   isEditorPreference,
   openPathIn,
   type OpenPreference,
 } from './open-app.ts'

 /** 解析后的横幅配置（已回退到默认值，均为最终生效值） */
 export interface ResolvedBannerConfig {
   /** 头像图片绝对路径（空串表示默认头像） */
   readonly avatarPath: string
   /** 横幅问候语文本 */
   readonly text: string
   /** 是否显示横幅 */
   readonly show: boolean
 }

 /** 彩带（完成回合庆祝特效）配置 */
 export interface ConfettiConfig {
   /** 是否播放庆祝音效 */
   readonly sound: boolean
 }

 /** 「打开方式」配置（设置页下拉当前选中的偏好 ID，供界面回显） */
 export interface OpenConfig {
   /** 终端偏好 ID；空串 = 平台默认终端 */
   readonly terminal: string
   /** 编辑器偏好 ID；空串 = VS Code */
   readonly editor: string
 }

 /** 工作台当前生效的完整配置 */
 export interface WorkbenchConfig {
   readonly banner: ResolvedBannerConfig
   readonly confetti: ConfettiConfig
   readonly open: OpenConfig
    /** 附加 IDE 打开方式的展示开关（true = 展示在工作区菜单尾部） */
    readonly openExtra: ExtraOpenConfig
 }

/** 「附加 IDE」打开方式的展示开关（true = 展示在工作区菜单尾部）。 */
export interface ExtraOpenConfig {
  /** 是否展示「在 Android Studio 中打开」 */
  readonly androidStudio: boolean
  /** 是否展示「在 Xcode 中打开」 */
  readonly xcode: boolean
  /** 是否展示「在微信开发者工具中打开」 */
  readonly wechatDevtools: boolean
  /** 是否展示「在 IntelliJ IDEA 中打开」 */
  readonly intellijIdea: boolean
  /** 是否展示「在 DevEco Studio 中打开」 */
  readonly devecoStudio: boolean
  /** 是否展示「在 WebStorm 中打开」 */
  readonly webstorm: boolean
  /** 是否展示「在 PyCharm 中打开」 */
  readonly pycharm: boolean
  /** 是否展示「在 GoLand 中打开」 */
  readonly goland: boolean
}

 /** 横幅设置的部分更新（所有字段可选） */
 export interface BannerSettingsPatch {
   readonly avatarPath?: string
   readonly text?: string
   readonly show?: boolean
 }

 /** 彩带设置的部分更新 */
 export interface ConfettiSettingsPatch {
   readonly show?: boolean
   readonly sound?: boolean
 }

 /** 英语学习设置的部分更新 */
 export interface EnglishSettingsPatch {
   readonly enabled?: boolean
 }

 /** 打开方式设置的部分更新 */
 export interface OpenSettingsPatch {
   readonly terminal?: string
   readonly editor?: string
 }

/** 「附加 IDE」打开方式开关的部分更新。 */
export interface ExtraOpenSettingsPatch {
  /** 是否展示「在 Android Studio 中打开」 */
  readonly androidStudio?: boolean
  /** 是否展示「在 Xcode 中打开」 */
  readonly xcode?: boolean
  /** 是否展示「在微信开发者工具中打开」 */
  readonly wechatDevtools?: boolean
  /** 是否展示「在 IntelliJ IDEA 中打开」 */
  readonly intellijIdea?: boolean
  /** 是否展示「在 DevEco Studio 中打开」 */
  readonly devecoStudio?: boolean
  /** 是否展示「在 WebStorm 中打开」 */
  readonly webstorm?: boolean
  /** 是否展示「在 PyCharm 中打开」 */
  readonly pycharm?: boolean
  /** 是否展示「在 GoLand 中打开」 */
  readonly goland?: boolean
}

 /** 工作台设置的部分更新 */
 export interface WorkbenchSettingsPatch {
   readonly banner?: BannerSettingsPatch
   readonly confetti?: ConfettiSettingsPatch
   readonly english?: EnglishSettingsPatch
   readonly open?: OpenSettingsPatch
    readonly openExtra?: ExtraOpenSettingsPatch
 }

 /**
  * 工作台运行时接口：封装配置读取/更新、头像保存与存储目录。
  * 由 index.ts 的 apply 在装配时注入具体实现。
  */
 export interface WorkbenchRuntime {
   /** 读取当前生效的配置 */
   resolve(): WorkbenchConfig
   /** 应用设置更新 */
   updateSettings(patch: WorkbenchSettingsPatch): Promise<void>
   /** 保存头像字节流，返回落盘后的文件路径 */
   saveAvatar(buffer: Buffer): Promise<string>
   /** 任务看板等数据的持久化目录 */
   storageDir: string
 }

 /** 扩展名 → MIME 类型映射，用于头像响应的 Content-Type */
 const CONTENT_TYPES: Record<string, string> = {
   '.png': 'image/png',
   '.jpg': 'image/jpeg',
   '.jpeg': 'image/jpeg',
   '.gif': 'image/gif',
   '.webp': 'image/webp',
   '.svg': 'image/svg+xml',
 }

 /** 根据文件路径后缀返回对应的 MIME 类型，未知扩展名默认按 PNG 处理 */
 export function avatarContentType(path: string): string {
   return CONTENT_TYPES[extname(path).toLowerCase()] ?? 'image/png'
 }

 /** 头像上传的最大字节数：10MB */
 export const MAX_AVATAR_BYTES = 10 * 1024 * 1024

 /** 生成「成功」JSON 响应体：{ ok: true, ...value } */
 const OK = (value: Record<string, unknown>): string => JSON.stringify({ ok: true, ...value })

 /**
  * 从 HTTP 请求流中读取整个请求体，并做大小上限保护。
  * 超过 maxBytes 时抛出错误并销毁请求连接。
  */
 export function readBody(req: IncomingMessage, maxBytes: number): Promise<Buffer> {
   return new Promise<Buffer>((resolve, reject) => {
     const chunks: Buffer[] = []
     let size = 0
     req.on('data', (chunk: Buffer) => {
       size += chunk.length
       if (size > maxBytes) {
         reject(new Error(`request body exceeds ${maxBytes} bytes`))
         req.destroy()
         return
       }
       chunks.push(chunk)
     })
     req.on('end', () => { resolve(Buffer.concat(chunks)) })
     req.on('error', reject)
   })
 }

 /**
  * 通过文件头魔数嗅探图片类型，返回扩展名（'.png' / '.jpg' / '.gif' / '.webp'）。
  * 无法识别的字节流返回 undefined。
  */
 export function sniffImageType(buffer: Buffer): string | undefined {
   // PNG：8 字节签名 89 50 4E 47
   if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
     return '.png'
   }
   // JPEG：FF D8 FF
   if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
     return '.jpg'
   }
   // GIF：GIF8（47 49 46 38）
   if (buffer.length >= 4 && buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
     return '.gif'
   }
   // WebP：RIFF....WEBP（前 4 字节 RIFF，第 9~12 字节 WEBP）
   if (buffer.length >= 12 && buffer.toString('latin1', 0, 4) === 'RIFF' && buffer.toString('latin1', 8, 12) === 'WEBP') {
     return '.webp'
   }
   return undefined
 }

 /**
  * 原子写回文本文件：先写临时文件再 rename 覆盖目标，
  * 避免进程中途崩溃时留下半截 JSON（对比直接 writeFile 覆盖）。
  */
 async function atomicWriteFile(target: string, text: string): Promise<void> {
   const tmp = `${target}.tmp`
   await writeFile(tmp, text, 'utf8')
   await rename(tmp, target)
 }

 /**
  * 创建工作台的全部网页路由。
  * 返回 WebRoute 数组，由调用方（index.ts）逐个注册到 webServer。
  */
 export function createWorkbenchRoutes(runtime: WorkbenchRuntime): WebRoute[] {
   // 头像处理器：优先返回用户上传的头像文件；读取失败或未设置时回退到内置默认头像
   const avatarHandler: WebRoute['handler'] = async (_req, res) => {
     // 读取当前设置中的头像路径；为空则直接走默认头像分支
     const avatarPath = runtime.resolve().banner.avatarPath
     if (avatarPath.length > 0) {
       try {
         const info = await stat(avatarPath)
         if (info.isFile()) {
           const body = await readFile(avatarPath)
           res.writeHead(200, {
             'Content-Type': avatarContentType(avatarPath),
             'Content-Length': body.length,
             'Cache-Control': 'no-cache',
           })
           res.end(body)
           return
         }
       } catch {
         // 头像文件缺失或不可读：静默回退到默认头像
       }
     }
     // 回退分支：返回内置默认头像
     res.writeHead(200, {
       'Content-Type': DEFAULT_AVATAR_CONTENT_TYPE,
       'Content-Length': DEFAULT_AVATAR_BYTES.length,
       'Cache-Control': 'no-cache',
     })
     res.end(DEFAULT_AVATAR_BYTES)
   }

   return [
     {
       kind: 'exact',
       path: '/bga-dsh-workbench/avatar',
       handler: async (req, res) => {
         // POST 意为上传头像；其余方法一律按「读取头像」处理
         if (req.method === 'POST') {
           try {
             const body = await readBody(req, MAX_AVATAR_BYTES)
             if (sniffImageType(body) === undefined) {
               throw new Error('unsupported image type (png, jpg, gif, webp supported)')
             }
             const avatarPath = await runtime.saveAvatar(body)
             res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
             res.end(OK({ avatarPath }))
           } catch (error) {
             res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
             res.end(JSON.stringify({ ok: false, error: (error as Error).message }))
           }
           return
         }
         await avatarHandler(req, res)
       },
     },
     {
       kind: 'exact',
       path: '/bga-dsh-workbench/config',
       handler: (_req, res) => {
          // 返回当前生效的横幅+彩带+打开方式配置，供浏览器端初始化界面
         res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
         res.end(JSON.stringify(runtime.resolve()))
       },
     },
     {
       kind: 'exact',
       path: '/bga-dsh-workbench/settings',
       handler: async (req, res) => {
         try {
           const body = await readBody(req, 64 * 1024)
           const parsed = JSON.parse(body.toString('utf8')) as Record<string, unknown>
           if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
             throw new Error('settings patch must be an object')
           }
           // 从请求体中提取 banner 与 confetti 两个可选字段
           const banner = parsed.banner
           const confetti = parsed.confetti
            const open = parsed.open
             const openExtra = parsed.openExtra
           // 逐字段校验类型并构造合法的更新补丁；任何非法字段都抛错走 400 分支
           const patch: {
             banner?: { avatarPath?: string; text?: string; show?: boolean }
             confetti?: { show?: boolean; sound?: boolean }
             english?: { enabled?: boolean }
              openExtra?: Record<string, boolean>
              open?: { terminal?: string; editor?: string }
           } = {}
           if (banner !== undefined) {
             if (typeof banner !== 'object' || banner === null || Array.isArray(banner)) {
               throw new Error('banner must be an object')
             }
             const fields = banner as Record<string, unknown>
             const item: { avatarPath?: string; text?: string; show?: boolean } = {}
             if (fields.avatarPath !== undefined) {
               if (typeof fields.avatarPath !== 'string') throw new Error('banner.avatarPath must be a string')
               item.avatarPath = fields.avatarPath
             }
             if (fields.text !== undefined) {
               if (typeof fields.text !== 'string') throw new Error('banner.text must be a string')
               item.text = fields.text
             }
             if (fields.show !== undefined) {
               if (typeof fields.show !== 'boolean') throw new Error('banner.show must be a boolean')
               item.show = fields.show
             }
             patch.banner = item
           }
           if (confetti !== undefined) {
             if (typeof confetti !== 'object' || confetti === null || Array.isArray(confetti)) {
               throw new Error('confetti must be an object')
             }
             const fields = confetti as Record<string, unknown>
             const item: { sound?: boolean } = {}
             if (fields.sound !== undefined) {
               if (typeof fields.sound !== 'boolean') throw new Error('confetti.sound must be a boolean')
               item.sound = fields.sound
             }
             patch.confetti = item
           }
            if (open !== undefined) {
              if (typeof open !== 'object' || open === null || Array.isArray(open)) {
                throw new Error('open must be an object')
              }
              const fields = open as Record<string, unknown>
              const item: { terminal?: string; editor?: string } = {}
              if (fields.terminal !== undefined) {
                if (typeof fields.terminal !== 'string') throw new Error('open.terminal must be a string')
                if (!isTerminalPreference(fields.terminal)) {
                  throw new Error(`open.terminal is not a known terminal preference: ${fields.terminal}`)
                }
                item.terminal = fields.terminal
              }
              if (fields.editor !== undefined) {
                if (typeof fields.editor !== 'string') throw new Error('open.editor must be a string')
                if (!isEditorPreference(fields.editor)) {
                  throw new Error(`open.editor is not a known editor preference: ${fields.editor}`)
                }
                item.editor = fields.editor
              }
              patch.open = item
            }
             if (openExtra !== undefined) {
               if (typeof openExtra !== 'object' || openExtra === null || Array.isArray(openExtra)) {
                 throw new Error('openExtra must be an object')
               }
               const fields = openExtra as Record<string, unknown>
               const keys = ['androidStudio', 'xcode', 'wechatDevtools', 'intellijIdea', 'devecoStudio', 'webstorm', 'pycharm', 'goland'] as const
               const item: Partial<Record<typeof keys[number], boolean>> = {}
               for (const key of keys) {
                 if (fields[key] !== undefined) {
                   if (typeof fields[key] !== 'boolean') {
                     throw new Error(`openExtra.${key} must be a boolean`)
                   }
                   item[key] = Boolean(fields[key])
                 }
               }
               patch.openExtra = item as Record<string, boolean>
             }
           const english = parsed.english
           if (english !== undefined) {
             if (typeof english !== 'object' || english === null || Array.isArray(english)) {
               throw new Error('english must be an object')
             }
             const efields = english as Record<string, unknown>
             const eitem: { enabled?: boolean } = {}
             if (efields.enabled !== undefined) {
               if (typeof efields.enabled !== 'boolean') throw new Error('english.enabled must be a boolean')
               eitem.enabled = efields.enabled
             }
             patch.english = eitem
           }
           await runtime.updateSettings(patch)
           res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
           res.end(OK({}))
         } catch (error) {
           res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
           res.end(JSON.stringify({ ok: false, error: (error as Error).message }))
         }
       },
     },

     /**
      * 任务看板持久化端点。
      * - GET    读 tasks.json（文件不存在时返回 '[]'）；
      * - POST   原子写回整个任务列表（先校验 JSON 合法再落盘）；
      * - DELETE 清空任务文件。
      */
     {
       kind: 'exact',
       path: '/bga-dsh-workbench/tasks',
       handler: async (req, res) => {
         const tasksFile = join(runtime.storageDir, 'tasks.json')
         try {
           if (req.method === 'DELETE') {
             await unlink(tasksFile).catch(() => {})
             res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
             res.end(OK({}))
             return
           }
           if (req.method === 'POST') {
             // 上限 2MB 的整表写入；先 JSON.parse 校验语法规整再落盘
             const body = await readBody(req, 2 * 1024 * 1024) // 2MB
             const text = body.toString('utf8')
             JSON.parse(text) // 语法校验：非法 JSON 直接抛错走 400 分支
             await mkdir(runtime.storageDir, { recursive: true })
             await atomicWriteFile(tasksFile, text)
             res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
             res.end(OK({}))
             return
           }
           // 默认 GET：读取任务列表；文件缺失时容错地返回空数组
           const data = await readFile(tasksFile, 'utf8').catch(() => '[]')
           res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
           res.end(data)
         } catch (error) {
           res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
           res.end(JSON.stringify({ ok: false, error: (error as Error).message }))
         }
       },
     },

      /**
       * 工作台元数据持久化端点（日报「当日已完成」打卡等小块状态）。
       * - GET    读 workbench-meta.json（文件不存在时返回 '{}'）；
       * - POST   原子写回整个元数据对象（先校验 JSON 合法再落盘）。
       */
      {
        kind: 'exact',
        path: '/bga-dsh-workbench/workbench-meta',
        handler: async (req, res) => {
          const metaFile = join(runtime.storageDir, 'workbench-meta.json')
          try {
            if (req.method === 'POST') {
              // 上限 256KB 的整表写入；先 JSON.parse 校验语法规整再落盘
              const body = await readBody(req, 256 * 1024)
              const text = body.toString('utf8')
              JSON.parse(text) // 语法校验：非法 JSON 直接抛错走 400 分支
              await mkdir(runtime.storageDir, { recursive: true })
              await atomicWriteFile(metaFile, text)
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
              res.end(OK({}))
              return
            }
            // 默认 GET：读取元数据；文件缺失时容错地返回空对象
            const data = await readFile(metaFile, 'utf8').catch(() => '{}')
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(data)
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(JSON.stringify({ ok: false, error: (error as Error).message }))
          }
        },
      },
     {
       kind: 'exact',
       path: '/bga-dsh-workbench/open',
       handler: async (req, res) => {
         try {
           const body = await readBody(req, 16 * 1024)
           const parsed = JSON.parse(body.toString('utf8')) as Record<string, unknown>
           const kind = parsed.kind
           const path = parsed.path
           if (!isOpenKind(kind) && !isExtraOpenKind(kind)) {
             throw new Error('kind must be one of: finder, terminal, vscode, or an extra IDE kind')
           }
           if (typeof path !== 'string' || path.length === 0) {
             throw new Error('path must be a non-empty string')
           }
           if (!isAbsolute(path)) {
             throw new Error('path must be an absolute filesystem path')
           }
           // 读取当前设置的打开偏好（实时生效），传入 openPathIn 决定候选命令
           const openConfig = runtime.resolve().open
           const preference: OpenPreference = {
             terminal: openConfig.terminal.length > 0 ? openConfig.terminal : undefined,
             editor: openConfig.editor.length > 0 ? openConfig.editor : undefined,
           }
           // kind 为附加 IDE 时走其独立打开执行；否则走原有 openPathIn（含偏好链）
           const result = isExtraOpenKind(kind)
             ? await openExtraPathIn(kind, path)
             : await openPathIn(kind, path, { preference })
           if (result.ok) {
             res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
             res.end(OK({}))
           } else {
             res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
             res.end(JSON.stringify({ ok: false, error: result.error ?? 'failed to open' }))
           }
         } catch (error) {
           res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
           res.end(JSON.stringify({ ok: false, error: (error as Error).message }))
         }
       },
     },
   ]
 }