/**
 * Built-in CEFR-graded vocabulary the user can adopt with one click,
 * avoiding a model-generation round-trip. Each entry has an English word and
 * a short Chinese meaning plus a tiny example.
 */
export interface BuiltinWord {
    text: string;
    meaning: string;
    example: string;
    exampleMeaning: string;
}
export interface BuiltinList {
    id: string;
    label: string;
    level: string;
    words: BuiltinWord[];
}
export declare const BUILTIN_LISTS: BuiltinList[];
/** Look up a built-in list by its id. */
export declare function findBuiltinList(id: string): BuiltinList | undefined;
