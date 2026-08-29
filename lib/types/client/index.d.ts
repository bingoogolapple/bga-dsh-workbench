import type { Context as ClientContext } from '@deepseek-ai/cordis';
export declare const inject: readonly string[];
export declare const CONFIG_CHANGED_EVENT = "bga-dsh-workbench:config-changed";
export declare function apply(ctx: ClientContext): void;
