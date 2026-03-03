import type { BaseDevice } from '../../entities/base-device';
import type { Command } from './interfaces';

export class ToggleNetworkCommand implements Command {
  get label() {
    return this.device.isConnectedToNetwork
      ? 'Disconnect from Internet'
      : 'Connect to Internet';
  }

  constructor(private device: BaseDevice) {}

  execute() {
    this.device.isConnectedToNetwork = !this.device.isConnectedToNetwork;
    console.log(
      this.device.isConnectedToNetwork
        ? 'Device connected to internet'
        : 'Device disconnected from internet',
    );
  }
}
