import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, ViewController, NavParams, ToastController } from 'ionic-angular';

import { DeviceListService } from "../../../services/devices-list";
import { Category } from "../../../models/category";
import { DeviceCategory } from "../../../models/device-category";

@IonicPage()
@Component({
  selector: 'page-add-category',
  templateUrl: 'add-category.html',
})
export class AddCategoryPage {
  mode = 'New';
  category: Category;
  listCategory: Category[];
  listDeviceCategory: DeviceCategory[];
  categoryForm: FormGroup;

  index: number;


  constructor(private viewCtrl: ViewController, public toastCtrl: ToastController, private navParams: NavParams, private dlService: DeviceListService) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    if(this.mode == 'Edit') {
      this.category = this.navParams.get('category');
      this.index = this.navParams.get('index');
    }
    this.initializeForm();
  }

  ionViewWillEnter() {
    this.listDeviceCategory = this.dlService.getDevicesCategory();
    this.listCategory = this.dlService.getCategories();
  }

  onSubmit() {
    const value = this.categoryForm.value;
    if(this.mode == "Edit") {
      for(var index = 0; index < this.listDeviceCategory.length; index++) {
        console.log('old Value name: ' + this.category.name);
        console.log('New Value name: ' + value.name);
        if (this.listDeviceCategory[index].category == this.category.name)
        {
          console.log('Device Category: ' + this.listDeviceCategory[index].category +' Device Name: ' + this.listDeviceCategory[index].name);
          this.listDeviceCategory[index].category = value.name;
          this.dlService.updateDeviceCategory(index,
            this.listDeviceCategory[index].name,
            this.listDeviceCategory[index].quantity,
            this.listDeviceCategory[index].power,
            this.listDeviceCategory[index].hours,
            this.listDeviceCategory[index].daysUsed,
            this.listDeviceCategory[index].category
          )

          this.dlService.updateDevice(index,
            this.listDeviceCategory[index].name,
            this.listDeviceCategory[index].quantity,
            this.listDeviceCategory[index].power,
            this.listDeviceCategory[index].hours,
            this.listDeviceCategory[index].daysUsed,
            this.listDeviceCategory[index].category
          )
        }
      }
      this.dlService.updateCategory(this.index, value.name);

      const toast = this.toastCtrl.create({
        message: 'Edit Successful',
        duration: 1500,
        position: 'bottom'
      });
      toast.present();
    } else if (this.mode == "Add") {
        this.dlService.addCategory(value.name);
        this.categoryForm.reset();
        const toast = this.toastCtrl.create({
          message: 'Category Added Successfully',
          duration: 2000,
          position: 'bottom'
      });
      toast.present();
    }
    this.viewCtrl.dismiss();
  }

  private initializeForm() {
    let name = null;

    if(this.mode == 'Edit') {
      name = this.category.name;
    }

    this.categoryForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
    });
  }

  onClose() {
    this.viewCtrl.dismiss();
  }
}
