import { Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";

import { Device } from "../../models/device";
import { Rate } from "../../models/rate";
import { parse, getMinutes, getHours } from 'date-fns';

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage implements OnInit{

  listDevices: Device[];
  listRates: Rate[];
  totalPower: number = 0;
  totalHours: number;
  flat: number;
  power: number;
  multi: number;
  capacity: number;
  vat: number;
  consumptionTotal = 0;
  totalBill: number;
  check = 0;
  displayPower: number;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private dlService: DeviceListService,
     private settingsService: SettingsService) {}

  ngOnInit() {
    this.dlService.fetchDevices()
      .then(
        (devices: Device[]) => this.listDevices = devices
      );
    this.settingsService.fetchRates()
      .then(
        (rates: Rate[]) => this.listRates = rates
      );
    }

  ionViewWillEnter() {
    this.settingsService.getSettings();
    this.listDevices = this.dlService.getDevices();
    this.listRates = this.settingsService.getRates();

    this.calculate();
    this.consumptionTotalFunction();
    this.capacityFunction();
    this.vatFunction();
    this.totalBillFunction();
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
      //console.log("Power",this.totalPower);
    }
    this.displayPower = +(this.totalPower/1000).toFixed(2);
    return this.totalPower;
  }

  consumptionTotalFunction() {
    let rateValue: number;
    let total = 0;
    this.consumptionTotal = 0;
    let totalPowerPrice = this.totalPower/1000;
      for(let index in this.listRates) {
        //console.log("starting Total Power", this.totalPower);
        if(this.listRates[index].rateRange <= totalPowerPrice) {
          rateValue = this.listRates[index].rateRange * this.listRates[index].rateCost;
          totalPowerPrice -= this.listRates[index].rateRange;
          total += rateValue;
          //console.log("Rate <= Total: ", total);
        } else if(this.listRates[index].rateRange > totalPowerPrice && totalPowerPrice >= 0) {
          rateValue = totalPowerPrice * this.listRates[index].rateCost;

          totalPowerPrice -= this.listRates[index].rateRange;
          total += rateValue;
          //console.log("Rate > Total: ", total);
        }
        //console.log("Total Power:", this.totalPower, "consumption Total:", this.consumptionTotal);
      }
      this.consumptionTotal = total;
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
