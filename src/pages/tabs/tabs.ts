import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import {NavController } from 'ionic-angular';

import { SummaryPage } from "../summary//summary";
import { DevicesListPage } from "../devices-list//devices-list";
import { ReportsPage } from "../reports/reports";

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
  //adPage = AddDevicePage;
  constructor(translate: TranslateService,
    private navCtrl: NavController,
  public storage: Storage) {}

  ionViewDidLoad() {
  this.storage.get('intro-done').then(done => {
    if (!done) {
      this.storage.set('intro-done', true);
      this.navCtrl.setRoot(TutorialPage);
    }
  });
}

}
