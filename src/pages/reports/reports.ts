import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import {format, parse, getMinutes, getHours} from 'date-fns'

import { Device } from "../../models/device";
import { Rate } from "../../models/rate";
import { Month } from "../../models/month";
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage implements OnInit{

  @ViewChild('barChart') barChart;
  @ViewChild('barChartItems') barChartItems;
  @ViewChild('monthlyCostChart') monthlyCostChart;
  @ViewChild('barChartItemsCost') barChartItemsCost;

  listDevices: Device[];
  listRates: Rate[];
  public totalPower: any = [];

  public barChartEl: any;
  public barChartItemsEl: any;
  public monthlyCostEl: any;
  public itemsCostEl: any;

  listMonths: Month[];

  public monthName: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public monthlyPower: any = [];
  public monthlyCost: any = [];

  public dailyPowerItem: any = [];
  public monthlyPowerItem: any = [];
  public yearlyPowerItem: any = [];

  public dailyItemCost: any = [];
  public monthlyItemCost: any = [];
  public yearlyItemCost: any = [];

  public items: any = [];

  language: string;
  rtl: string;
  arabic = false;
  slide: string;
  select = false;

  constructor(
    public navCtrl: NavController,
    private dlService: DeviceListService,
    private settingsService: SettingsService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.settingsService.getLanguage();
    this.dlService.fetchDevices()
      .then(
        (devices: Device[]) => this.listDevices = devices
      );
    this.dlService.fetchMonths()
      .then(
        (months: Month[]) => this.listMonths = months
      );
      this.settingsService.fetchRates()
        .then(
          (rates: Rate[]) => this.listRates = rates
        );
    }

  ionViewWillEnter() {
    this.setLanguage();
    this.settingsService.getSettings();
    this.listDevices = this.dlService.getDevices();
    this.listRates = this.settingsService.getRates();
    this.listMonths = this.dlService.getMonths();

    this.calculate();
    this.createBarChart();
    this.createBarChartItems();
    this.createChartMonthlyCost();
    this.createBarChartItemsCost();
  }

  calculate(){
    var thisMonth = format(new Date(), 'MMM')
    //console.log(thisMonth);
    let count : any;
    let totalPower = 0;
    let rateValue: number;
    let total = 0;
    let totalCost = 0;

    for(let index in this.listDevices) {
      let getTime = parse('0000-00-00T' + this.listDevices[index].hours + '00');
      let mins = getMinutes(new Date(getTime));
      let hours = getHours(new Date(getTime));
      mins = +(mins/60).toFixed(2);
      let time = mins + hours;

      let totalHours = time * this.listDevices[index].quantity;
      let power = this.listDevices[index].power;
      let deviceTotalPower = +((totalHours * this.listDevices[index].daysUsed * power ) * this.listDevices[index].compressor).toFixed(2);
      let daily = +((totalHours * power) * this.listDevices[index].compressor).toFixed(2); //CONSUMPTION
      let yearly = (deviceTotalPower * 12).toFixed(2);

      let dailyCost = +((daily/1000) * this.listRates[0].rateCost).toFixed(2);
      let monthlyCost = +(dailyCost * 30).toFixed(2);
      let yearlyCost = +(dailyCost * 365).toFixed(2);
      //console.log('Multi: ',multi);
      //console.log('Device: ',this.listDevices[index].name);
      totalPower = totalPower + deviceTotalPower;

      //console.log('total ',total);
      this.dailyPowerItem.push(daily);
      this.monthlyPowerItem.push(deviceTotalPower);
      this.yearlyPowerItem.push(yearly);

      this.dailyItemCost.push(dailyCost);
      this.monthlyItemCost.push(monthlyCost);
      this.yearlyItemCost.push(yearlyCost);
      //this.monthlyCost.push(totalCost);
      this.items.push(this.listDevices[index].name.slice(0,7));
    }
    //totalCost = +((totalPower/1000) * this.settingsService.getCost).toFixed(2);
    //console.log('cost',totalCost);
    let tempTotalPower = totalPower/1000;
    for(let index in this.listRates) {
      if(this.listRates[index].rateRange <= tempTotalPower) {
        rateValue = this.listRates[index].rateRange * this.listRates[index].rateCost;
        tempTotalPower -= this.listRates[index].rateRange;
        total += rateValue;
      } else if(this.listRates[index].rateRange > tempTotalPower && tempTotalPower >= 0) {
        rateValue = tempTotalPower * this.listRates[index].rateCost;

        tempTotalPower -= this.listRates[index].rateRange;
        total += rateValue;
      }
    }
    totalCost = +total.toFixed(2);

    for(count in this.monthName) {
      while(this.listMonths.length < 12) {
        this.dlService.addMonth(this.monthName, 0, 0);
        //console.log('length',this.listMonths.length);
        this.listMonths = this.dlService.getMonths();
      }
          if(this.monthName[count] == thisMonth) {
              this.dlService.updateMonth(count, this.listMonths[count].monthName, totalPower, totalCost);
              this.listMonths = this.dlService.getMonths();
              this.monthlyPower.push(this.listMonths[count].monthlyPower);
              this.monthlyCost.push(this.listMonths[count].monthlyCost);
              console.log('cost' ,this.listMonths[count].monthlyCost);
            } else {
                this.dlService.updateMonth(count, this.listMonths[count].monthName, this.listMonths[count].monthlyPower, this.listMonths[count].monthlyCost);
                //this.monthName.push[this.listMonths[count].monthName];
                this.monthlyPower.push(this.listMonths[count].monthlyPower);
                this.monthlyCost.push(this.listMonths[count].monthlyCost);
              }
      }
       this.listMonths = this.dlService.getMonths();
       //console.log(this.monthlyPower);
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

  createBarChart() {
     this.barChartEl = new Chart(this.barChart.nativeElement, {
        type: 'line',
        data: {
           labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
           datasets: [{
              label                 : 'Monthly Watts Usage',
              data                  : this.monthlyPower,
              duration              : 2000,
              easing                : 'easeInQuart',
              backgroundColor       : 'rgba(255, 99, 132, 0.2)',
              hoverBackgroundColor  : "#FF6384",
              fill 				          : false
           }
         ]
        },
        options : {
           legend         : {
              display     : true,
              boxWidth    : 80,
              fontSize    : 15,
              padding     : 0
           },
           scales: {
              yAxes: [{
                 ticks: {
                    beginAtZero:true,
                 }
              }],
              xAxes: [{
                 ticks: {
                    autoSkip: false
                 }
              }]
           }
        }
     });
      this.monthlyPower = [];
  }

  createChartMonthlyCost() {
     this.monthlyCostEl = new Chart(this.monthlyCostChart.nativeElement, {
        type: 'line',
        data: {
           labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
           datasets: [{
              label                 : 'Monthly Expenses',
              data                  : this.monthlyCost,
              duration              : 2000,
              easing                : 'easeInQuart',
              backgroundColor       : 'rgba(99, 132, 255, 0.2)',
              hoverBackgroundColor  : "#6384FF",
              fill 				          : false
           }
         ]
        },
        options : {
           legend         : {
              display     : true,
              boxWidth    : 80,
              fontSize    : 15,
              padding     : 0
           },
           scales: {
              yAxes: [{
                 ticks: {
                    beginAtZero:true,
                 }
              }],
              xAxes: [{
                 ticks: {
                    autoSkip: false
                 }
              }]
           }
        }
     });
      this.monthlyCost = [];
  }

  createBarChartItems() {
     this.barChartItemsEl = new Chart(this.barChartItems.nativeElement, {
        type: 'bar',
        data: {
           labels: this.items,
           datasets: [{
              label                 : 'Daily',
              data                  : this.dailyPowerItem,
              duration              : 2000,
              easing                : 'easeInQuart',
              backgroundColor       : 'rgba(255, 99, 132, 0.2)',
              hoverBackgroundColor  : "#FF6384"
             },{
               label                 : 'Monthly',
               data                  : this.monthlyPowerItem,
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(132, 255, 99, 0.2)',
               hoverBackgroundColor  : "#84FF63"
             },{
               label                 : 'Yearly',
               data                  : this.yearlyPowerItem,
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(99, 132, 255, 0.2)',
               hoverBackgroundColor  : "#6384FF"
             }
         ]
        },
        options : {
           legend         : {
              display     : true,
              boxWidth    : 50,
              fontSize    : 12,
              padding     : 0
           },
           scales: {
              yAxes: [{
                 ticks: {
                    beginAtZero:true
                 }
              }],
              xAxes: [{
                 ticks: {
                   autoskip: false,
                 }
              }]
           }
        }
     });

     this.dailyPowerItem = [];
     this.monthlyPowerItem = [];
     this.yearlyPowerItem = [];
  }

  createBarChartItemsCost() {
     this.itemsCostEl = new Chart(this.barChartItemsCost.nativeElement, {
        type: 'bar',
        data: {
           labels: this.items,
           datasets: [{
              label                 : 'Daily',
              data                  : this.dailyItemCost,
              duration              : 2000,
              easing                : 'easeInQuart',
              backgroundColor       : 'rgba(255, 99, 132, 0.2)',
              hoverBackgroundColor  : "#FF6384"
             },{
               label                 : 'Monthly',
               data                  : this.monthlyItemCost,
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(132, 255, 99, 0.2)',
               hoverBackgroundColor  : "#84FF63"
             },{
               label                 : 'Yearly',
               data                  : this.yearlyItemCost,
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(99, 132, 255, 0.2)',
               hoverBackgroundColor  : "#6384FF"
             }
         ]
        },
        options : {
           legend         : {
              display     : true,
              boxWidth    : 50,
              fontSize    : 12,
              padding     : 0
           },
           scales: {
              yAxes: [{
                 ticks: {
                    beginAtZero:true
                 }
              }],
              xAxes: [{
                 ticks: {
                    autoSkip: false
                 }
              }]
           }
        }
     });

     this.dailyItemCost = [];
     this.monthlyItemCost = [];
     this.yearlyItemCost = [];
     this.items = [];
   }
}
