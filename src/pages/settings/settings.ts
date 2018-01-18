import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Toggle } from 'ionic-angular';
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

  selected(event) {
    this.settingsService.setLanguage(event._value);
    //.translateService.use(event._value);
    //.storage.set('language', event._value);
  }

  // getLanguage() {
  //   this.storage.get('language').then((lang) => {
  //     this.translateService.use(lang);
  //   });
  // }

  // checkLanguage() {
  //   return this.settingsService.getLanguage();
  // }

  // segmentChanged(event) {
  //       this.translateService.use(event._value);
  //
  //       //console.log(this.ar);
  //       this.storage.set('language', event._value)
  //         .then( as => console.log(event._value))
  //         .catch(
  //             err => console.log(err)
  //         );
  //
  //   }

    // onToggle (toggle: Toggle) {
    //   this.settingsService.setLanguage(toggle.checked);
    // }
    //
    // checkArabic() {
    //   return this.settingsService.isArabic();
    // }

}
