import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { Device } from "../../models/device";
import { CreatePage } from "../add-device/create/create";
import { SelectPage } from "../add-device/select/select";

@Component({
  selector: 'page-devices-list',
  templateUrl: 'devices-list.html',
})
export class DevicesListPage {
  listDevices: Device[];

  constructor(private dlService: DeviceListService, private navCtrl: NavController) {
  }

  ionViewWillEnter() {
    this.listDevices = this.dlService.getDevices();
  }

  onLoadDevice(device: Device, index: number) {
    this.navCtrl.push(SelectPage, {device: device, index: index});
  }
}
