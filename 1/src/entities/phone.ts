import { BaseDevice } from './base-device';
import type { IBattery } from './interfaces/battery.interface';

export class Phone extends BaseDevice {
  constructor(brand: string, battery: IBattery) {
    super(brand, false, true, false, true, battery);
  }
}
