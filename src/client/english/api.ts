/**
 * Browser-side API client for the English-learning ledger routes.
 * Thin wrapper over fetch to the /bga-dsh-workbench/english/* endpoints the
 * host serves; every call returns plain JSON matching the host contract.
 */

export interface PublicItem {
  id: string
  text: string
  meaning: string
  example: string
  status: 'new' | 'learning' | 'known' | 'mastered'
  correctCount: number
  xpEarned: number
}

export interface PublicCard {
  id: string
  topic: string
  mode: 'copy' | 'recall' | 'choice' | 'audio'
  mastery: 'count' | 'srs'
  threshold: number
  targetLang: string
  sessionSize: number
  locked: boolean
  createdAt: number
  progress: { total: number; mastered: number; percent: number }
  items: PublicItem[]
}

export interface PublicState {
  cards: PublicCard[]
  currentCardId: string | null
  day: { date: string; hearts: number; completedToday: number; correctToday: number; wrongToday: number }
  streak: number
  xp: number
  totalCompleted: number
  statistics: { answers: number; correct: number; wrong: number; xp: number }
  badge: { tier: number; name: string; next: number }
}

export interface QuizQuestion {
  itemId: string
  cardId: string
  mode: 'copy' | 'recall' | 'choice' | 'audio'
  prompt: string
  hint: string
  choices?: string[]
  answer: string
  example: string
}

export interface QuizResult {
  ok: 'correct' | 'wrong'
  item: PublicItem
  cardId: string
  mastered: boolean
  heartsLeft: number
  xpDelta: number
  streak: number
  locked: boolean
  answer: string
  progress: PublicCard['progress']
}

export interface BuiltinInfo {
  id: string
  label: string
  level: string
  count: number
}

const BASE = '/bga-dsh-workbench/english'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  return res.json() as Promise<T>
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return res.json() as Promise<T>
}

export const englishApi = {
  state: (): Promise<{ ok: boolean; state: PublicState }> => get('/state'),
  next: (): Promise<{ ok: boolean; question: QuizQuestion | null; reason?: string; targetLang?: string }> => get('/next'),
  builtins: (): Promise<{ ok: boolean; builtins: BuiltinInfo[] }> => get('/builtins'),
  result: (body: { itemId: string; cardId: string; answer: string; mode: string }): Promise<{ ok: boolean; result: QuizResult; state: PublicState }> =>
    post('/result', body),
  select: (cardId: string | null): Promise<{ ok: boolean; state: PublicState }> => post('/select', { cardId }),
  createFromBuiltin: (builtin: string, mode: string, mastery: string, threshold: number): Promise<{ ok: boolean; state: PublicState }> =>
    post('/cards', { builtin, mode, mastery, threshold }),
  createGenerated: (card: { topic: string; mode: string; mastery: string; threshold: number; items: Array<{ text: string; meaning: string; example?: string }> }): Promise<{ ok: boolean; state: PublicState }> =>
    post('/cards', card),
  generate: (params: { topic: string; mode: string; mastery: string; threshold: number; provider?: string; model?: string; nativeLang?: string; targetLang?: string }): Promise<{ ok: boolean; state: PublicState; error?: string }> =>
    post('/generate', params),
  models: (): Promise<{ ok: boolean; providers: Array<{ provider: string; providerName: string; models: Array<{ id: string; name: string }> }>; current: { provider: string | null; model: string | null }; hasDefault: boolean }> =>
    get('/models'),
  setDefaultModel: (provider: string, model: string): Promise<{ ok: boolean; provider: string; model: string }> =>
    post('/default-model', { provider, model }),
  importState: (content: string): Promise<{ ok: boolean; state: PublicState }> => post('/import', { content }),
  exportState: (): Promise<string> => fetch(`${BASE}/export`).then(res => res.text()),
  updateCard: (cardId: string, patch: { topic?: string; mode?: string; mastery?: string; threshold?: number; sessionSize?: number }): Promise<{ ok: boolean; state: PublicState }> =>
    post('/cards/update', { cardId, ...patch }),
  deleteCard: (cardId: string): Promise<{ ok: boolean; state: PublicState }> => post('/cards/delete', { cardId }),
  reset: (): Promise<{ ok: boolean; state: PublicState }> => post('/reset'),
}
