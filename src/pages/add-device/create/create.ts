import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, NavParams, ViewController, NavController } from "ionic-angular";

import { DeviceListService } from "../../../services/devices-list";
import { Device } from "../../../models/device";
import { DeviceCategory } from "../../../models/device-category";

@IonicPage()
@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage implements OnInit {
  mode = 'New';
  deviceForm: FormGroup;
  device: Device;
  deviceCategory: DeviceCategory;
  index: number;

  constructor (private navParams: NavParams, private dlService: DeviceListService, private navCtrl: NavController) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if (this.mode == 'Edit') {
      this.device = this.navParams.get('device');
      this.index = this.navParams.get('index');
    } else if (this.mode == 'Create') {
      this.deviceCategory = this.navParams.get('deviceCategory');
      this.index = this.navParams.get('index');
    }
    this.initializeForm();
  }

  onSubmit() {
    const value = this.deviceForm.value;
    if (this.mode == 'Edit') {
      this.dlService.updateDevice(this.index, value.name, value.quantity, value.power, value.hours, value.daysUsed, value.category);
    } else if (this.mode == 'New') {
      this.dlService.addDevice(value.name, value.quantity, value.power, value.hours, value.daysUsed, value.category);
    } else if (this.mode == 'Add') {
        this.dlService.addDeviceCategory(value.name, value.quantity, value.power, value.hours, value.daysUsed, value.category);
    } else  if (this.mode == 'Create') {
        this.dlService.addDevice(value.name, value.quantity, value.power, value.hours, value.daysUsed, value.category);
    }
    this.deviceForm.reset();
    this.navCtrl.popToRoot();
  }

  private initializeForm() {
    let name = null;
    let quantity = 1;
    let power = null;
    let hours = null;
    let daysUsed = 30;
    let category = null;

    if(this.mode == 'Edit'){
      name = this.device.name;
      quantity = this.device.quantity;
      power = this.device.power;
      hours = this.device.hours;
      daysUsed = this.device.daysUsed;
      category = this.device.category;
    }

    if(this.mode == 'Create') {

      name = this.deviceCategory.name;
      quantity = this.deviceCategory.quantity;
      power = this.deviceCategory.power;
      hours = this.deviceCategory.hours;
      daysUsed = this.deviceCategory.daysUsed;
      category = this.deviceCategory.category;
    }

    this.deviceForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'quantity': new FormControl(quantity, Validators.required),
      'power': new FormControl(power, Validators.required),
      'hours': new FormControl(hours, Validators.required),
      'daysUsed': new FormControl(daysUsed, Validators.required),
      'category': new FormControl(category, Validators.required)
    });
  }
}
