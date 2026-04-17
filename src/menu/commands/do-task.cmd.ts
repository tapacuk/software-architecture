import type { BaseDevice, Task } from '../../entities';

export class DoTaskCommand {
  constructor(
    private device: BaseDevice,
    private task: Task,
  ) {}
  get label() {
    return `${this.task.name}`;
  }

  async execute() {
    await this.device.performTask(this.task);
  }
}
