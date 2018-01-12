import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Device } from "../models/device";
import { Category } from "../models/category";

@Injectable()
export class DeviceListService {
  private devices: Device[] = [];
  private categories: Category[] = [];

  constructor(private storage: Storage) {}

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
