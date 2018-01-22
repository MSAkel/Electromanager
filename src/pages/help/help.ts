import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
  language: string;
  rtl: string;
  arabic = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public settingsService: SettingsService,
    private translateService: TranslateService) {
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
    return this.rtl;
  }


}
