import type { UsageIntensity } from './types/usage-intensity.type';

export class Battery {
  constructor(
    public capacity: number,
    public chargePercent: number = 100,
  ) {}

  consume(msTime: number, intensity: UsageIntensity): void {
    const hours = msTime / 60000;
    const maxTime =
      intensity === 'low' ? this.capacity / 64 : this.capacity / 196;
    const reduction = (hours / maxTime) * 100;
    this.chargePercent = Math.max(0, this.chargePercent - reduction);
    this.chargePercent.toFixed();
  }
}
