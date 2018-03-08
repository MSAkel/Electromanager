import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

import { DeviceListService } from "../../../services/devices-list";

import { CreatePage } from "../create/create";
import { DeviceCategory } from "../../../models/device-category";

@IonicPage()
@Component({
  selector: 'page-display-cat',
  templateUrl: 'display-cat.html',
})
export class DisplayCatPage implements OnInit{
  listDevicesCategory: DeviceCategory[];
  categoryDevice: DeviceCategory;
  index: number;

  constructor(
    private dlService: DeviceListService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController) {}

  ngOnInit() {
    this.dlService.fetchDevicesCategory()
    .then(
      (devices: DeviceCategory[]) => this.listDevicesCategory = devices
    );
  }

  ionViewWillEnter() {
    this.listDevicesCategory = this.dlService.getDevicesCategory();
    console.log(this.listDevicesCategory);
  }

  onDelete(index: number) {
    this.dlService.removeDeviceCategory(index);
    this.listDevicesCategory = this.dlService.getDevicesCategory();

    const toast = this.toastCtrl.create({
      message: 'Item Delete',
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  onEdit(device: DeviceCategory, index: number) {
    const modal = this.modalCtrl.create(CreatePage, {mode: 'Category Edit', device: device, index: index});
    modal.present();
    modal.onDidDismiss(() => {
      this.listDevicesCategory = this.dlService.getDevicesCategory();
    });
  }
}
