// ============================================================================
// 文件：EnglishLearningLayer.tsx —— 「英语学习」彩带叠加答题层
//
// 职责：
//   监听 ConfettiLayer 广播的「整轮对话完成」事件，向宿主拉取一个待学词条，
//   渲染居中答题卡（支持 抄写 / 回忆 / 选择 / 听音 四种模式），作答后提交给
//   宿主评分，并展示多邻国式反馈（❤️心形 / 🔥连击 / XP / 掌握进度）。
//   词库已空、当日心形用尽或未配置话题卡时静默无感知（或按需提示）。
// ============================================================================
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { TURN_COMPLETE_EVENT } from '../ConfettiLayer.tsx'
import { englishApi, type PublicState, type QuizQuestion as Q } from './api.ts'

const overlayStyle: CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 2147483646,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(0,0,0,0.45)',
}
const cardStyle: CSSProperties = {
  width: 420, maxWidth: '92vw', borderRadius: 16,
  background: 'var(--dsw-alias-bg-layer, #fff)', color: 'var(--dsw-alias-text-primary, #111)',
  boxShadow: '0 18px 60px rgba(0,0,0,0.35)', padding: 20, fontFamily: 'inherit',
}
const inputStyle: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 18,
  border: '2px solid var(--dsw-alias-border-l2, #ccc)',
  boxSizing: 'border-box', marginTop: 12, outline: 'none',
}
const rowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, marginBottom: 8 }
const btnStyle: CSSProperties = {
  marginTop: 12, padding: '10px 0', width: '100%', borderRadius: 10, border: 'none',
  background: 'var(--dsw-alias-brand-primary, #0070f3)', color: '#fff', fontSize: 15, cursor: 'pointer',
}
const choiceStyle: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10, marginTop: 8, textAlign: 'left',
  border: '2px solid var(--dsw-alias-border-l2, #ccc)', background: 'transparent', cursor: 'pointer', fontSize: 15,
  transition: 'border-color 120ms ease, background 120ms ease',
}
const choiceSelectedStyle: CSSProperties = {
  ...choiceStyle,
  borderColor: 'var(--dsw-alias-brand-primary, #0070f3)',
  background: 'var(--dsw-alias-brand-primary-weak, rgba(0,112,243,0.08))',
}

/** Lightweight local pronunciation via Web Speech (no external dependency). */
const LANG_MAP: Record<string, string> = { zh: 'zh-CN', en: 'en-US', 'en-simple': 'en-US', ja: 'ja-JP', ko: 'ko-KR', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR', ru: 'ru-RU', ar: 'ar-SA' }
function speak(text: string, lang = 'en'): void {
  try {
    if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = LANG_MAP[lang] ?? lang
    utter.rate = 1
    utter.volume = 1
    // Some browsers need a microtask delay after cancel before a new speak().
    setTimeout(() => { window.speechSynthesis.speak(utter) }, 50)
  } catch {
    // graceful: voice unavailable
  }
}

function Hearts({ count }: { count: number }): JSX.Element {
  return <span>❤️{count}</span>
}

/**
 * The quiz overlay. Renders nothing until a turn-complete event fires and a
 * question is available; after grading, shows feedback and auto/self-closes.
 */
export function EnglishLearningLayer(): JSX.Element | null {
  const [question, setQuestion] = useState<Q | null>(null)
  const [notice, setNotice] = useState<{ kind: 'done' | 'locked'; text: string } | null>(null)
  const [value, setValue] = useState('')
  const [phase, setPhase] = useState<'ask' | 'correct' | 'wrong'>('ask')
  const [feedback, setFeedback] = useState<{ xp: number; hearts: number; streak: number; mastered: boolean; answer: string } | null>(null)
  const [state, setState] = useState<PublicState | null>(null)
  const [busy, setBusy] = useState(false)
  const [inputHint, setInputHint] = useState<string | null>(null)
  const [sessionDone, setSessionDone] = useState(false)
  const sessionCountRef = useRef(0)
  const sessionCorrectRef = useRef(0)
  const autoCloseTimerRef = useRef<number | null>(null)
  const busyRef = useRef(false)
  const enabledRef = useRef(true)
  const targetLangRef = useRef('en')

  // 读取英语学习总开关；关闭时不弹出答题卡。
  useEffect(() => {
    fetch('/bga-dsh-workbench/config', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((cfg: unknown) => {
        const c = cfg as { english?: { enabled?: unknown } } | null
        if (c !== null) enabledRef.current = typeof c.english?.enabled === 'boolean' ? c.english.enabled : true
      })
      .catch(() => { /* 默认开启 */ })
  }, [])

  // Load a question challenge.
  const challenge = async (): Promise<void> => {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    try {
      const res = await englishApi.next()
      if (res.question !== null) {
        if (res.targetLang) targetLangRef.current = res.targetLang
        setQuestion(res.question)
        setValue('')
        setPhase('ask')
        setFeedback(null)
        setInputHint(null)
      } else {
        const reason = res.reason
        if (reason === 'done') {
          setNotice({ kind: 'done', text: '🎉 当前话题卡已全部掌握，去设置里换一张新话题卡吧' })
        } else if (reason === 'locked') {
          setNotice({ kind: 'locked', text: '❤️ 今日心形已用尽，明天再来继续学习' })
        }
        // reason 'no-card': silently ignore (nothing configured).
      }
      // Refresh gamification state for display (best effort).
      englishApi.state().then(r => setState(r.state)).catch(() => { })
    } catch {
      // network / host unavailable: ignore
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  // 本轮结束时关闭弹窗并重置。
  const endSession = (): void => {
    setQuestion(null)
    setNotice(null)
    setValue('')
    setPhase('ask')
    setFeedback(null)
    setInputHint(null)
    sessionCountRef.current = 0
    sessionCorrectRef.current = 0
    setSessionDone(false)
  }

  // 兼容旧引用：dismissFeedback 在本轮内切换题目。
  const dismissFeedback = challenge

  useEffect(() => {
    const handler = (): void => {
      if (!enabledRef.current) return
      // session 进行中由 auto-close timer 驱动下一题，不响应外部事件。
      if (sessionCountRef.current > 0) return
      void challenge()
    }
    window.addEventListener(TURN_COMPLETE_EVENT, handler)
    return () => window.removeEventListener(TURN_COMPLETE_EVENT, handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ready the input to be focused whenever a new question appears.
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (question !== null) inputRef.current?.focus()
  }, [question])

  // Auto-read the word aloud in audio mode.
  useEffect(() => {
    if (question?.mode === 'audio') speak(question.answer, targetLangRef.current)
  }, [question])

  const submit = async (): Promise<void> => {
    if (question === null || busy) return
    // 判空：选择题未选中时提示，非选择题在输入为空时提示。
    if (question.mode === 'choice' && value === '') {
      setInputHint('请先选择一个选项')
      return
    }
    if (question.mode !== 'choice' && value.trim() === '') {
      setInputHint('请先输入内容再提交')
      return
    }
    setInputHint(null)
    const answer = question.mode === 'choice' ? value : value
    setBusy(true)
    try {
      const res = await englishApi.result({ itemId: question.itemId, cardId: question.cardId, answer, mode: question.mode })
      const r = res.result
      setFeedback({ xp: r.xpDelta, hearts: r.heartsLeft, streak: r.streak, mastered: r.mastered, answer: r.answer })
      setState(res.state)
      sessionCountRef.current++
      if (r.ok === 'correct') { sessionCorrectRef.current++ }
      setPhase(r.ok === 'correct' ? 'correct' : 'wrong')
    } catch {
      // ignore
    } finally {
      setBusy(false)
    }
  }

  // 答对后 2s / 答错后 4s 自动关闭结果页；答完一轮后显示汇总。
  useEffect(() => {
    if (phase !== 'correct' && phase !== 'wrong') return
    if (autoCloseTimerRef.current !== null) window.clearTimeout(autoCloseTimerRef.current)
    const card = state?.cards.find(c => c.id === question?.cardId)
    const limit = card?.sessionSize ?? 5
    const newCount = sessionCountRef.current
    if (newCount >= limit) {
      autoCloseTimerRef.current = window.setTimeout(() => { autoCloseTimerRef.current = null; setSessionDone(true); setPhase('ask') }, 1500)
      return
    }
    const delay = phase === 'correct' ? 1500 : 4000
    autoCloseTimerRef.current = window.setTimeout(() => { autoCloseTimerRef.current = null; dismissFeedback() }, delay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // 本轮完成汇总 → 1.5s 后自动关闭。
  useEffect(() => {
    if (!sessionDone) return
    const timer = window.setTimeout(() => { endSession() }, 1500)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionDone])

  const onKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key !== 'Enter') return
    // 空输入时回车只提示，不提交。
    if (question !== null && question.mode !== 'choice' && value.trim() === '') {
      setInputHint('请先输入内容再提交')
      e.preventDefault()
      return
    }
    void submit()
  }

  const choose = (option: string): void => {
    setValue(option)
  }

  // Notices shown when no question is available (done / locked), auto-dismiss.
  if (notice !== null) {
    return (
      <div style={overlayStyle} onClick={() => setNotice(null)}>
        <div style={{ ...cardStyle, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: 16, lineHeight: 1.6 }}>{notice.text}</div>
          <div style={{ fontSize: 12, marginTop: 12, opacity: 0.7 }}>点击任意处关闭</div>
        </div>
      </div>
    )
  }

  // Session complete summary.
  if (sessionDone) {
    return (
      <div style={overlayStyle} onClick={() => endSession()}>
        <div style={{ ...cardStyle, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: 22, marginBottom: 12 }}>🎉 本轮完成！</div>
          <div style={{ fontSize: 15, lineHeight: 2 }}>
            <div>答对 <b>{sessionCorrectRef.current}</b> / {sessionCountRef.current} 题</div>
            <div>正确率 <b>{sessionCountRef.current > 0 ? Math.round(sessionCorrectRef.current / sessionCountRef.current * 100) : 0}%</b></div>
          </div>
          <button type="button" style={{ ...btnStyle, marginTop: 16 }} onClick={() => endSession()}>好的</button>
        </div>
      </div>
    )
  }

  if (question === null) return null

  const hearts = state?.day.hearts ?? 5

  return (
    <div style={overlayStyle} onClick={phase === 'correct' || phase === 'wrong' ? dismissFeedback : undefined}>
      <div style={cardStyle} onClick={e => e.stopPropagation()}>
        {/* Header: gamification bar */}
        <div style={rowStyle}>
          <Hearts count={hearts} />
          <span>🔥{state?.streak ?? 0}</span>
          <span style={{ marginLeft: 'auto' }}>⚡{state?.xp ?? 0} XP · {state?.badge.name ?? '青铜'}</span>
        </div>

        {phase === 'ask' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.5 }}>{question.prompt}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>{question.hint}</div>

            {question.mode === 'audio' && (
              <button type="button" style={{ ...btnStyle, marginTop: 10 }} onClick={() => speak(question.answer, targetLangRef.current)}>
                🔊 再听一遍
              </button>
            )}
            {question.mode !== 'choice' ? (
              <input
                ref={inputRef}
                style={inputStyle}
                value={value}
                onChange={e => { setValue(e.target.value); setInputHint(null) }}
                onKeyDown={onKey}
                onCopy={e => { if (question.mode === 'copy') e.preventDefault() }}
                onCut={e => { if (question.mode === 'copy') e.preventDefault() }}
                onPaste={e => { if (question.mode === 'copy') e.preventDefault() }}
                onContextMenu={e => { if (question.mode === 'copy') e.preventDefault() }}
                placeholder="输入英文…"
              />
            ) : (
              <div style={{ marginTop: 8 }}>
                {question.choices?.map(option => (
                  <button key={option} type="button" style={option === value ? choiceSelectedStyle : choiceStyle} onClick={() => choose(option)}>
                    {option}
                  </button>
                ))}
              </div>
            )}
            {inputHint !== null && (
              <div style={{ fontSize: 13, color: 'var(--dsw-alias-state-error-primary, #c00000)', marginTop: 8 }}>
                {inputHint}
              </div>
            )}
            <button type="button" style={{ ...btnStyle, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={() => void submit()}>
              提交
            </button>
            {question.mode === 'copy' && (
              <button type="button" style={{ ...btnStyle, background: 'transparent', color: 'var(--dsw-alias-brand-primary, #0070f3)', border: '1px solid currentColor' }} onClick={() => speak(question.answer, targetLangRef.current)}>
                🔊 朗读该词
              </button>
            )}
          </>
        )}

        {phase === 'correct' && feedback !== null && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40 }}>✅</div>
            <div style={{ fontSize: 16, marginTop: 6 }}>
              正确！+{feedback.xp} XP{feedback.mastered ? ' · 🎓 本词已掌握' : ''}
            </div>
            <div style={{ fontSize: 13, marginTop: 6, opacity: 0.75 }}>
              🔥 连击 {feedback.streak} 天 · ❤️ 剩 {feedback.hearts}
            </div>
            <div style={{ fontSize: 12, marginTop: 8, opacity: 0.6 }}>⏱ 2 秒后自动下一题</div>
            <button type="button" style={btnStyle} onClick={dismissFeedback}>继续</button>
          </div>
        )}

        {phase === 'wrong' && feedback !== null && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40 }}>❌</div>
            <div style={{ fontSize: 16, marginTop: 6 }}>答错了，正确答案：<b>{feedback.answer}</b></div>
            <div style={{ fontSize: 13, marginTop: 6, opacity: 0.75 }}>❤️ 还剩 {feedback.hearts}（答错扣一颗心）</div>
            <button type="button" style={{ ...btnStyle, background: 'var(--dsw-alias-brand-primary, #0070f3)' }} onClick={dismissFeedback}>
              学到啦
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
