import { Device } from "../models/device";

export class DeviceListService {
  private devices: Device[] = [];

  addDevice(name: string, energy: number, hours: number, totalHours: number) {
    this.devices.push(new Device(name, energy, hours, totalHours));
    console.log(this.devices);
  }

  addDevices(items: Device[]) {
    this.devices.push(...items);
  }

  getDevices() {
    return this.devices.slice();
  }

  updateDevice(index: number, name: string, energy: number, hours: number, totalHours: number) {
    this.devices[index] = new Device(name, energy, hours, totalHours);
  }

  removeDevice(index: number) {
    this.devices.splice(index, 1);
  }

}
