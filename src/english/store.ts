/**
 * Host-side persistence of the English-learning ledger to the storage
 * directory (`english-data.json`), mirroring the tasks.json pattern.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { makeCard, makeDefaultState, type EnglishState } from './model.ts'
import { BASIC_ENGLISH_850 } from './basic-english-850.ts'

/** File name for the English learning ledger in the storage directory. */
export const ENGLISH_FILE = 'english-data.json'

/** The topic name used for the built-in Basic English 850 card. */
export const BASIC_ENGLISH_TOPIC = 'Basic English 850'

/** Read the ledger; returns a fresh default state on any read/parse failure. */
export async function loadEnglishState(storageDir: string): Promise<EnglishState> {
  const file = join(storageDir, ENGLISH_FILE)
  try {
    const raw = await readFile(file, 'utf8')
    const parsed = JSON.parse(raw) as Partial<EnglishState>
    const def = makeDefaultState()
    if (Array.isArray(parsed.cards)) def.cards = parsed.cards as EnglishState['cards']
    if (typeof parsed.currentCardId === 'string' || parsed.currentCardId === null) {
      def.currentCardId = parsed.currentCardId
    }
    if (typeof parsed.xp === 'number') def.xp = parsed.xp
    if (typeof parsed.streak === 'number') def.streak = parsed.streak
    if (typeof parsed.lastActiveDate === 'string' || parsed.lastActiveDate === null) {
      def.lastActiveDate = parsed.lastActiveDate
    }
    if (typeof parsed.totalCompleted === 'number') def.totalCompleted = parsed.totalCompleted
    if (parsed.day && typeof parsed.day === 'object') {
      const day = parsed.day as Partial<EnglishState['day']>
      if (typeof day.hearts === 'number') def.day.hearts = day.hearts
      def.day.date = typeof day.date === 'string' ? day.date : def.day.date
    }
    if (parsed.statistics && typeof parsed.statistics === 'object') {
      def.statistics = { ...def.statistics, ...(parsed.statistics as EnglishState['statistics']) }
    }
    // Load wrong word notebook
    if (Array.isArray(parsed.wrongWords)) def.wrongWords = parsed.wrongWords as EnglishState['wrongWords']
    // Load frequency settings
    if (typeof parsed.frequency === 'string') def.frequency = parsed.frequency as EnglishState['frequency']
    if (typeof parsed.dailyQuizLimit === 'number') def.dailyQuizLimit = parsed.dailyQuizLimit
    if (typeof parsed.quizzesToday === 'number') def.quizzesToday = parsed.quizzesToday
    if (typeof parsed.quizzesDate === 'string') def.quizzesDate = parsed.quizzesDate
    // Ensure the built-in Basic English 850 card exists and is locked.
    ensureBasicEnglish850(def)
    return def
  } catch {
    const def = makeDefaultState()
    ensureBasicEnglish850(def)
    return def
  }
}

/** Ensure the locked Basic English 850 card exists in the state. */
export function ensureBasicEnglish850(state: EnglishState): void {
  const existing = state.cards.find(c => c.topic === BASIC_ENGLISH_TOPIC)
  if (existing !== undefined) {
    // Mark as locked in case it was created before the field existed.
    existing.locked = true
    return
  }
  const card = makeCard(
    BASIC_ENGLISH_TOPIC, 'copy', 'count', 3,
    BASIC_ENGLISH_850.map(w => ({ text: w.text, meaning: w.meaning, example: w.example, type: 'word' as const, exampleMeaning: '' })),
    'en-simple',
  )
  card.locked = true
  state.cards.unshift(card)
  if (state.currentCardId === null) state.currentCardId = card.id
}

/** Persist the whole ledger to disk. */
export async function saveEnglishState(storageDir: string, state: EnglishState): Promise<void> {
  await mkdir(storageDir, { recursive: true })
  const file = join(storageDir, ENGLISH_FILE)
  await writeFile(file, JSON.stringify(state), 'utf8')
}
