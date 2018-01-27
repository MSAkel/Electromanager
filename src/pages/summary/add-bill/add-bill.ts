import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, NavController, ViewController, NavParams, ToastController } from 'ionic-angular';

import { SettingsService } from "../../../services/settings";
import { TranslateService } from '@ngx-translate/core';
import { DeviceListService } from "../../../services/devices-list";

import { Adjust } from '../../../models/adjust';

@IonicPage()
@Component({
  selector: 'page-add-bill',
  templateUrl: 'add-bill.html',
})
export class AddBillPage implements OnInit {
  mode = 'Add';
  billForm: FormGroup;

  adjust: Adjust;
  //listAdjust: Adjust[];
  index: number;

  language: string;
  rtl: string;
  arabic = false;

  constructor(
    private viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private dlService: DeviceListService,
    private settingsService: SettingsService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.settingsService.getLanguage();
    // this.dlService.fetchAdjust()
    //   .then(
    //     (adjust: Adjust[]) => this.listAdjust = adjust
    //   );
    this.mode = this.navParams.get('mode');
    if(this.mode == 'Edit') {
      this.adjust = this.navParams.get('bill');
      this.index = this.navParams.get('index');
    }
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
    return this.rtl;
  }

  onSubmit() {
    const value = this.billForm.value;
    console.log('Bill: ' + value.bill + " appBill: " + value.appBill);
    value.difference = value.appBill - value.bill;
    if (this.mode == 'Edit') {
      this.dlService.updateAdjust(this.index, value.bill, value.appBill, value.difference);
      const toast = this.toastCtrl.create({
        message: 'Edit Successful',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    } else if (this.mode == 'Add') {
        this.dlService.addAdjust(value.bill, value.appBill, value.difference);
        const toast = this.toastCtrl.create({
          message: 'Bill Added Successfully',
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      }

    this.billForm.reset();
    this.viewCtrl.dismiss();
  }

  private initializeForm() {
    let bill = null;
    let appbill = null;
    let difference = null;

    if(this.mode == 'Edit'){
      bill = this.adjust.bill;
      appbill = this.adjust.appBill;
      difference = this.adjust.difference;
    }

    this.billForm = new FormGroup({
      'bill': new FormControl(bill, Validators.required),
      'appBill': new FormControl(appbill, Validators.required),
      'difference': new FormControl(difference)
    });
  }
}
