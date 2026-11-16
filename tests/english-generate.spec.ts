import type { Context } from '@deepseek-ai/cordis'
import type { GenerateOptions } from '@deepseek-ai/dsh-llm'
import { describe, expect, it, vi } from 'vitest'
import { generateEnglishText, saveEnglishDefaultModel } from '../src/english/generate.ts'

function hostModel() {
  const currentSelection = () => ({ provider: 'test', model: 'selected', reasoningEffort: 'high' })
  const saveSelection = vi.fn(async () => {})
  const stream = vi.fn(async function* (_options: GenerateOptions) { yield { type: 'text-delta', text: ' [] ' } })
  const resolveModelInfo = vi.fn(async () => ({ reasoning: { defaultEffort: 'low' } }))
  const services = {
    agentDefaultModel: { currentSelection, saveSelection },
    llm: { stream, resolveModelInfo },
  }
  const ctx = { get: (name: keyof typeof services) => services[name] } as unknown as Context
  return { ctx, saveSelection, stream }
}

describe('English model selection', () => {
  it('uses the configured reasoning effort only on the matching model route', async () => {
    const { ctx, stream } = hostModel()
    await expect(generateEnglishText(ctx, 'food')).resolves.toBe('[]')
    await generateEnglishText(ctx, 'food', { provider: 'test', model: 'other' })

    expect(stream).toHaveBeenNthCalledWith(1, expect.objectContaining({ model: 'selected', reasoningEffort: 'high' }))
    expect(stream.mock.calls[1]![0]).not.toHaveProperty('reasoningEffort')
  })

  it('keeps the current effort for the same default and uses the new model default when switching', async () => {
    const { ctx, saveSelection } = hostModel()
    await saveEnglishDefaultModel(ctx, { provider: 'test', model: 'selected' })
    await saveEnglishDefaultModel(ctx, { provider: 'test', model: 'other' })

    expect(saveSelection).toHaveBeenNthCalledWith(1, { provider: 'test', model: 'selected', reasoningEffort: 'high' })
    expect(saveSelection).toHaveBeenNthCalledWith(2, { provider: 'test', model: 'other', reasoningEffort: 'low' })
  })
})
