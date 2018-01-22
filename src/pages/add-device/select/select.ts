import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Device } from "../../../models/device";
import { CreatePage } from "../create/create";
import { DeviceListService } from "../../../services/devices-list";

@IonicPage()
@Component({
  selector: 'page-select',
  templateUrl: 'select.html',
})
export class SelectPage implements OnInit {
  device: Device;
  index: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private dlService: DeviceListService) {
  }

  ngOnInit() {
    this.device = this.navParams.get('device');
    this.index = this.navParams.get('index');
  }

  onEditDevice() {
    //this.navCtrl.push(CreatePage, {mode: 'Edit', device: this.device, index: this.index});
    const modal = this.modalCtrl.create(CreatePage, {mode: 'Edit', device: this.device, index: this.index});
    modal.present();
  }

  onDeleteDevice() {
    this.dlService.removeDevice(this.index);
    this.navCtrl.popToRoot();
  }

}
