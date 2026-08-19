import { type BurstRect } from './confetti.ts';
export interface ConfettiLayerProps {
    fire?: (rect: BurstRect) => () => void;
    playSound?: () => void;
    loadSoundEnabled?: () => Promise<boolean>;
}
export declare function fetchConfettiSound(): Promise<boolean>;
export declare function ConfettiLayer({ fire, playSound, loadSoundEnabled, }: ConfettiLayerProps): null;
