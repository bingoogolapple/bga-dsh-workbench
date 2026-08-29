/**
 * English-learning domain model and pure game rules.
 *
 * Everything here is a pure function over plain JSON data (no DSH or Node
 * dependencies) so the whole progress/quiz state machine can be unit-tested
 * in isolation and runs identically on host-side route handlers.
 */

/** A single vocabulary item inside a topic card. */
export interface EnglishItem {
  /** Stable per-card id (nanoid-like). */
  id: string
  /** Type: word (单词/短语) or sentence (完整句子). */
  type: 'word' | 'sentence'
  /** The English word or sentence. */
  text: string
  /** Chinese meaning / prompt for recall + recall mode. */
  meaning: string
  /** Optional example sentence using the word. */
  example: string
  /** Chinese translation of the example sentence. */
  exampleMeaning: string
  /** Mastery stage: new -> learning -> known -> mastered. */
  status: 'new' | 'learning' | 'known' | 'mastered'
  /** Cumulative correct answers (still tracked for the "by count" mode). */
  correctCount: number
  /** Timestamp of the last correct answer (ms). */
  lastCorrectAt: number | null
  /** SRS: timestamp at/after which the item is due for review (ms). */
  nextReviewAt: number
  /** SRS: current spacing interval in days. */
  intervalDays: number
  /** SRS: ease factor multiplier (start 2.5). */
  ease: number
  /** Total XP this item has earned. */
  xpEarned: number
}

/** One topic card = one learning path ("skill tree" node). */
export interface EnglishCard {
  id: string
  topic: string
  /** Quiz mode default for this card: copy (scoring typing) | recall | choice | audio. */
  mode: 'copy' | 'recall' | 'choice' | 'audio'
  /** Mastery rule: 'count' (answer N times) or 'srs' (spaced repetition). */
  mastery: 'count' | 'srs'
  /** Correct-answer threshold when mastery === 'count'. */
  threshold: number
  /** Target language code (e.g. 'en', 'ja', 'ko'). */
  targetLang: string
  /** Number of questions per learning session (1–50, default 5). */
  sessionSize: number
  /** Locked cards cannot be deleted (e.g. the built-in Basic English 850 card). */
  locked?: boolean
  createdAt: number
  items: EnglishItem[]
}

/** Today-scoped streak / hearts ledger. */
export interface EnglishDayState {
  /** Date key (YYYY-MM-DD, local) this state belongs to. */
  date: string
  /** Hearts remaining today (5 max). */
  hearts: number
  /** How many items were mastered today. */
  completedToday: number
  /** Total correct answers today. */
  correctToday: number
  /** Total wrong answers today. */
  wrongToday: number
}

/** A wrong word entry for the notebook. */
export interface WrongWordEntry {
  itemId: string
  cardId: string
  text: string
  meaning: string
  example: string
  wrongCount: number
  lastWrongAt: number
  addedAt: number
}

/** Learning frequency setting: how often to show quiz after conversation turns. */
export type LearningFrequency = 'every-turn' | 'every-2' | 'every-5' | 'every-10' | 'manual'

/** Global learning progress / gamification state. */
export interface EnglishState {
  cards: EnglishCard[]
  currentCardId: string | null
  day: EnglishDayState
  /** Streak: number of consecutive active days. */
  streak: number
  /** Last date (YYYY-MM-DD) on which a correct answer was recorded. */
  lastActiveDate: string | null
  /** Cumulative XP. */
  xp: number
  /** Cumulative mastered items ever. */
  totalCompleted: number
  /** Total answers recorded (for stats). */
  totalAnswers: number
  statistics: { answers: number; correct: number; wrong: number; xp: number }
  /** Wrong word notebook: items the user got wrong, for review. */
  wrongWords: WrongWordEntry[]
  /** Learning frequency: how often to show quiz after conversation turns. */
  frequency: LearningFrequency
  /** Maximum quizzes per day (0 = unlimited). */
  dailyQuizLimit: number
  /** How many quizzes shown today (resets daily). */
  quizzesToday: number
  /** Date for the quizzesToday counter. */
  quizzesDate: string
}

/** Quiz question handed to the client (never leaks the answer in recall/audio). */
export interface EnglishQuestion {
  itemId: string
  cardId: string
  /** Mode the question is presented in. */
  mode: 'copy' | 'recall' | 'choice' | 'audio'
  /** Copy mode: the English text to type back. Recall: the Chinese prompt. */
  prompt: string
  /** For copy/audio: placeholder meaning (not the answer text). */
  hint: string
  /** For choice mode: the four options (shuffled), one is the answer. */
  choices?: string[]
  /** The correct English text (used by the client to compare). */
  answer: string
  /** The item's example sentence (audio/example readout). */
  example: string
}

/** Result of grading one user answer. */
export interface EnglishResult {
  ok: 'correct' | 'wrong'
  /** Item after applying the outcome. */
  item: EnglishItem
  cardId: string
  /** Whether this answer flipped the item to mastered. */
  mastered: boolean
  /** Hearts left (may have dropped on a wrong answer). */
  heartsLeft: number
  /** XP delta this answer. */
  xpDelta: number
  /** Running streak. */
  streak: number
  /** Hearts locked (0 = locked for today). */
  locked: boolean
  /** Correct answer (for wrong feedback / audio). */
  answer: string
  /** Updated card progress summary. */
  progress: EnglishCardProgress
}

/** Lightweight progress summary of one card. */
export interface EnglishCardProgress {
  total: number
  mastered: number
  percent: number
}

/** SRS default schedule (days). */
export const SRS_INTERVALS = [1, 3, 7, 15, 30, 60] as const

/** Default hearts per day. */
export const DAILY_HEARTS = 5

const KEYCHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'
/** Generate a short collision-resistant id. */
export function nanoid(length = 10): string {
  let out = ''
  for (let i = 0; i < length; i += 1) {
    const idx = Math.floor(Math.random() * KEYCHARS.length)
    out += KEYCHARS[idx]!
  }
  return out
}

/** Local date key (YYYY-MM-DD) for a timestamp. */
export function localDateKey(now = Date.now()): string {
  const d = new Date(now)
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Difference in whole days between two local date keys (positive if tomorrow). */
export function dateDiff(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number) as [number, number, number]
  const [by, bm, bd] = b.split('-').map(Number) as [number, number, number]
  const A = new Date(ay, (am ?? 1) - 1, ad ?? 1).getTime()
  const B = new Date(by, (bm ?? 1) - 1, bd ?? 1).getTime()
  return Math.round((A - B) / 86_400_000)
}

/** Create a fresh EnglishItem. */
export function makeItem(text: string, meaning: string, example = '', type: 'word' | 'sentence' = 'word', exampleMeaning = ''): EnglishItem {
  return {
    id: nanoid(),
    type,
    text: text.trim(),
    meaning: meaning.trim(),
    example: example.trim(),
    exampleMeaning: exampleMeaning.trim(),
    status: 'new',
    correctCount: 0,
    lastCorrectAt: null,
    nextReviewAt: 0,
    intervalDays: 1,
    ease: 2.5,
    xpEarned: 0,
  }
}

function clampSessionSize(v: unknown): number { const n = Number(v); return Number.isFinite(n) && n >= 1 && n <= 10 ? Math.round(n) : 1 }

/** Build a fresh card from generated (or built-in) entries. */
export function makeCard(topic: string, mode: EnglishCard['mode'], mastery: EnglishCard['mastery'], threshold: number, entries: Array<{ text: string; meaning: string; example?: string; type?: 'word' | 'sentence'; exampleMeaning?: string }>, targetLang = 'en', sessionSize = 1): EnglishCard {
  return {
    id: nanoid(),
    topic: topic.trim(),
    mode,
    mastery,
    threshold,
    targetLang,
    sessionSize: clampSessionSize(sessionSize),
    createdAt: Date.now(),
    items: entries.map(entry => makeItem(entry.text, entry.meaning, entry.example ?? '', entry.type ?? 'word', entry.exampleMeaning ?? '')),
  }
}

/** Create an empty, healthy default state on first run. */
export function makeDefaultState(): EnglishState {
  return {
    cards: [],
    currentCardId: null,
    day: { date: localDateKey(), hearts: DAILY_HEARTS, completedToday: 0, correctToday: 0, wrongToday: 0 },
    streak: 0,
    lastActiveDate: null,
    xp: 0,
    totalCompleted: 0,
    totalAnswers: 0,
    statistics: { answers: 0, correct: 0, wrong: 0, xp: 0 },
    wrongWords: [],
    frequency: 'every-turn',
    dailyQuizLimit: 10,
    quizzesToday: 0,
    quizzesDate: '',
  }
}

/** Canonicalise text for forgiving comparison (trim, lowercase, collapse spaces). */
export function normalizeAnswer(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.!?]+$/u, '')
}

/** Roll the day ledger if the stored date is not today. */
export function rollDay(state: EnglishState, now = Date.now()): void {
  const today = localDateKey(now)
  if (state.day.date === today) return
  state.day = {
    date: today,
    hearts: DAILY_HEARTS,
    completedToday: 0,
    correctToday: 0,
    wrongToday: 0,
  }
}

/** Advance or keep the streak, given a mastered/correct activity on `now`. */
export function bumpStreak(state: EnglishState, now = Date.now()): void {
  const today = localDateKey(now)
  if (state.lastActiveDate === null) {
    state.streak = 1
  } else if (state.lastActiveDate === today) {
    // already active today, keep
  } else {
    const gap = dateDiff(today, state.lastActiveDate)
    state.streak = gap === 1 ? state.streak + 1 : 1
  }
  state.lastActiveDate = today
}

/**
 * Grade one answer against an item and mutate the state accordingly.
 * Returns the `EnglishResult` describing the outcome. Pure mutation; caller
 * persists afterwards.
 */
export function gradeAnswer(
  state: EnglishState,
  itemId: string,
  cardId: string,
  userText: string,
  now = Date.now(),
): EnglishResult {
  const card = state.cards.find(c => c.id === cardId)
  const item = card?.items.find(it => it.id === itemId)
  // Guard: card/item must exist; if not, fail closed with a locked-style result.
  if (card === undefined || item === undefined) {
    return {
      ok: 'wrong', item: { ...makeItem('', '') }, cardId, mastered: false,
      heartsLeft: state.day.hearts, xpDelta: 0, streak: state.streak,
      locked: false, answer: '', progress: { total: 0, mastered: 0, percent: 0 },
    }
  }

  rollDay(state, now)
  const correct = normalizeAnswer(userText) === normalizeAnswer(item.text)
  state.totalAnswers += 1
  state.statistics.answers += 1

  let xpDelta = 0
  let mastered = false

  if (correct) {
    state.statistics.correct += 1
    state.day.correctToday += 1
    item.correctCount += 1
    item.lastCorrectAt = now
    xpDelta = 10
    // Streak management only counts genuine correct activity.
    bumpStreak(state, now)
    state.xp += xpDelta
    state.statistics.xp += xpDelta
    item.xpEarned += xpDelta

    // Mastery progression.
    if (card.mastery === 'count') {
      if (!isMastered(item) && item.correctCount >= card.threshold) {
        item.status = 'mastered'
        mastered = true
      } else if (!isMastered(item) && item.status !== 'learning') {
        item.status = 'learning'
      }
    } else {
      // SRS mode: advance scheduled review.
      item.intervalDays = item.intervalDays >= SRS_INTERVALS[SRS_INTERVALS.length - 1]!
        ? SRS_INTERVALS[SRS_INTERVALS.length - 1]!
        : nextInterval(item.intervalDays)
      item.nextReviewAt = now + item.intervalDays * 86_400_000
      item.ease = Math.min(3, item.ease + 0.1)
      // Mark mastered after enough successful spaced reviews.
      const reviews = item.intervalDays
      if (reviews >= 15) {
        item.status = 'mastered'
        mastered = true
      } else if (item.status !== 'known') {
        item.status = reviews >= 7 ? 'known' : 'learning'
      }
    }

    if (mastered) {
      state.day.completedToday += 1
      state.totalCompleted += 1
    }
  } else {
    state.statistics.wrong += 1
    state.day.wrongToday += 1
    // Wrong answer costs a heart and resets the item's progress.
    state.day.hearts = Math.max(0, state.day.hearts - 1)
    resetItemProgress(item)
    // Track wrong words in notebook
    const existing = state.wrongWords.find(w => w.itemId === item.id)
    if (existing) {
      existing.wrongCount += 1
      existing.lastWrongAt = now
    } else {
      state.wrongWords.push({
        itemId: item.id,
        cardId,
        text: item.text,
        meaning: item.meaning,
        example: item.example,
        wrongCount: 1,
        lastWrongAt: now,
        addedAt: now,
      })
    }
  }

  return {
    ok: correct ? 'correct' : 'wrong',
    item,
    cardId,
    mastered,
    heartsLeft: state.day.hearts,
    xpDelta: correct ? xpDelta : -0,
    streak: state.streak,
    locked: state.day.hearts === 0,
    answer: item.text,
    progress: progressOf(card),
  }
}

/** Advance an SRS interval to the next tier. */
export function nextInterval(current: number): number {
  for (const tier of SRS_INTERVALS) {
    if (tier > current) return tier
  }
  return SRS_INTERVALS[SRS_INTERVALS.length - 1]!
}

/** Whether an item is already mastered. */
export function isMastered(item: EnglishItem): boolean {
  return item.status === 'mastered'
}

/** Reset progress on a wrong answer (back toward new). */
export function resetItemProgress(item: EnglishItem): void {
  if (item.status === 'mastered') return // mastered never regresses
  item.status = 'new'
  item.correctCount = Math.max(0, item.correctCount - 1)
  item.intervalDays = 1
  item.nextReviewAt = 0
}

/** Pick the next due item to practise from the active card, or null if none. */
export function pickNextItem(card: EnglishCard, now = Date.now()): EnglishItem | null {
  const learnable = card.items
    .filter(it => !isMastered(it))
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt)
  // Prefer items that are "due" (nextReviewAt passed, or never reviewed).
  const due = learnable.filter(it => it.nextReviewAt <= now || it.correctCount === 0)
  const pool = due.length > 0 ? due : learnable
  return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)]! : null
}

/** Build the quiz question surface for a mode (never leaks the answer for recall/audio). */
export function buildQuestion(card: EnglishCard, item: EnglishItem): EnglishQuestion {
  const base: EnglishQuestion = {
    itemId: item.id,
    cardId: card.id,
    mode: card.mode,
    prompt: '',
    hint: '',
    answer: item.text,
    example: item.example,
  }
  if (card.mode === 'copy' || card.mode === 'audio') {
    // prompt is the English text; hint is the meaning.
    base.prompt = card.mode === 'audio' ? '🎧 （听发音后输入）' : item.text
    base.hint = item.meaning
  } else if (card.mode === 'recall') {
    base.prompt = item.meaning
    base.hint = '输入对应的英文'
  } else {
    // choice
    base.prompt = item.meaning
    base.hint = '选择正确的英文'
    base.choices = buildChoices(card, item)
  }
  return base
}

/** Build 4 choices for choice mode: the answer + 3 distinct distractors. */
export function buildChoices(card: EnglishCard, item: EnglishItem): string[] {
  const others = card.items
    .filter(it => it.id !== item.id && it.text !== item.text)
    .map(it => it.text)
  const seen = new Set<string>()
  const distractors: string[] = []
  while (distractors.length < 3 && others.length > 0) {
    const idx = Math.floor(Math.random() * others.length)
    const candidate = others[idx]!
    if (!seen.has(candidate)) {
      seen.add(candidate)
      distractors.push(candidate)
    }
    others.splice(idx, 1)
  }
  const pool = [...distractors, item.text]
  // shuffle
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = pool[i]!
    pool[i] = pool[j]!
    pool[j] = tmp
  }
  return pool.length >= 2 ? pool : [item.text]
}

/** Progress summary for a card. */
export function progressOf(card: EnglishCard): EnglishCardProgress {
  const mastered = card.items.filter(isMastered).length
  const total = card.items.length
  return { total, mastered, percent: total === 0 ? 0 : Math.round((mastered / total) * 100) }
}

/** Serialisable snapshot of the whole state (what the client sees). */
export function publicState(state: EnglishState) {
  return {
    cards: state.cards.map(card => ({
      id: card.id,
      topic: card.topic,
      mode: card.mode,
      mastery: card.mastery,
      threshold: card.threshold,
      targetLang: card.targetLang ?? 'en',
      sessionSize: clampSessionSize(card.sessionSize ?? 1),
      locked: card.locked ?? false,
      createdAt: card.createdAt,
      progress: progressOf(card),
      items: card.items.map(it => ({
        id: it.id,
        type: it.type,
        text: it.text,
        meaning: it.meaning,
        example: it.example,
        exampleMeaning: it.exampleMeaning,
        status: it.status,
        correctCount: it.correctCount,
        xpEarned: it.xpEarned,
      })),
    })),
    currentCardId: state.currentCardId,
    day: { ...state.day },
    streak: state.streak,
    xp: state.xp,
    totalCompleted: state.totalCompleted,
    statistics: { ...state.statistics },
    badge: badgeForXp(state.xp),
    frequency: state.frequency,
    dailyQuizLimit: state.dailyQuizLimit,
    quizzesToday: state.quizzesToday,
    quizzesDate: state.quizzesDate,
  }
}

/** XP -> badge tier. */
export function badgeForXp(xp: number): { tier: number; name: string; next: number } {
  const tiers = [
    { threshold: 0, name: '青铜' },
    { threshold: 200, name: '白银' },
    { threshold: 500, name: '黄金' },
    { threshold: 1000, name: '铂金' },
    { threshold: 2000, name: '钻石' },
  ]
  let current = tiers[0]!
  for (const tier of tiers) {
    if (xp >= tier.threshold) current = tier
  }
  const index = tiers.findIndex(t => t === current)!
  const nextTier = tiers[index + 1]
  return {
    tier: index,
    name: current.name,
    next: nextTier === undefined ? 0 : nextTier.threshold - current.threshold,
  }
}

/** Export payload: the full state as a portable JSON document. */
export function exportState(state: EnglishState): string {
  return JSON.stringify({ version: 1, exportedAt: Date.now(), ...state }, null, 2)
}

/** Validate + parse an imported JSON document, tolerating old/partial shapes. */
export function parseImport(text: string): EnglishState | undefined {
  try {
    const parsed = JSON.parse(text) as Partial<EnglishState> & { version?: number }
    if (!Array.isArray(parsed.cards)) return undefined
    const def = makeDefaultState()
    def.cards = parsed.cards.filter(isPlausibleCard)
    def.currentCardId = parsed.currentCardId ?? null
    def.xp = typeof parsed.xp === 'number' ? parsed.xp : 0
    def.statistics = { ...def.statistics, ...(parsed.statistics ?? {}) }
    def.totalCompleted = typeof parsed.totalCompleted === 'number' ? parsed.totalCompleted : 0
    rollDay(def)
    return def
  } catch {
    return undefined
  }
}

/** Coerce a raw card into a valid EnglishCard (for import robustness). */
function isPlausibleCard(value: unknown): value is EnglishCard {
  if (typeof value !== 'object' || value === null) return false
  const card = value as Partial<EnglishCard>
  if (typeof card.topic !== 'string' || !Array.isArray(card.items)) return false
  return true
}
