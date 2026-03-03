import type { BaseDevice } from '../../entities/base-device';
import { Computer } from '../../entities/computer';
import {
  type Command,
  ToggleElectricityCommand,
  InstallSoftwareCommand,
  ToggleNetworkCommand,
  ToggleSpeakersCommand,
} from '../commands';

export function buildCommands(device: BaseDevice): Command[] {
  const commands: Command[] = [
    new ToggleElectricityCommand(device),
    new InstallSoftwareCommand(device),
    new ToggleNetworkCommand(device),
  ];

  if (device instanceof Computer) {
    commands.push(new ToggleSpeakersCommand(device));
  }

  return commands;
}
