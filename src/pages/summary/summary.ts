import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { Device } from "../../models/device";

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage implements OnInit{
  listDevices: Device[];
  totalPower: number = 0;
  totalHours: number;
  power: number;
  multi: number;
  capacity = 10;
  vat: number;
  consumptionTotal: number;
  totalBill: number;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private dlService: DeviceListService
     ) {}

     ngOnInit() {
       this.dlService.fetchDevices()
          .then(
            (devices: Device[]) => this.listDevices = devices
          );
     }

  ionViewWillEnter() {
    this.listDevices = this.dlService.getDevices();
    //if( this.listDevices.length > 0) {
      this.calculate();
      this.consumptionTotalFunction();
      this.vatFunction();
      this.totalBillFunction();
    //}
  }

     calculate(){
         this.totalPower = 0;
         for(var index = 0; index < this.listDevices.length; index++){
           this.totalHours = this.listDevices[index].hours * this.listDevices[index].quantity;
           this.power = this.listDevices[index].power;
           this.multi = this.totalHours * this.power * this.listDevices[index].daysUsed;
           this.totalPower = this.totalPower + this.multi;
           console.log(this.listDevices.length);
           console.log('count ' + index);

       }
       return this.totalPower;
     }

     consumptionTotalFunction() {
       if(this.totalPower > 0 && this.totalPower <= 6000000){
         this.consumptionTotal = this.totalPower/1000 * 0.18;
       } else if (this.totalPower > 60000000) {
         this.consumptionTotal = this.totalPower/1000 * 0.30;
       }
       return this.consumptionTotal;
     }

     vatFunction() {
       this.vat = (5/100) * (this.capacity + (this.totalPower/1000 * 0.18));
       return this.vat;
     }

     totalBillFunction(){
       return this.totalBill = this.consumptionTotal + this.capacity + this.vat;
     }
}
