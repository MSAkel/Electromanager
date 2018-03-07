import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SettingsService } from "../../services/settings";

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public settingsService: SettingsService) {}
}
