import { Device } from "../models/device";

export class DeviceListService {
  private devices: Device[] = [];

  addDevice(name: string, quantity: number, power: number, hours: number, totalHours: number, daysUsed: number) {
    this.devices.push(new Device(name, quantity, power, hours, totalHours, daysUsed));
    console.log(this.devices);
  }

  // addDevices(items: Device[]) {
  //   this.devices.push(...items);
  // }

  getDevices() {
    return this.devices.slice();
  }

  updateDevice(index: number, name: string, quantity: number, power: number, hours: number, totalHours: number, daysUsed: number) {
    this.devices[index] = new Device(name, quantity, power, hours, totalHours, daysUsed);
  }

  removeDevice(index: number) {
    this.devices.splice(index, 1);
  }

}
