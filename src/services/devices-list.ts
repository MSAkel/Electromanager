import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Device } from "../models/device";
import { Category } from "../models/category";
import { DeviceCategory } from "../models/device-category";
import { Adjust } from "../models/adjust";
import { Month } from "../models/month";
// import { Group } from "../models/group";
// import { GroupList } from "../models/group-list";

@Injectable()
export class DeviceListService {
  private devices: Device[] = [];
  private categories: Category[] = [];
  private devicescategory: DeviceCategory[] = [];
  private adjust: Adjust[] = [];
  private months: Month[] = []
  // private group: Group[] = [];
  // private groupList: GroupList[] = [];

  constructor(private storage: Storage) {}

  addMonth(monthName: string, monthlyPower: number, monthlyCost: number) {
    const month = new Month(monthName, monthlyPower, monthlyCost);
    this.months.push(month);
    this.storage.set('months', this.months)
      .then()
      .catch(
        err => {
          this.months.splice(this.months.indexOf(month),1);
        }
      );
  }

  getMonths() {
    return this.months.slice();
  }

  fetchMonths() {
    return this.storage.get('months')
      .then(
        (months: Month[]) => {
          this.months = months != null ? months : [];
          return this.months;
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  updateMonth(index: number, monthName: string, monthlyPower: number, monthlyCost: number) {
    this.months[index] = new Month(monthName, monthlyPower, monthlyCost);
    this.storage.set('months', this.months)
      .then()
      .catch(
        err => {
          err => console.log(err)
        }
      );
  }

  removeMonth(index: number) {
    this.months.splice(index, 1);
    this.storage.set('months', this.months)
      .then()
      .catch(
        err => console.log(err)
      );
  }

  //GROUP LIST SERVICE
  // addGroupList(name: string, quantity: number, power: number, hours: number, daysUsed: number, category: string, group: string) {
  //   const groupList = new GroupList(name, quantity, power, hours, daysUsed, category, group);
  //   this.groupList.push(groupList);
  //   this.storage.set('groupList', this.groupList)
  //     .then()
  //     .catch(
  //       err => {
  //         this.groupList.splice(this.groupList.indexOf(groupList),1);
  //       }
  //     );
  // }
  //
  // getGroupList() {
  //   return this.groupList.slice();
  // }
  //
  // fetchGroupList() {
  //   return this.storage.get('groupList')
  //     .then(
  //       (groupList: GroupList[]) => {
  //         this.groupList = groupList != null ? groupList : [];
  //         return this.groupList;
  //       }
  //     )
  //     .catch(
  //       err => console.log(err)
  //     );
  // }
  //
  // removeGroupList(index: number) {
  //   this.groupList.splice(index, 1);
  //   this.storage.set('groupList', this.groupList)
  //     .then()
  //     .catch(
  //       err => console.log(err)
  //     );
  // }

  //GROUP SERVICE
  // addGroup(name: string , totalPower: number, totalCost: number) {
  //   const group = new Group(name, totalPower, totalCost);
  //   this.group.push(group);
  //   this.storage.set('group', this.group)
  //     .then()
  //     .catch(
  //       err => {
  //         this.group.splice(this.group.indexOf(group),1);
  //       }
  //     );
  // }
  //
  // getGroup() {
  //   return this.group.slice();
  // }
  //
  // fetchGroup() {
  //   return this.storage.get('group')
  //     .then(
  //       (group: Group[]) => {
  //         this.group = group != null ? group : [];
  //         return this.group;
  //       }
  //     )
  //     .catch(
  //       err => console.log(err)
  //     );
  // }
  //
  // updateGroup(index: number, name: string , totalPower: number, totalCost: number) {
  //   this.group[index] = new Group(name, totalPower, totalCost);
  //   this.storage.set('group', this.group)
  //     .then()
  //     .catch(
  //       err => {
  //         err => console.log(err)
  //       }
  //     );
  // }
  //
  // removeGroup(index: number) {
  //   this.group.splice(index, 1);
  //   this.storage.set('group', this.group)
  //     .then()
  //     .catch(
  //       err => console.log(err)
  //     );
  // }


//ADJUST SERVICE
addAdjust(bill: number, appBill: number, difference: number) {
  const adjust = new Adjust(bill, appBill, difference);
  this.adjust.push(adjust);
  this.storage.set('adjust', this.adjust)
    .then()
    .catch(
      err => {
        this.adjust.splice(this.adjust.indexOf(adjust),1);
      }
    );
}

getAdjust() {
  return this.adjust.slice();
}

fetchAdjust() {
  return this.storage.get('adjust')
    .then(
      (adjust: Adjust[]) => {
        this.adjust = adjust != null ? adjust : [];
        return this.adjust;
      }
    )
    .catch(
      err => console.log(err)
    );
}

updateAdjust(index: number, bill: number, appBill: number, difference: number) {
  this.adjust[index] = new Adjust(bill, appBill, difference);
  this.storage.set('adjust', this.adjust)
    .then()
    .catch(
      err => {
        err => console.log(err)
      }
    );
}

removeAdjust(index: number) {
  this.adjust.splice(index, 1);
  this.storage.set('adjust', this.adjust)
    .then()
    .catch(
      err => console.log(err)
    );
}

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
