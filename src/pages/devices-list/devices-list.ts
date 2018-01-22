import { Component, OnInit } from '@angular/core';
import {NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { Device } from "../../models/device";
//import { CreatePage } from "../add-device/create/create";
import { AddDevicePage } from "../add-device/add-device";
import { SelectPage } from "../add-device/select/select";
import { CreatePage } from "../add-device/create/create";
//import { TutorialPage } from "../tutorial/tutorial";


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
    this.settingsService.getLanguage();
    this.dlService.fetchDevices()
    .then(
      (devices: Device[]) => this.listDevices = devices
    );
  }

//   ionViewDidLoad() {
//   this.storage.get('intro-done').then(done => {
//     if (!done) {
//       this.storage.set('intro-done', true);
//       this.navCtrl.setRoot(TutorialPage);
//     }
//   });
// }

  ionViewWillEnter() {
    this.setLanguage();
    this.listDevices = this.dlService.getDevices();
    console.log(this.listDevices);
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

  sortBy(sort){
    this.column = sort;
    console.log();
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  onLoadDevice(device: Device, index: number) {
    this.navCtrl.push(SelectPage, {device: device, index: index});
  }

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
  }

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
