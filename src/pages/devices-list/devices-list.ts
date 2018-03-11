import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
//import { Storage } from '@ionic/storage';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";

import { Device } from "../../models/device";
import { Month } from "../../models/month";
import { Rate } from "../../models/rate";
import { Category } from "../../models/category";
import { CataloguePage } from "../catalogue/catalogue";

import { DeviceCategory } from "../../models/device-category";
import { CreatePage } from "../create/create";

@Component({
  selector: 'page-devices-list',
  templateUrl: 'devices-list.html',
})
export class DevicesListPage implements OnInit{
  listDevices: Device[];
  device: Device;
  index: number;
  categoryForm: FormGroup;
  categoryEditForm: FormGroup;
  listRates: Rate[];
  listMonths: Month[];

  listCategories: Category[];
  category: Category;
  listCategoryDevices: DeviceCategory[];

  edit = false;
  name: string;

  constructor(private dlService: DeviceListService,
     private navCtrl: NavController,
     private modalCtrl: ModalController,
     public toastCtrl: ToastController,
     public navParams: NavParams,
     //public storage: Storage,
     public alertCtrl: AlertController,
     private settingsService: SettingsService) {}

  ngOnInit() {
    this.dlService.fetchDevices()
    .then(
      (devices: Device[]) => this.listDevices = devices
    );
    this.settingsService.fetchRates()
      .then(
        (rates: Rate[]) => this.listRates = rates
    );
    this.dlService.fetchCategories()
      .then(
        (categories: Category[]) => this.listCategories = categories
    );
    this.dlService.fetchDevicesCategory()
      .then(
        (devices: DeviceCategory[]) => this.listCategoryDevices = devices
    );
    this.dlService.fetchMonths()
      .then(
        (months: Month[]) => this.listMonths = months
    );

  }

  ionViewWillEnter() {
    this.listDevices = this.dlService.getDevices();
    this.listCategories = this.dlService.getCategories();
    console.log(this.listDevices);
    console.log(this.listCategories);
    this.edit = false;
    //this.name = null;
  }

  onAddAppliance(category: Category) {
    const modal = this.modalCtrl.create(CreatePage, {mode: 'New', category: category});
    modal.present();
    modal.onDidDismiss(() => {
      this.listCategories = this.dlService.getCategories();
      this.listCategoryDevices = this.dlService.getDevicesCategory();
      this.listDevices = this.dlService.getDevices();
    });
  }

  onEdit(device: Device, index: number) {
    const modal = this.modalCtrl.create(CreatePage, {mode: 'Edit', device: device, index: index});
    modal.present();
    modal.onDidDismiss(() => {
      this.listDevices = this.dlService.getDevices();
    });
  }

  onDelete(index: number) {
    this.dlService.removeDevice(index);
    this.listDevices = this.dlService.getDevices();

    const toast = this.toastCtrl.create({
      message: 'Item Delete',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  displayWindow() {
     let alert = this.alertCtrl.create({
       title: 'Create Category',
       inputs: [
         {
           name: 'title',
           placeholder: 'Category Name'
         },
       ],
       buttons: [
         {
           text: 'Cancel',
           handler: () => {
             console.log('Cancel clicked');
           }
         },
         {
           text: 'Save',
           handler: (data) => {
             this.name = data.title;
             if(this.name.length == 0) {

               return false;
             } else {
               console.log(this.name);
               this.onAddCategory();
             }
           }
         }
       ]
     });
     alert.present();
   }

   onAddCategory() {
      this.dlService.addCategory(this.name.toUpperCase());
      const toast = this.toastCtrl.create({
        message: 'Category Added Successfully',
        duration: 1000,
        position: 'bottom'
    });
    toast.present();
      this.listCategories = this.dlService.getCategories();
   }

  onDeleteCategory(index: number) {
    for (let deviceIndex = 0; deviceIndex < this.listDevices.length; deviceIndex++) {
      try {
        while(this.listDevices[deviceIndex].category === this.listCategories[index].name) {
              this.dlService.removeDevice(deviceIndex);
              this.listDevices = this.dlService.getDevices();
        }
      }
      catch(err) {
        continue;
      }
    }
    this.dlService.removeCategory(index);
    this.listDevices = this.dlService.getDevices();
    this.listCategories = this.dlService.getCategories();

    const toast = this.toastCtrl.create({
      message: 'Category Deleted',
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  onSelectCategory(category: Category, index: number) {
    this.edit = true;
    this.category = category;
    this.index = index;
    this.name = this.category.name;
    console.log('Name:',category.name);

    this.initializeEditForm();
  }

  private initializeEditForm() {
    let name = this.category.name;

    this.categoryEditForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
    });
  }

  onEditCategory() {
    const value = this.categoryEditForm.value;

      for(var index = 0; index < this.listDevices.length; index++) {
        if (this.listDevices[index].category == this.category.name) {
          this.dlService.updateDevice(index,
            this.listDevices[index].name,
            this.listDevices[index].quantity,
            this.listDevices[index].power,
            this.listDevices[index].hours,
            this.listDevices[index].daysUsed,
            value.name.toUpperCase(),
            this.listDevices[index].compressor
          )
        }
      }
      this.dlService.updateCategory(this.index, value.name.toUpperCase());

      const toast = this.toastCtrl.create({
        message: 'Edit Successful',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
    this.edit = false;
    this.listCategories = this.dlService.getCategories();
    this.listDevices = this.dlService.getDevices();
  }

   onViewCatalogue() {
     this.navCtrl.push(CataloguePage);
   }
}
