import { Component, OnInit } from '@angular/core';
import {NavController, AlertController, NavParams } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { Device } from "../../models/device";
import { CreatePage } from "../add-device/create/create";
import { AddDevicePage } from "../add-device/add-device";
import { SelectPage } from "../add-device/select/select";

@Component({
  selector: 'page-devices-list',
  templateUrl: 'devices-list.html',
})
export class DevicesListPage implements OnInit{
  listDevices: Device[];
  device: Device;
  index: number;

  language: string;
  rtl: string;
  arabic = false;
  slide: string;

  constructor(private dlService: DeviceListService,
     private navCtrl: NavController,
     private alertCtrl: AlertController,
     public navParams: NavParams,
     private settingsService: SettingsService,
     private translateService: TranslateService) {
  }

  ngOnInit() {
    this.settingsService.getLanguage();
    this.dlService.fetchDevices()
    .then(
      (devices: Device[]) => this.listDevices = devices
    );
  }

  ionViewWillEnter() {
    this.setLanguage();
    this.listDevices = this.dlService.getDevices();
  }

  setLanguage() {
    this.language = this.translateService.currentLang;
    if(this.language == 'ar')
    {
      this.rtl = 'rtl';
      this.slide = 'left';
      this.arabic = true;
    }
    return this.rtl;
  }

  onLoadDevice(device: Device, index: number) {
    this.navCtrl.push(SelectPage, {device: device, index: index});
  }

  onDelete() {
    this.dlService.removeDevice(this.index);
    this.listDevices = this.dlService.getDevices();
  }

  // onEdit() {
  //   this.device = this.navParams.get('device');
  //   this.index = this.navParams.get('index');
  //   this.navCtrl.push(CreatePage, {mode: 'Edit', device: this.device, index: this.index});
  // }

  onAddDevice() {
    this.navCtrl.push(AddDevicePage);
  //   const alert = this.alertCtrl.create({
  //     title: 'Add New Appliance',
  //     message: 'Select an appliance or create a new one',
  //     buttons: [
  //       {
  //         text: "Create New",
  //         handler: () => {
  //           this.navCtrl.push(CreatePage, {mode: 'Add'});
  //         }
  //       },
  //       {
  //         text: "Select Appliance",
  //         handler: () => {
  //           this.navCtrl.push(AddDevicePage);
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
   }
}
