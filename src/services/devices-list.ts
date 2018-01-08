import { Device } from "../models/device";

export class DeviceListService {
  private devices: Device[] = [];

  addDevice(name: string, quantity: number, power: number, hours: number, daysUsed: number) {
    this.devices.push(new Device(name, quantity, power, hours, daysUsed));
    console.log(this.devices);
  }

  // addDevices(items: Device[]) {
  //   this.devices.push(...items);
  // }

  getDevices() {
    return this.devices.slice();
  }

  updateDevice(index: number, name: string, quantity: number, power: number, hours: number, daysUsed: number) {
    this.devices[index] = new Device(name, quantity, power, hours,  daysUsed);
  }

  removeDevice(index: number) {
    this.devices.splice(index, 1);
  }

}
