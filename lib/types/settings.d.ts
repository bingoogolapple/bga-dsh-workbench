import z from '@deepseek-ai/schemastery';
import type { WorkbenchConfig } from './routes.ts';
export declare const WORKBENCH_ENTRY_ID = "bga-dsh-workbench";
export declare const DEFAULT_TEXT = "\u7684\u4E13\u5C5E Harness \u5DE5\u4F5C\u53F0";
export declare function defaultStorageDir(): string;
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    avatarPath: z<string, string, "defined">;
    text: z<string, string, "defined">;
    show: z<boolean, boolean, "defined">;
    sound: z<boolean, boolean, "defined">;
    storageDir: z<string, string, "defined">;
    preferences: z<NoInfer<Schemastery.ObjectS<NoInfer<{
        banner: z<Schemastery.ObjectS<NoInfer<{
            avatarPath: z<string, string, "plain">;
            text: z<string, string, "plain">;
            show: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            avatarPath: z<string, string, "plain">;
            text: z<string, string, "plain">;
            show: z<boolean, boolean, "plain">;
        }>>, "plain">;
        confetti: z<Schemastery.ObjectS<NoInfer<{
            show: z<boolean, boolean, "plain">;
            sound: z<boolean, boolean, "plain">;
            theme: z<"gold" | "default" | "ocean" | "sakura" | "neon", "gold" | "default" | "ocean" | "sakura" | "neon", "plain">;
            intensity: z<"small" | "medium" | "large" | "epic", "small" | "medium" | "large" | "epic", "plain">;
            trigger: z<"every" | "success" | "task", "every" | "success" | "task", "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            show: z<boolean, boolean, "plain">;
            sound: z<boolean, boolean, "plain">;
            theme: z<"gold" | "default" | "ocean" | "sakura" | "neon", "gold" | "default" | "ocean" | "sakura" | "neon", "plain">;
            intensity: z<"small" | "medium" | "large" | "epic", "small" | "medium" | "large" | "epic", "plain">;
            trigger: z<"every" | "success" | "task", "every" | "success" | "task", "plain">;
        }>>, "plain">;
        english: z<Schemastery.ObjectS<NoInfer<{
            enabled: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            enabled: z<boolean, boolean, "plain">;
        }>>, "plain">;
        open: z<Schemastery.ObjectS<NoInfer<{
            terminal: z<string, string, "plain">;
            editor: z<string, string, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            terminal: z<string, string, "plain">;
            editor: z<string, string, "plain">;
        }>>, "plain">;
        openExtra: z<Schemastery.ObjectS<NoInfer<{
            androidStudio: z<boolean, boolean, "plain">;
            xcode: z<boolean, boolean, "plain">;
            wechatDevtools: z<boolean, boolean, "plain">;
            intellijIdea: z<boolean, boolean, "plain">;
            devecoStudio: z<boolean, boolean, "plain">;
            webstorm: z<boolean, boolean, "plain">;
            pycharm: z<boolean, boolean, "plain">;
            goland: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            androidStudio: z<boolean, boolean, "plain">;
            xcode: z<boolean, boolean, "plain">;
            wechatDevtools: z<boolean, boolean, "plain">;
            intellijIdea: z<boolean, boolean, "plain">;
            devecoStudio: z<boolean, boolean, "plain">;
            webstorm: z<boolean, boolean, "plain">;
            pycharm: z<boolean, boolean, "plain">;
            goland: z<boolean, boolean, "plain">;
        }>>, "plain">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        banner: z<Schemastery.ObjectS<NoInfer<{
            avatarPath: z<string, string, "plain">;
            text: z<string, string, "plain">;
            show: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            avatarPath: z<string, string, "plain">;
            text: z<string, string, "plain">;
            show: z<boolean, boolean, "plain">;
        }>>, "plain">;
        confetti: z<Schemastery.ObjectS<NoInfer<{
            show: z<boolean, boolean, "plain">;
            sound: z<boolean, boolean, "plain">;
            theme: z<"gold" | "default" | "ocean" | "sakura" | "neon", "gold" | "default" | "ocean" | "sakura" | "neon", "plain">;
            intensity: z<"small" | "medium" | "large" | "epic", "small" | "medium" | "large" | "epic", "plain">;
            trigger: z<"every" | "success" | "task", "every" | "success" | "task", "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            show: z<boolean, boolean, "plain">;
            sound: z<boolean, boolean, "plain">;
            theme: z<"gold" | "default" | "ocean" | "sakura" | "neon", "gold" | "default" | "ocean" | "sakura" | "neon", "plain">;
            intensity: z<"small" | "medium" | "large" | "epic", "small" | "medium" | "large" | "epic", "plain">;
            trigger: z<"every" | "success" | "task", "every" | "success" | "task", "plain">;
        }>>, "plain">;
        english: z<Schemastery.ObjectS<NoInfer<{
            enabled: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            enabled: z<boolean, boolean, "plain">;
        }>>, "plain">;
        open: z<Schemastery.ObjectS<NoInfer<{
            terminal: z<string, string, "plain">;
            editor: z<string, string, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            terminal: z<string, string, "plain">;
            editor: z<string, string, "plain">;
        }>>, "plain">;
        openExtra: z<Schemastery.ObjectS<NoInfer<{
            androidStudio: z<boolean, boolean, "plain">;
            xcode: z<boolean, boolean, "plain">;
            wechatDevtools: z<boolean, boolean, "plain">;
            intellijIdea: z<boolean, boolean, "plain">;
            devecoStudio: z<boolean, boolean, "plain">;
            webstorm: z<boolean, boolean, "plain">;
            pycharm: z<boolean, boolean, "plain">;
            goland: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            androidStudio: z<boolean, boolean, "plain">;
            xcode: z<boolean, boolean, "plain">;
            wechatDevtools: z<boolean, boolean, "plain">;
            intellijIdea: z<boolean, boolean, "plain">;
            devecoStudio: z<boolean, boolean, "plain">;
            webstorm: z<boolean, boolean, "plain">;
            pycharm: z<boolean, boolean, "plain">;
            goland: z<boolean, boolean, "plain">;
        }>>, "plain">;
    }>>>, "volatile-defined">;
    taskBoard: z<NoInfer<Schemastery.ObjectS<NoInfer<{
        enabled: z<boolean, boolean, "plain">;
        announceToAgent: z<boolean, boolean, "plain">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        enabled: z<boolean, boolean, "plain">;
        announceToAgent: z<boolean, boolean, "plain">;
    }>>>, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    avatarPath: z<string, string, "defined">;
    text: z<string, string, "defined">;
    show: z<boolean, boolean, "defined">;
    sound: z<boolean, boolean, "defined">;
    storageDir: z<string, string, "defined">;
    preferences: z<NoInfer<Schemastery.ObjectS<NoInfer<{
        banner: z<Schemastery.ObjectS<NoInfer<{
            avatarPath: z<string, string, "plain">;
            text: z<string, string, "plain">;
            show: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            avatarPath: z<string, string, "plain">;
            text: z<string, string, "plain">;
            show: z<boolean, boolean, "plain">;
        }>>, "plain">;
        confetti: z<Schemastery.ObjectS<NoInfer<{
            show: z<boolean, boolean, "plain">;
            sound: z<boolean, boolean, "plain">;
            theme: z<"gold" | "default" | "ocean" | "sakura" | "neon", "gold" | "default" | "ocean" | "sakura" | "neon", "plain">;
            intensity: z<"small" | "medium" | "large" | "epic", "small" | "medium" | "large" | "epic", "plain">;
            trigger: z<"every" | "success" | "task", "every" | "success" | "task", "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            show: z<boolean, boolean, "plain">;
            sound: z<boolean, boolean, "plain">;
            theme: z<"gold" | "default" | "ocean" | "sakura" | "neon", "gold" | "default" | "ocean" | "sakura" | "neon", "plain">;
            intensity: z<"small" | "medium" | "large" | "epic", "small" | "medium" | "large" | "epic", "plain">;
            trigger: z<"every" | "success" | "task", "every" | "success" | "task", "plain">;
        }>>, "plain">;
        english: z<Schemastery.ObjectS<NoInfer<{
            enabled: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            enabled: z<boolean, boolean, "plain">;
        }>>, "plain">;
        open: z<Schemastery.ObjectS<NoInfer<{
            terminal: z<string, string, "plain">;
            editor: z<string, string, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            terminal: z<string, string, "plain">;
            editor: z<string, string, "plain">;
        }>>, "plain">;
        openExtra: z<Schemastery.ObjectS<NoInfer<{
            androidStudio: z<boolean, boolean, "plain">;
            xcode: z<boolean, boolean, "plain">;
            wechatDevtools: z<boolean, boolean, "plain">;
            intellijIdea: z<boolean, boolean, "plain">;
            devecoStudio: z<boolean, boolean, "plain">;
            webstorm: z<boolean, boolean, "plain">;
            pycharm: z<boolean, boolean, "plain">;
            goland: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            androidStudio: z<boolean, boolean, "plain">;
            xcode: z<boolean, boolean, "plain">;
            wechatDevtools: z<boolean, boolean, "plain">;
            intellijIdea: z<boolean, boolean, "plain">;
            devecoStudio: z<boolean, boolean, "plain">;
            webstorm: z<boolean, boolean, "plain">;
            pycharm: z<boolean, boolean, "plain">;
            goland: z<boolean, boolean, "plain">;
        }>>, "plain">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        banner: z<Schemastery.ObjectS<NoInfer<{
            avatarPath: z<string, string, "plain">;
            text: z<string, string, "plain">;
            show: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            avatarPath: z<string, string, "plain">;
            text: z<string, string, "plain">;
            show: z<boolean, boolean, "plain">;
        }>>, "plain">;
        confetti: z<Schemastery.ObjectS<NoInfer<{
            show: z<boolean, boolean, "plain">;
            sound: z<boolean, boolean, "plain">;
            theme: z<"gold" | "default" | "ocean" | "sakura" | "neon", "gold" | "default" | "ocean" | "sakura" | "neon", "plain">;
            intensity: z<"small" | "medium" | "large" | "epic", "small" | "medium" | "large" | "epic", "plain">;
            trigger: z<"every" | "success" | "task", "every" | "success" | "task", "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            show: z<boolean, boolean, "plain">;
            sound: z<boolean, boolean, "plain">;
            theme: z<"gold" | "default" | "ocean" | "sakura" | "neon", "gold" | "default" | "ocean" | "sakura" | "neon", "plain">;
            intensity: z<"small" | "medium" | "large" | "epic", "small" | "medium" | "large" | "epic", "plain">;
            trigger: z<"every" | "success" | "task", "every" | "success" | "task", "plain">;
        }>>, "plain">;
        english: z<Schemastery.ObjectS<NoInfer<{
            enabled: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            enabled: z<boolean, boolean, "plain">;
        }>>, "plain">;
        open: z<Schemastery.ObjectS<NoInfer<{
            terminal: z<string, string, "plain">;
            editor: z<string, string, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            terminal: z<string, string, "plain">;
            editor: z<string, string, "plain">;
        }>>, "plain">;
        openExtra: z<Schemastery.ObjectS<NoInfer<{
            androidStudio: z<boolean, boolean, "plain">;
            xcode: z<boolean, boolean, "plain">;
            wechatDevtools: z<boolean, boolean, "plain">;
            intellijIdea: z<boolean, boolean, "plain">;
            devecoStudio: z<boolean, boolean, "plain">;
            webstorm: z<boolean, boolean, "plain">;
            pycharm: z<boolean, boolean, "plain">;
            goland: z<boolean, boolean, "plain">;
        }>>, Schemastery.ObjectT<NoInfer<{
            androidStudio: z<boolean, boolean, "plain">;
            xcode: z<boolean, boolean, "plain">;
            wechatDevtools: z<boolean, boolean, "plain">;
            intellijIdea: z<boolean, boolean, "plain">;
            devecoStudio: z<boolean, boolean, "plain">;
            webstorm: z<boolean, boolean, "plain">;
            pycharm: z<boolean, boolean, "plain">;
            goland: z<boolean, boolean, "plain">;
        }>>, "plain">;
    }>>>, "volatile-defined">;
    taskBoard: z<NoInfer<Schemastery.ObjectS<NoInfer<{
        enabled: z<boolean, boolean, "plain">;
        announceToAgent: z<boolean, boolean, "plain">;
    }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
        enabled: z<boolean, boolean, "plain">;
        announceToAgent: z<boolean, boolean, "plain">;
    }>>>, "volatile-defined">;
}>>, "plain">;
export type Config = ReturnType<typeof Config>;
export declare function resolveWorkbenchSettings(config: Config): WorkbenchConfig;
