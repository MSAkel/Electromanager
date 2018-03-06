import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';

import { DeviceListService } from "../../../services/devices-list";
import { SettingsService } from "../../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { CreatePage } from "../create/create";
import { CatDevice } from "../../../data/device-cat.interface";
import { DeviceCategory } from "../../../models/device-category";
import { Category } from "../../../models/category";

@IonicPage()
@Component({
  selector: 'page-display-cat',
  templateUrl: 'display-cat.html',
})
export class DisplayCatPage implements OnInit{
  //deviceGroup: {category: string, devices: CatDevice[], icon: string};
  listDevicesCategory: DeviceCategory[];
  //listCategories: Category[];
  categoryDevice: DeviceCategory;
  //category: Category;
  index: number;

  //mode:string;

  language: string;
  rtl: string;
  arabic = false;

  constructor(
    private dlService: DeviceListService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private settingsService: SettingsService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.settingsService.getLanguage();
    // this.dlService.fetchCategories()
    //   .then(
    //     (categories: Category[]) => this.listCategories = categories
    //   );

    this.dlService.fetchDevicesCategory()
    .then(
      (devices: DeviceCategory[]) => this.listDevicesCategory = devices
    );
  }

  ionViewWillEnter() {
    this.setLanguage();
    this.listDevicesCategory = this.dlService.getDevicesCategory();
    console.log(this.listDevicesCategory);
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
