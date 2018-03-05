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
import 'chartjs-plugin-datalabels';

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
  //@ViewChild('pieChartCategories') pieChartCategories;
  @ViewChild('applianceDetails') applianceDetails;

  listDevices: Device[];
  device: Device;
  index: number;
  listRates: Rate[];
  public totalPower: any = [];

  public barChartEl: any;
  public barChartItemsEl: any;
  public monthlyCostEl: any;
  public itemsCostEl: any;
  //public CategoriesEl: any;
  public applianceDetailsEl: any;

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

  public hours: any = [];
  public costPerHour: any = [];
  public kwPerHour: any = [];

  public hoursRange = 0;
  public wattsRange = 0;
  public daysRange = 0;
  public tariffRange= 0;
  public selectedItem = "Custom Input";

  terms = null;

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
    this.listRates = this.settingsService.getRates();
    this.listDevices = this.dlService.getDevices();
    this.listMonths = this.dlService.getMonths();

    this.calculate();
    this.createBarChart();
    this.createBarChartItems();
    this.createChartMonthlyCost();
    this.createBarChartItemsCost();
    this.createChartApplianceDetails();

    //this.createPieChartCategories();
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
      let yearly = +((deviceTotalPower/1000) * 12).toFixed(2);

      let dailyCost = +((daily/1000) * this.listRates[0].rateCost).toFixed(2);
      let monthlyCost = +(dailyCost * this.listDevices[index].daysUsed).toFixed(2);
      let yearlyCost = +(dailyCost * (this.listDevices[index].daysUsed * 12)).toFixed(2);
      //console.log('Multi: ',multi);
      //console.log('Device: ',this.listDevices[index].name);
      totalPower = totalPower + deviceTotalPower;

      //console.log('total ',total);
      this.dailyPowerItem.push((daily/1000).toFixed(1));
      this.monthlyPowerItem.push((deviceTotalPower/1000).toFixed(1));
      this.yearlyPowerItem.push(yearly.toFixed(1));

      this.dailyItemCost.push(dailyCost.toFixed(1));
      this.monthlyItemCost.push(monthlyCost.toFixed(1));
      this.yearlyItemCost.push(yearlyCost.toFixed(1));
      //this.monthlyCost.push(totalCost);
      this.items.push(this.listDevices[index].name.slice(0,8));
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
        this.dlService.addMonth(this.monthName[count], 0, 0);
        console.log('length',this.listMonths.length);
        this.listMonths = this.dlService.getMonths();
      }
          if(this.monthName[count] == thisMonth) {
              this.dlService.updateMonth(count, this.listMonths[count].monthName, totalPower, totalCost);
              this.listMonths = this.dlService.getMonths();
              this.monthlyPower.push((this.listMonths[count].monthlyPower/1000).toFixed(1));
              this.monthlyCost.push(this.listMonths[count].monthlyCost.toFixed(1));
              //console.log('cost' ,this.listMonths[count].monthlyCost);

            } else {
                this.dlService.updateMonth(count, this.listMonths[count].monthName, this.listMonths[count].monthlyPower, this.listMonths[count].monthlyCost);
                this.listMonths = this.dlService.getMonths();
                //this.monthName.push[this.listMonths[count].monthName];
                this.monthlyPower.push((this.listMonths[count].monthlyPower/1000).toFixed(1));
                this.monthlyCost.push(this.listMonths[count].monthlyCost.toFixed(1));
              }
        //console.log(this.monthName[count], ": ", this.listMonths[count].monthlyPower);
      }
       this.listMonths = this.dlService.getMonths();
       //console.log(this.listMonths);

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
    if(this.barChartEl != null) {
    this.barChartEl.destroy();}
     this.barChartEl = new Chart(this.barChart.nativeElement, {
        type: 'line',
        data: {
           labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
           datasets: [{
              label                 : 'KWh',
              data                  : this.monthlyPower,
              duration              : 2000,
              easing                : 'easeInQuart',
              backgroundColor       : 'rgba(255, 99, 132, 0.2)',
              hoverBackgroundColor  : "#FF6384",
              fill 				          : false,
              lineTension           : 0,
              radius: 5,
              datalabels: {
                    align: 'end',
                    color:'#000',
                    }
           }
         ]
        },
        options : {
          anchor: 'end',
           legend         : {
              display     : true,
              labels: {
                boxWidth    : 30,
                fontSize    : 14,
              }
           },
           scales: {
              yAxes: [{
                 ticks: {
                    beginAtZero:true,
                 }
              }],
              xAxes: [{
                 ticks: {
                   autoskip: false,
                   minRotation: 0,
                   maxRotation: 0,

                 }
              }]
           }
        }
     });
      this.monthlyPower = [];
  }

  createChartMonthlyCost() {
    if(this.monthlyCostEl != null) {
    this.monthlyCostEl.destroy();}
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
              fill 				          : false,
              lineTension           : 0,
              radius: 5,
              datalabels: {
                    align: 'end',
                    color:'#000',
                    }
           }
         ]
        },
        options : {
           legend         : {
              display     : true,
              labels: {
                boxWidth    : 30,
                fontSize    : 14,
              }
           },
           scales: {
              yAxes: [{
                 ticks: {
                    beginAtZero:true,
                 }
              }],
              xAxes: [{
                 ticks: {
                   autoskip: false,
                   minRotation: 0,
                   maxRotation: 0
                 }
              }]
           }
        }
     });
      this.monthlyCost = [];
  }

  createBarChartItems() {
    if(this.barChartItemsEl != null) {
    this.barChartItemsEl.destroy();}
     this.barChartItemsEl = new Chart(this.barChartItems.nativeElement, {
        type: 'bar',
        data: {
           labels: this.items,
           datasets: [{
               label                 : 'Monthly KWh',
               data                  : this.monthlyPowerItem,
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(255, 99, 132, 0.2)',
               hoverBackgroundColor  : "#FF6384",
               datalabels: {
                     align: 'end',
                     color:'#000',
                     }
             },{
               label                 : 'Yearly KWh',
               data                  : this.yearlyPowerItem,
               duration              : 2000,
               hidden                : true,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(99, 132, 255, 0.2)',
               hoverBackgroundColor  : "#6384FF",
               datalabels: {
                     color:'#000',
                     }
             }
         ]
        },
        options : {
           legend         : {
              display     : true,
              labels: {
                boxWidth    : 30,
                fontSize    : 14,
              }
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
                   minRotation: 90,
                   maxRotation: 90
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
    if(this.itemsCostEl != null) {
    this.itemsCostEl.destroy();}
     this.itemsCostEl = new Chart(this.barChartItemsCost.nativeElement, {
        type: 'bar',
        data: {
           labels: this.items,
           datasets: [{
               label                 : 'Monthly',
               data                  : this.monthlyItemCost,
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(255, 99, 132, 0.2)',
               hoverBackgroundColor  : "#FF6384",
               datalabels: {
                     color:'#000',
                     }
             },{
               label                 : 'Yearly',
               data                  : this.yearlyItemCost,
               duration              : 2000,
               hidden                : true,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(99, 132, 255, 0.2)',
               hoverBackgroundColor  : "#6384FF",
               datalabels: {
                     color:'#000',
                     }
             }
         ]
        },
        options : {
           legend         : {
              display     : true,
              labels: {
                boxWidth    : 30,
                fontSize    : 14,
              }
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
                   minRotation: 90,
                   maxRotation: 90
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

  // createPieChartCategories() {
  //   this.CategoriesEl 			= new Chart(this.pieChartCategories.nativeElement,
  //    {
  //       type: 'pie',
  //       data: {
  //           labels: ,
  //           datasets: [{
  //               label                 : 'Daily Technology usage',
  //               data                  : ,
  //               duration              : 2000,
  //               easing                : 'easeInQuart',
  //               backgroundColor       : ,
  //               hoverBackgroundColor  :
  //           }]
  //       },
  //       options : {
  //          maintainAspectRatio: false,
  //          layout: {
  //             padding: {
  //                left     : 50,
  //                right    : 0,
  //                top      : 0,
  //                bottom   : 0
  //             }
  //          },
  //          animation: {
  //             duration : 5000
  //          }
  //       }
  //    });
  //    this.chartLoading = this.pieChartEl.generateLegend();
  // }


selectedAppliance(appliance: Device, index: number) {
  let selected: number;
  if(appliance != null){
  let getTime = parse('0000-00-00T' + appliance.hours + '00');
  let mins = getMinutes(new Date(getTime));
  let hours = getHours(new Date(getTime));
  mins = +(mins/60).toFixed(0);
  var time = mins + hours;

  this.selectedItem = appliance.name;
  this.hoursRange = time;
  this.wattsRange = appliance.power;
  this.daysRange = appliance.daysUsed;
  this.tariffRange = this.listRates[0].rateCost;
}

   this.terms = null;
   selected = ((this.wattsRange * this.hoursRange * this.daysRange)/1000);

   //console.log(this.hoursRange);
    // console.log(selected);
     // for(let i = 1; i <= 24; i++) {
     //   this.hours.push(i);
     //   this.costPerHour.push(i * (appliance.power/1000) * this.listRates[0].rateCost);
     //   this.kwPerHour.push(i *(appliance.power/1000));
     // }

    this.costPerHour.push(((selected) * this.tariffRange).toFixed(1));
    this.kwPerHour.push((selected).toFixed(1));
  this.createChartApplianceDetails();
}

onClearSelected() {
  this.selectedItem = "Custom Input"
  this.hoursRange = 0;
  this.wattsRange = 0;
  this.daysRange = 0;
  this.tariffRange = 0;

}

   createChartApplianceDetails() {
     if(this.applianceDetailsEl != null) {
     this.applianceDetailsEl.destroy();}
      this.applianceDetailsEl = new Chart(this.applianceDetails.nativeElement, {
         type: 'bar',
         data: {
            labels: ['Cost', 'KWh'],
            datasets: [
            //   {
            //    label                 : 'Hour',
            //    data                  : [this.costPerHour / (30.4 * 24), this.kwPerHour / (30.4 * 24)],
            //    duration              : 2000,
            //    easing                : 'easeInQuart',
            //    backgroundColor       : 'rgba(255, 99, 132, 0.2)',
            //    hoverBackgroundColor  : "#FF6384",
            //    fill 				          : false
            // },
            // {
            //    label                 : 'Day',
            //    data                  : [this.costPerHour / 30.4, this.kwPerHour / 30.4],
            //    duration              : 2000,
            //    easing                : 'easeInQuart',
            //    hidden                : true,
            //    backgroundColor       : 'rgba(132, 255, 99, 0.2)',
            //    hoverBackgroundColor  : "#84FF63",
            //    fill 				          : false
            // },
            {
               label                 : 'Month',
               data                  : [this.costPerHour, this.kwPerHour],
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(255, 99, 132, 0.2)',
               hoverBackgroundColor  : "#FF6384",
               datalabels: {
                     color:'#000',
                     }
            },
            {
               label                 : 'Year',
               data                  : [((this.costPerHour * 12).toFixed(1)), ((this.kwPerHour * 12).toFixed(1))],
               duration              : 2000,
               hidden                : true,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(99, 132, 255, 0.2)',
               hoverBackgroundColor  : "#6384FF",
               datalabels: {
                     color:'#000',
                     }
            },
          ]
         },
         options : {
            legend         : {
               display     : true,
               labels: {
                 boxWidth    : 30,
                 fontSize    : 14,
               }
            },
            scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero:true,
                  }
               }],
               xAxes: [{
                  ticks: {
                     autoSkip: true,
                  }
               }]
            }
         }
      });

      this.costPerHour = [];
      this.kwPerHour = [];
   }
}
