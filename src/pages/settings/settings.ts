import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
@Injectable()
export class SettingsPage implements OnInit{

  language: string;
  rtl: string;
  arabic = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settingsService: SettingsService,
    private translateService: TranslateService,
    private storage: Storage) {
  }

  ngOnInit() {
      this.settingsService.getLanguage();
  }

  ionViewWillEnter() {
    this.setLanguage();
  }

  setLanguage() {
    this.language = this.translateService.currentLang;
    if(this.language == 'ar')
    {
      this.rtl = 'rtl';
      this.arabic = true;
    }
  }

  selected(event) {
    this.settingsService.setLanguage(event._value);
    this.refreshPage();
  }

  refreshPage() {
   this.navCtrl.setRoot(this.navCtrl.getActive().component);
}
}
