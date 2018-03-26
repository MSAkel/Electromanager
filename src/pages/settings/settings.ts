import { Component, OnInit, Injectable } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { SettingsService } from "../../services/settings";
import { Rate } from "../../models/rate";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
@Injectable()
export class SettingsPage implements OnInit{
  settingsForm: FormGroup;
  rateForm: FormGroup;

  listRates: Rate[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private settingsService: SettingsService,
    public toastCtrl: ToastController) {}

  ngOnInit() {
    this.settingsService.getSettings();
    this.settingsService.fetchRates()
      .then(
        (rates: Rate[]) => this.listRates = rates
      );
    this.initializeForm();
  }

  ionViewWillEnter() {
    this.listRates = this.settingsService.getRates();
  }

  onSubmitRate() {
    const value = this.rateForm.value;
    var rateRangeIncrement: number;
    console.log(this.listRates.length);
    if(this.listRates.length == 0) {
      rateRangeIncrement = 0;
    } else {
      var lastIndex = this.listRates.length - 1;
       rateRangeIncrement = this.listRates[lastIndex].rateRange * 1 + 1;
    }

    if(value.range <= rateRangeIncrement)
    {
      let toast = this.toastCtrl.create({
        message:"Input cannot be lower than highest kWh range",
        duration: 2000
      });
      toast.present();
    } else {

    this.settingsService.addRate(parseInt(value.range), rateRangeIncrement, value.cost);
    this.listRates = this.settingsService.getRates();
    this.rateForm.reset();
    console.log(this.listRates);

    let toast = this.toastCtrl.create({
      message:"Settings Saved",
      duration: 1000
    });
    toast.present();
  }
  }
  onSubmit() {
    const value = this.settingsForm.value;
    this.settingsService.saveSettings(value.tax, value.flatRate);
  }

  onClear() {
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

      'tax': new FormControl(tax),
      'flatRate': new FormControl(flatRate)
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message:"Settings Saved",
      duration: 1000
    });
    toast.present();
  }
}
