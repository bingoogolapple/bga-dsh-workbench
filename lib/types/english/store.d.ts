import { type EnglishState } from './model.ts';
/** File name for the English learning ledger in the storage directory. */
export declare const ENGLISH_FILE = "english-data.json";
/** The topic name used for the built-in Basic English 850 card. */
export declare const BASIC_ENGLISH_TOPIC = "Basic English 850";
/** Read the ledger; returns a fresh default state on any read/parse failure. */
export declare function loadEnglishState(storageDir: string): Promise<EnglishState>;
/** Ensure the locked Basic English 850 card exists in the state. */
export declare function ensureBasicEnglish850(state: EnglishState): void;
/** Persist the whole ledger to disk. */
export declare function saveEnglishState(storageDir: string, state: EnglishState): Promise<void>;
