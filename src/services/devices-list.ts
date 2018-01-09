import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Device } from "../models/device";

@Injectable()
export class DeviceListService {
  private devices: Device[] = [];

  constructor(private storage: Storage) {}

  addDevice(name: string, quantity: number, power: number, hours: number, daysUsed: number) {
    const device = new Device(name, quantity, power, hours, daysUsed);
    this.devices.push(device);
    this.storage.set('devices', this.devices)
      .then()
      .catch(
        err => {
          this.devices.splice(this.devices.indexOf(device),1);
        }
      );
  }

  // addDevices(items: Device[]) {
  //   this.devices.push(...items);
  // }

  getDevices() {
    return this.devices.slice();
  }

  fetchDevices() {
    return this.storage.get('devices')
      .then(
        (devices: Device[]) => {
          this.devices = devices != null ? devices : [];
          return this.devices;
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  updateDevice(index: number, name: string, quantity: number, power: number, hours: number, daysUsed: number) {
    this.devices[index] = new Device(name, quantity, power, hours,  daysUsed);
    this.storage.set('devices', this.devices)
      .then()
      .catch(
        err => {
          err => console.log(err)
        }
      );
  }

  removeDevice(index: number) {
    this.devices.splice(index, 1);
    this.storage.set('devices', this.devices)
      .then()
      .catch(
        err => console.log(err)
      );
  }

}
