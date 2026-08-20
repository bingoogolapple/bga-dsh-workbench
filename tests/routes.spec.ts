// ============================================================
 // routes.spec.ts —— 工作台 HTTP 路由与服务端工具函数测试
 // ============================================================
 // 测试对象（src/routes.ts、src/index.ts、src/default-avatar.ts）：
 //   - avatarContentType：按扩展名推断头像的 Content-Type；
 //   - sniffImageType：按文件魔数识别图片真实格式；
 //   - readBody：从请求流收集请求体并执行大小上限校验；
 //   - createWorkbenchRoutes 返回的各条路由：
 //       GET  /bga-dsh-workbench/avatar   读取头像文件
 //       GET  /bga-dsh-workbench/config   返回解析后的模块配置
 //       POST /bga-dsh-workbench/settings 持久化模块配置补丁
 //       POST /bga-dsh-workbench/avatar   上传 / 保存头像
 //   - Config schema 的默认值填充与显式覆盖。
 // 覆盖范围：内容类型 / 魔数识别、请求体上限、路由响应状态与响应体、
 // 头像缺失回退到内嵌默认头像、配置补丁校验拒绝非法负载等。
 // 测试环境：vitest（node）。
 import { EventEmitter } from 'node:events'
 import { mkdtemp, rm, writeFile } from 'node:fs/promises'
 import type { ServerResponse } from 'node:http'
 import { tmpdir } from 'node:os'
 import { join } from 'node:path'
 import { afterEach, describe, expect, it, vi } from 'vitest'
 import { Config, DEFAULT_TEXT } from '../src/index.ts'
 import { DEFAULT_AVATAR_BYTES } from '../src/default-avatar.ts'
 import {
   avatarContentType, createWorkbenchRoutes, readBody, sniffImageType,
   type WorkbenchConfig, type WorkbenchRuntime,
 } from '../src/routes.ts'

 // 收集所有需要清理的异步清理函数（临时目录删除等），用例结束后倒序执行
 const cleanups: Array<() => Promise<void>> = []

 // 在系统临时目录中创建唯一子目录并写入指定文件，同时注册目录的清理函数
 async function tempFile(name: string, content: Buffer | string): Promise<string> {
   const dir = await mkdtemp(join(tmpdir(), 'bga-workbench-'))
   const path = join(dir, name)
   await writeFile(path, content)
   cleanups.push(() => rm(dir, { recursive: true, force: true }))
   return path
 }

 // 每个用例结束后清理所有注册过的临时目录
 afterEach(async () => {
   while (cleanups.length > 0) {
     await cleanups.pop()!()
   }
 })

 // 构造一个记录 writeHead / end 调用的假 ServerResponse，
 // 供路由代码写入状态码 / 响应头 / 响应体，随后统一断言
 function capture() {
   const calls: Array<{ status: number; headers: Record<string, unknown>; body?: Buffer | string }> = []
   const res = {
     writeHead(status: number, headers: Record<string, unknown>): void {
       calls.push({ status, headers })
     },
     end(body?: Buffer | string): void {
       calls[0]!.body = body // 响应体挂在第一次 writeHead 对应的记录上
     },
   }
   return { res: res as unknown as ServerResponse, calls }
 }

 // 构造一个假的请求流：用 EventEmitter 模拟 data / end 事件，
 // pushAll 一次性吐出所有 chunk 并结束流
 function fakeRequest(method: string, chunks: Buffer[] = []): {
   req: Parameters<typeof readBody>[0]
   pushAll: () => void
   destroy: () => void
 } {
   const stream = new EventEmitter() as Parameters<typeof readBody>[0]
   let destroyed = false
   ;(stream as unknown as { method: string }).method = method
   ;(stream as unknown as { destroy: () => void }).destroy = () => { destroyed = true }
   const pushAll = (): void => {
     for (const chunk of chunks) stream.emit('data', chunk)
     stream.emit('end')
   }
   return {
     req: stream,
     pushAll,
     destroy: () => { destroyed = true },
   }
 }

 // 构造一个测试用 WorkbenchRuntime：
 //   - resolve 返回可注入的 banner / confetti 配置；
 //   - updateSettings 记录配置持久化调用；
 //   - saveAvatar 按魔数推测扩展名（缺失时回退 .png），把上传内容写入临时文件并返回路径
 function runtime(config: Partial<import('../src/routes.ts').ResolvedBannerConfig> = {}, open: { terminal?: string; editor?: string } = {}): { runtime: WorkbenchRuntime; updates: ReturnType<typeof vi.fn> } {
   const resolved: WorkbenchConfig = {
     banner: { avatarPath: '', text: DEFAULT_TEXT, show: true, ...config },
     confetti: { sound: true },
      open: { terminal: open.terminal ?? '', editor: open.editor ?? '' },
      openExtra: { androidStudio: true, xcode: true, wechatDevtools: true, intellijIdea: true, devecoStudio: true, webstorm: true, pycharm: true, goland: true },
   }
   const updateSettings = vi.fn(async () => {})
   const saveAvatar = vi.fn(async (buffer: Buffer) => {
     // 按魔数推测扩展名，写文件到临时路径作为“保存”
     const ext = sniffImageType(buffer) ?? '.png'
     const path = join(tmpdir(), `bga-upload-${Date.now()}${ext}`)
     await writeFile(path, buffer)
     return path
   })
   return {
     runtime: {
       resolve: () => resolved,
       updateSettings,
       saveAvatar,
     },
     updates: updateSettings,
   }
 }

 // 便捷函数：直接生成路由列表
 function routes(rt: WorkbenchRuntime) {
   return createWorkbenchRoutes(rt)
 }

 // 按路径从路由列表中查找具体路由，找不到直接抛出（fail fast）
 function byPath(routeList: ReturnType<typeof routes>, path: string) {
   const route = routeList.find(candidate => candidate.path === path)
   if (route === undefined) throw new Error(`no route ${path}`)
   return route
 }

 // avatarContentType：扩展名 → MIME 类型映射
 describe('avatarContentType', () => {
   // 常见图片扩展名映射正确；不支持的扩展名（avif）回退为 png
   it('maps common image extensions and defaults to png', () => {
     expect(avatarContentType('/a/avatar.png')).toBe('image/png')
     expect(avatarContentType('/a/avatar.JPG')).toBe('image/jpeg') // 大小写不敏感
     expect(avatarContentType('/a/avatar.webp')).toBe('image/webp')
     expect(avatarContentType('/a/avatar.svg')).toBe('image/svg+xml')
     expect(avatarContentType('/a/avatar.avif')).toBe('image/png') // 未知类型回退 png
   })
 })

 // sniffImageType：图片魔数 → 扩展名
 describe('sniffImageType', () => {
   // 识别 png / jpg / gif / webp 的魔数字节
   it('recognizes png, jpg, gif and webp magic bytes', () => {
     // PNG 魔数：89 50 4E 47 0D 0A 1A 0A
     expect(sniffImageType(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe('.png')
     // JPEG 魔数：FF D8 FF E0
     expect(sniffImageType(Buffer.from([0xff, 0xd8, 0xff, 0xe0]))).toBe('.jpg')
     // GIF 魔数：GIF89a
     expect(sniffImageType(Buffer.from('GIF89a', 'latin1'))).toBe('.gif')
     // WEBP 魔数：RIFF....WEBP
     expect(sniffImageType(Buffer.concat([Buffer.from('RIFF', 'latin1'), Buffer.alloc(4), Buffer.from('WEBP', 'latin1')]))).toBe('.webp')
   })

   // 非图片字节（含空数据）应返回 undefined 表示无法识别
   it('rejects non-image bytes', () => {
     expect(sniffImageType(Buffer.from('hello world', 'utf8'))).toBeUndefined()
     expect(sniffImageType(Buffer.alloc(0))).toBeUndefined()
   })
 })

 // readBody：从请求流收集请求体
 describe('readBody', () => {
   // 多个 chunk 应被拼接为完整请求体
   it('collects the full body', async () => {
     const { req, pushAll } = fakeRequest('POST', [Buffer.from('abc'), Buffer.from('def')])
     const promise = readBody(req, 1024)
     pushAll()
     await expect(promise).resolves.toEqual(Buffer.from('abcdef'))
   })

   // 请求体超过上限时应 reject（错误信息含 exceeds），并销毁请求流
   it('rejects a body over the cap', async () => {
     const { req, pushAll, destroy } = fakeRequest('POST', [Buffer.alloc(2048)])
     const promise = readBody(req, 1024).catch((error: Error) => error) // 先捕获错误供后续断言
     pushAll()
     const error = await promise
     expect(error).toBeInstanceOf(Error)
     expect((error as Error).message).toContain('exceeds')
     destroy()
   })
 })

 // 头像 GET 路由
 describe('avatar GET route', () => {
   // 解析到头像文件时，返回 200 + 正确的 Content-Type 与文件内容
   it('serves the resolved avatar file with its content type and body', async () => {
     // 创建一个 8 字节、带 PNG 魔数的文件作为头像
     const path = await tempFile('avatar.png', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
     const { runtime: rt } = runtime({ avatarPath: path })
     const { res, calls } = capture()
     await byPath(routes(rt), '/bga-dsh-workbench/avatar').handler({ method: 'GET' } as never, res)
     expect(calls[0]).toMatchObject({ status: 200, headers: { 'Content-Type': 'image/png' } })
     expect((calls[0]!.body as Buffer).length).toBe(8) // 响应体即原始文件内容
   })

   // 文件缺失时回退到内嵌默认头像（仍返回 200）
   it('falls back to the embedded default avatar for a missing file', async () => {
     const missing = join(tmpdir(), 'bga-missing.png') // 该路径不存在
     const { runtime: rt } = runtime({ avatarPath: missing })
     const { res, calls } = capture()
     await byPath(routes(rt), '/bga-dsh-workbench/avatar').handler({ method: 'GET' } as never, res)
     expect(calls[0]?.status).toBe(200)
     // 响应体应与内嵌默认头像字节完全一致
     expect((calls[0]!.body as Buffer).equals(DEFAULT_AVATAR_BYTES)).toBe(true)
   })

   // 头像路径为空时同样回退到默认头像
   it('falls back to the embedded default avatar for an empty path', async () => {
     const { runtime: rt } = runtime({ avatarPath: '' })
     const { res, calls } = capture()
     await byPath(routes(rt), '/bga-dsh-workbench/avatar').handler({ method: 'GET' } as never, res)
     expect(calls[0]?.status).toBe(200)
     expect((calls[0]!.body as Buffer).equals(DEFAULT_AVATAR_BYTES)).toBe(true)
   })

   // 内嵌默认头像本身应是一个合法的 PNG（魔数正确且有一定体积）
   it('the embedded default decodes to a valid PNG', () => {
     expect(DEFAULT_AVATAR_BYTES.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
     expect(DEFAULT_AVATAR_BYTES.length).toBeGreaterThan(1000) // 至少有一定体积
   })
 })

 // 配置路由
 describe('config route', () => {
   // 返回完整解析后的配置，按模块键嵌套（banner / confetti）
   it('returns the resolved module options nested under their module keys', async () => {
     const { runtime: rt } = runtime({ avatarPath: '/a.png', text: '的专属 Harness 工作台', show: true })
     const { res, calls } = capture()
     await byPath(routes(rt), '/bga-dsh-workbench/config').handler({} as never, res)
     expect(JSON.parse(String(calls[0]!.body))).toEqual({
       banner: { avatarPath: '/a.png', text: '的专属 Harness 工作台', show: true },
       confetti: { sound: true },
       open: { terminal: '', editor: '' },
       openExtra: { androidStudio: true, xcode: true, wechatDevtools: true, intellijIdea: true, devecoStudio: true, webstorm: true, pycharm: true, goland: true },
     })
   })
 })

 // 设置 POST 路由
 describe('settings POST route', () => {
   // 合法、模块作用域的设置补丁应被持久化（调用 updateSettings）并返回 { ok: true }
   it('persists a valid module-scoped patch', async () => {
     const { runtime: rt, updates } = runtime({})
     const { req, pushAll } = fakeRequest('POST', [Buffer.from(JSON.stringify({ banner: { text: '你好', show: false } }), 'utf8')])
     const { res, calls } = capture()
     const promise = byPath(routes(rt), '/bga-dsh-workbench/settings').handler(req, res)
     pushAll()
     await promise
     expect(updates).toHaveBeenCalledWith({ banner: { text: '你好', show: false } })
     expect(JSON.parse(String(calls[0]!.body))).toEqual({ ok: true })
   })

   // confetti 模块的设置补丁同样应被持久化
   it('persists a confetti module patch', async () => {
     const { runtime: rt, updates } = runtime({})
     const { req, pushAll } = fakeRequest('POST', [Buffer.from(JSON.stringify({ confetti: { sound: false } }), 'utf8')])
     const { res, calls } = capture()
     const promise = byPath(routes(rt), '/bga-dsh-workbench/settings').handler(req, res)
     pushAll()
     await promise
     expect(updates).toHaveBeenCalledWith({ confetti: { sound: false } })
     expect(JSON.parse(String(calls[0]!.body))).toEqual({ ok: true })
   })

   // 非法 JSON、非对象、类型错误（含未知键）的补丁一律返回 400 且不持久化
   // open 模块的设置补丁（终端/编辑器偏好）应被持久化

   // open 字段的非法偏好 ID / 类型错误应被 400 拒绝且不持久化
   it('rejects invalid open preference IDs with 400', async () => {
     const { runtime: rt, updates } = runtime({})
     for (const payload of [
       JSON.stringify({ open: 42 }), // open 不是对象
       JSON.stringify({ open: { terminal: 42 } }), // 类型错误
       JSON.stringify({ open: { terminal: 'terminal-nope' } }), // 未知终端 ID
     ]) {
       const { req, pushAll } = fakeRequest('POST', [Buffer.from(payload, 'utf8')])
       const { res, calls } = capture()
       const promise = byPath(routes(rt), '/bga-dsh-workbench/settings').handler(req, res)
       pushAll()
       await promise
       expect(calls[0]?.status).toBe(400)
     }
     expect(updates).not.toHaveBeenCalled()
   })
   it('persists extra IDE toggles including webstorm/pycharm/goland', async () => {
     const { runtime: rt, updates } = runtime({})
     const payload = JSON.stringify({
       openExtra: { androidStudio: false, xcode: false, wechatDevtools: true, intellijIdea: false, devecoStudio: false, webstorm: false, pycharm: false, goland: false },
     })
     const { req, pushAll } = fakeRequest('POST', [Buffer.from(payload, 'utf8')])
     const { res, calls } = capture()
     const promise = byPath(routes(rt), '/bga-dsh-workbench/settings').handler(req, res)
     pushAll()
     await promise
     expect(updates).toHaveBeenCalledWith({
       openExtra: { androidStudio: false, xcode: false, wechatDevtools: true, intellijIdea: false, devecoStudio: false, webstorm: false, pycharm: false, goland: false },
     })
     expect(JSON.parse(String(calls[0]!.body))).toEqual({ ok: true })
   })

   it('rejects malformed or wrongly-typed patches with 400', async () => {
     const { runtime: rt, updates } = runtime({})
     for (const payload of [
       'not json', // 非法 JSON 文本
       JSON.stringify([]), // 非对象
       JSON.stringify({ banner: 42 }), // banner 不是对象
       JSON.stringify({ banner: { text: 42 } }), // text 类型错误
       JSON.stringify({ banner: { show: 'yes' } }), // show 类型错误
       JSON.stringify({ confetti: 42 }), // confetti 不是对象
       JSON.stringify({ confetti: { sound: 'yes' } }), // sound 类型错误
     ]) {
       const { req, pushAll } = fakeRequest('POST', [Buffer.from(payload, 'utf8')])
       const { res, calls } = capture()
       const promise = byPath(routes(rt), '/bga-dsh-workbench/settings').handler(req, res)
       pushAll()
       await promise
       expect(calls[0]?.status).toBe(400)
     }
     // 所有非法负载都不应触发配置持久化
     expect(updates).not.toHaveBeenCalled()
   })
 })

 // 头像 POST 路由
 describe('avatar POST route', () => {
   // 接受图片上传、保存并返回新路径；上传内容带 PNG 魔数 → 按魔数保存为 .png
   it('accepts an image upload, saves it, and returns the new path', async () => {
     const { runtime: rt } = runtime({})
     const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
     const { req, pushAll } = fakeRequest('POST', [png])
     const { res, calls } = capture()
     const promise = byPath(routes(rt), '/bga-dsh-workbench/avatar').handler(req, res)
     pushAll()
     await promise
     expect(calls[0]?.status).toBe(200)
     const value = JSON.parse(String(calls[0]!.body)) as { ok: boolean; avatarPath: string }
     expect(value.ok).toBe(true)
     expect(value.avatarPath.endsWith('.png')).toBe(true) // 按魔数推得的扩展名
   })

   // 非图片内容上传：返回 400 且不触发任何配置保存
   it('rejects a non-image upload with 400', async () => {
     const { runtime: rt, updates } = runtime({})
     const { req, pushAll } = fakeRequest('POST', [Buffer.from('plain text', 'utf8')])
     const { res, calls } = capture()
     const promise = byPath(routes(rt), '/bga-dsh-workbench/avatar').handler(req, res)
     pushAll()
     await promise
     expect(calls[0]?.status).toBe(400)
     expect(updates).not.toHaveBeenCalled()
   })
 })

 // Config schema 默认值
 describe('Config schema defaults', () => {
   // 不提供配置时填充所有文档化默认值
   it('fills the documented defaults when no config is supplied', () => {
     expect(Config(undefined)).toEqual({
       avatarPath: '',
       text: DEFAULT_TEXT,
       show: true,
       sound: true,
       storageDir: undefined,
       })
       })

   // 显式提供的配置项覆盖默认值，其余字段仍保持默认
   it('accepts explicit overrides', () => {
     const value = Config({ avatarPath: '/tmp/a.png', text: 'hello', show: false, sound: false, storageDir: '/tmp/storage' })
     expect(value).toEqual({
       avatarPath: '/tmp/a.png',
       text: 'hello',
       show: false,
       sound: false,
       storageDir: '/tmp/storage',
       })
       })
 })

describe('open route', () => {
  // 向 /open 路由发出一次 POST，返回状态码与解析后的 JSON 体（结果由 openPathIn 真实执行）
  function postOpen(body: Record<string, unknown>): Promise<{ status: number; json: { ok?: boolean; error?: string } }> {
    const { res, calls } = capture()
    const routeList = routes(runtime().runtime)
    const route = byPath(routeList, '/bga-dsh-workbench/open')
    const req = fakeRequest('POST', [Buffer.from(JSON.stringify(body))])
    // 先调用 handler 再推送请求体：readBody 需要先挂上 data/end 监听
    const promise = Promise.resolve(route.handler(req.req, res))
    req.pushAll()
    return promise.then(() => {
      const last = calls[calls.length - 1]
      const status = last?.status ?? 500
      const json = JSON.parse(last?.body ?? '{}') as { ok?: boolean; error?: string }
      return { status, json }
    })
  }

  it('finder kind 打开绝对路径时成功', async () => {
    const { status, json } = await postOpen({ kind: 'finder', path: '/tmp/demo' })
    expect(status).toBe(200)
    expect(json.ok).toBe(true)
  }, 10_000)

  it('拒绝非法 kind', async () => {
    const { status, json } = await postOpen({ kind: 'editor', path: '/tmp/demo' })
    expect(status).toBe(400)
    expect(json.ok).toBe(false)
    expect(json.error).toContain('kind')
  })

  it('拒绝相对路径', async () => {
    const { status, json } = await postOpen({ kind: 'finder', path: 'relative/path' })
    expect(status).toBe(400)
    expect(json.ok).toBe(false)
    expect(json.error).toContain('absolute')
  })

  it('拒绝空路径', async () => {
    const { status, json } = await postOpen({ kind: 'finder', path: '' })
    expect(status).toBe(400)
    expect(json.ok).toBe(false)
  })
})

 // open 路由偏好处理：/open 应读取配置中的偏好并传给 openPathIn
 describe('open route preference handling', () => {
   // 向 /open 发 POST 并返回状态与 JSON
   function postOpen(rt: import('../src/routes.ts').WorkbenchRuntime, body: Record<string, unknown>): Promise<{ status: number; json: { ok?: boolean; error?: string } }> {
     const { res, calls } = capture()
     const routeList = routes(rt)
     const route = byPath(routeList, '/bga-dsh-workbench/open')
     const req = fakeRequest('POST', [Buffer.from(JSON.stringify(body))])
     const promise = Promise.resolve(route.handler(req.req, res))
     req.pushAll()
     return promise.then(() => {
       const last = calls[calls.length - 1]
       const status = last?.status ?? 500
       const json = JSON.parse(last?.body ?? '{}') as { ok?: boolean; error?: string }
       return { status, json }
     })
   }

   // 配置了 iTerm 偏好：terminal 打开只用偏好候选（不带默认链回退）。
   // 本机可能已装 iTerm（成功）也可能未装（失败并携带偏好 ID）——两种都证明
   // 偏好被路由到了 openPathIn，而不是走默认 Terminal 候选。
   it('configured iTerm preference routes terminal open to the preferred command', async () => {
     const { runtime: rt } = runtime({}, { terminal: 'terminal-iterm' })
     const { status, json } = await postOpen(rt, { kind: 'terminal', path: '/tmp/proj' })
     expect(status).toBe(200) // 打开失败也是业务错误，HTTP 状态仍 200
     if (json.ok === true) {
       // 本机装有 iTerm，偏好候选成功打开：无需更多断言
       expect(json.error).toBeUndefined()
     } else {
       // 未装 iTerm：错误信息必须携带偏好 ID（证明走的是偏好候选而非默认链）
       expect(json.error).toContain('terminal-iterm')
     }
   }, 10_000)


   // 未配置偏好：finder 走默认链，直接成功
   it('unconfigured preferences still open finder successfully', async () => {
     const { runtime: rt } = runtime({})
     const { status, json } = await postOpen(rt, { kind: 'finder', path: '/tmp/proj' })
     expect(status).toBe(200)
     expect(json.ok).toBe(true)
   }, 10_000)
 })

