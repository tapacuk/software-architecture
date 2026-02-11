import type { Task } from '../task';
import type { UsageIntensity } from '../types/usage-intensity.type';

export default interface IDevice {
  brand: string;
  hasElectricity: boolean;
  hasSoftware: boolean;
  isConnectedToNetwork: boolean;
  hasAudio: boolean;
  turnOn(): void;
  performTask(
    task: Task,
    time: number,
    intensity: UsageIntensity,
    needsNetwork: boolean,
    needsAudio: boolean,
  ): void;
}
