import { BaseDevice } from './base-device';
import type { Battery } from './battery';

export class Laptop extends BaseDevice {
  constructor(brand: string, battery: Battery) {
    super(brand, false, false, false, true, battery);
  }
}
