//import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
//import { NavController } from 'ionic-angular';

import { SummaryPage } from "../summary//summary";
import { DevicesListPage } from "../devices-list//devices-list";
import { ReportsPage } from "../reports/reports";

//import { TutorialPage } from "../tutorial/tutorial";
import { SettingsService } from "../../services/settings";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  summaryPage = SummaryPage;
  dlPage = DevicesListPage;
  reportsPage = ReportsPage;

  constructor(
    //private navCtrl: NavController,
    private settingsService: SettingsService
    //public storage: Storage
  ) {}

  ionViewDidLoad() {
  //  this.storage.get('intro-done').then(done => {
    //  if (!done) {
      //this.navCtrl.setRoot(TutorialPage);
        this.settingsService.addRate(1000, 0, 0.18);
    //  }
    //});
  }
}
