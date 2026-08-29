// ============================================================================
// 文件：EnglishSettings.tsx —— 设置页「英语学习」区块
//
// 职责：
//   展示并管理英语学习：游戏化状态（XP / 连击 / 心形 / 段位）、话题卡片列表与
//   当前选择、内置 CEFR 分级词库一键选用、按主题直接生成新词库、导出/导入/重置。
//   所有操作（含「模型生成」）都直接走 englishApi（浏览器侧 fetch）调用宿主
//   /bga-dsh-workbench/english/* 路由；「生成」由宿主用 llm.stream() 发起一次
//   临时大模型请求（不驱动 agent 会话），完成后由返回的完整 state 即时刷新页面。
// ============================================================================
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import {
  englishApi, type BuiltinInfo, type PublicState,
} from './api.ts'

export interface ProviderModels {
  provider: string
  providerName: string
  models: Array<{ id: string; name: string }>
}

const h3Style: CSSProperties = { fontSize: 15, margin: '16px 0 4px' }
const subH3Style: CSSProperties = { fontSize: 13, margin: 0, fontWeight: 600 }
const rowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', flexWrap: 'wrap' }
const labelStyle: CSSProperties = { minWidth: 72, fontWeight: 400, fontSize: 14 }
const captionStyle: CSSProperties = { fontSize: 12, color: 'var(--dsw-alias-label-tertiary, #888)' }
const buttonStyle: CSSProperties = {
  padding: '4px 12px', borderRadius: 8, border: '1px solid var(--dsw-alias-border-l2, #ccc)',
  background: 'transparent', cursor: 'pointer', fontSize: 13,
}
const inputStyle: CSSProperties = {
  padding: '4px 8px', borderRadius: 8, border: '1px solid var(--dsw-alias-border-l2, #ccc)',
  fontSize: 13, minWidth: 180,
}
const okStyle: CSSProperties = { color: 'var(--dsw-alias-state-success-primary, #2e8e52)', fontSize: 13 }
const errorStyle: CSSProperties = { color: 'var(--dsw-alias-state-error-primary, #c00000)', fontSize: 13 }

export interface EnglishSettingsProps {
  // No props: the settings panel calls the host /english/generate route directly.
}

const MODES = [
  { id: 'copy', label: '抄写' },
  { id: 'recall', label: '回忆' },
  { id: 'choice', label: '选择' },
  { id: 'audio', label: '听音' },
]
const MASTERY = [
  { id: 'count', label: '连续答对达标' },
  { id: 'srs', label: '智能间隔复习' },
]

const LANGUAGES = [
  { id: 'zh', label: '中文' },
  { id: 'en', label: 'English' },
  { id: 'en-simple', label: 'Simple English' },
  { id: 'ja', label: '日本語' },
  { id: 'ko', label: '한국어' },
  { id: 'es', label: 'Español' },
  { id: 'fr', label: 'Français' },
  { id: 'de', label: 'Deutsch' },
  { id: 'pt', label: 'Português' },
  { id: 'ru', label: 'Русский' },
  { id: 'ar', label: 'العربية' },
]

export function EnglishSettings(_props: EnglishSettingsProps): JSX.Element {
  const [state, setState] = useState<PublicState | null>(null)
  const [builtins, setBuiltins] = useState<BuiltinInfo[]>([])
  const [topic, setTopic] = useState('')
  const [nativeLang, setNativeLang] = useState('zh')
  const [targetLang, setTargetLang] = useState('en')
  const [mode, setMode] = useState('copy')
  const [mastery, setMastery] = useState('srs')
  const [threshold, setThreshold] = useState(3)
  const [sessionSize, setSessionSize] = useState(1)
  const [busy, setBusy] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredEdit, setHoveredEdit] = useState<string | null>(null)
  const [hoveredView, setHoveredView] = useState<string | null>(null)
  const [hoveredDelete, setHoveredDelete] = useState<string | null>(null)
  const [viewingCard, setViewingCard] = useState<{ topic: string; items: Array<{ type: string; text: string; meaning: string; example: string; exampleMeaning: string }> } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ cardId: string; topic: string } | null>(null)
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [englishEnabled, setEnglishEnabled] = useState(true)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  // Wrong word notebook + dashboard
  const [wrongWords, setWrongWords] = useState<Array<{ itemId: string; cardId: string; text: string; meaning: string; example: string; wrongCount: number; lastWrongAt: number; addedAt: number }>>([])
  const [dashboard, setDashboard] = useState<{ xp: number; streak: number; totalCompleted: number; totalWrong: number; totalCards: number; masteredCards: number; statistics: { answers: number; correct: number; wrong: number; xp: number }; day: { date: string; hearts: number; completedToday: number; correctToday: number; wrongToday: number } } | null>(null)

  // Model picker state (used when no default model is configured, or to re-pick).
  const [pickProviders, setPickProviders] = useState<ProviderModels[]>([])
  const [pickProvider, setPickProvider] = useState('')
  const [pickModel, setPickModel] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [pendingGenerate, setPendingGenerate] = useState(false)
  const [defaultLabel, setDefaultLabel] = useState('未选择默认模型')
  const [pickMessage, setPickMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const refresh = async (silent = false): Promise<void> => {
    try {
      const res = await englishApi.state()
      setState(res.state)
      if (!silent) return
    } catch {
      if (!silent) setMessage({ kind: 'error', text: '读取外语学习状态失败' })
    }
  }

  // Load wrong words and dashboard data
  const refreshWrongWords = async (): Promise<void> => {
    try {
      const res = await englishApi.wrongWords()
      if (res.ok) setWrongWords(res.wrongWords)
    } catch { /* ignore */ }
  }
  const refreshDashboard = async (): Promise<void> => {
    try {
      const res = await englishApi.dashboard()
      if (res.ok) setDashboard(res)
    } catch { /* ignore */ }
  }

  const onFrequencyChange = async (frequency: string): Promise<void> => {
    try {
      const res = await englishApi.setFrequency(frequency, state?.dailyQuizLimit)
      if (res.ok) { setState(res.state); setMessage({ kind: 'ok', text: '学习频率已更新' }) }
    } catch { setMessage({ kind: 'error', text: '更新频率失败' }) }
  }
  const onDailyLimitChange = async (limit: number): Promise<void> => {
    try {
      const res = await englishApi.setFrequency(state?.frequency ?? 'every-turn', limit)
      if (res.ok) setState(res.state)
    } catch { /* ignore */ }
  }
  const onRemoveWrongWord = async (itemId: string): Promise<void> => {
    try {
      const res = await englishApi.removeWrongWord(itemId)
      if (res.ok) { setState(res.state); await refreshWrongWords() }
    } catch { /* ignore */ }
  }
  const onClearWrongWords = async (): Promise<void> => {
    try {
      const res = await englishApi.clearWrongWords()
      if (res.ok) { setState(res.state); setWrongWords([]) }
    } catch { /* ignore */ }
  }

  const pickerCancel = (): void => {
    setShowPicker(false)
    setPendingGenerate(false)
    setPickProvider('')
    setPickModel('')
  }

  // 英语学习总开关：从 config 读取初始值
  useEffect(() => {
    fetch('/bga-dsh-workbench/config', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((cfg: unknown) => {
        const c = cfg as { english?: { enabled?: unknown } } | null
        if (c !== null) setEnglishEnabled(typeof c.english?.enabled === 'boolean' ? c.english.enabled : true)
      })
      .catch(() => { /* default on */ })
  }, [])

  const onToggleEnglishEnabled = async (next: boolean): Promise<void> => {
    setEnglishEnabled(next)
    try {
      await fetch('/bga-dsh-workbench/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ english: { enabled: next } }),
      })
      setMessage({ kind: 'ok', text: next ? '外语学习已启用' : '外语学习已关闭' })
    } catch {
      setEnglishEnabled(!next)
      setMessage({ kind: 'error', text: '保存失败' })
    }
  }

  useEffect(() => {
    void refresh(true)
    void refreshWrongWords()
    void refreshDashboard()
    englishApi.builtins().then(res => setBuiltins(res.builtins)).catch(() => { })
    englishApi.models().then(res => {
      const provs = res.providers ?? []
      setPickProviders(provs)
      if (res.hasDefault && res.current.provider && res.current.model) {
        const prov = provs.find(p => p.provider === res.current.provider)
        const name = prov?.models.find(m => m.id === res.current.model)?.name ?? res.current.model
        setDefaultLabel(`${prov?.providerName ?? res.current.provider} · ${name}`)
      }
    }).catch(() => { })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Pop the model picker; optionally run generation after the user confirms. */
  const openPicker = async (alsoGenerate: boolean): Promise<void> => {
    setPendingGenerate(alsoGenerate)
    setPickMessage(null)
    try {
      const res = await englishApi.models()
      const provs = res.providers ?? []
      setPickProviders(provs)
      if (res.current.provider && res.current.model) {
        setPickProvider(res.current.provider)
        setPickModel(res.current.model)
      } else if (provs.length > 0 && provs[0]!.models.length > 0) {
        setPickProvider(provs[0]!.provider)
        setPickModel(provs[0]!.models[0]!.id)
      }
    } catch {
      setPickMessage({ kind: 'error', text: '获取模型列表失败' })
    }
    setShowPicker(true)
  }

  /** When the picker's provider changes, reset the model to the first of that provider. */
  const onPickProviderChange = (provider: string): void => {
    setPickProvider(provider)
    const prov = pickProviders.find(p => p.provider === provider)
    setPickModel(prov && prov.models.length > 0 ? prov.models[0]!.id : '')
  }

  /** Save the chosen default model; if the picker was opened from 生成, run generation too. */
  const pickerConfirm = async (): Promise<void> => {
    if (pickProvider === '' || pickModel === '') {
      setPickMessage({ kind: 'error', text: '请选择提供商与模型' })
      return
    }
    setPickMessage(null)
    setBusy(true)
    try {
      const saved = await englishApi.setDefaultModel(pickProvider, pickModel)
      if (!saved.ok) throw new Error('save failed')
      const prov = pickProviders.find(p => p.provider === pickProvider)
      const name = prov?.models.find(m => m.id === pickModel)?.name ?? pickModel
      setDefaultLabel(`${prov?.providerName ?? pickProvider} · ${name}`)
      setShowPicker(false)
      if (pendingGenerate) {
        setPendingGenerate(false)
        await runGenerate(pickProvider, pickModel)
      } else {
        setMessage({ kind: 'ok', text: '已保存默认模型' })
      }
    } catch {
      setPickMessage({ kind: 'error', text: '保存默认模型失败' })
    } finally {
      setBusy(false)
    }
  }

  const onSelect = async (cardId: string | null): Promise<void> => {
    setEditingCardId(null)
    setBusy(true)
    try {
      const res = await englishApi.select(cardId)
      setState(res.state)
      setMessage({ kind: 'ok', text: '已切换当前话题卡' })
    } catch (error) {
      setMessage({ kind: 'error', text: (error as Error).message })
    } finally {
      setBusy(false)
    }
  }

  const onDeleteCard = (cardId: string, topic: string): void => {
    setConfirmDelete({ cardId, topic })
  }

  const confirmDeleteCard = async (): Promise<void> => {
    if (confirmDelete === null) return
    const { cardId, topic } = confirmDelete
    setConfirmDelete(null)
    setBusy(true)
    try {
      const res = await englishApi.deleteCard(cardId)
      if (res.ok) { setState(res.state); setMessage({ kind: 'ok', text: `已删除话题卡「${topic}」` }) }
      else { setMessage({ kind: 'error', text: '删除失败' }) }
    } catch { setMessage({ kind: 'error', text: '删除失败' }) } finally { setBusy(false) }
  }

  const onSaveCardConfig = async (): Promise<void> => {
    const cardId = editingCardId ?? state?.currentCardId
    if (cardId === null || cardId === undefined) return
    setBusy(true)
    try {
      const res = await englishApi.updateCard(cardId, { topic, mode, mastery, threshold, sessionSize })
      if (res.ok) { setState(res.state); setEditingCardId(null); setMessage({ kind: 'ok', text: '话题卡配置已保存' }) }
      else { setMessage({ kind: 'error', text: '保存失败' }) }
    } catch { setMessage({ kind: 'error', text: '保存失败' }) } finally { setBusy(false) }
  }

  const onBuiltin = async (id: string): Promise<void> => {
    setBusy(true)
    setMessage(null)
    try {
      const res = await englishApi.createFromBuiltin(id, mode, mastery, threshold)
      setState(res.state)
      setMessage({ kind: 'ok', text: '已选用内置词库' })
    } catch (error) {
      setMessage({ kind: 'error', text: (error as Error).message })
    } finally {
      setBusy(false)
    }
  }

  /** Perform the model generation, optionally pinning provider/model. */
  const runGenerate = async (provider?: string, model?: string): Promise<void> => {
    const body: { topic: string; mode: string; mastery: string; threshold: number; provider?: string; model?: string; nativeLang?: string; targetLang?: string } = {
      topic: topic.trim(), mode, mastery, threshold, nativeLang, targetLang,
    }
    if (provider !== undefined && model !== undefined) {
      body.provider = provider
      body.model = model
    }
    setBusy(true)
    setMessage(null)
    try {
      const result = await englishApi.generate(body)
      if (result.ok) {
        // Direct host generation returns the fresh state — update the library immediately.
        setState(result.state)
        setMessage({ kind: 'ok', text: '词库生成成功，已加入话题库' })
      } else {
        setMessage({ kind: 'error', text: result.error ?? '生成失败' })
      }
    } catch {
      setMessage({ kind: 'error', text: '生成失败：网络或服务异常' })
    }
    setBusy(false)
  }

  const onGenerate = async (): Promise<void> => {
    if (topic.trim() === '') {
      setMessage({ kind: 'error', text: '请先输入学习主题' })
      return
    }
    // If a default model is already configured, generate straight away; otherwise
    // pop the model picker so the user chooses a model first.
    try {
      const info = await englishApi.models()
      if (info.hasDefault) {
        await runGenerate()
      } else if (info.providers.length === 0) {
        setMessage({ kind: 'error', text: '当前没有可用模型，请先在「模型」设置里配置' })
      } else {
        await openPicker(true)
      }
    } catch {
      await openPicker(true)
    }
  }

  const onExport = async (): Promise<void> => {
    try {
      const content = await englishApi.exportState()
      const blob = new Blob([content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'english-data.json'
      a.click()
      URL.revokeObjectURL(url)
      setMessage({ kind: 'ok', text: '已导出 english-data.json' })
    } catch (error) {
      setMessage({ kind: 'error', text: (error as Error).message })
    }
  }

  const onImport = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file === undefined) return
    try {
      const content = await file.text()
      const res = await englishApi.importState(content)
      setState(res.state)
      setMessage({ kind: 'ok', text: '已导入学习数据' })
    } catch (error) {
      setMessage({ kind: 'error', text: (error as Error).message })
    } finally {
      event.target.value = ''
    }
  }

  const onReset = (): void => {
    setShowResetConfirm(true)
  }

  const confirmReset = async (): Promise<void> => {
    setShowResetConfirm(false)
    setBusy(true)
    try {
      const res = await englishApi.reset()
      setState(res.state)
      setMessage({ kind: 'ok', text: '已清空外语学习数据' })
    } catch (error) {
      setMessage({ kind: 'error', text: (error as Error).message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{
      background: 'var(--dsw-alias-bg-layer, #fff)', border: '1px solid var(--dsw-alias-border-l2, #ddd)',
      borderRadius: 10, padding: '10px 12px', marginTop: 8,
    }}>
      <h3 style={{ ...h3Style, marginTop: 0 }}>外语学习</h3>

      <div style={rowStyle}>
        <span style={labelStyle}>外语学习总开关</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <input type="checkbox" checked={englishEnabled} onChange={e => void onToggleEnglishEnabled(e.target.checked)} />
          启用外语学习弹窗（整轮对话完成后弹出答题卡）
        </label>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>当前状态</span>
        <span style={captionStyle}>
          ⚡{state?.xp ?? 0} XP · {state?.badge.name ?? '青铜'} · 🔥连击{state?.streak ?? 0}天 · ❤️{state?.day.hearts ?? 5}
        </span>
      </div>

      <div style={rowStyle}>
        <span style={subH3Style}>学习主题卡</span>
      </div>
      {(state?.cards.length ?? 0) === 0 ? (
        <div style={captionStyle}>还没有话题卡，请先用下面按钮选用内置词库，或输入主题生成。</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {(state?.cards ?? []).map(card => {
            const active = card.id === state?.currentCardId
            const editing = card.id === editingCardId
            const percent = card.progress.percent
            return (
              <div
                key={card.id}
                role="button"
                tabIndex={0}
                onClick={() => void onSelect(card.id)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') void onSelect(card.id) }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                title="点击设为当前学习话题卡"
                style={{
                  flex: '0 0 calc(50% - 5px)', maxWidth: 'calc(50% - 5px)', boxSizing: 'border-box',
                  padding: '10px 12px', position: 'relative',
                  border: '1px solid var(--dsw-alias-border-l2, #ddd)',
                  borderRadius: 10, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8,
                  background: active
                    ? 'var(--dsw-alias-brand-primary-weak, rgba(0,112,243,0.08))'
                    : editing
                      ? 'rgba(0,112,243,0.04)'
                      : 'var(--dsw-alias-bg-layer, #fff)',
                  cursor: 'pointer',
                  boxShadow: active
                    ? '0 2px 8px rgba(0,112,243,0.15)'
                    : editing
                      ? '0 2px 8px rgba(0,112,243,0.1)'
                      : hoveredCard === card.id
                        ? 'var(--dsw-shadow-lv2, 0 4px 12px rgba(0,0,0,0.12))'
                        : '0 1px 3px rgba(0,0,0,0.06)',
                  transform: !active && !editing && hoveredCard === card.id ? 'translateY(-1px)' : undefined,
                  transition: 'box-shadow 120ms ease, border-color 120ms ease, transform 120ms ease',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontWeight: 600, fontSize: 14,
                  }}>{card.topic}</span>
                  <button
                    type="button"
                    title="编辑此话题卡配置"
                    onClick={e => {
                      e.stopPropagation()
                      setEditingCardId(card.id)
                      setTopic(card.topic)
                      setMode(card.mode)
                      setMastery(card.mastery)
                      setThreshold(card.threshold)
                      setSessionSize(card.sessionSize)
                    }}
                    onMouseEnter={() => setHoveredEdit(card.id)}
                    onMouseLeave={() => setHoveredEdit(null)}
                    style={{
                      flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 22, height: 22, padding: 0,
                      background: hoveredEdit === card.id ? 'var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.06))' : 'transparent',
                      border: 'none', borderRadius: 6, cursor: 'pointer',
                      color: hoveredEdit === card.id ? 'var(--dsw-alias-brand-primary, #0070f3)' : 'var(--dsw-alias-label-tertiary, #888)',
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    title="查看词库内容"
                    onClick={e => { e.stopPropagation(); setViewingCard({ topic: card.topic, items: card.items.map((it: { type?: string; text: string; meaning: string; example: string; exampleMeaning?: string }) => ({ type: it.type ?? 'word', text: it.text, meaning: it.meaning, example: it.example, exampleMeaning: it.exampleMeaning ?? '' })) }) }}
                    onMouseEnter={() => setHoveredView(card.id)}
                    onMouseLeave={() => setHoveredView(null)}
                    style={{
                      flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 22, height: 22, padding: 0,
                      background: hoveredView === card.id ? 'var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.06))' : 'transparent',
                      border: 'none', borderRadius: 6, cursor: 'pointer',
                      color: hoveredView === card.id ? 'var(--dsw-alias-brand-primary, #0070f3)' : 'var(--dsw-alias-label-tertiary, #888)',
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  {!card.locked && (
                  <button
                    type="button"
                    title="删除此话题卡"
                    onClick={e => { e.stopPropagation(); void onDeleteCard(card.id, card.topic) }}
                    onMouseEnter={() => setHoveredDelete(card.id)}
                    onMouseLeave={() => setHoveredDelete(null)}
                    style={{
                      flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 22, height: 22, padding: 0,
                      background: hoveredDelete === card.id ? 'var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.06))' : 'transparent',
                      border: 'none', borderRadius: 6, cursor: 'pointer',
                      color: hoveredDelete === card.id ? 'var(--dsw-alias-state-error-primary, #c00000)' : 'var(--dsw-alias-label-tertiary, #888)',
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                    </svg>
                  </button>
                  )}
                </span>
                <span style={{ fontSize: 12, opacity: 0.75 }}>
                  {card.progress.mastered}/{card.progress.total} 已掌握 · {percent}%
                </span>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 4 }}>
            <h3 style={{ ...subH3Style, visibility: editingCardId !== null ? 'hidden' : 'visible' }}>按主题生成新主题卡</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {editingCardId !== null ? (
                <>
                  <button type="button" style={buttonStyle} disabled={busy} onClick={() => void onSaveCardConfig()}>
                    保存主题卡
                  </button>
                  <button type="button" style={buttonStyle} disabled={busy} onClick={() => { setEditingCardId(null); setTopic('') }}>
                    取消编辑
                  </button>
                </>
              ) : (
                <button type="button" style={buttonStyle} disabled={busy} onClick={() => void onGenerate()}>
                  {busy ? '生成中…' : '生成主题卡'}
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {editingCardId === null && (
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <div style={{ flex: '0 0 48%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={labelStyle}>母语</span>
              <select style={{ ...inputStyle, minWidth: 0, flex: 1 }} value={nativeLang} onChange={e => setNativeLang(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>
            <div style={{ flex: '0 0 48%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={labelStyle}>外语</span>
              <select style={{ ...inputStyle, minWidth: 0, flex: 1 }} value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>
          </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <div style={{ flex: '0 0 48%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={labelStyle}>主题</span>
              <input style={{ ...inputStyle, minWidth: 0, flex: 1 }} value={topic} onChange={e => setTopic(e.target.value)} disabled={editingCardId !== null} placeholder="例如：人工智能" />
            </div>
            <div style={{ flex: '0 0 48%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={labelStyle}>模式</span>
              <select style={{ ...inputStyle, minWidth: 0, flex: 1 }} value={mode} onChange={e => setMode(e.target.value)}>
                {MODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: '0 0 48%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={labelStyle}>掌握规则</span>
              <select style={{ ...inputStyle, minWidth: 0, flex: 1 }} value={mastery} onChange={e => setMastery(e.target.value)}>
                {MASTERY.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
            <div style={{ flex: '0 0 48%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={labelStyle}>答对数</span>
              <input type="number" min={1} max={20} style={{ ...inputStyle, minWidth: 0, flex: 1 }} value={threshold} onChange={e => setThreshold(Number(e.target.value))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: '0 0 48%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={labelStyle}>每次答题数</span>
              <input type="number" min={1} max={10} style={{ ...inputStyle, minWidth: 0, flex: 1 }} value={sessionSize} onChange={e => setSessionSize(Number(e.target.value))} />
            </div>
          </div>
          </div>
          {editingCardId === null && (
          <div style={rowStyle}>
            <span style={labelStyle}>生成模型</span>
            <span style={captionStyle}>{defaultLabel}</span>
            <button type="button" style={buttonStyle} disabled={busy} onClick={() => void openPicker(false)}>
              选择 / 更换模型
            </button>
          </div>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <h3 style={{ ...subH3Style, marginBottom: 6 }}>添加内置词库（CEFR 分级）为主题卡</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {builtins.map(b => (
              <button key={b.id} type="button" style={buttonStyle} onClick={() => void onBuiltin(b.id)}>
                {b.label}（{b.count}词）
              </button>
            ))}
          </div>
        </div>
      </div>

      <h3 style={{ ...subH3Style, marginTop: 6 }}>数据管理</h3>
      <div style={rowStyle}>
        <button type="button" style={buttonStyle} onClick={() => void onExport()}>导出 JSON</button>
        <button type="button" style={buttonStyle} onClick={() => fileRef.current?.click()}>导入 JSON</button>
        <button type="button" style={buttonStyle} onClick={() => void onReset()}>清空数据</button>
        <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={e => void onImport(e)} />
      </div>

      {/* 学习频率控制 */}
      <h3 style={{ ...subH3Style, marginTop: 6 }}>学习频率</h3>
      <div style={rowStyle}>
        <span style={labelStyle}>答题频率</span>
        <select style={{ ...inputStyle, flex: 1 }} value={state?.frequency ?? 'every-turn'} onChange={e => void onFrequencyChange(e.target.value)}>
          <option value="every-turn">每轮对话后</option>
          <option value="every-2">每 2 轮后</option>
          <option value="every-5">每 5 轮后</option>
          <option value="every-10">每 10 轮后</option>
          <option value="manual">仅手动触发</option>
        </select>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>每日上限</span>
        <input style={{ ...inputStyle, width: 80 }} type="number" min={0} max={50} value={state?.dailyQuizLimit ?? 10} onChange={e => void onDailyLimitChange(Number(e.target.value))} />
        <span style={captionStyle}>次（0 = 不限）</span>
      </div>

      {/* 错词本 */}
      <h3 style={{ ...subH3Style, marginTop: 6 }}>错词本</h3>
      {wrongWords.length === 0 ? (
        <div style={{ ...captionStyle, padding: '8px 0' }}>暂无错词</div>
      ) : (
        <>
          <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid var(--dsw-alias-border-l2, #eee)', borderRadius: 8, marginBottom: 8 }}>
            {wrongWords.map(w => (
              <div key={w.itemId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderBottom: '1px solid var(--dsw-alias-border-l2, #f5f5f5)' }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{w.text}</span>
                  <span style={{ color: 'var(--dsw-alias-label-secondary, #666)', fontSize: 12, marginLeft: 8 }}>{w.meaning}</span>
                  <span style={{ color: 'var(--dsw-alias-label-tertiary, #999)', fontSize: 11, marginLeft: 8 }}>错 {w.wrongCount} 次</span>
                </div>
                <button type="button" style={{ ...buttonStyle, padding: '2px 8px', fontSize: 11 }} onClick={() => void onRemoveWrongWord(w.itemId)}>移除</button>
              </div>
            ))}
          </div>
          <button type="button" style={{ ...buttonStyle, color: 'var(--dsw-alias-state-error-primary, #c00000)', borderColor: 'var(--dsw-alias-state-error-primary, #c00000)' }} onClick={() => void onClearWrongWords()}>清空错词本</button>
        </>
      )}

      {/* 学习报告 */}
      <h3 style={{ ...subH3Style, marginTop: 6 }}>学习报告</h3>
      {dashboard !== null ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '8px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--dsw-alias-brand-primary, #0070f3)' }}>{dashboard.xp}</div>
            <div style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary, #999)' }}>总 XP</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#ff6b35' }}>{dashboard.streak}</div>
            <div style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary, #999)' }}>连续天数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--dsw-alias-state-success-primary, #2e8e52)' }}>{dashboard.masteredCards}/{dashboard.totalCards}</div>
            <div style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary, #999)' }}>已掌握卡</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{dashboard.totalCompleted}</div>
            <div style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary, #999)' }}>已掌握词</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--dsw-alias-state-error-primary, #c00000)' }}>{dashboard.totalWrong}</div>
            <div style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary, #999)' }}>错词数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{dashboard.statistics.answers > 0 ? Math.round(dashboard.statistics.correct / dashboard.statistics.answers * 100) : 0}%</div>
            <div style={{ fontSize: 11, color: 'var(--dsw-alias-label-tertiary, #999)' }}>正确率</div>
          </div>
        </div>
      ) : (
        <div style={{ ...captionStyle, padding: '8px 0' }}>加载中...</div>
      )}

      {message !== null && (
        <div style={message.kind === 'ok' ? okStyle : errorStyle}>{message.text}</div>
      )}

      {showPicker && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)',
        }} onClick={pickerCancel}>
          <div
            style={{
              width: 460, maxWidth: '92vw', borderRadius: 14, padding: 20,
              background: 'var(--dsw-alias-bg-layer, #fff)', color: 'var(--dsw-alias-text-primary, #111)',
              boxShadow: '0 18px 60px rgba(0,0,0,0.35)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 15, margin: '0 0 12px' }}>选择生成模型</h3>
            <div style={rowStyle}>
              <span style={labelStyle}>提供商</span>
              <select style={{ ...inputStyle, flex: 1 }} value={pickProvider} onChange={e => onPickProviderChange(e.target.value)}>
                {(pickProviders.length === 0) && <option value="">（无可用提供商）</option>}
                {pickProviders.map(p => (
                  <option key={p.provider} value={p.provider}>{p.providerName}</option>
                ))}
              </select>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>模型</span>
              <select style={{ ...inputStyle, flex: 1 }} value={pickModel} onChange={e => setPickModel(e.target.value)}>
                {(pickProviders.find(p => p.provider === pickProvider)?.models.length ?? 0) === 0 && <option value="">（该提供商无模型）</option>}
                {(pickProviders.find(p => p.provider === pickProvider)?.models ?? []).map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            {pickMessage !== null && (
              <div style={pickMessage.kind === 'ok' ? okStyle : errorStyle}>{pickMessage.text}</div>
            )}
            <div style={{ ...rowStyle, justifyContent: 'flex-end', marginTop: 12 }}>
              <button type="button" style={buttonStyle} onClick={pickerCancel}>取消</button>
              <button type="button" style={{ ...buttonStyle, borderColor: 'var(--dsw-alias-brand-primary, #0070f3)', color: 'var(--dsw-alias-brand-primary, #0070f3)' }} disabled={busy} onClick={() => void pickerConfirm()}>
                {pendingGenerate ? '保存并生成' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete !== null && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dsw-alias-bg-mask-1, rgba(0,0,0,0.45))' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setConfirmDelete(null) }}
        >
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12, width: 'min(400px, calc(100vw - 48px))',
            padding: 18, background: 'var(--dsw-alias-bg-base, #fff)', border: '1px solid var(--dsw-alias-border-l2, #ddd)',
            borderRadius: 14, boxShadow: 'var(--dsw-shadow-lv3, 0 18px 60px rgba(0,0,0,0.35))',
            color: 'var(--dsw-alias-text-primary, #111)',
          }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>删除话题卡</h2>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--dsw-alias-label-secondary, #666)' }}>
              确定要删除话题卡「{confirmDelete.topic}」吗？此操作不可撤销。
            </p>
            <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <button type="button" style={{ padding: '5px 12px', fontSize: 12, color: 'var(--dsw-alias-text-primary, #111)', background: 'transparent', border: '1px solid var(--dsw-alias-border-l2, #ccc)', borderRadius: 8, cursor: 'pointer' }} onClick={() => setConfirmDelete(null)}>
                取消
              </button>
              <button type="button" style={{ padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--dsw-alias-state-error-primary, #c00000)', border: 'none', borderRadius: 8, cursor: 'pointer' }} onClick={() => void confirmDeleteCard()}>
                删除
              </button>
            </footer>
          </div>
        </div>
      )}

      {viewingCard !== null && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dsw-alias-bg-mask-1, rgba(0,0,0,0.45))' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setViewingCard(null) }}
        >
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 0, width: 'min(520px, calc(100vw - 48px))', maxHeight: 'calc(100vh - 280px)',
            background: 'var(--dsw-alias-bg-base, #fff)', border: '1px solid var(--dsw-alias-border-l2, #ddd)',
            borderRadius: 14, boxShadow: 'var(--dsw-shadow-lv3, 0 18px 60px rgba(0,0,0,0.35))',
            color: 'var(--dsw-alias-text-primary, #111)', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--dsw-alias-border-l2, #eee)' }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{viewingCard.topic}</h2>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--dsw-alias-label-tertiary, #888)', fontSize: 18, lineHeight: 1 }} onClick={() => setViewingCard(null)}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {viewingCard.items.map((it, idx) => (
                <div key={idx} style={{ padding: '8px 18px', borderBottom: idx < viewingCard.items.length - 1 ? '1px solid var(--dsw-alias-border-l2, #f0f0f0)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{
                      flex: 'none', fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 4,
                      background: it.type === 'sentence' ? 'rgba(0,112,243,0.1)' : 'rgba(0,0,0,0.05)',
                      color: it.type === 'sentence' ? 'var(--dsw-alias-brand-primary, #0070f3)' : 'var(--dsw-alias-label-secondary, #666)',
                    }}>
                      {it.type === 'sentence' ? '句子' : '单词'}
                    </span>
                    <span style={{ fontSize: 14 }}>
                      <span style={{ fontWeight: 600 }}>{it.text}</span>
                      <span style={{ color: 'var(--dsw-alias-label-secondary, #666)' }}> ｜ {it.meaning}</span>
                    </span>
                  </div>
                  {it.example !== '' && it.type !== 'sentence' && (
                    <>
                      <div style={{ fontSize: 12, color: 'var(--dsw-alias-label-tertiary, #999)', marginTop: 2, fontStyle: 'italic', paddingLeft: 30 }}>{it.example}</div>
                      {it.exampleMeaning !== '' && <div style={{ fontSize: 12, color: 'var(--dsw-alias-label-tertiary, #999)', marginTop: 1, paddingLeft: 30 }}>{it.exampleMeaning}</div>}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--dsw-alias-border-l2, #eee)', textAlign: 'right' }}>
              <button type="button" style={{ padding: '5px 14px', fontSize: 12, color: 'var(--dsw-alias-text-primary, #111)', background: 'transparent', border: '1px solid var(--dsw-alias-border-l2, #ccc)', borderRadius: 8, cursor: 'pointer' }} onClick={() => setViewingCard(null)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dsw-alias-bg-mask-1, rgba(0,0,0,0.45))' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setShowResetConfirm(false) }}
        >
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12, width: 'min(400px, calc(100vw - 48px))',
            padding: 18, background: 'var(--dsw-alias-bg-base, #fff)', border: '1px solid var(--dsw-alias-border-l2, #ddd)',
            borderRadius: 14, boxShadow: 'var(--dsw-shadow-lv3, 0 18px 60px rgba(0,0,0,0.35))',
            color: 'var(--dsw-alias-text-primary, #111)',
          }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>清空数据</h2>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--dsw-alias-label-secondary, #666)' }}>
              确定要清空全部外语学习数据吗？此操作不可恢复，所有话题卡、学习进度和经验值都将被删除。
            </p>
            <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <button type="button" style={{ padding: '5px 12px', fontSize: 12, color: 'var(--dsw-alias-text-primary, #111)', background: 'transparent', border: '1px solid var(--dsw-alias-border-l2, #ccc)', borderRadius: 8, cursor: 'pointer' }} onClick={() => setShowResetConfirm(false)}>
                取消
              </button>
              <button type="button" style={{ padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--dsw-alias-state-error-primary, #c00000)', border: 'none', borderRadius: 8, cursor: 'pointer' }} onClick={() => void confirmReset()}>
                清空
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}
