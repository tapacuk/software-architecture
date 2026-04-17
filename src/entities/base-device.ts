import { compose } from 'node:stream';
import { ask } from '../menu/helpers/ask';
import type { Battery } from './battery';
import type { Task } from './task';

export abstract class BaseDevice {
  constructor(
    public brand: string,
    public hasElectricity: boolean = false,
    public hasSoftware: boolean = false,
    public isConnectedToNetwork: boolean = false,
    public hasAudio: boolean = false,
    protected battery?: Battery,
  ) {}

  turnOn(): void {
    console.log(`${this.brand} is booting...`);
  }

  protected checkPrerequisites(
    needsNetwork: boolean,
    needsAudio: boolean,
  ): boolean {
    if (!this.hasSoftware) {
      console.log('ERROR: Software is not installed!');
      return false;
    }
    if (needsNetwork && !this.isConnectedToNetwork) {
      console.log('ERROR: Device isnt connected to a Network!');
      return false;
    }
    if (needsAudio && !this.hasAudio) {
      console.log('WARN: Device doesnt have an audio output!');
    }
    return true;
  }

  async performTask(task: Task) {
    const { intensity, needsNetwork, needsAudio } = task;
    const isPowerAvailable = !this.battery || this.battery.chargePercent > 0;
    const isBatteryLow = !this.battery || this.battery.chargePercent > 10;

    if (!isPowerAvailable) {
      console.log(`${this.brand} cant boot: battery is empty!`);
      return;
    }
    if (!isBatteryLow) {
      console.log(`${this.brand} cant perform task: battery is low!`);
      return;
    }

    if (this.checkPrerequisites(needsNetwork, needsAudio)) {
      console.log(
        `Executing ${task.name} on ${this.brand} (Intensity: ${intensity}).`,
      );

      if (this.battery && !this.hasElectricity) {
        console.log(`Device is not connected to electricity - using battery`);
      }

      const timeStart = Date.now();
      await ask('\nEnter any key to stop...');
      const msTime = Date.now() - timeStart;
      console.clear();

      console.log(`Task: ${task.name}`);
      if (this.battery && !this.hasElectricity) {
        this.battery.consume(msTime, task.intensity);
        console.log(`Battery: ${this.checkBattery()}%`);
      }
      console.log(`Time elapsed: ${(msTime / 60000).toFixed(1)}h`);
    }
  }

  checkBattery() {
    return !this.battery
      ? 'No battery!'
      : this.battery.chargePercent.toFixed(1);
  }
}
