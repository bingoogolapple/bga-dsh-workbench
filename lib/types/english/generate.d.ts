/**
 * Host-side, direct model-driven word generation.
 *
 * Uses the `llm` service's `stream()` to make a single temporary LLM request
 * (no agent session), combined with `agentDefaultModel` so the plugin reuses
 * the user's currently-selected provider+model. This is far more reliable and
 * cheaper than driving a full agent session just to emit a JSON word list.
 */
import type { Context } from '@deepseek-ai/cordis';
/**
 * Call the model once for `topic` and return the model's raw reply text.
 * Returns undefined when the llm service is unavailable, neither an explicit
 * selection nor a default model is available, or the stream ends normally
 * with no text. Throws with the model's actual failure reason when the stream
 * terminates on an error/abort, so the settings page shows why generation failed.
 */
export declare function generateEnglishText(ctx: Context, topic: string, selection?: {
    provider: string;
    model: string;
}, nativeLang?: string, targetLang?: string): Promise<string | undefined>;
/** Extract the first JSON value (object or array) from an assistant text. */
export declare function extractJson(text: string): unknown;
/**
 * List every registered provider route and the models it advertises, for a
 * model picker in the settings panel. Returns an empty array when the `llm`
 * service is unavailable or listing fails.
 */
export declare function listEnglishModels(ctx: Context): Promise<Array<{
    provider: string;
    providerName: string;
    models: Array<{
        id: string;
        name: string;
    }>;
}>>;
