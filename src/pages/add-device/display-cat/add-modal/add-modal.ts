import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { DeviceListService } from "../../../../services/devices-list";
import { Device } from "../../../../models/device";

@IonicPage()
@Component({
  selector: 'page-add-modal',
  templateUrl: 'add-modal.html',
})
export class AddModalPage implements OnInit{
  deviceForm: FormGroup;
  device: Device;
  // name: string;
  // quantity: number;
  // power: number;
  // hours: number;
  // daysUsed: number;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private dlService: DeviceListService) {}

  ngOnInit() {
    this.initializeForm();
  }

  onSubmit() {
    const value = this.deviceForm.value;
    this.dlService.addDevice(value.name, value.quantity, value.power, value.hours, value.daysUsed, value.category);
    this.deviceForm.reset();
    this.viewCtrl.dismiss();
  }

  // ionViewDidLoad() {
  //   this.name = this.navParams.get('name');
  //   this.quantity = this.navParams.get('quantity');
  //   this.power = this.navParams.get('power');
  //   this.hours = this.navParams.get('hours');
  //   this.daysUsed = this.navParams.get('daysUsed');
  // }

  private initializeForm() {

    let name = this.navParams.get('name');
    let quantity = this.navParams.get('quantity');
    let power = this.navParams.get('power');
    let hours = this.navParams.get('hours');
    let daysUsed = this.navParams.get('daysUsed');
    let category = this.navParams.get('category');


    this.deviceForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'quantity': new FormControl(quantity, Validators.required),
      'power': new FormControl(power, Validators.required),
      'hours': new FormControl(hours, Validators.required),
      'daysUsed': new FormControl(daysUsed, Validators.required),
      'category': new FormControl(category, Validators.required)
    });
  }

  onClose() {
    this.viewCtrl.dismiss();
  }
}
