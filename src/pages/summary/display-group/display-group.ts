import { Component, OnInit } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DeviceListService } from "../../../services/devices-list";
import { SettingsService } from "../../../services/settings";
import { TranslateService } from '@ngx-translate/core';
import { GroupList } from "../../../models/group-list";
import { Group } from "../../../models/group";

@Component({
  selector: 'page-display-group',
  templateUrl: 'display-group.html',
})
export class DisplayGroupPage implements OnInit{
  listGroupDevices: GroupList[];
  group: Group;

  language: string;
  rtl: string;
  arabic = false;
  slide: string;

  descending: boolean = false;
  order: number;
  column: string;

  constructor(
     private dlService: DeviceListService,
     private navCtrl: NavController,
     public navParams: NavParams,
     public storage: Storage,
     private settingsService: SettingsService,
     private translateService: TranslateService) {
  }

  ngOnInit() {
    this.group = this.navParams.get('group');
    this.settingsService.getLanguage()
      .then(() =>{
        if(this.translateService.currentLang === "ar"){
          this.rtl = "rtl";
          this.slide = 'left';
          this.arabic = true;
        }
    });
    this.dlService.fetchGroupList()
    .then(
      (listDevices: GroupList[]) => this.listGroupDevices = listDevices
    );
  }

  ionViewWillEnter() {
    //this.setLanguage();
    this.listGroupDevices = this.dlService.getGroupList();
    console.log(this.listGroupDevices);
  }

  sortBy(sort){
    this.column = sort;
    console.log();
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }
}
