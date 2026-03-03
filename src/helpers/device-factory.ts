import type { BaseDevice } from '../entities/base-device';
import { Battery } from '../entities/battery';
import { Computer } from '../entities/computer';
import { Laptop } from '../entities/laptop';
import { Phone } from '../entities/phone';

type DeviceType = 'phone' | 'laptop' | 'computer';

export class DeviceFactory {
  static create(type: DeviceType, ...args: any[]): BaseDevice {
    switch (type) {
      case 'phone':
        return new Phone(args[0], new Battery(args[1]));
      case 'laptop':
        return new Laptop(args[0], new Battery(args[1]));
      case 'computer':
        return new Computer(args[0]);
      default:
        throw new Error(`ERROR: Unknown device type: ${type}`);
    }
  }
}
