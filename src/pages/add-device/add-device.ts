import { Component, OnInit } from '@angular/core';
import {NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { AddCategoryPage } from "./add-category/add-category";
import { CreatePage } from "../add-device/create/create";
import { DisplayCatPage } from "./display-cat/display-cat";
import { AddModalPage } from "./display-cat/add-modal/add-modal";

import { Category } from "../../models/category";
import { DeviceCategory } from "../../models/device-category";
import { CatDevice } from "../../data/device-cat.interface";
import devices from '../../data/device-cat';

@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html',
})
export class AddDevicePage implements OnInit{
  deviceCat: {category: string, devices: CatDevice[], icon: string}[];
  displayCatPage = DisplayCatPage;

  listCategories: Category[];
  category: Category;
  index: number;

  listCategoryDevices: DeviceCategory[];

  language: string;
  rtl: string;
  arabic = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private dlService: DeviceListService,
    private settingsService: SettingsService,
    private translateService: TranslateService) {}

  ngOnInit() {
    this.settingsService.getLanguage();
    this.deviceCat = devices;
    this.dlService.fetchCategories()
      .then(
        (categories: Category[]) => this.listCategories = categories
      );
    this.dlService.fetchDevicesCategory()
      .then(
        (devices: DeviceCategory[]) => this.listCategoryDevices = devices
      );
  }

  ionViewWillEnter() {
    this.setLanguage();
    this.listCategories = this.dlService.getCategories();
    console.log(this.listCategoryDevices);
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

  onAddDevice(deviceCategory: DeviceCategory, index: number) {
    const modal = this.modalCtrl.create(CreatePage, {mode: 'Add', deviceCategory: deviceCategory, index: index});
    modal.present();
  }

  //TODO: Fix this
  onDelete(index: number) {
    for (let deviceIndex = 0; deviceIndex < this.listCategoryDevices.length; deviceIndex++) {
      try {
        while(this.listCategoryDevices[deviceIndex].category === this.listCategories[index].name) {
              this.dlService.removeDeviceCategory(deviceIndex);
              this.listCategoryDevices = this.dlService.getDevicesCategory();
        }
      }
      catch(err) {
        continue;
      }
    }
    this.dlService.removeCategory(index);
    this.listCategories = this.dlService.getCategories();

    const toast = this.toastCtrl.create({
      message: 'Category Deleted',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  onEdit(category: Category, index: number) {
    const modal = this.modalCtrl.create(AddCategoryPage, {mode: 'Edit', category: category, index: index});
    modal.present();
    modal.onDidDismiss(() => {
      this.listCategories = this.dlService.getCategories();
    });
  }

  onLoadCategory(category: Category, index: number) {
    this.navCtrl.push(DisplayCatPage, {mode: 'Custom', category: category, index: index});
  }

  onAddCategory() {
    const modal = this.modalCtrl.create(AddCategoryPage, {mode: 'Add'})
    modal.present();
    modal.onDidDismiss(() => {
      this.listCategories = this.dlService.getCategories();
    });
  }

  onAddItem() {
    //this.navCtrl.push(CreatePage, {mode: 'New'});
    const modal = this.modalCtrl.create(CreatePage, {mode: 'New'});
    modal.present();
    modal.onDidDismiss(() => {
      this.listCategories = this.dlService.getCategories();
      this.listCategoryDevices = this.dlService.getDevicesCategory();
    });
  }

  // onAddToCategory(){
  //   //this.navCtrl.push(CreatePage, {mode: 'Add'});
  //   const modal = this.modalCtrl.create(CreatePage, {mode: 'Add'});
  //   modal.present();
  // }
}
