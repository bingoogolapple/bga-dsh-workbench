import type { WebRoute } from '@deepseek-ai/dsh-host-webserver';
import { type EnglishState } from './model.ts';
/** Sanitise a topic string to a usable card name. */
export interface EnglishRuntime {
    storageDir: string;
}
/**
 * Build the English-learning routes. `load`/`save` are injected so tests can
 * swap the backing store; defaults read/write the storage directory.
 */
export declare function createEnglishRoutes(options: {
    storageDir: string;
    load?: (dir: string) => Promise<EnglishState>;
    save?: (dir: string, state: EnglishState) => Promise<void>;
    /** Direct-LLM generator callback (host provides ctx-bound impl). Returns the model's raw reply text. */
    generateText?: (topic: string, selection?: {
        provider: string;
        model: string;
    }, nativeLang?: string, targetLang?: string) => Promise<string | undefined>;
    /** List available providers and their models (host provides ctx-bound impl). */
    listModels?: () => Promise<Array<{
        provider: string;
        providerName: string;
        models: Array<{
            id: string;
            name: string;
        }>;
    }>>;
    /** Read the currently-selected default model. */
    currentSelection?: () => {
        provider?: string;
        model?: string;
    };
    /** Persist the user's chosen default model. */
    saveSelection?: (selection: {
        provider: string;
        model: string;
    }) => Promise<void>;
}): WebRoute[];
