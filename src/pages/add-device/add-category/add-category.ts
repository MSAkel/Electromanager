import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { DeviceListService } from "../../../services/devices-list";

@IonicPage()
@Component({
  selector: 'page-add-category',
  templateUrl: 'add-category.html',
})
export class AddCategoryPage {

  categoryForm: FormGroup;


  constructor(private viewCtrl: ViewController, private navParams: NavParams, private dlService: DeviceListService) {}

  ngOnInit() {
    this.initializeForm();
  }

  onSubmit() {
    const value = this.categoryForm.value;
    this.dlService.addCategory(value.name);
    this.categoryForm.reset();
    this.viewCtrl.dismiss();
  }

  private initializeForm() {
    let name = null;


    this.categoryForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
    });
  }

  onClose() {
    this.viewCtrl.dismiss();
  }
}
