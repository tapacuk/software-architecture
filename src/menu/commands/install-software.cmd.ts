import type { BaseDevice } from '../../entities/base-device';
import type { Command } from './interfaces';

export class InstallSoftwareCommand implements Command {
  get label() {
    return this.device.hasSoftware ? 'Uninstall Software' : 'Install Software';
  }

  constructor(private device: BaseDevice) {}

  execute() {
    this.device.hasSoftware = !this.device.hasSoftware;
    console.log(
      this.device.hasSoftware
        ? 'OS Software was installed'
        : 'OS Software was uninstalled',
    );
  }
}
