import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
export declare const inject: readonly string[];
export declare const CONFIG_CHANGED_EVENT = "bga-dsh-workbench:config-changed";
export declare function apply(ctx: ClientContext): void;
