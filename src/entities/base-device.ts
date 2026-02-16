import type { IBattery } from './interfaces/battery.interface';
import type IDevice from './interfaces/device.interface';
import type { Task } from './task';
import type { UsageIntensity } from './types/usage-intensity.type';

export abstract class BaseDevice implements IDevice {
  constructor(
    public brand: string,
    public hasElectricity: boolean = false,
    public hasSoftware: boolean = false,
    public isConnectedToNetwork: boolean = false,
    public hasAudio: boolean = false,
    protected battery?: IBattery,
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

  performTask(
    task: Task,
    time: number,
    intensity: UsageIntensity,
    needsNetwork: boolean,
    needsAudio: boolean,
  ): void {
    const isPowerAvailable = !this.battery || this.battery.chargePercent > 0;

    if (!isPowerAvailable) {
      console.log(`${this.brand} cant boot: battery is empty!`);
      return;
    }

    if (this.checkPrerequisites(needsNetwork, needsAudio)) {
      console.log(
        `Executing ${task.name} on ${this.brand} (Intensity: ${intensity}).`,
      );
      if (this.battery && !this.hasElectricity) {
        console.log(`Device is not connected to electricity - using battery`);
        this.battery.consume(time, task.intensity);
        console.log(`Battery: ${this.battery.chargePercent.toFixed(1)}%`);
      }
    }
  }

  checkBattery() {
    return this.battery?.chargePercent.toFixed(1);
  }
}
