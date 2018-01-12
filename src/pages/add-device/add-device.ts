import { Component, OnInit } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';

import { AddCategoryPage } from "./add-category/add-category";

import { CatDevice } from "../../data/device-cat.interface";
import devices from '../../data/device-cat';
import { DisplayCatPage } from "./display-cat/display-cat";

@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html',
})
export class AddDevicePage implements OnInit{
  deviceCat: {category: string, devices: CatDevice[], icon: string}[];
  displayCatPage = DisplayCatPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.deviceCat = devices;
  }
  //Create device button
  onAddCategory() {
    this.navCtrl.push(AddCategoryPage);
  }

  // onLoadCreate() {
  //   this.navCtrl.push(CreatePage);
  // }
}
