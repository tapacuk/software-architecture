import { Task, BaseDevice, Computer } from '../entities';
import { DoTaskCommand, type TaskCommand } from './commands';
import { ask } from './helpers/ask';
import { buildCommands } from './helpers/build-commands';
import { DeviceFactory } from './helpers/device-factory';

const TASKS = [
  { task: new Task('Work in Excel online', 'low', true, false), hours: 1 },
  { task: new Task('Play Minecraft', 'high', false, true), hours: 4 },
  { task: new Task('Write code', 'low', false, false), hours: 2 },
];

export class Menu {
  async main() {
    let running = true;
    while (running) {
      console.clear();
      console.log('\n      -DEVICE-IMITATOR-');
      console.log('\nSelect Device:');
      console.log('1 | Phone');
      console.log('2 | Laptop');
      console.log('3 | Computer');
      console.log('\n0 | End ');

      const choice = await ask('Choose an Option: ');
      switch (choice) {
        case '1':
          console.clear();
          const phone = DeviceFactory.create(
            'phone',
            'iPhone 17 Pro Max',
            3000,
          );
          await this.deviceManager(phone);
          break;
        case '2':
          console.clear();
          const laptop = DeviceFactory.create('laptop', 'MacBook Air 15', 7000);
          await this.deviceManager(laptop);
          break;
        case '3':
          console.clear();
          const computer = DeviceFactory.create(
            'computer',
            'Asus B29348-349-HFDS7777-S-WA-G',
          );
          await this.deviceManager(computer);
          break;
        case '0':
          running = false;
          break;
        default:
          console.clear();
          console.log('ERROR: Unknown option');
      }
    }
  }

  async deviceManager(device: BaseDevice) {
    let running = true;
    while (running) {
      console.clear();
      console.log(`\n      IMITATION OF ${device.brand}`);
      console.log(
        `Electricity: ${device.hasElectricity ? 'Connected' : 'Not Connected'}`,
      );
      console.log(`Software: ${device.hasSoftware ? 'Installed' : 'None'}`);
      console.log(
        `Internet connection: ${device.isConnectedToNetwork ? 'Connected' : 'Not Connected'}`,
      );
      console.log(`Audio: ${device.hasAudio ? 'Speakers' : 'None'}`);
      if (!(device instanceof Computer))
        console.log(`Battery: ${device.checkBattery()}%`);

      const commands = buildCommands(device);
      const lastCommand = commands.length + 1;

      commands.map((cmd, i) => {
        console.log(`${i + 1} | ${cmd.label}`);
      });
      console.log(`${lastCommand} | Do task`);
      console.log('0 | Exit');

      const option = await ask('\nChoose option:');

      if (option === '0') {
        running = false;
        break;
      }

      if (option === lastCommand.toString()) {
        console.clear();
        await this.taskPerformer(device);
      }
      const index = parseInt(option) - 1;
      const command = commands[index];

      if (command) {
        console.clear();
        command.execute();
      } else {
        console.log('ERROR: Unknown option');
      }
    }
  }

  async taskPerformer(device: BaseDevice) {
    let running = true;
    while (running) {
      console.clear();
      console.log(`\n      TASK IMITATION OF ${device.brand}`);

      const commands: TaskCommand[] = TASKS.map(
        ({ task, hours }) => new DoTaskCommand(device, task, hours),
      );

      commands.map((cmd, i) => {
        console.log(`${i + 1} | ${cmd.label}`);
      });
      console.log('0 | Back');

      const option = await ask('\nChoose option:');

      if (option === '0') {
        running = false;
        break;
      }

      const index = parseInt(option) - 1;
      const command = commands[index];

      if (command) {
        console.clear();
        command.execute();
        await ask('\nPress Enter to continue...');
      } else {
        console.log('ERROR: Unknown option');
      }
    }
  }
}
