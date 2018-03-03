import { Injectable} from '@angular/core';
import { Storage } from '@ionic/storage';

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastController } from 'ionic-angular';

import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { Rate } from "../../models/rate";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
@Injectable()
export class SettingsPage implements OnInit{
  settingsForm: FormGroup;
  rateForm: FormGroup;
  language: string;
  rtl: string;
  arabic = false;
  english = false;

  listRates: Rate[];
  current: number;
  index = 0;
  num: number = 1;
  //previousRate: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private settingsService: SettingsService,
    private translateService: TranslateService,
    public toastCtrl: ToastController,
    private storage: Storage) {
  }

  ngOnInit() {
      this.settingsService.getLanguage();
      this.settingsService.getSettings();
      this.settingsService.fetchRates()
        .then(
          (rates: Rate[]) => this.listRates = rates
        );

      this.initializeForm();
  }

  ionViewWillEnter() {
    this.setLanguage();
    this.listRates = this.settingsService.getRates();
  }

  setLanguage() {
    this.language = this.translateService.currentLang;
    if(this.language == 'ar')
    {
      this.rtl = 'rtl';
      this.arabic = true;
    } else {
      this.english = true;
    }
  }

  selected(event) {
    this.settingsService.setLanguage(event);
    console.log(event);
    this.refreshPage();
  }

  // previous() {
  //     var previousRate = this.listRates[this.index].rateRange;
  //     if(this.index < this.listRates.length){
  //       console.log("Value:", previousRate);
  //       console.log("rate:", this.index);
  //        this.index++
  //     }
  //     return previousRate;
  // }

  refreshPage() {
   this.navCtrl.setRoot(this.navCtrl.getActive().component);
}

  onSubmitRate() {
    const value = this.rateForm.value;
    this.settingsService.addRate(value.range, value.cost);
    this.listRates = this.settingsService.getRates();
    this.rateForm.reset();
  }
  onSubmit() {
    const value = this.settingsForm.value;
    this.settingsService.saveSettings(value.tax, value.flatRate);
  }

  // onDelete(index: number) {
  //   this.settingsService.removeRate(index);
  //   this.listRates = this.settingsService.getRates();
  //
  //   const toast = this.toastCtrl.create({
  //     message: 'Item Delete',
  //     duration: 1500,
  //     position: 'bottom'
  //   });
  //   toast.present();
  // }

  onClear() {
    // this.settingsService.removeRates();
    // this.listRates = this.settingsService.getRates();

      // const toast = this.toastCtrl.create({
      //   message: 'Cleared List',
      //   duration: 1500,
      //   position: 'bottom'
      // });
      // toast.present();
     let alert = this.alertCtrl.create({
     title: 'Clear List?',
     message: 'Clicking confirm will delete all your tariff rate entries',
     buttons: [
       {
         text: 'Close',
         handler: () => {
           console.log('Disagree clicked');
         }
       },
       {
         text: 'Confirm',
         handler: () => {
           this.settingsService.removeRates();
           this.listRates = this.settingsService.getRates();
         }
       }
     ]
   });

   alert.present();
  }


  private initializeForm() {
    let range = null;
    let cost = null;
    let  tax = this.settingsService.getTax;
    let flatRate = this.settingsService.getFlatRate;

    this.rateForm = new FormGroup({
      'range':new FormControl(range, Validators.required),
      'cost': new FormControl(cost, Validators.required)
    })

    this.settingsForm = new FormGroup({

      'tax': new FormControl(tax, Validators.required),
      'flatRate': new FormControl(flatRate, Validators.required)
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message:" {{ 'SETTINGS.TOAST' | translate }}",
      duration: 1000
    });
    toast.present();
  }
}
