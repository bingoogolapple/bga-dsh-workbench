import { type BurstRect } from './confetti.ts';
export interface ConfettiLayerProps {
    fire?: (rect: BurstRect) => () => void;
    playSound?: () => void;
    loadSoundEnabled?: () => Promise<boolean>;
    loadConfettiEnabled?: () => Promise<boolean>;
}
export declare const TURN_COMPLETE_EVENT = "bga-dsh-workbench:turn-complete";
export declare function fetchConfettiSound(): Promise<boolean>;
export declare function fetchConfettiEnabled(): Promise<boolean>;
export declare function ConfettiLayer({ fire, playSound, loadSoundEnabled, loadConfettiEnabled, }: ConfettiLayerProps): null;
