import { Component, OnInit } from '@angular/core';
import {NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { Device } from "../../models/device";
import { AddDevicePage } from "../add-device/add-device";
import { SelectPage } from "../add-device/select/select";
import { CreatePage } from "../add-device/create/create";
//import { AddGroupPage } from "./add-group/add-group";

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

  descending: boolean = false;
  order: number;
  column: string;


  constructor(private dlService: DeviceListService,
     private navCtrl: NavController,
     private modalCtrl: ModalController,
     public toastCtrl: ToastController,
    // private alertCtrl: AlertController,
     public navParams: NavParams,
     public storage: Storage,
     private settingsService: SettingsService,
     private translateService: TranslateService) {
  }

  ngOnInit() {
    this.settingsService.getLanguage()
      .then(() =>{
        if(this.translateService.currentLang === "ar"){
          this.rtl = "rtl";
          this.slide = 'left';
          this.arabic = true;
        }
    });
    this.dlService.fetchDevices()
    .then(
      (devices: Device[]) => this.listDevices = devices
    );
  }

  ionViewWillEnter() {
    //this.setLanguage();
    this.listDevices = this.dlService.getDevices();
    console.log(this.listDevices);
  }

  sortBy(sort){
    this.column = sort;
    console.log();
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  // onLoadDevice(device: Device, index: number) {
  //   this.navCtrl.push(SelectPage, {device: device, index: index});
  // }

  onDelete(index: number) {
    this.dlService.removeDevice(index);
    this.listDevices = this.dlService.getDevices();

    const toast = this.toastCtrl.create({
      message: 'Item Delete',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  onEdit(device: Device, index: number) {
    const modal = this.modalCtrl.create(CreatePage, {mode: 'Edit', device: device, index: index});
    modal.present();
    modal.onDidDismiss(() => {
      this.listDevices = this.dlService.getDevices();
    });
  }

  onAddDevice() {
    this.navCtrl.push(AddDevicePage);
   }

  // onAddGroup() {
  //   const modal = this.modalCtrl.create(AddGroupPage);
  //   modal.present();
  // }

}
