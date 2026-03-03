import type { Command } from './command.interface';

export interface TaskCommand extends Command {
  hours: number;
}
