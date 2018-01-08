import { Component, OnInit } from '@angular/core';
import {NavController, AlertController } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
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
  totalPower: number = 0;
  totalHours: number;
  power: number;
  multi: number;


  constructor(private dlService: DeviceListService,
     private navCtrl: NavController,
     private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.dlService.fetchDevices();
  }

  ionViewWillEnter() {
    this.listDevices = this.dlService.getDevices();
    if( this.listDevices.length > 0) {
      this.calculate();
    }
  }

  calculate(){
      this.totalPower = 0;
      for(var index = 0; index < this.listDevices.length; index++){
        this.totalHours = this.listDevices[index].totalHours;
        this.power = this.listDevices[index].power;
        this.multi = this.totalHours * this.power;
        this.totalPower = this.totalPower + this.multi;
        console.log(this.listDevices.length);
        console.log('count ' + index);

    }
    return this.totalPower;
  }

  onLoadDevice(device: Device, index: number) {
    this.navCtrl.push(SelectPage, {device: device, index: index});

  }

  onAddDevice() {
    const alert = this.alertCtrl.create({
      title: 'Add New Appliance',
      message: 'Select an appliance or create a new one',
      buttons: [
        {
          text: "Create New",
          handler: () => {
            this.navCtrl.push(CreatePage, {mode: 'Add'});
          }
        },
        {
          text: "Select Appliance",
          handler: () => {
            this.navCtrl.push(AddDevicePage);
          }
        }
      ]
    });
    alert.present();
  }
}
