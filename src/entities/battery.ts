import type { IBattery } from './interfaces/battery.interface';
import type { UsageIntensity } from './types/usage-intensity.type';

export class Battery implements IBattery {
  constructor(
    public capacity: number,
    public chargePercent: number = 100,
  ) {}

  consume(hours: number, intensity: UsageIntensity): void {
    const maxTime =
      intensity === 'low' ? this.capacity / 64 : this.capacity / 196;
    const reduction = (hours / maxTime) * 100;
    this.chargePercent = Math.max(0, this.chargePercent - reduction);
    this.chargePercent.toFixed();
  }
}
