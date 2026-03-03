import type { BaseDevice, Task } from '../../entities';
import type { TaskCommand } from './interfaces';

export class DoTaskCommand implements TaskCommand {
  hours: number;
  get label() {
    return `${this.task.name} for ${this.hours} hours`;
  }
  constructor(
    private device: BaseDevice,
    private task: Task,
    hours: number,
  ) {
    this.hours = hours;
  }

  execute() {
    this.device.performTask(this.task, this.hours);
  }
}
