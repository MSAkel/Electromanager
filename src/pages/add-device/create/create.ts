// import { Component } from '@angular/core';
// import { NgForm } from "@angular/forms";
//
// import { DeviceListService } from "../../../services/devices-list";
//
// @Component({
//   selector: 'page-create',
//   templateUrl: 'create.html',
// })
// export class CreatePage {
//
//   constructor (private dlService: DeviceListService) {}
//
//   onAddDevice(form: NgForm) {
//     this.dlService.addDevice(form.value.deviceName, form.value.energy, form.value.hours, form.value.totalHours);
//     form.reset();
//   }
// }

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
      this.dlService.updateDevice(this.index, value.deviceName, value.energy, value.hours, value.totalHours);
    } else {
      this.dlService.addDevice(value.deviceName, value.energy, value.hours, value.totalHours);
    }
    this.deviceForm.reset();
    this.navCtrl.popToRoot();
  }

  private initializeForm() {
    let deviceName = null;
    let energy = null;
    let hours = null;
    let totalHours = null;

    if(this.mode == 'Edit'){
      deviceName = this.device.name;
      energy = this.device.energy;
      hours = this.device.hours;
      totalHours = this.device.totalHours;
    }

    this.deviceForm = new FormGroup({
      'deviceName': new FormControl(deviceName, Validators.required),
      'energy': new FormControl(energy, Validators.required),
      'hours': new FormControl(hours, Validators.required),
      'totalHours': new FormControl(totalHours, Validators.required)
    });
  }
}
