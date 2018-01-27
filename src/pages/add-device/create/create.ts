import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, NavParams, ViewController, NavController, ToastController } from "ionic-angular";

import { SettingsService } from "../../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { DeviceListService } from "../../../services/devices-list";
import { Device } from "../../../models/device";
import { DeviceCategory } from "../../../models/device-category";
import { Category } from "../../../models/category";

@IonicPage()
@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage implements OnInit {
  mode = 'New';
  deviceForm: FormGroup;
  device: Device;
  listDevices: Device[];
  listCategory: Category[];
  categoryDevice: DeviceCategory;
  //listCategoryDevices: DeviceCategory[];
  index: number;

  language: string;
  rtl: string;
  arabic = false;

  hours = [];
  minutes = [];
  days = [];

  constructor (
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private dlService: DeviceListService,
    private navCtrl: NavController,
    public toastCtrl: ToastController,
    private settingsService: SettingsService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.settingsService.getLanguage();
    this.dlService.fetchCategories()
    .then(
      (category: Category[]) => this.listCategory = category
    );
    this.mode = this.navParams.get('mode');
    if (this.mode == 'Edit') {
      this.device = this.navParams.get('device');
      this.index = this.navParams.get('index');
    } else if (this.mode == 'Category Edit') {
      this.device = this.navParams.get('device');
      this.index = this.navParams.get('index');
    }else if (this.mode == 'Create') {
      this.categoryDevice = this.navParams.get('deviceCategory');
      this.index = this.navParams.get('index');
    }
    this.initializeForm();
  }

  ionViewWillEnter() {
    this.listDevices = this.dlService.getDevices();
    this.setLanguage();
    this.countHours();
    this.countMinutes();
    this.countDays();
  }

  countHours() {
    for(let i = 0; i <= 24; i++) {
      this.hours.push({hours: i});
    }
  }
  countMinutes() {
    for(let i = 0; i < 60; i++) {
      this.minutes.push({minutes: i});
    }
  }
  countDays() {
    for(let i = 0; i <= 30; i++) {
      this.days.push({days: i});
    }
    console.log(this.days);
  }

  setLanguage() {
    this.language = this.translateService.currentLang;
    if(this.language == 'ar')
    {
      this.rtl = 'rtl';
      this.arabic = true;
    }
    return this.rtl;
  }

  onSubmit() {
    const value = this.deviceForm.value;
    if (this.mode == 'Edit') {
      this.dlService.updateDevice(this.index, value.name.toUpperCase(), value.quantity, value.power, value.hours, value.daysUsed, value.category);
      const toast = this.toastCtrl.create({
        message: 'Edit Successful',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    } else if (this.mode == 'Category Edit') {
      for(let index = 0; index < this.listDevices.length; index++) {
        if(this.listDevices[index].name === this.device.name) {
          console.log("Device: ", this.listDevices[index].name);
          this.dlService.updateDevice(index, value.name.toUpperCase(), value.quantity, value.power, value.hours, value.daysUsed, value.category
          )
        }
      }
      this.dlService.updateDeviceCategory(this.index, value.name.toUpperCase(), value.quantity, value.power, value.hours, value.daysUsed, value.category);
      const toast = this.toastCtrl.create({
        message: 'Edit Successful',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    } else if (this.mode == 'New') {
      // if(value.AddToList == true) {
      //
      // }
      // if(value.AddToCategory == true) {
      //
      // }
      this.dlService.addDevice(value.name.toUpperCase(), value.quantity, value.power, value.hours, value.daysUsed, value.category);
      this.dlService.addDeviceCategory(value.name.toUpperCase(), value.quantity, value.power, value.hours, value.daysUsed, value.category);
      const toast = this.toastCtrl.create({
        message: 'Item Added Successfully',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
    // else if (this.mode == 'Add') {
    //     this.dlService.addDeviceCategory(value.name, value.quantity, value.power, value.hours, value.daysUsed, value.category);
    //     const toast = this.toastCtrl.create({
    //       message: 'Item Added Successfully',
    //       duration: 2000,
    //       position: 'bottom'
    //     });
    //     toast.present();
    // }
    else  if (this.mode == 'Add') {
        this.dlService.addDevice(value.name.toUpperCase(), value.quantity, value.power, value.hours, value.daysUsed, value.category);
        const toast = this.toastCtrl.create({
          message: 'Item Added Successfully',
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
    }
    this.deviceForm.reset();
    this.viewCtrl.dismiss();
  }

  private initializeForm() {
    let name = null;
    let quantity = 1;
    let power = null;
    let hours = 0o0;
    let daysUsed = 30;
    let category = 'Others';
    // let AddToList = null;
    // let AddToCategory = false;

    if(this.mode == 'Edit'){
      name = this.device.name;
      quantity = this.device.quantity;
      power = this.device.power;
      hours = this.device.hours;
      daysUsed = this.device.daysUsed;
      category = this.device.category;
    }

    if(this.mode == 'Category Edit'){
      name = this.device.name;
      quantity = this.device.quantity;
      power = this.device.power;
      hours = this.device.hours;
      daysUsed = this.device.daysUsed;
      category = this.device.category;
    }

    if(this.mode == 'Create') {

      name = this.categoryDevice.name;
      quantity = this.categoryDevice.quantity;
      power = this.categoryDevice.power;
      hours = this.categoryDevice.hours;
      daysUsed = this.categoryDevice.daysUsed;
      category = this.categoryDevice.category;
    }

    this.deviceForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'quantity': new FormControl(quantity, Validators.required),
      'power': new FormControl(power, Validators.required),
      'hours': new FormControl(hours, Validators.required),
      'daysUsed': new FormControl(daysUsed, Validators.required),
      'category': new FormControl(category, Validators.required)
      // 'AddToList': new FormControl(AddToList),
      // 'AddToCategory': new FormControl(AddToCategory)
    });
  }
}
