import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import {NavController } from 'ionic-angular';

import { SummaryPage } from "../summary//summary";
import { DevicesListPage } from "../devices-list//devices-list";
import { ReportsPage } from "../reports/reports";

import { SettingsService } from "../../services/settings";
import {TranslateService} from '@ngx-translate/core';
import { TutorialPage } from "../tutorial/tutorial";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  summaryPage = SummaryPage;
  dlPage = DevicesListPage;
  reportsPage = ReportsPage;

  language: string;
  rtl: string;
  arabic = false;

  constructor(
    private translateService: TranslateService,
    private navCtrl: NavController,
    private settingsService: SettingsService,
    public storage: Storage
  ) {}

  ngOnInit() {
    this.settingsService.getLanguage();
  }

  ionViewWillEnter() {
    this.setLanguage();
  }

  ionViewDidLoad() {
    this.storage.get('intro-done').then(done => {
      if (!done) {
        this.storage.set('intro-done', true);
        this.navCtrl.setRoot(TutorialPage);
      }
    });
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
