/**
 * Host-side, direct model-driven word generation.
 *
 * Uses the `llm` service's `stream()` to make a single temporary LLM request
 * (no agent session), combined with `agentDefaultModel` so the plugin reuses
 * the user's currently-selected provider+model. This is far more reliable and
 * cheaper than driving a full agent session just to emit a JSON word list.
 */
import type { Context } from '@deepseek-ai/cordis'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'

/** The LLM instruction used to produce a topic word list. */
const SYSTEM_PROMPT = '你是专注为中国英语学习者生成词汇学习内容的助手。只输出用户要求的 JSON，不要任何解释。'

function userPrompt(topic: string, nativeLang?: string, targetLang?: string): string {
  const langLabels: Record<string, string> = { zh: '中文', en: 'English', ja: '日本語', ko: '한국어', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português', ru: 'Русский', ar: 'العربية' }
  const nativeLabel = langLabels[nativeLang ?? ''] ?? '中文'
  const isSimpleEnglish = targetLang === 'en-simple'
  const targetLabel = isSimpleEnglish ? 'Simple English' : (langLabels[targetLang ?? ''] ?? 'English')

  if (isSimpleEnglish) {
    return `请为主题「${topic}」生成适合学习 Simple English 的${nativeLabel}母语者学习内容。Simple English 只使用约850个最基础的英语词汇（Basic English），句子结构也必须简单。只输出一个严格 JSON 数组，不要任何其它文字、不要 markdown 代码块、不要前后缀说明。数组元素混合包含两种类型：1) 单词/短语 {"type":"word","text":"英文单词或短语（必须来自Basic English 850词表，如 need, give, good, water, work, think, come, go, take, make, see, know, say, get, put, run, eat, drink, play, stop, start, help, like, love, big, small, old, new, hot, cold, long, short, right, wrong, every, some, many, much, more, most, first, last, next, here, there, now, then, yes, no, not, and, but, or, with, for, from, into, about, before, after, over, under, up, down, off, on, in, out, at, by, to, of, is, are, was, were, have, has, had, can, could, will, would, shall, should, may, might, do, does, did 等）","meaning":"${nativeLabel}释义","example":"用上述简单词汇组成的一个短例句（不超过10个词）","exampleMeaning":"例句的${nativeLabel}翻译"}；2) 实用句子 {"type":"sentence","text":"一个简短的英文句子（只用Basic English词汇，不超过12个词）","meaning":"${nativeLabel}翻译","example":"","exampleMeaning":""}。单词和句子各至少10条，具体数量由你根据主题灵活决定。确保每条 text 唯一、用词正确、只使用最基础的英语词汇，适合英语初学者。`
  }

  return `请为主题「${topic}」生成适合学习${targetLabel}的${nativeLabel}母语者学习内容。只输出一个严格 JSON 数组，不要任何其它文字、不要 markdown 代码块、不要前后缀说明。数组元素混合包含两种类型：1) 单词/短语 {"type":"word","text":"${targetLabel}单词或短语","meaning":"${nativeLabel}释义","example":"包含该词的一个${targetLabel}例句","exampleMeaning":"例句的${nativeLabel}翻译"}；2) 实用句子 {"type":"sentence","text":"一个完整的${targetLabel}句子","meaning":"${nativeLabel}翻译","example":"","exampleMeaning":""}。单词和句子各至少10条，具体数量由你根据主题灵活决定。确保每条 text 唯一、用词正确、难度适合初中级${targetLabel}学习者。`
}

/** Build a human-readable description of a terminal error/aborted finish chunk. */
function describeFailure(reason: { kind: string; failure?: { message?: string; code?: string } }): string {
  const msg = reason.failure?.message
  const code = reason.failure?.code
  const detail = msg && msg.length > 0 ? msg : reason.kind
  return code ? `模型请求失败[${code}]：${detail}` : `模型请求失败：${detail}`
}

/**
 * Call the model once for `topic` and return the model's raw reply text.
 * Returns undefined when the llm service is unavailable, neither an explicit
 * selection nor a default model is available, or the stream ends normally
 * with no text. Throws with the model's actual failure reason when the stream
 * terminates on an error/abort, so the settings page shows why generation failed.
 */
export async function generateEnglishText(
  ctx: Context,
  topic: string,
  selection?: { provider: string; model: string },
  nativeLang?: string,
  targetLang?: string,
): Promise<string | undefined> {
  const llm = ctx.get('llm') as {
    stream(options: GenerateOptions): AsyncIterable<StreamChunk>
  } | undefined
  if (llm === undefined) return undefined

  // If the caller did not pin a provider/model, fall back to the user's
  // currently-selected default model (if any).
  let provider = selection?.provider
  let model = selection?.model
  if (provider === undefined || model === undefined) {
    const defaultModel = ctx.get('agentDefaultModel') as { currentSelection(): { provider?: string; model?: string } } | undefined
    if (defaultModel !== undefined) {
      const current = defaultModel.currentSelection()
      provider = provider ?? current.provider
      model = model ?? current.model
    }
  }
  if (provider === undefined || model === undefined) return undefined

  // DSH's Message model needs ContentBlock[] content (plus id/role/source), so
  // we build a proper user message instead of passing a raw string.
  const userMessage = createUserMessage({
    content: [{ type: 'text', text: userPrompt(topic, nativeLang, targetLang) }],
    source: { kind: 'user' },
  })

  let text = ''
  try {
    for await (const chunk of llm.stream({
      provider,
      model,
      system: SYSTEM_PROMPT,
      messages: [userMessage],
      temperature: 0.6,
    })) {
      if (chunk.type === 'text-delta' && typeof chunk.text === 'string') text += chunk.text
      else if (chunk.type === 'finish') {
        const reason = chunk.reason
        if (reason.kind === 'error' || reason.kind === 'aborted') {
          throw new Error(describeFailure(reason as { kind: string; failure?: { message?: string; code?: string } }))
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('模型请求失败')) throw error
    throw new Error(`模型请求失败：${(error as Error)?.message ?? String(error)}`)
  }
  const trimmed = text.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/** Extract the first JSON value (object or array) from an assistant text. */
export function extractJson(text: string): unknown {
  const start = text.search(/[\[{]/u)
  if (start < 0) return undefined
  let depth = 0
  let inString = false
  let escape = false
  let end = -1
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i]!
    if (escape) { escape = false; continue }
    if (inString) {
      if (ch === '\\') escape = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') { inString = true; continue }
    if (ch === '[' || ch === '{') { depth += 1; continue }
    if (ch === ']' || ch === '}') {
      depth -= 1
      if (depth === 0) { end = i + 1; break }
    }
  }
  if (end < 0) return undefined
  try {
    return JSON.parse(text.slice(start, end))
  } catch {
    return undefined
  }
}

/**
 * List every registered provider route and the models it advertises, for a
 * model picker in the settings panel. Returns an empty array when the `llm`
 * service is unavailable or listing fails.
 */
export async function listEnglishModels(ctx: Context): Promise<Array<{ provider: string; providerName: string; models: Array<{ id: string; name: string }> }>> {
  const llm = ctx.get('llm') as {
    listProviders(): Array<{ id: string; name: string }>
    listModels(provider: string): Promise<Array<{ id: string; name: string }>>
  } | undefined
  if (llm === undefined) return []
  try {
    const providers = llm.listProviders()
    const result: Array<{ provider: string; providerName: string; models: Array<{ id: string; name: string }> }> = []
    for (const provider of providers) {
      const models = await llm.listModels(provider.id)
      result.push({
        provider: provider.id,
        providerName: provider.name,
        models: models.map(m => ({ id: m.id, name: m.name })),
      })
    }
    return result
  } catch {
    return []
  }
}
