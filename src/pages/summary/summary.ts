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
  //total Overall
  totalPower: number = 0;
  totalHours: number;
  power: number;
  multi: number;

  //Total Per day
  // totalPowerDay: number = 0;
  // totalHoursDay: number;
  // powerDay: number;
  // multiDay: number;


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
      //this.calculateDay();
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

     // calculateDay() {
     //   this.totalPowerDay = 0;
     //   for(var index = 0; index < this.listDevices.length; index++){
     //     this.totalHoursDay = this.listDevices[index].hours;
     //     this.powerDay = this.listDevices[index].power;
     //     this.multiDay = this.totalHours * this.power;
     //     this.totalPowerDay = this.totalPowerDay + this.multiDay;
     //     console.log(this.listDevices.length);
     //     console.log('count ' + index);
     //
     //   }
     //   return this.totalPowerDay;
     // }

}
