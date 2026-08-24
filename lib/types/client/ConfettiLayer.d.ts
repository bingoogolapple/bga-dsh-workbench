import { runConfettiBurst } from './confetti.ts';
export interface ConfettiLayerProps {
    fire?: typeof runConfettiBurst;
    playSound?: () => void;
    loadSoundEnabled?: () => Promise<boolean>;
    loadConfettiEnabled?: () => Promise<boolean>;
    loadConfettiConfig?: () => Promise<ConfettiConfig>;
}
/** 彩带运行时配置（来自 /config 的 confetti 字段） */
export interface ConfettiConfig {
    /** 彩带配色主题 */
    theme: 'default' | 'gold' | 'ocean' | 'sakura' | 'neon';
    /** 彩带强度 */
    intensity: 'small' | 'medium' | 'large' | 'epic';
    /** 触发时机 */
    trigger: 'success' | 'every' | 'task';
}
export declare const TURN_COMPLETE_EVENT = "bga-dsh-workbench:turn-complete";
export declare const TASK_EXECUTION_EVENT = "bga-dsh-workbench:task-execution";
export declare function fetchConfettiSound(): Promise<boolean>;
export declare function fetchConfettiEnabled(): Promise<boolean>;
export declare function fetchConfettiConfig(): Promise<ConfettiConfig>;
export declare function ConfettiLayer({ fire, playSound, loadSoundEnabled, loadConfettiEnabled, loadConfettiConfig, }: ConfettiLayerProps): null;
