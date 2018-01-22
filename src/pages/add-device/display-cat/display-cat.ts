import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';

import { DeviceListService } from "../../../services/devices-list";
import { Device } from "../../../models/device";
//import { AddModalPage } from "./add-modal/add-modal";
import { CreatePage } from "../create/create";
import { CatDevice } from "../../../data/device-cat.interface";
import { DeviceCategory } from "../../../models/device-category";
import { Category } from "../../../models/category";
//import { CreatePage } from "../create/create";
//import {DeviceListService} from '../../../services/devices-list';

@IonicPage()
@Component({
  selector: 'page-display-cat',
  templateUrl: 'display-cat.html',
})
export class DisplayCatPage implements OnInit{
  deviceGroup: {category: string, devices: CatDevice[], icon: string};
  listDevicesCategory: DeviceCategory[];
  deviceCategory: DeviceCategory;
  category: Category;
  index: number;

  mode:string;


  constructor(
    private dlService: DeviceListService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
     //private alertCtrl: AlertController,
     //private dlService: DeviceListService,
    private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');

      this.category = this.navParams.get('category');

      this.deviceGroup = this.navParams.data;
    
    console.log(this.mode);
    this.dlService.fetchDevicesCategory()
    .then(
      (devices: DeviceCategory[]) => this.listDevicesCategory = devices
    );
  }

  onDelete(index: number) {
    this.dlService.removeDeviceCategory(index);
    this.listDevicesCategory = this.dlService.getDevicesCategory();

    const toast = this.toastCtrl.create({
      message: 'Item Delete',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  onEdit(device: DeviceCategory, index: number) {
    const modal = this.modalCtrl.create(CreatePage, {mode: 'Category Edit', device: device, index: index});
    modal.present();
  }

  ionViewWillEnter() {
    this.listDevicesCategory = this.dlService.getDevicesCategory();
  }

  onAddDevice(deviceCategory: DeviceCategory, index: number) {
    const modal = this.modalCtrl.create(CreatePage, {mode: 'Create', deviceCategory: deviceCategory, index: index});
    modal.present();
  }

  // onAddDevice(selectedDevice: CatDevice) {
  //   console.log('test');
  //   const modal = this.modalCtrl.create(AddModalPage, selectedDevice);
  //   modal.present();

    // const alert = this.alertCtrl.create({
    //   title: 'Add Device',
    //   //subTitle: 'Are you sure?',
    //   message: 'Add item to your list?',
    //   buttons: [
    //     {
    //       text: "Confirm",
    //       handler: () => {
    //         //this.navCtrl.push(CreatePage, {mode: 'Edit', device: this.deviceCat, index: this.index});
    //         this.dlService.addDevice(selectedDevice.name, selectedDevice.quantity, selectedDevice.power, selectedDevice.hours, selectedDevice.daysUsed);
    //       }
    //     },
    //     {
    //       text: "Cancel",
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancelled');
    //       }
    //     }
    //   ]
    // });
    //
    // alert.present();
  //}

}
