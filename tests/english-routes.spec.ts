// ============================================================
// english-routes.spec.ts —— 英语学习 HTTP 路由测试
// ============================================================
// 测试对象：src/english/routes.ts 的 createEnglishRoutes。
// 重点覆盖「按主题直接生成词库」链路（对应设置页的模型生成按钮）：
//   - POST /generate 调用宿主注入的 generateText（一次临时 llm 请求，无 agent 会话），
//     解析返回并落盘，最终返回完整 state —— 设置页据此「生成完就直接刷新」。
//   - 其它路由（state / cards(内置) / select / next / result / import / reset）。
// 复用 routes.spec.ts 的 capture / fakeRequest 约定（vitest node 环境）。
import { EventEmitter } from 'node:events'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import type { ServerResponse } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createEnglishRoutes } from '../src/english/routes.ts'
import { ENGLISH_FILE } from '../src/english/store.ts'

const cleanups: Array<() => Promise<void>> = []

async function tempDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'bga-english-'))
  cleanups.push(() => rm(dir, { recursive: true, force: true }))
  return dir
}

afterEach(async () => {
  while (cleanups.length > 0) await cleanups.pop()!()
})

/** Fake ServerResponse that records writeHead + body. */
function capture() {
  const calls: Array<{ status: number; body?: string }> = []
  const res = {
    writeHead(status: number): void { calls.push({ status }) },
    end(body?: string): void { calls[0]!.body = String(body ?? '') },
  }
  return { res: res as unknown as ServerResponse, calls }
}

function parsed(calls: Array<{ body?: string }>): Record<string, unknown> {
  return JSON.parse(String(calls[0]!.body)) as Record<string, unknown>
}

/**
 * Build a POST request that mimics an IncomingMessage readable: emits the JSON
 * body via 'data'/'end' events AND supports `for await (chunk of req)` (the
 * english routes read bodies via async iteration).
 */
async function postRequest(body?: unknown) {
  const buf = Buffer.from(body === undefined ? '' : JSON.stringify(body), 'utf8')
  const stream = new EventEmitter() as EventEmitter & { method: string }
  stream.method = 'POST'
  // Async-iterable view: yields the body once then ends.
  ;(stream as unknown as { [Symbol.asyncIterator](): AsyncIterator<Buffer> })[Symbol.asyncIterator] = function () {
    let emitted = false
    return {
      next: async () => {
        if (!emitted) {
          emitted = true
          return { done: false, value: buf }
        }
        return { done: true, value: undefined }
      },
    }
  }
  return stream
}

/** Find an exact-path route by its trailing path segment. */
function byPath(rt: ReturnType<typeof createEnglishRoutes>, suffix: string) {
  const r = rt.find(route => route.path?.endsWith(suffix))
  if (r === undefined) throw new Error(`route not found: ${suffix}`)
  return r
}

/** Adopt a built-in CEFR A1 card into the ledger; returns its card id. */
async function adoptA1(rt: ReturnType<typeof createEnglishRoutes>): Promise<string> {
  const { res, calls } = capture()
  await byPath(rt, '/cards').handler(await postRequest({ builtin: 'cefr-a1' }), res)
  const state = (parsed(calls).state as { cards: Array<{ id: string; topic: string }> })
  const a1 = state.cards.find(c => c.topic === 'A1 基础')!
  return a1.id
}

describe('english routes: /state /cards', () => {
  it('GET /state returns an empty healthy default on first run', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const { res, calls } = capture()
    await byPath(rt, '/state').handler({} as never, res)
    const body = parsed(calls)
    expect(body.ok).toBe(true)
    const state = body.state as { cards: unknown[]; xp: number; day: { hearts: number } }
    expect(state.cards).toHaveLength(1)
    expect(state.cards[0]!.topic).toBe('Basic English 850')
    expect((state.cards[0] as { locked?: boolean }).locked).toBe(true)
    expect(state.xp).toBe(0)
    expect(state.day.hearts).toBe(5)
  })

  it('POST /cards adopts a built-in CEFR list and creates a card', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const { res, calls } = capture()
    await byPath(rt, '/cards').handler(await postRequest({ builtin: 'cefr-a1' }), res)
    const body = parsed(calls)
    expect(body.ok).toBe(true)
    const state = body.state as { cards: Array<{ topic: string; items: unknown[] }> }
    expect(state.cards).toHaveLength(2)
    expect(state.cards[1]!.topic).toBe('A1 基础')
    expect(state.cards[1]!.items).toHaveLength(30)
  })

  it('rejects an unknown builtin id', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const { res, calls } = capture()
    await byPath(rt, '/cards').handler(await postRequest({ builtin: 'nope' }), res)
    expect(parsed(calls).ok).toBe(false)
  })
})

describe('english routes: /generate 直接大模型生成', () => {
  // A default model is configured, so the route resolves a selection automatically.
  const withDefault = { currentSelection: () => ({ provider: 'test', model: 'model-1' }) }

  it('calls generateText once with the resolved selection, parses JSON, persists, and returns fresh state', async () => {
    const dir = await tempDir()
    const generateText = vi.fn(async () => JSON.stringify([
      { text: 'artificial', meaning: '人工的', example: 'This is artificial.' },
      { text: 'intelligence', meaning: '智能', example: 'We study intelligence.' },
    ]))
    const rt = createEnglishRoutes({ storageDir: dir, generateText, ...withDefault })
    const { res, calls } = capture()
    await byPath(rt, '/generate').handler(
      await postRequest({ topic: '人工智能', mode: 'recall', mastery: 'srs', threshold: 3 }), res,
    )
    expect(generateText).toHaveBeenCalledTimes(1)
    expect(generateText).toHaveBeenCalledWith('人工智能', { provider: 'test', model: 'model-1' }, undefined, undefined)
    const body = parsed(calls)
    expect(body.ok).toBe(true)
    const state = body.state as { cards: Array<{ topic: string; mode: string; mastery: string; items: Array<{ text: string }> }> }
    expect(state.cards).toHaveLength(2)
    const genCard = state.cards.find(c => c.topic === '人工智能')
    expect(genCard).toBeDefined()
    expect(genCard!.mode).toBe('recall')
    expect(genCard!.mastery).toBe('srs')
    expect(genCard!.items.map(i => i.text)).toEqual(['artificial', 'intelligence'])
  })

  it('accepts an explicit provider/model from the body (overrides the default)', async () => {
    const dir = await tempDir()
    const generateText = vi.fn(async () => '[{"text":"hello","meaning":"你好"}]')
    const rt = createEnglishRoutes({ storageDir: dir, generateText, ...withDefault })
    const { res, calls } = capture()
    await byPath(rt, '/generate').handler(
      await postRequest({ topic: '旅行', provider: 'other', model: 'chosen' }), res,
    )
    expect(generateText).toHaveBeenCalledWith('旅行', { provider: 'other', model: 'chosen' }, undefined, undefined)
    expect(parsed(calls).ok).toBe(true)
  })

  it('rejects an empty topic before calling the model', async () => {
    const dir = await tempDir()
    const generateText = vi.fn()
    const rt = createEnglishRoutes({ storageDir: dir, generateText, ...withDefault })
    const { res, calls } = capture()
    await byPath(rt, '/generate').handler(await postRequest({ topic: '   ' }), res)
    expect(generateText).not.toHaveBeenCalled()
    expect(parsed(calls).ok).toBe(false)
  })

  it('fails cleanly when the host has no generator wired', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir, ...withDefault }) // no generateText
    const { res, calls } = capture()
    await byPath(rt, '/generate').handler(await postRequest({ topic: '旅行' }), res)
    const body = parsed(calls)
    expect(body.ok).toBe(false)
    expect(String(body.error)).toContain('不支持直接生成')
  })

  it('fails with a clear prompt when no default model and no explicit model are available', async () => {
    const dir = await tempDir()
    const generateText = vi.fn()
    const rt = createEnglishRoutes({ storageDir: dir, generateText }) // no currentSelection
    const { res, calls } = capture()
    await byPath(rt, '/generate').handler(await postRequest({ topic: '旅行' }), res)
    const body = parsed(calls)
    expect(body.ok).toBe(false)
    expect(String(body.error)).toContain('未配置默认模型')
    expect(generateText).not.toHaveBeenCalled()
  })

  it('fails cleanly when the model returns an empty reply', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir, generateText: async () => undefined, ...withDefault })
    const { res, calls } = capture()
    await byPath(rt, '/generate').handler(await postRequest({ topic: '旅行' }), res)
    const body = parsed(calls)
    expect(body.ok).toBe(false)
    expect(String(body.error)).toContain('模型生成失败')
  })

  it('fails cleanly when the model returns non-JSON gibberish', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir, generateText: async () => '不好意思，我不会', ...withDefault })
    const { res, calls } = capture()
    await byPath(rt, '/generate').handler(await postRequest({ topic: '旅行' }), res)
    const body = parsed(calls)
    expect(body.ok).toBe(false)
    expect(String(body.error)).toContain('不是有效的词库 JSON')
  })

  it('persists the generated card to english-data.json', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir, generateText: async () => '[{"text":"hello","meaning":"你好"}]', ...withDefault })
    const { res, calls } = capture()
    await byPath(rt, '/generate').handler(await postRequest({ topic: '问候' }), res)
    expect(parsed(calls).ok).toBe(true)
    const stored = JSON.parse(await readFile(join(dir, ENGLISH_FILE), 'utf8')) as { cards: Array<{ topic: string }> }
    expect(stored.cards.find(c => c.topic === '问候')).toBeDefined()
  })
})

describe('english routes: /models /default-model', () => {
  it('GET /models lists providers/models and reflects the current default', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({
      storageDir: dir,
      listModels: async () => [
        { provider: 'a', providerName: 'Alpha', models: [{ id: 'a1', name: 'Alpha One' }] },
        { provider: 'b', providerName: 'Beta', models: [{ id: 'b1', name: 'Beta One' }] },
      ],
      currentSelection: () => ({ provider: 'b', model: 'b1' }),
    })
    const { res, calls } = capture()
    await byPath(rt, '/models').handler({} as never, res)
    const body = parsed(calls)
    expect(body.ok).toBe(true)
    expect(body.hasDefault).toBe(true)
    expect((body.current as { provider: string }).provider).toBe('b')
    expect((body.providers as Array<{ provider: string }>)).toHaveLength(2)
  })

  it('POST /default-model persists the chosen selection via saveSelection', async () => {
    const dir = await tempDir()
    const saveSelection = vi.fn(async () => {})
    const rt = createEnglishRoutes({ storageDir: dir, saveSelection })
    const { res, calls } = capture()
    await byPath(rt, '/default-model').handler(await postRequest({ provider: 'a', model: 'a1' }), res)
    expect(saveSelection).toHaveBeenCalledWith({ provider: 'a', model: 'a1' })
    expect(parsed(calls).ok).toBe(true)
  })

  it('POST /default-model rejects a missing provider/model', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const { res, calls } = capture()
    await byPath(rt, '/default-model').handler(await postRequest({ provider: 'a' }), res)
    expect(parsed(calls).ok).toBe(false)
  })
})

describe('english routes: /select /next /result /reset', () => {
  it('POST /select sets the current card', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const cardId = await adoptA1(rt)
    const { res, calls } = capture()
    await byPath(rt, '/select').handler(await postRequest({ cardId }), res)
    const body = parsed(calls)
    expect(body.ok).toBe(true)
    expect((body.state as { currentCardId: string | null }).currentCardId).toBe(cardId)
  })

  it('GET /next returns a question and POST /result grades it correct', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const cardId = await adoptA1(rt)
    await byPath(rt, '/select').handler(await postRequest({ cardId }), { writeHead() {}, end() {} } as never)

    const { res: qRes, calls: qCalls } = capture()
    await byPath(rt, '/next').handler({} as never, qRes)
    const q = (parsed(qCalls).question as { itemId: string; cardId: string; answer: string; mode: string } | null)
    expect(q).toBeTruthy()

    const { res: rRes, calls: rCalls } = capture()
    await byPath(rt, '/result').handler(
      await postRequest({ itemId: q!.itemId, cardId: q!.cardId, answer: q!.answer, mode: q!.mode }), rRes,
    )
    const r = parsed(rCalls) as { result: { ok: string; xpDelta: number } }
    expect(r.result.ok).toBe('correct')
    expect(r.result.xpDelta).toBe(10)
  })

  it('POST /reset wipes the ledger back to default', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    await adoptA1(rt)
    const { res, calls } = capture()
    await byPath(rt, '/reset').handler({} as never, res)
    const body = parsed(calls)
    expect(body.ok).toBe(true)
    const resetCards = (body.state as { cards: Array<{ topic: string; locked?: boolean }> }).cards
    expect(resetCards).toHaveLength(1)
    expect(resetCards[0]!.topic).toBe('Basic English 850')
    expect(resetCards[0]!.locked).toBe(true)
  })
})

describe('english routes: /cards/delete', () => {
  it('deletes a card and adjusts currentCardId', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const cardId = await adoptA1(rt)

    const { res, calls } = capture()
    await byPath(rt, '/cards/delete').handler(await postRequest({ cardId }), res)
    const body = parsed(calls)
    expect(body.ok).toBe(true)
    const state = body.state as { cards: Array<{ id: string }>; currentCardId: string | null }
    expect(state.cards).toHaveLength(1)
    expect(state.cards[0]!.topic).toBe('Basic English 850')
  })

  it('auto-selects next card when deleting the current one', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    // Adopt two different built-in lists
    const { res: r1 } = capture()
    await byPath(rt, '/cards').handler(await postRequest({ builtin: 'cefr-a1' }), r1)
    const { res: r2, calls: c2 } = capture()
    await byPath(rt, '/cards').handler(await postRequest({ builtin: 'cefr-a2' }), r2)
    const state2 = (parsed(c2).state as { cards: Array<{ id: string; topic: string }>; currentCardId: string })
    expect(state2.cards).toHaveLength(3)

    // Select the A2 card as current (can't delete the locked Basic English 850)
    const a2Card = state2.cards.find(c => c.topic === 'A2 初级')!
    const { res: sRes } = capture()
    await byPath(rt, '/select').handler(await postRequest({ cardId: a2Card.id }), sRes)

    // Delete the current card (A2)
    const { res: dRes, calls: dCalls } = capture()
    await byPath(rt, '/cards/delete').handler(await postRequest({ cardId: a2Card.id }), dRes)
    const dBody = parsed(dCalls)
    expect(dBody.ok).toBe(true)
    const dState = dBody.state as { cards: Array<{ id: string }>; currentCardId: string }
    expect(dState.cards).toHaveLength(2)
  })

  it('rejects missing cardId', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const { res, calls } = capture()
    await byPath(rt, '/cards/delete').handler(await postRequest({}), res)
    expect(parsed(calls).ok).toBe(false)
  })

  it('rejects non-existent cardId', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const { res, calls } = capture()
    await byPath(rt, '/cards/delete').handler(await postRequest({ cardId: 'no-such-id' }), res)
    expect(parsed(calls).ok).toBe(false)
  })
})

describe('english routes: /cards/update', () => {
  it('updates mode/mastery/threshold without resetting progress', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const cardId = await adoptA1(rt)

    const { res, calls } = capture()
    await byPath(rt, '/cards/update').handler(
      await postRequest({ cardId, mode: 'recall', mastery: 'count', threshold: 5 }), res,
    )
    const body = parsed(calls)
    expect(body.ok).toBe(true)
    const allCards = (body.state as { cards: Array<{ id: string; mode: string; mastery: string; threshold: number }> }).cards
    const card = allCards.find(c => c.id === cardId)!
    expect(card.mode).toBe('recall')
    expect(card.mastery).toBe('count')
    expect(card.threshold).toBe(5)
    // Items and progress are preserved
    const fullCard = (body.state as { cards: Array<{ id: string; items: unknown[] }> }).cards.find(c => c.id === cardId)!
    expect(fullCard.items.length).toBeGreaterThan(0)
  })

  it('partial update only changes provided fields', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const cardId = await adoptA1(rt)

    const { res, calls } = capture()
    await byPath(rt, '/cards/update').handler(await postRequest({ cardId, mode: 'audio' }), res)
    const body = parsed(calls)
    const card = (body.state as { cards: Array<{ id: string; mode: string; mastery: string }> }).cards.find(c => c.id === cardId)!
    expect(card.mode).toBe('audio')
    expect(card.mastery).toBe('count') // unchanged default for builtin
  })

  it('rejects missing cardId', async () => {
    const dir = await tempDir()
    const rt = createEnglishRoutes({ storageDir: dir })
    const { res, calls } = capture()
    await byPath(rt, '/cards/update').handler(await postRequest({}), res)
    expect(parsed(calls).ok).toBe(false)
  })
})
