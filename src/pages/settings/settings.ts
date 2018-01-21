import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastController } from 'ionic-angular';

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
  settingsForm: FormGroup;
  language: string;
  rtl: string;
  arabic = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settingsService: SettingsService,
    private translateService: TranslateService,
    public toastCtrl: ToastController,
    private storage: Storage) {
  }

  ngOnInit() {
      this.settingsService.getLanguage();
      this.settingsService.getSettings();
      this.initializeForm();
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
  onSubmit() {
    const value = this.settingsForm.value;
    this.settingsService.saveSettings(value.cost, value.tax, value.flatRate);
  }


  private initializeForm() {
    let cost = this.settingsService.getCost;
    let  tax = this.settingsService.getTax;
    let flatRate = this.settingsService.getFlatRate;


    this.settingsForm = new FormGroup({
      'cost': new FormControl(cost, Validators.required),
      'tax': new FormControl(tax, Validators.required),
      'flatRate': new FormControl(flatRate, Validators.required)
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: '{{ SETTINGS.TOAST }}',
      duration: 2500
    });
    toast.present();
  }
}
