// ============================================================
// workbench-meta-routes.spec.ts —— 工作台元数据端点测试
// ============================================================
// 覆盖：GET 读取（缺失文件回退 '{}'）、POST 写入并落盘、非法 JSON 400、
// M2 扩展字段（周起始/分类/提醒）完整持久化。
import { EventEmitter } from 'node:events'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import type { ServerResponse } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createWorkbenchRoutes, type WorkbenchRuntime } from '../src/routes.ts'
import { DEFAULT_TEXT } from '../src/index.ts'

const cleanups: Array<() => Promise<void>> = []
async function tempDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'bga-meta-'))
  cleanups.push(() => rm(dir, { recursive: true, force: true }))
  return dir
}
afterEach(async () => {
  while (cleanups.length > 0) await cleanups.pop()!()
})

function fakeRuntime(storageDir: string): WorkbenchRuntime {
  return {
    storageDir,
    resolve: () => ({
      banner: { avatarPath: '', text: DEFAULT_TEXT, show: true },
      confetti: { sound: true },
      open: { terminal: '', editor: '' },
      openExtra: {},
    }),
    updateSettings: async () => {},
    saveAvatar: async () => '/tmp/none.png',
  }
}

function capture() {
  const calls: Array<{ status: number; body?: Buffer | string }> = []
  const res = {
    writeHead(status: number): void { calls.push({ status }) },
    end(body?: Buffer | string): void { calls[0]!.body = body },
  }
  return { res: res as unknown as ServerResponse, calls }
}

function fakeRequest(method: string, chunks: Buffer[] = []) {
  const stream = new EventEmitter() as Parameters<WorkbenchRuntime['resolve']> extends never ? never : EventEmitter & { method: string }
  ;(stream as unknown as { method: string }).method = method
  const pushAll = (): void => {
    for (const chunk of chunks) stream.emit('data', chunk)
    stream.emit('end')
  }
  return { req: stream as unknown as import('node:http').IncomingMessage, pushAll }
}

describe('workbench-meta route', () => {
  it('GET：文件缺失时返回 200 与空对象', async () => {
    const rt = fakeRuntime(await tempDir())
    const route = createWorkbenchRoutes(rt).find(r => r.path === '/bga-dsh-workbench/workbench-meta')!
    const { req, pushAll } = fakeRequest('GET')
    const { res, calls } = capture()
    const promise = route.handler(req, res)
    pushAll()
    await promise
    expect(calls[0]?.status).toBe(200)
    expect(String(calls[0]!.body)).toBe('{}')
  })

  it('POST：写入文件，GET 可读回', async () => {
    const dir = await tempDir()
    const rt = fakeRuntime(dir)
    const route = createWorkbenchRoutes(rt).find(r => r.path === '/bga-dsh-workbench/workbench-meta')!

    const payload = JSON.stringify({ dayDoneAt: { '2018-08-20': 123 }, updatedAt: 123 })
    const { req, pushAll } = fakeRequest('POST', [Buffer.from(payload, 'utf8')])
    const { res, calls } = capture()
    const promise = route.handler(req, res)
    pushAll()
    await promise
    expect(calls[0]?.status).toBe(200)

    const onDisk = await readFile(join(dir, 'workbench-meta.json'), 'utf8')
    expect(JSON.parse(onDisk)).toEqual({ dayDoneAt: { '2018-08-20': 123 }, updatedAt: 123 })

    const { req: req2, pushAll: pushAll2 } = fakeRequest('GET')
    const { res: res2, calls: calls2 } = capture()
    const promise2 = route.handler(req2, res2)
    pushAll2()
    await promise2
    expect(String(calls2[0]!.body)).toBe(payload)
  })

  it('POST：非法 JSON 返回 400 且不落盘', async () => {
    const dir = await tempDir()
    const rt = fakeRuntime(dir)
    const route = createWorkbenchRoutes(rt).find(r => r.path === '/bga-dsh-workbench/workbench-meta')!

    const { req, pushAll } = fakeRequest('POST', [Buffer.from('{not-json', 'utf8')])
    const { res, calls } = capture()
    const promise = route.handler(req, res)
    pushAll()
    await promise
    expect(calls[0]?.status).toBe(400)

    await expect(readFile(join(dir, 'workbench-meta.json'), 'utf8')).rejects.toThrow()
  })

  it('POST：M2 扩展字段（周起始/分类/提醒）完整持久化', async () => {
    const dir = await tempDir()
    const rt = fakeRuntime(dir)
    const route = createWorkbenchRoutes(rt).find(r => r.path === '/bga-dsh-workbench/workbench-meta')!

    const payload = JSON.stringify({
      dayDoneAt: {},
      updatedAt: 1,
      weekStart: 'sunday',
      categories: [
        { id: 'business', label: '业务/技术需求' },
        { id: 'collab', label: '协同支持' },
      ],
      reminder: { enabled: true, cron: '0 21 * * *' },
    })
    const { req, pushAll } = fakeRequest('POST', [Buffer.from(payload, 'utf8')])
    const { res, calls } = capture()
    const promise = route.handler(req, res)
    pushAll()
    await promise
    expect(calls[0]?.status).toBe(200)

    const onDisk = JSON.parse(await readFile(join(dir, 'workbench-meta.json'), 'utf8'))
    expect(onDisk.weekStart).toBe('sunday')
    expect(onDisk.categories).toHaveLength(2)
    expect(onDisk.reminder).toEqual({ enabled: true, cron: '0 21 * * *' })
  })
})