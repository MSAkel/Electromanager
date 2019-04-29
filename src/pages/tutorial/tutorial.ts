//import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { TabsPage } from '../tabs/tabs';
import { DevicesListPage } from "../devices-list/devices-list";

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
    // public storage: Storage
   ) {}

  navHome() {
    //this.storage.set('intro-done', true);
    this.navCtrl.pop();
  }
}
