import type { UsageIntensity } from '../types/usage-intensity.type';

export interface IBattery {
  capacity: number;
  chargePercent: number;

  consume(hours: number, intensity: UsageIntensity): void;
}
