import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Device } from "../models/device";
import { Category } from "../models/category";
import { DeviceCategory } from "../models/device-category";


@Injectable()
export class DeviceListService {
  private devices: Device[] = [];
  private categories: Category[] = [];
  private devicescategory: DeviceCategory[] = [];

  constructor(private storage: Storage) {}

//DEVICE CATEGORY SERVICE
addDeviceCategory(name: string, quantity: number, power: number, hours: number, daysUsed: number, category: string) {
  const devicecategory = new DeviceCategory(name, quantity, power, hours, daysUsed, category);
  this.devicescategory.push(devicecategory);
  this.storage.set('devicescategory', this.devicescategory)
    .then()
    .catch(
      err => {
        this.devicescategory.splice(this.devicescategory.indexOf(devicecategory),1);
      }
    );
}

getDevicesCategory() {
  return this.devicescategory.slice();
}

fetchDevicesCategory() {
  return this.storage.get('devicescategory')
    .then(
      (devicescategory: DeviceCategory[]) => {
        this.devicescategory= devicescategory != null ? devicescategory : [];
        return this.devicescategory;
      }
    )
    .catch(
      err => console.log(err)
    );
}

updateDeviceCategory(index: number, name: string, quantity: number, power: number, hours: number, daysUsed: number, category: string) {
  this.devicescategory[index] = new DeviceCategory(name, quantity, power, hours,  daysUsed, category);
  this.storage.set('devicescategory', this.devicescategory)
    .then()
    .catch(
      err => {
        err => console.log(err)
      }
    );
}

removeDeviceCategory(index: number) {
  this.devicescategory.splice(index, 1);
  this.storage.set('devicescategory', this.devicescategory)
    .then()
    .catch(
      err => console.log(err)
    );
}

//CATEGORY SERVICE
  addCategory(name: string) {
    const category = new Category(name);
    this.categories.push(category);
    this.storage.set('categories', this.categories)
      .then()
      .catch(
        err => {
          this.categories.splice(this.categories.indexOf(category), 1);
        }
      );
  }

  getCategories() {
    return this.categories.slice();
  }

  fetchCategories() {
    return this.storage.get('categories')
      .then(
        (categories: Category[]) => {
          this.categories = categories != null ? categories : [];
          return this.categories;
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  updateCategory(index: number, name: string) {
    this.categories[index] = new Category(name);
    this.storage.set('categories', this.categories)
      .then()
      .catch(
        err => {
          err => console.log(err)
        }
      );
  }

  removeCategory(index: number) {
    this.categories.splice(index, 1);
    this.storage.set('categories', this.categories)
      .then()
      .catch(
        err => console.log(err)
      );
  }

  //DEVICE SERVICE
  addDevice(name: string, quantity: number, power: number, hours: number, daysUsed: number, category: string) {
    const device = new Device(name, quantity, power, hours, daysUsed, category);
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

  updateDevice(index: number, name: string, quantity: number, power: number, hours: number, daysUsed: number, category: string) {
    this.devices[index] = new Device(name, quantity, power, hours,  daysUsed, category);
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
