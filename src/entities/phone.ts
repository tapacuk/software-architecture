import { BaseDevice } from './base-device';
import type { Battery } from './battery';

export class Phone extends BaseDevice {
  constructor(brand: string, battery: Battery) {
    super(brand, false, true, false, true, battery);
  }
}
