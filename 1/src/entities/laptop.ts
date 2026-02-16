import { BaseDevice } from './base-device';
import type { IBattery } from './interfaces/battery.interface';

export class Laptop extends BaseDevice {
  constructor(brand: string, battery: IBattery) {
    super(brand, false, false, false, true, battery);
  }
}
