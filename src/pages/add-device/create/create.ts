import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NavParams, NavController } from "ionic-angular";

import { DeviceListService } from "../../../services/devices-list";
import { Device } from "../../../models/device";

@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage implements OnInit {
  mode = 'New';
  deviceForm: FormGroup;
  device: Device;
  index: number;

  constructor (private navParams: NavParams, private dlService: DeviceListService, private navCtrl: NavController) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if (this.mode == 'Edit') {
      this.device = this.navParams.get('device');
      this.index = this.navParams.get('index');
    }
    this.initializeForm();
  }

  onSubmit() {
    const value = this.deviceForm.value;
    if (this.mode == 'Edit') {
      this.dlService.updateDevice(this.index, value.name, value.quantity, value.power, value.hours, value.totalHours, value.daysUsed);
    } else {
      this.dlService.addDevice(value.name, value.quantity, value.power, value.hours, value.totalHours, value.daysUsed);
    }
    this.deviceForm.reset();
    this.navCtrl.popToRoot();
  }

  private initializeForm() {
    let name = null;
    let quantity = 1;
    let power = null;
    let hours = null;
    let totalHours = null;
    let daysUsed = 30;

    if(this.mode == 'Edit'){
      name = this.device.name;
      quantity = this.device.quantity;
      power = this.device.power;
      hours = this.device.hours;
      totalHours = this.device.totalHours;
      daysUsed = this.device.daysUsed;
    }

    this.deviceForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'quantity': new FormControl(quantity, Validators.required),
      'power': new FormControl(power, Validators.required),
      'hours': new FormControl(hours, Validators.required),
      'totalHours': new FormControl(totalHours, Validators.required),
      'daysUsed': new FormControl(daysUsed, Validators.required)
    });
  }
}
