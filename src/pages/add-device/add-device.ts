import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';

import { CreatePage } from "./create/create";

@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html',
})
export class AddDevicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  onNewDevice() {
    this.navCtrl.push(CreatePage, {mode: 'New'});
  }

  // onLoadCreate() {
  //   this.navCtrl.push(CreatePage);
  // }

}
