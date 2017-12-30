import { Component, OnInit } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';

import { CreatePage } from "./create/create";

import { CatDevice } from "../../data/device-cat.interface";
import lists from '../../data/device-cat';

@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html',
})
export class AddDevicePage implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  deviceCat: {category: string, lists: CatDevice[], icon: string}[];

  ngOnInit() {
    this.deviceCat = lists;
  }
  //Create device button
  onNewDevice() {
    this.navCtrl.push(CreatePage, {mode: 'New'});
  }

  // onLoadCreate() {
  //   this.navCtrl.push(CreatePage);
  // }

}
