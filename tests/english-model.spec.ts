// ============================================================
// english-model.spec.ts —— 英语学习核心状态机（纯逻辑）测试
// ============================================================
// 测试对象：src/english/model.ts 的纯函数（题目抽取、评分、心形/连击/XP/掌握规则）。
import { describe, expect, it } from 'vitest'
import {
  buildChoices, buildQuestion, bumpStreak, gradeAnswer, isMastered, makeCard, makeDefaultState,
  normalizeAnswer, pickNextItem, progressOf, publicState, rollDay,
} from '../src/english/model.ts'

function card(overrides: Partial<Parameters<typeof makeCard>[0]> & { items?: Parameters<typeof makeCard>[4] } = {}) {
  return makeCard(
    overrides.topic ?? '测试',
    overrides.mode ?? 'copy',
    overrides.mastery ?? 'count',
    overrides.threshold ?? 3,
    overrides.items ?? [
      { text: 'hello', meaning: '你好', example: 'Hello world' },
      { text: 'world', meaning: '世界' },
      { text: 'apple', meaning: '苹果' },
    ],
  )
}

describe('makeCard / makeItem', () => {
  it('creates a card with independent item ids and zero progress', () => {
    const c = card()
    expect(c.items).toHaveLength(3)
    expect(new Set(c.items.map(i => i.id)).size).toBe(3)
    expect(progressOf(c)).toEqual({ total: 3, mastered: 0, percent: 0 })
    expect(c.items.every(i => i.status === 'new')).toBe(true)
  })
})

describe('normalizeAnswer', () => {
  it('is forgiving about case, trailing punctuation, and whitespace', () => {
    expect(normalizeAnswer('  Hello, world! ')).toBe('hello, world')
    expect(normalizeAnswer('HELLO')).toBe('hello')
    expect(normalizeAnswer('spaced   word')).toBe('spaced word')
  })
})

describe('gradeAnswer', () => {
  it('credits XP and bumps streak on a correct answer', () => {
    const state = makeDefaultState()
    const c = card()
    state.cards = [c]
    state.currentCardId = c.id
    const item = c.items[0]!
    const r = gradeAnswer(state, item.id, c.id, item.text, 1_000_000)
    expect(r.ok).toBe('correct')
    expect(r.xpDelta).toBe(10)
    expect(state.xp).toBe(10)
    expect(state.streak).toBe(1)
    expect(item.correctCount).toBe(1)
    expect(r.heartsLeft).toBe(5)
  })

  it('deducts a heart and resets item progress on a wrong answer', () => {
    const state = makeDefaultState()
    const c = card()
    state.cards = [c]
    const item = c.items[0]!
    // Prime the item with one prior correct answer.
    gradeAnswer(state, item.id, c.id, item.text, 1_000_000)
    expect(item.correctCount).toBe(1)
    const r = gradeAnswer(state, item.id, c.id, 'totally wrong', 1_000_100)
    expect(r.ok).toBe('wrong')
    expect(state.day.hearts).toBe(4)
    expect(item.correctCount).toBe(0) // reset
  })

  it('masters an item once the by-count threshold is reached', () => {
    const state = makeDefaultState()
    const c = card({ threshold: 2 })
    state.cards = [c]
    const item = c.items[0]!
    gradeAnswer(state, item.id, c.id, item.text, 1_000_000)
    expect(isMastered(item)).toBe(false)
    const r = gradeAnswer(state, item.id, c.id, item.text, 1_001_000)
    expect(r.mastered).toBe(true)
    expect(isMastered(item)).toBe(true)
    expect(state.totalCompleted).toBe(1)
  })

  it('locks the day when hearts run out', () => {
    const state = makeDefaultState()
    const c = card()
    state.cards = [c]
    const item = c.items[0]!
    // Miss 5 times -> hearts 0.
    for (let i = 0; i < 5; i += 1) {
      gradeAnswer(state, item.id, c.id, 'wrong', 1_000_000 + i)
    }
    expect(state.day.hearts).toBe(0)
    const r = gradeAnswer(state, item.id, c.id, item.text, 2_000_000)
    expect(r.locked).toBe(true)
  })
})

describe('rollDay / bumpStreak', () => {
  it('resets hearts when the local date changes', () => {
    const state = makeDefaultState()
    state.day.hearts = 1
    // Advance roughly 1 day.
    rollDay(state, state.day.date.length ? Date.parse(state.day.date) + 86_400_000 : Date.now())
    expect(state.day.hearts).toBe(5)
    expect(state.day.date).not.toBe(makeDefaultState().day.date)
  })

  it('extend streak for consecutive days and reset after a gap', () => {
    const state = makeDefaultState()
    bumpStreak(state, Date.parse('2026-01-01'))
    expect(state.streak).toBe(1)
    bumpStreak(state, Date.parse('2026-01-02'))
    expect(state.streak).toBe(2)
    bumpStreak(state, Date.parse('2026-01-05')) // gap
    expect(state.streak).toBe(1)
  })
})

describe('pickNextItem / buildQuestion / buildChoices', () => {
  it('prefers not-yet-mastered items and skips mastered ones', () => {
    const c = card()
    c.items[0]!.status = 'mastered'
    c.items[0]!.correctCount = 5
    const next = pickNextItem(c, 0)
    expect(next?.id).not.toBe(c.items[0]!.id)
  })

  it('returns null on a fully mastered card', () => {
    const c = card()
    for (const item of c.items) item.status = 'mastered'
    expect(pickNextItem(c, 0)).toBeNull()
  })

  it('does not leak the answer in recall mode (prompt is the meaning)', () => {
    const c = card({ mode: 'recall' })
    const q = buildQuestion(c, c.items[0]!)
    expect(q.prompt).toBe(c.items[0]!.meaning)
    expect(q.answer).toBe(c.items[0]!.text)
  })

  it('builds 4 choices including the correct answer for choice mode', () => {
    const c = card({
      mode: 'choice',
      items: [
        { text: 'alpha', meaning: '一' }, { text: 'beta', meaning: '二' },
        { text: 'gamma', meaning: '三' }, { text: 'delta', meaning: '四' },
        { text: 'epsilon', meaning: '五' },
      ],
    })
    const q = buildQuestion(c, c.items[0]!)
    const choices = q.choices!
    expect(choices).toHaveLength(4)
    expect(choices).toContain(c.items[0]!.text)
    expect(new Set(choices).size).toBe(4)
    const another = buildChoices(c, c.items[0]!)
    expect(another).toHaveLength(4)
  })
})

describe('publicState / badge', () => {
  it('exposes a serialisable snapshot with a badge tier', () => {
    const state = makeDefaultState()
    state.xp = 250
    state.cards = [card()]
    const pub = publicState(state)
    expect(pub.badge.name).toBe('白银')
    expect(pub.cards[0]!.progress.total).toBe(3)
    expect(JSON.parse(JSON.stringify(pub))).toBeTruthy()
  })
})
