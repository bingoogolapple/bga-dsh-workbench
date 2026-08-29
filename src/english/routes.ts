/**
 * Host HTTP routes for the English-learning ledger.
 *
 * The host is the single source of truth for the game/quiz state machine:
 * every mutation (grade an answer, pick a question, select a card, import)
 * runs through `english/model.ts` pure functions and is persisted to
 * `english-data.json`. The browser only renders surfaces driven by these
 * routes, mirroring the tasks.json pattern in routes.ts.
 */
import { unlink } from 'node:fs/promises'
import { join } from 'node:path'
import type { IncomingMessage } from 'node:http'
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver'
import {
  buildQuestion, exportState, gradeAnswer, makeCard, makeDefaultState, parseImport,
  pickNextItem, publicState, type EnglishState,
} from './model.ts'
import { findBuiltinList } from './builtin.ts'
import { extractJson } from './generate.ts'
import { ENGLISH_FILE, ensureBasicEnglish850, loadEnglishState, saveEnglishState } from './store.ts'

const OK = (value: Record<string, unknown>): string => JSON.stringify({ ok: true, ...value })

/** Read a JSON body with a size cap and parse it. */
async function readJson(req: IncomingMessage, max: number): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    size += (chunk as Buffer).length
    if (size > max) throw new Error('request body too large')
    chunks.push(chunk as Buffer)
  }
  const text = Buffer.concat(chunks).toString('utf8')
  if (text.trim() === '') return undefined
  return JSON.parse(text)
}

/** Sanitise a topic string to a usable card name. */
export interface EnglishRuntime {
  storageDir: string
}

/**
 * Build the English-learning routes. `load`/`save` are injected so tests can
 * swap the backing store; defaults read/write the storage directory.
 */
export function createEnglishRoutes(options: {
  storageDir: string
  load?: (dir: string) => Promise<EnglishState>
  save?: (dir: string, state: EnglishState) => Promise<void>
  /** Direct-LLM generator callback (host provides ctx-bound impl). Returns the model's raw reply text. */
  generateText?: (topic: string, selection?: { provider: string; model: string }, nativeLang?: string, targetLang?: string) => Promise<string | undefined>
  /** List available providers and their models (host provides ctx-bound impl). */
  listModels?: () => Promise<Array<{ provider: string; providerName: string; models: Array<{ id: string; name: string }> }>>
  /** Read the currently-selected default model. */
  currentSelection?: () => { provider?: string; model?: string }
  /** Persist the user's chosen default model. */
  saveSelection?: (selection: { provider: string; model: string }) => Promise<void>
}): WebRoute[] {
  const load = options.load ?? loadEnglishState
  const save = options.save ?? saveEnglishState
  const dir = options.storageDir

  /** Load the current ledger (happy path). */
  const current = async (): Promise<EnglishState> => load(dir)

  const base = '/bga-dsh-workbench/english'

  const sendJson = (res: Parameters<WebRoute['handler']>[1], body: string, status = 200): void => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(body)
  }
  /** Serialise an error response. */
  const sendError = (res: Parameters<WebRoute['handler']>[1], message: string): void => {
    sendJson(res, JSON.stringify({ ok: false, error: message }), 400)
  }

  return [
    // GET /state — full public snapshot (cards, progress, day, streak, xp).
    {
      kind: 'exact',
      path: `${base}/state`,
      handler: async (_req, res) => {
        const state = await current()
        sendJson(res, OK({ state: publicState(state) }))
      },
    },
    // POST /cards — adopt a built-in list OR save a generated card.
    // { builtin?: id }  -> create/overwrite a card from the built-in list.
    // { topic, mode, mastery, threshold, items } -> create/overwrite a card.
    {
      kind: 'exact',
      path: `${base}/cards`,
      handler: async (req, res) => {
        try {
          const body = (await readJson(req, 512 * 1024)) as Record<string, unknown> | undefined
          const state = await current()
          let newCardId: string | null = null
          if (body && typeof body.builtin === 'string') {
            const list = findBuiltinList(body.builtin)
            if (list === undefined) throw new Error(`unknown builtin list: ${body.builtin}`)
            const mode = validMode(body.mode)
            const mastery = validMastery(body.mastery)
            const threshold = clampThreshold(body.threshold)
            const card = makeCard(list.label, mode, mastery, threshold, list.words.map(w => ({ text: w.text, meaning: w.meaning, example: w.example })))
            // Overwrite an existing card whose topic matches (re-generate resets progress).
            const existing = state.cards.find(c => c.topic === list.label)
            if (existing !== undefined) {
              const index = state.cards.indexOf(existing)
              state.cards[index] = card
            } else {
              state.cards.push(card)
            }
            newCardId = card.id
          } else if (body && typeof body.topic === 'string' && Array.isArray(body.items)) {
            const topic = body.topic.trim()
            if (topic.length === 0) throw new Error('topic must not be empty')
            const mode = validMode(body.mode)
            const mastery = validMastery(body.mastery)
            const threshold = clampThreshold(body.threshold)
            const entries = (body.items as Array<Record<string, unknown>>)
              .map(item => ({ text: String(item.text ?? ''), meaning: String(item.meaning ?? ''), example: String(item.example ?? '') }))
              .filter(e => e.text.trim() !== '')
            if (entries.length === 0) throw new Error('card must contain at least one item')
            const card = makeCard(topic, mode, mastery, threshold, entries)
            const existing = state.cards.find(c => c.topic === topic)
            if (existing !== undefined) {
              const index = state.cards.indexOf(existing)
              state.cards[index] = card
            } else {
              state.cards.push(card)
            }
            newCardId = card.id
          } else {
            throw new Error('body must provide builtin (id) or topic + items')
          }

          if (newCardId !== null && state.currentCardId === null) state.currentCardId = newCardId
          await save(dir, state)
          sendJson(res, OK({ state: publicState(state) }))
        } catch (error) {
          sendError(res, (error as Error).message)
        }
      },
    },
    // POST /select — set the current learning card.
    { kind: 'exact', path: `${base}/select`, handler: async (req, res) => {
      try {
        const body = (await readJson(req, 16 * 1024)) as Record<string, unknown> | undefined
        const cardId = typeof body?.cardId === 'string' ? body.cardId : null
        const state = await current()
        if (cardId !== null && !state.cards.some(c => c.id === cardId)) {
          throw new Error('card not found')
        }
        state.currentCardId = cardId
        await save(dir, state)
        sendJson(res, OK({ state: publicState(state) }))
      } catch (error) {
        sendError(res, (error as Error).message)
      }
    } },
    // POST /cards/update — update mode/mastery/threshold on an existing card without resetting progress.
    { kind: 'exact', path: `${base}/cards/update`, handler: async (req, res) => {
      try {
        const body = (await readJson(req, 16 * 1024)) as Record<string, unknown> | undefined
        const cardId = typeof body?.cardId === 'string' ? body.cardId : ''
        if (cardId === '') throw new Error('cardId is required')
        const state = await current()
        const card = state.cards.find(c => c.id === cardId)
        if (card === undefined) throw new Error('card not found')
        if (typeof body?.topic === 'string' && body.topic.trim() !== '') card.topic = body.topic.trim()
        if (body?.mode !== undefined) card.mode = validMode(body.mode)
        if (body?.mastery !== undefined) card.mastery = validMastery(body.mastery)
        if (body?.threshold !== undefined) card.threshold = clampThreshold(body.threshold)
        if (body?.sessionSize !== undefined) card.sessionSize = clampSessionSize(body.sessionSize)
        await save(dir, state)
        sendJson(res, OK({ state: publicState(state) }))
      } catch (error) {
        sendError(res, (error as Error).message)
      }
    } },
    // POST /cards/delete — remove a topic card by id.
    { kind: 'exact', path: `${base}/cards/delete`, handler: async (req, res) => {
      try {
        const body = (await readJson(req, 16 * 1024)) as Record<string, unknown> | undefined
        const cardId = typeof body?.cardId === 'string' ? body.cardId : ''
        if (cardId === '') throw new Error('cardId is required')
        const state = await current()
        const index = state.cards.findIndex(c => c.id === cardId)
        if (index === -1) throw new Error('card not found')
        if (state.cards[index]!.locked) throw new Error('该主题卡已锁定，无法删除')
        state.cards.splice(index, 1)
        // If the deleted card was the current one, auto-select the next available card (or null).
        if (state.currentCardId === cardId) {
          state.currentCardId = state.cards.length > 0 ? state.cards[0].id : null
        }
        await save(dir, state)
        sendJson(res, OK({ state: publicState(state) }))
      } catch (error) {
        sendError(res, (error as Error).message)
      }
    } },
    // GET /models — available providers + models and the current default selection,
    // so the settings panel can offer a model picker when no default is configured.
    { kind: 'exact', path: `${base}/models`, handler: async (_req, res) => {
      try {
        const providers = options.listModels === undefined ? [] : await options.listModels()
        const current = options.currentSelection?.() ?? { provider: undefined, model: undefined }
        sendJson(res, OK({
          providers,
          current: { provider: current.provider ?? null, model: current.model ?? null },
          hasDefault: current.provider !== undefined && current.model !== undefined,
        }))
      } catch {
        sendJson(res, OK({ providers: [], current: { provider: null, model: null }, hasDefault: false }))
      }
    } },
    // POST /default-model — persist the user's chosen default model { provider, model }.
    { kind: 'exact', path: `${base}/default-model`, handler: async (req, res) => {
      try {
        const body = (await readJson(req, 16 * 1024)) as Record<string, unknown> | undefined
        const provider = typeof body?.provider === 'string' ? body.provider : ''
        const model = typeof body?.model === 'string' ? body.model : ''
        if (provider === '' || model === '') throw new Error('provider and model are required')
        if (options.saveSelection !== undefined) await options.saveSelection({ provider, model })
        sendJson(res, OK({ provider, model }))
      } catch (error) {
        sendError(res, (error as Error).message)
      }
    } },
    // GET /next — a question from the current card (or null when locked/empty).
    { kind: 'exact', path: `${base}/next`, handler: async (_req, res) => {
      const state = await current()
      const card = state.cards.find(c => c.id === state.currentCardId)
      if (card === undefined) { sendJson(res, OK({ question: null, reason: 'no-card' })); return }
      if (state.day.hearts <= 0) { sendJson(res, OK({ question: null, reason: 'locked' })); return }
      const item = pickNextItem(card)
      if (item === null) { sendJson(res, OK({ question: null, reason: 'done' })); return }
      sendJson(res, OK({ question: buildQuestion(card, item), targetLang: card.targetLang ?? 'en' }))
    } },
    // POST /result — grade an answer { itemId, cardId, answer, mode }.
    { kind: 'exact', path: `${base}/result`, handler: async (req, res) => {
      try {
        const body = (await readJson(req, 16 * 1024)) as Record<string, unknown> | undefined
        const itemId = String(body?.itemId ?? '')
        const cardId = String(body?.cardId ?? '')
        const answer = String(body?.answer ?? '')
        const state = await current()
        const result = gradeAnswer(state, itemId, cardId, answer)
        await save(dir, state)
        sendJson(res, OK({ result, state: publicState(state) }))
      } catch (error) {
        sendError(res, (error as Error).message)
      }
    } },
    // POST /builtins — return the built-in list catalogue (no storage side effects).
    { kind: 'exact', path: `${base}/builtins`, handler: async (_req, res) => {
      const { BUILTIN_LISTS } = await import('./builtin.ts')
      sendJson(res, OK({ builtins: BUILTIN_LISTS.map(l => ({ id: l.id, label: l.label, level: l.level, count: l.words.length })) }))
    } },
    // GET /export — download the ledger as JSON.
    { kind: 'exact', path: `${base}/export`, handler: async (_req, res) => {
      const state = await current()
      const text = exportState(state)
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': 'attachment; filename="english-data.json"' })
      res.end(text)
    } },
    // POST /import — replace the ledger from an uploaded document ({ content: <export string> }).
    { kind: 'exact', path: `${base}/import`, handler: async (req, res) => {
      try {
        const body = (await readJson(req, 8 * 1024 * 1024)) as { content?: unknown } | undefined
        const content = typeof body?.content === 'string' ? body.content : undefined
        const parsed = content === undefined ? undefined : parseImport(content)
        if (parsed === undefined) throw new Error('invalid english data document')
        await save(dir, parsed)
        sendJson(res, OK({ state: publicState(parsed) }))
      } catch (error) {
        sendError(res, (error as Error).message)
      }
    } },
    // POST /generate — generate a topic card directly via the LLM service.
    // Depends on the host-provided generateText (ctx-bound llm.stream). Parses
    // the model's JSON reply, persists the card, and returns the fresh state so
    // the browser can refresh immediately.
    { kind: 'exact', path: `${base}/generate`, handler: async (req, res) => {
      try {
        const body = (await readJson(req, 64 * 1024)) as Record<string, unknown> | undefined
        const topic = typeof body?.topic === 'string' ? body.topic.trim() : ''
        if (topic.length === 0) throw new Error('topic must not be empty')
        if (options.generateText === undefined) throw new Error('当前环境不支持直接生成，请改用内置词库')

        // Resolve which model to use: an explicit provider/model in the body
        // wins; otherwise fall back to the currently-selected default model.
        // When neither exists we fail with a clear "please choose a model" so
        // the settings panel can pop the model picker.
        const explicitProvider = typeof body?.provider === 'string' ? body.provider : undefined
        const explicitModel = typeof body?.model === 'string' ? body.model : undefined
        let provider = explicitProvider
        let model = explicitModel
        if ((provider === undefined || model === undefined) && options.currentSelection !== undefined) {
          const current = options.currentSelection()
          provider = provider ?? current.provider
          model = model ?? current.model
        }
        const selection = provider !== undefined && model !== undefined ? { provider, model } : undefined
        if (selection === undefined) {
          throw new Error('未配置默认模型，请先在下方选择模型再生成')
        }

        const rawText = await options.generateText(topic, selection, typeof body?.nativeLang === 'string' ? body.nativeLang : undefined, typeof body?.targetLang === 'string' ? body.targetLang : undefined)
        if (rawText === undefined) throw new Error('模型生成失败：未获取到内容，请重试或更换模型')
        const parsed = extractJson(rawText)
        const arr = Array.isArray(parsed) ? parsed : Array.isArray((parsed as { items?: unknown })?.items) ? (parsed as { items: unknown[] }).items : undefined
        if (arr === undefined || arr.length === 0) throw new Error('模型返回的不是有效的词库 JSON')
        const mode = validMode(body?.mode)
        const mastery = validMastery(body?.mastery)
        const threshold = clampThreshold(body?.threshold)
        const entries = (arr as Array<Record<string, unknown>>)
          .map(item => ({
            text: String(item.text ?? ''),
            meaning: String(item.meaning ?? ''),
            example: String(item.example ?? ''),
            exampleMeaning: String(item.exampleMeaning ?? ''),
            type: (item.type === 'sentence' ? 'sentence' : 'word') as 'word' | 'sentence',
          }))
          .filter(e => e.text.trim() !== '')
        if (entries.length === 0) throw new Error('模型生成结果没有有效词条')
        const state = await current()
        const card = makeCard(topic, mode, mastery, threshold, entries)
        const existing = state.cards.find(c => c.topic === topic)
        if (existing !== undefined) {
          const index = state.cards.indexOf(existing)
          state.cards[index] = card
        } else {
          state.cards.push(card)
        }
        if (state.currentCardId === null) state.currentCardId = card.id
        await save(dir, state)
        sendJson(res, OK({ state: publicState(state) }))
      } catch (error) {
        sendError(res, (error as Error).message)
      }
    } },
    // POST /reset — wipe the ledger (idempotent).
    { kind: 'exact', path: `${base}/reset`, handler: async (_req, res) => {
      const file = join(dir, ENGLISH_FILE)
      await unlink(file).catch(() => { })
      const fresh = makeDefaultState()
      ensureBasicEnglish850(fresh)
      await save(dir, fresh)
      sendJson(res, OK({ state: publicState(fresh) }))
    } },
    // GET /wrong-words — return the wrong word notebook.
    { kind: 'exact', path: `${base}/wrong-words`, handler: async (_req, res) => {
      const state = await current()
      sendJson(res, OK({ wrongWords: state.wrongWords ?? [] }))
    } },
    // POST /wrong-words/clear — clear the wrong word notebook.
    { kind: 'exact', path: `${base}/wrong-words/clear`, handler: async (_req, res) => {
      const state = await current()
      state.wrongWords = []
      await save(dir, state)
      sendJson(res, OK({ state: publicState(state) }))
    } },
    // POST /wrong-words/remove — remove a specific wrong word.
    { kind: 'exact', path: `${base}/wrong-words/remove`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 4096) as { itemId?: string }
        if (!body?.itemId) return sendError(res, 'itemId required')
        const state = await current()
        state.wrongWords = (state.wrongWords ?? []).filter(w => w.itemId !== body.itemId)
        await save(dir, state)
        sendJson(res, OK({ state: publicState(state) }))
      } catch { sendError(res, 'invalid request') }
    } },
    // POST /frequency — update learning frequency settings.
    { kind: 'exact', path: `${base}/frequency`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 4096) as { frequency?: string; dailyQuizLimit?: number }
        const state = await current()
        if (body.frequency) state.frequency = body.frequency as EnglishState['frequency']
        if (typeof body.dailyQuizLimit === 'number') state.dailyQuizLimit = Math.max(0, Math.min(50, body.dailyQuizLimit))
        await save(dir, state)
        sendJson(res, OK({ state: publicState(state) }))
      } catch { sendError(res, 'invalid request') }
    } },
    // GET /dashboard — return dashboard stats for the learning report.
    { kind: 'exact', path: `${base}/dashboard`, handler: async (_req, res) => {
      const state = await current()
      const totalWrong = (state.wrongWords ?? []).length
      const totalCards = state.cards.length
      const masteredCards = state.cards.filter(c => {
        const mastered = c.items.filter(i => i.status === 'mastered')
        return mastered.length === c.items.length && c.items.length > 0
      }).length
      sendJson(res, OK({
        xp: state.xp,
        streak: state.streak,
        totalCompleted: state.totalCompleted,
        totalWrong,
        totalCards,
        masteredCards,
        statistics: state.statistics,
        day: state.day,
      }))
    } },
  ]
}

function validMode(value: unknown): 'copy' | 'recall' | 'choice' | 'audio' {
  return value === 'recall' || value === 'choice' || value === 'audio' ? value : 'copy'
}

function validMastery(value: unknown): 'count' | 'srs' {
  return value === 'srs' ? 'srs' : 'count'
}

function clampThreshold(value: unknown): number {
  const n = typeof value === 'number' ? Math.floor(value) : 3
  return Math.max(1, Math.min(20, n))
}
function clampSessionSize(value: unknown): number {
  const n = typeof value === 'number' ? Math.round(value) : 1
  return Math.max(1, Math.min(10, n))
}
