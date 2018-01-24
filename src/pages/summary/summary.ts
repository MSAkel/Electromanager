import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { AddBillPage } from "./add-bill/add-bill";

import { Device } from "../../models/device";
import { Adjust } from "../../models/adjust";
import { Chart } from 'chart.js';
//import * as HighCharts from 'highcharts';

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage implements OnInit{

  @ViewChild('pieCanvas') pieCanvas;

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

  pieChart: any;
  public chartLabels: any = [];
  public chartValues: any = [];
  public chartColours: any = [];

  category: string;

  language: string;
  rtl: string;
  arabic = false;
  slide: string;

  descending: boolean = false;
  order: number;
  column: string;

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
    this.category = "close";
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

    this.defineChartData();
    this.createPieChart();
    console.log(this.listAdjust);
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
    // this.navCtrl.push(AddBillPage, { mode: 'Add'});
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

  onDelete(index: number) {
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

    for ( var index = 0; index < this.listAdjust.length; index++) {
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


  //CHART FUNCTIONS
  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  defineChartData()
     {
        for(var index = 0; index < this.listDevices.length; index++)
        {
          var letters = '0123456789ABCDEF'.split('');
          var color = '#';
          for (var i = 0; i < 6; i++ ) {
              color += letters[Math.floor(Math.random() * 16)];
          }
          var getPower = this.listDevices[index].quantity * this.listDevices[index].power *
                         this.listDevices[index].hours * this.listDevices[index].daysUsed;
          var name = this.listDevices[index].name;
          //var y = this.listDevices[index].power;

          this.chartLabels.push(name);
          this.chartValues.push(getPower);
          this.chartColours.push(color);
      }
     }

  createPieChart(){
    if(this.pieChart != null) {
      this.pieChart.destroy();
    }
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {

    type: 'pie',
    data: {
      labels: this.chartLabels,
      datasets: [{
        label: "Power consumed",
        data: this.chartValues,
        backgroundColor:  this.chartColours,
        hoverBackgroundColor: this.chartColours
      }]
    },
    options: {
        legend: {
        display: false
      },
      // title: {
      //       display: true,
      //       text: 'Power Consumption In Watts',
      //       fontSize: 14
      //   }
     }
    });

    this.chartLabels = [];
    this.chartValues = [];

  }
  //END OF CHART FUNCTIONS

  calculate(){
    this.totalPower = 0;
    for(var index = 0; index < this.listDevices.length; index++){
      this.totalHours = this.listDevices[index].hours * this.listDevices[index].quantity;
      this.power = this.listDevices[index].power;
      this.multi = this.totalHours * this.power * this.listDevices[index].daysUsed;
      this.totalPower = this.totalPower + this.multi;
      //console.log(this.listDevices.length);
      //console.log('count ' + index);
    }
    return this.totalPower;
  }

     consumptionTotalFunction() {
       if(this.totalPower > 0 && this.totalPower <= 6000000){
         this.consumptionTotal = this.totalPower/1000 * this.settingsService.getCost;
       } else if (this.totalPower > 60000000) {
         this.consumptionTotal = this.totalPower/1000 * 0.30;
       }
       return this.consumptionTotal;
     }

     capacityFunction() {
       this.capacity = this.settingsService.getFlatRate * 1;
       return this.capacity;
     }

     vatFunction() {
       //console.log('Flat Rate: ' + this.settingsService.getFlatRate + "Tax");
       console.log('Tax: ' + this.settingsService.getTax);
       console.log('Cost: ' + this.settingsService.getCost);
       console.log('Flat: ' + this.settingsService.getFlatRate);
       console.log((this.settingsService.getTax/100) * (this.capacity + this.consumptionTotal));
       this.vat = (this.settingsService.getTax/100) * (this.capacity + this.consumptionTotal);
       return this.vat;
     }

     totalBillFunction(){
        //this.flat = this.settingsService.getFlatRate;
        this.totalBill = this.consumptionTotal + this.vat + this.capacity;
        //this.totalBill += this.capacity
        //console.log('Consumption: ' + this.consumptionTotal);
        //console.log('Flat Rate: ' + this.capacity + " TOTAL");
        //console.log('Tax: ' + this.vat);
        //console.log(this.totalBill);
        return this.totalBill;
     }

     sortBy(sort){
       this.column = sort;
       console.log();
       this.descending = !this.descending;
       this.order = this.descending ? 1 : -1;
     }
}
