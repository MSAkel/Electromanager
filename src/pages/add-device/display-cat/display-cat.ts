import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';

import { AddModalPage } from "./add-modal/add-modal";
import { CatDevice } from "../../../data/device-cat.interface";
//import { CreatePage } from "../create/create";
//import {DeviceListService} from '../../../services/devices-list';

@IonicPage()
@Component({
  selector: 'page-display-cat',
  templateUrl: 'display-cat.html',
})
export class DisplayCatPage implements OnInit{
  deviceGroup: {category: string, devices: CatDevice[], icon: string};
  //index: number;
  // name: string;
  // quantity: number;
  // power: number;
  // hours: number;
  // totalHours: number;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     //private alertCtrl: AlertController,
     //private dlService: DeviceListService,
     private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.deviceGroup = this.navParams.data;
  }

  onAddDevice(selectedDevice: CatDevice) {
    console.log('test');
    const modal = this.modalCtrl.create(AddModalPage, selectedDevice);
    modal.present();

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
  }

}
