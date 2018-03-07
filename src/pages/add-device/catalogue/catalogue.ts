import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-catalogue',
  templateUrl: 'catalogue.html',
})
export class CataloguePage {
  appliance: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.appliance = 'airCons';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CataloguePage');
  }

}
