import { Component, OnInit } from '@angular/core';
import {NavController, NavParams, ModalController } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { AddCategoryPage } from "./add-category/add-category";
import { CreatePage } from "../add-device/create/create";
import { DisplayCatPage } from "./display-cat/display-cat";
import { AddModalPage } from "./display-cat/add-modal/add-modal";

import { Category } from "../../models/category";
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

  language: string;
  rtl: string;
  arabic = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
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
  }

  ionViewWillEnter() {
    this.setLanguage();
    this.listCategories = this.dlService.getCategories();
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

  onLoadCategory(category: Category, index: number) {
    this.navCtrl.push(DisplayCatPage, {mode: 'Custom', category: category, index: index});
  }

  onAddCategory() {
    this.navCtrl.push(AddCategoryPage);
  }

  onAddItem() {
    //this.navCtrl.push(CreatePage, {mode: 'New'});
    const modal = this.modalCtrl.create(CreatePage, {mode: 'New'});
    modal.present();
  }

  // onAddToCategory(){
  //   //this.navCtrl.push(CreatePage, {mode: 'Add'});
  //   const modal = this.modalCtrl.create(CreatePage, {mode: 'Add'});
  //   modal.present();
  // }
}
