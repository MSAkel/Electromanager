import { Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { AddBillPage } from "./add-bill/add-bill";

import { Device } from "../../models/device";
import { Adjust } from "../../models/adjust";

import {parse, getMinutes, getHours, getDate } from 'date-fns';

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage implements OnInit{

  listDevices: Device[];
  totalPower: number = 0;
  totalHours: number;
  flat: number;
  power: number;
  multi: number;
  capacity: number;
  vat: number;
  consumptionTotal: number;
  totalBill: number;
  check = 0;

  listAdjust: Adjust[];
  adjusting:number;

  language: string;
  rtl: string;
  arabic = false;
  slide: string;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private modalCtrl: ModalController,
     public toastCtrl: ToastController,
     private dlService: DeviceListService,
     private settingsService: SettingsService,
     private translateService: TranslateService
     ) {}

  ngOnInit() {
    this.settingsService.getLanguage();
    this.dlService.fetchAdjust()
      .then(
        (adjust: Adjust[]) => this.listAdjust = adjust
      );
    this.dlService.fetchDevices()
      .then(
        (devices: Device[]) => this.listDevices = devices
      );
    }

  ionViewWillEnter() {
    this.setLanguage();
    this.settingsService.getSettings();
    this.listDevices = this.dlService.getDevices();
    this.listAdjust = this.dlService.getAdjust();

    this.calculate();
    this.consumptionTotalFunction();
    this.capacityFunction();
    this.vatFunction();
    this.totalBillFunction();

    this.adjust();
  }

     setLanguage() {
       this.language = this.translateService.currentLang;
       if(this.language == 'ar')
       {
         this.rtl = 'rtl';
         this.slide = 'left';
         this.arabic = true;
       }
     }

  onAddBill() {
    const modal = this.modalCtrl.create(AddBillPage, { mode: 'Add'});
    modal.present();
    modal.onDidDismiss(() => {
      this.listAdjust = this.dlService.getAdjust();
    });
  }

  onEdit(bill: Adjust, index: number) {
    const modal = this.modalCtrl.create(AddBillPage, {mode: 'Edit', bill: bill, index: index});
    modal.present();
    modal.onDidDismiss(() => {
      this.listAdjust = this.dlService.getAdjust();
    });
  }

  onDeleteAdjust(index: number) {
    this.dlService.removeAdjust(index);
    this.listAdjust = this.dlService.getAdjust();

    const toast = this.toastCtrl.create({
      message: 'Category Deleted',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  adjust() {
    var avgDifference:number = 0;
    var avgAppBill:number = 0;
    var avgPercentage:number;
    //var adjusting:number;

    for (var index = 0; index < this.listAdjust.length; index++) {
      avgDifference +=  this.listAdjust[index].difference * 1;
      console.log("Avg. difference: " + avgDifference);
      avgAppBill += this.listAdjust[index].appBill * 1;
      console.log("Avg. App Bill: " + avgAppBill);
    }
    avgPercentage = (avgDifference/avgAppBill) * 100;
    console.log("avg%: " + avgPercentage);
    console.log("Total Bill: " + this.totalBill);
    this.adjusting = (avgPercentage/100) * this.totalBill;
    console.log("adjusting: " + this.adjusting);
    this.adjusting = this.totalBill - this.adjusting;
    return this.adjusting;
  }

  calculate(){
    this.totalPower = 0;
    for(let index in this.listDevices) {
      let getTime = parse('0000-00-00T' + this.listDevices[index].hours + '00');
      let mins = getMinutes(new Date(getTime));
      let hours = getHours(new Date(getTime));
      mins = +(mins/60).toFixed(2);
      let time = mins + hours;

      this.totalHours = time * this.listDevices[index].quantity;
      this.power = this.listDevices[index].power;
      this.multi = (this.totalHours * this.listDevices[index].daysUsed * this.power) * this.listDevices[index].compressor;

      this.totalPower = this.totalPower + this.multi;
      console.log("Power",this.totalPower);
    }
    return this.totalPower;
  }

  consumptionTotalFunction() {
       if(this.totalPower > 0 && this.totalPower <= 6000000){
         this.consumptionTotal = this.totalPower/1000 * this.settingsService.getCost;
       } else if (this.totalPower > 60000000) {
         this.consumptionTotal = this.totalPower/1000 * 0.30;
       }
       console.log('Summary consumption total:',this.consumptionTotal);
       return this.consumptionTotal;
     }

  capacityFunction() {
      // console.log("flat rate: ", this.settingsService.getFlatRate)
       this.capacity = this.settingsService.getFlatRate * 1;
       return this.capacity;
     }

  vatFunction() {
       this.vat = (this.settingsService.getTax/100) * (this.capacity + this.consumptionTotal);
       return this.vat;
     }

  totalBillFunction(){
        this.totalBill = this.consumptionTotal + this.vat + this.capacity;
        return this.totalBill;
     }
}
