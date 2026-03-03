import type { BaseDevice } from '../../entities/base-device';
import type { Command } from './interfaces';

export class ToggleElectricityCommand implements Command {
  get label() {
    return this.device.hasElectricity ? 'Unplug device' : 'Plug device in';
  }
  constructor(private device: BaseDevice) {}

  execute() {
    this.device.hasElectricity = !this.device.hasElectricity;
    console.log(
      this.device.hasElectricity
        ? 'Device connected to Electricity'
        : 'Device disconnected from Electricity',
    );
  }
}
