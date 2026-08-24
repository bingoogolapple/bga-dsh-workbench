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
    id: string;
    /** Type: word (单词/短语) or sentence (完整句子). */
    type: 'word' | 'sentence';
    /** The English word or sentence. */
    text: string;
    /** Chinese meaning / prompt for recall + recall mode. */
    meaning: string;
    /** Optional example sentence using the word. */
    example: string;
    /** Chinese translation of the example sentence. */
    exampleMeaning: string;
    /** Mastery stage: new -> learning -> known -> mastered. */
    status: 'new' | 'learning' | 'known' | 'mastered';
    /** Cumulative correct answers (still tracked for the "by count" mode). */
    correctCount: number;
    /** Timestamp of the last correct answer (ms). */
    lastCorrectAt: number | null;
    /** SRS: timestamp at/after which the item is due for review (ms). */
    nextReviewAt: number;
    /** SRS: current spacing interval in days. */
    intervalDays: number;
    /** SRS: ease factor multiplier (start 2.5). */
    ease: number;
    /** Total XP this item has earned. */
    xpEarned: number;
}
/** One topic card = one learning path ("skill tree" node). */
export interface EnglishCard {
    id: string;
    topic: string;
    /** Quiz mode default for this card: copy (scoring typing) | recall | choice | audio. */
    mode: 'copy' | 'recall' | 'choice' | 'audio';
    /** Mastery rule: 'count' (answer N times) or 'srs' (spaced repetition). */
    mastery: 'count' | 'srs';
    /** Correct-answer threshold when mastery === 'count'. */
    threshold: number;
    /** Target language code (e.g. 'en', 'ja', 'ko'). */
    targetLang: string;
    /** Number of questions per learning session (1–50, default 5). */
    sessionSize: number;
    /** Locked cards cannot be deleted (e.g. the built-in Basic English 850 card). */
    locked?: boolean;
    createdAt: number;
    items: EnglishItem[];
}
/** Today-scoped streak / hearts ledger. */
export interface EnglishDayState {
    /** Date key (YYYY-MM-DD, local) this state belongs to. */
    date: string;
    /** Hearts remaining today (5 max). */
    hearts: number;
    /** How many items were mastered today. */
    completedToday: number;
    /** Total correct answers today. */
    correctToday: number;
    /** Total wrong answers today. */
    wrongToday: number;
}
/** A wrong word entry for the notebook. */
export interface WrongWordEntry {
    itemId: string;
    cardId: string;
    text: string;
    meaning: string;
    example: string;
    wrongCount: number;
    lastWrongAt: number;
    addedAt: number;
}
/** Learning frequency setting: how often to show quiz after conversation turns. */
export type LearningFrequency = 'every-turn' | 'every-2' | 'every-5' | 'every-10' | 'manual';
/** Global learning progress / gamification state. */
export interface EnglishState {
    cards: EnglishCard[];
    currentCardId: string | null;
    day: EnglishDayState;
    /** Streak: number of consecutive active days. */
    streak: number;
    /** Last date (YYYY-MM-DD) on which a correct answer was recorded. */
    lastActiveDate: string | null;
    /** Cumulative XP. */
    xp: number;
    /** Cumulative mastered items ever. */
    totalCompleted: number;
    /** Total answers recorded (for stats). */
    totalAnswers: number;
    statistics: {
        answers: number;
        correct: number;
        wrong: number;
        xp: number;
    };
    /** Wrong word notebook: items the user got wrong, for review. */
    wrongWords: WrongWordEntry[];
    /** Learning frequency: how often to show quiz after conversation turns. */
    frequency: LearningFrequency;
    /** Maximum quizzes per day (0 = unlimited). */
    dailyQuizLimit: number;
    /** How many quizzes shown today (resets daily). */
    quizzesToday: number;
    /** Date for the quizzesToday counter. */
    quizzesDate: string;
}
/** Quiz question handed to the client (never leaks the answer in recall/audio). */
export interface EnglishQuestion {
    itemId: string;
    cardId: string;
    /** Mode the question is presented in. */
    mode: 'copy' | 'recall' | 'choice' | 'audio';
    /** Copy mode: the English text to type back. Recall: the Chinese prompt. */
    prompt: string;
    /** For copy/audio: placeholder meaning (not the answer text). */
    hint: string;
    /** For choice mode: the four options (shuffled), one is the answer. */
    choices?: string[];
    /** The correct English text (used by the client to compare). */
    answer: string;
    /** The item's example sentence (audio/example readout). */
    example: string;
}
/** Result of grading one user answer. */
export interface EnglishResult {
    ok: 'correct' | 'wrong';
    /** Item after applying the outcome. */
    item: EnglishItem;
    cardId: string;
    /** Whether this answer flipped the item to mastered. */
    mastered: boolean;
    /** Hearts left (may have dropped on a wrong answer). */
    heartsLeft: number;
    /** XP delta this answer. */
    xpDelta: number;
    /** Running streak. */
    streak: number;
    /** Hearts locked (0 = locked for today). */
    locked: boolean;
    /** Correct answer (for wrong feedback / audio). */
    answer: string;
    /** Updated card progress summary. */
    progress: EnglishCardProgress;
}
/** Lightweight progress summary of one card. */
export interface EnglishCardProgress {
    total: number;
    mastered: number;
    percent: number;
}
/** SRS default schedule (days). */
export declare const SRS_INTERVALS: readonly [1, 3, 7, 15, 30, 60];
/** Default hearts per day. */
export declare const DAILY_HEARTS = 5;
/** Generate a short collision-resistant id. */
export declare function nanoid(length?: number): string;
/** Local date key (YYYY-MM-DD) for a timestamp. */
export declare function localDateKey(now?: number): string;
/** Difference in whole days between two local date keys (positive if tomorrow). */
export declare function dateDiff(a: string, b: string): number;
/** Create a fresh EnglishItem. */
export declare function makeItem(text: string, meaning: string, example?: string, type?: 'word' | 'sentence', exampleMeaning?: string): EnglishItem;
/** Build a fresh card from generated (or built-in) entries. */
export declare function makeCard(topic: string, mode: EnglishCard['mode'], mastery: EnglishCard['mastery'], threshold: number, entries: Array<{
    text: string;
    meaning: string;
    example?: string;
    type?: 'word' | 'sentence';
    exampleMeaning?: string;
}>, targetLang?: string, sessionSize?: number): EnglishCard;
/** Create an empty, healthy default state on first run. */
export declare function makeDefaultState(): EnglishState;
/** Canonicalise text for forgiving comparison (trim, lowercase, collapse spaces). */
export declare function normalizeAnswer(text: string): string;
/** Roll the day ledger if the stored date is not today. */
export declare function rollDay(state: EnglishState, now?: number): void;
/** Advance or keep the streak, given a mastered/correct activity on `now`. */
export declare function bumpStreak(state: EnglishState, now?: number): void;
/**
 * Grade one answer against an item and mutate the state accordingly.
 * Returns the `EnglishResult` describing the outcome. Pure mutation; caller
 * persists afterwards.
 */
export declare function gradeAnswer(state: EnglishState, itemId: string, cardId: string, userText: string, now?: number): EnglishResult;
/** Advance an SRS interval to the next tier. */
export declare function nextInterval(current: number): number;
/** Whether an item is already mastered. */
export declare function isMastered(item: EnglishItem): boolean;
/** Reset progress on a wrong answer (back toward new). */
export declare function resetItemProgress(item: EnglishItem): void;
/** Pick the next due item to practise from the active card, or null if none. */
export declare function pickNextItem(card: EnglishCard, now?: number): EnglishItem | null;
/** Build the quiz question surface for a mode (never leaks the answer for recall/audio). */
export declare function buildQuestion(card: EnglishCard, item: EnglishItem): EnglishQuestion;
/** Build 4 choices for choice mode: the answer + 3 distinct distractors. */
export declare function buildChoices(card: EnglishCard, item: EnglishItem): string[];
/** Progress summary for a card. */
export declare function progressOf(card: EnglishCard): EnglishCardProgress;
/** Serialisable snapshot of the whole state (what the client sees). */
export declare function publicState(state: EnglishState): {
    cards: {
        id: string;
        topic: string;
        mode: "copy" | "recall" | "choice" | "audio";
        mastery: "count" | "srs";
        threshold: number;
        targetLang: string;
        sessionSize: number;
        locked: boolean;
        createdAt: number;
        progress: EnglishCardProgress;
        items: {
            id: string;
            type: "word" | "sentence";
            text: string;
            meaning: string;
            example: string;
            exampleMeaning: string;
            status: "new" | "learning" | "known" | "mastered";
            correctCount: number;
            xpEarned: number;
        }[];
    }[];
    currentCardId: string | null;
    day: {
        /** Date key (YYYY-MM-DD, local) this state belongs to. */
        date: string;
        /** Hearts remaining today (5 max). */
        hearts: number;
        /** How many items were mastered today. */
        completedToday: number;
        /** Total correct answers today. */
        correctToday: number;
        /** Total wrong answers today. */
        wrongToday: number;
    };
    streak: number;
    xp: number;
    totalCompleted: number;
    statistics: {
        answers: number;
        correct: number;
        wrong: number;
        xp: number;
    };
    badge: {
        tier: number;
        name: string;
        next: number;
    };
    frequency: LearningFrequency;
    dailyQuizLimit: number;
    quizzesToday: number;
    quizzesDate: string;
};
/** XP -> badge tier. */
export declare function badgeForXp(xp: number): {
    tier: number;
    name: string;
    next: number;
};
/** Export payload: the full state as a portable JSON document. */
export declare function exportState(state: EnglishState): string;
/** Validate + parse an imported JSON document, tolerating old/partial shapes. */
export declare function parseImport(text: string): EnglishState | undefined;
