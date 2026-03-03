import type { Computer } from '../../entities/computer';
import type { Command } from './interfaces';

export class ToggleSpeakersCommand implements Command {
  get label() {
    return this.computer.hasAudio ? 'Disconnect Speakers' : 'Connect Speakers';
  }

  constructor(private computer: Computer) {}

  execute() {
    this.computer.hasAudio = !this.computer.hasAudio;
    console.log(
      this.computer.hasAudio ? 'Speakers connected' : 'Speakers disconnected',
    );
  }
}
