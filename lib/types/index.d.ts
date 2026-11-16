import type { Context } from '@deepseek-ai/cordis';
import { type Config } from './settings.ts';
export { Config, DEFAULT_TEXT } from './settings.ts';
export declare const name = "bga-dsh-workbench";
export declare function apply(ctx: Context, config: Config): void;
