/**
 * Browser-side API client for the English-learning ledger routes.
 * Thin wrapper over fetch to the /bga-dsh-workbench/english/* endpoints the
 * host serves; every call returns plain JSON matching the host contract.
 */
export interface PublicItem {
    id: string;
    text: string;
    meaning: string;
    example: string;
    status: 'new' | 'learning' | 'known' | 'mastered';
    correctCount: number;
    xpEarned: number;
}
export interface PublicCard {
    id: string;
    topic: string;
    mode: 'copy' | 'recall' | 'choice' | 'audio';
    mastery: 'count' | 'srs';
    threshold: number;
    targetLang: string;
    sessionSize: number;
    locked: boolean;
    createdAt: number;
    progress: {
        total: number;
        mastered: number;
        percent: number;
    };
    items: PublicItem[];
}
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
export interface PublicState {
    cards: PublicCard[];
    currentCardId: string | null;
    day: {
        date: string;
        hearts: number;
        completedToday: number;
        correctToday: number;
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
    frequency: string;
    dailyQuizLimit: number;
    quizzesToday: number;
    quizzesDate: string;
}
export interface QuizQuestion {
    itemId: string;
    cardId: string;
    mode: 'copy' | 'recall' | 'choice' | 'audio';
    prompt: string;
    hint: string;
    choices?: string[];
    answer: string;
    example: string;
}
export interface QuizResult {
    ok: 'correct' | 'wrong';
    item: PublicItem;
    cardId: string;
    mastered: boolean;
    heartsLeft: number;
    xpDelta: number;
    streak: number;
    locked: boolean;
    answer: string;
    progress: PublicCard['progress'];
}
export interface BuiltinInfo {
    id: string;
    label: string;
    level: string;
    count: number;
}
export declare const englishApi: {
    state: () => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    next: () => Promise<{
        ok: boolean;
        question: QuizQuestion | null;
        reason?: string;
        targetLang?: string;
    }>;
    builtins: () => Promise<{
        ok: boolean;
        builtins: BuiltinInfo[];
    }>;
    result: (body: {
        itemId: string;
        cardId: string;
        answer: string;
        mode: string;
    }) => Promise<{
        ok: boolean;
        result: QuizResult;
        state: PublicState;
    }>;
    select: (cardId: string | null) => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    createFromBuiltin: (builtin: string, mode: string, mastery: string, threshold: number) => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    createGenerated: (card: {
        topic: string;
        mode: string;
        mastery: string;
        threshold: number;
        items: Array<{
            text: string;
            meaning: string;
            example?: string;
        }>;
    }) => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    generate: (params: {
        topic: string;
        mode: string;
        mastery: string;
        threshold: number;
        provider?: string;
        model?: string;
        nativeLang?: string;
        targetLang?: string;
    }) => Promise<{
        ok: boolean;
        state: PublicState;
        error?: string;
    }>;
    models: () => Promise<{
        ok: boolean;
        providers: Array<{
            provider: string;
            providerName: string;
            models: Array<{
                id: string;
                name: string;
            }>;
        }>;
        current: {
            provider: string | null;
            model: string | null;
        };
        hasDefault: boolean;
    }>;
    setDefaultModel: (provider: string, model: string) => Promise<{
        ok: boolean;
        provider: string;
        model: string;
    }>;
    importState: (content: string) => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    exportState: () => Promise<string>;
    updateCard: (cardId: string, patch: {
        topic?: string;
        mode?: string;
        mastery?: string;
        threshold?: number;
        sessionSize?: number;
    }) => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    deleteCard: (cardId: string) => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    reset: () => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    wrongWords: () => Promise<{
        ok: boolean;
        wrongWords: WrongWordEntry[];
    }>;
    clearWrongWords: () => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    removeWrongWord: (itemId: string) => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    setFrequency: (frequency: string, dailyQuizLimit?: number) => Promise<{
        ok: boolean;
        state: PublicState;
    }>;
    dashboard: () => Promise<{
        ok: boolean;
        xp: number;
        streak: number;
        totalCompleted: number;
        totalWrong: number;
        totalCards: number;
        masteredCards: number;
        statistics: {
            answers: number;
            correct: number;
            wrong: number;
            xp: number;
        };
        day: {
            date: string;
            hearts: number;
            completedToday: number;
            correctToday: number;
            wrongToday: number;
        };
    }>;
};
