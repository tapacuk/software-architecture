import type { BaseDevice } from '../entities/base-device';
import { Task } from '../entities/task';
import { DeviceFactory } from '../helpers/device-factory';
import { Computer } from '../entities/computer';
import { ask } from './helpers/ask';

const officeWorkTask = new Task('Work in Excel online', 'low', true, false);
const gameTask = new Task('Play Minecraft', 'high', false, true);
const codeTask = new Task('Write code', 'low', false, false);

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

      console.log(
        `\n1 | ${device.hasElectricity ? 'Unplug device' : 'Plug device in'}`,
      );
      console.log(
        `2 | ${device.hasSoftware ? 'Uninstall Software' : 'Install Software'}`,
      );
      console.log(
        `3 | ${device.isConnectedToNetwork ? 'Disconnect from Internet' : 'Connect to Internet'}`,
      );
      console.log(`4 | Do task`);

      if (device instanceof Computer) {
        console.log(
          `5 | ${device.hasAudio ? 'Disconnect Speakers' : 'Connect Speakers'}`,
        );
      }
      console.log('0 | Exit');

      const option = await ask('\nChoose option:');
      switch (option) {
        case '1':
          device.hasElectricity = !device.hasElectricity;
          console.clear();
          console.log(
            device.hasElectricity
              ? 'Device connected to Electricity'
              : 'Device disconnected from Electricity',
          );
          break;
        case '2':
          device.hasSoftware = !device.hasSoftware;
          console.clear();
          console.log(
            device.hasSoftware
              ? 'OS Software was installed '
              : 'OS Software was uninstalled',
          );
          break;
        case '3':
          device.isConnectedToNetwork = !device.isConnectedToNetwork;
          console.clear();
          console.log(
            device.isConnectedToNetwork
              ? 'Device is connected to the internet'
              : 'Device was disconnected from the internet',
          );
          break;
        case '4':
          console.clear();
          await this.taskPerformer(device);
          break;
        case '5':
          console.clear();
          if (device instanceof Computer) {
            device.hasAudio = !device.hasAudio;
            console.log(
              device.hasAudio
                ? 'Speakers was connected'
                : 'Speakers disconnected',
            );
          } else console.log('ERROR: Unknown option');
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

  async taskPerformer(device: BaseDevice) {
    let running = true;
    while (running) {
      console.clear();
      console.log(`\n      TASK IMITATION OF ${device.brand}`);
      console.log('1 | Work in Excel online for 1 hour');
      console.log('2 | Play Minecraft for 4 hours');
      console.log('3 | Write code for 2 hours');
      console.log('0 | Back');

      const option = await ask('\nChoose option:');
      switch (option) {
        case '1':
          console.clear();
          device.performTask(officeWorkTask, 1);
          await ask('\n Press Enter to continue...');
          break;
        case '2':
          console.clear();
          device.performTask(gameTask, 1);
          await ask('\n Press Enter to continue...');
          break;
        case '3':
          console.clear();
          device.performTask(codeTask, 1);
          await ask('\n Press Enter to continue...');
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
}
