import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import {format, parse, getMinutes, getHours} from 'date-fns'

import { CataloguePage } from "../catalogue/catalogue";

import { Device } from "../../models/device";
import { Rate } from "../../models/rate";
import { Month } from "../../models/month";
import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage implements OnInit{

  @ViewChild('barChart') barChart;
  @ViewChild('barChartItems') barChartItems;
  @ViewChild('monthlyCostChart') monthlyCostChart;
  @ViewChild('barChartItemsCost') barChartItemsCost;
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

  select = false;

  public hours: any = [];
  public costPerHour: any = [];
  public kwPerHour: any = [];

  public hoursRange = 1;
  public wattsRange = null;
  public daysRange = 1;
  public tariffRange= null;
  public selectedItem = "Custom Input";

  terms = null;

  constructor(
    public navCtrl: NavController,
    private dlService: DeviceListService,
    private settingsService: SettingsService) {}

  ngOnInit() {
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
    }

    ionViewWillEnter() {
      this.settingsService.getSettings();
      this.listRates = this.settingsService.getRates();
      this.listMonths = this.dlService.getMonths();
      this.listDevices = this.dlService.getDevices();

      this.calculate();
      this.updateCharts();
      console.log("Results Page");
    }

  calculate(){
    var thisMonth = format(new Date(), 'MMM')
    //console.log(thisMonth);
    let count : any;
    let totalPower = 0;
    let rateValue: number;
    let total = 0;
    let totalCost = 0;

    if(this.monthlyPower.length > 0) {
      this.monthlyPower = [];
      this.monthlyCost = [];
      //console.log("first: ",this.monthlyPower);
    }
    if(this.listRates.length !== 0){
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
        //console.log('length',this.listMonths.length);
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
      //console.log("last: ",this.monthlyPower);
    }//console.log(this.listMonths);
    }


    updateCharts() {
      this.barChartEl.data.datasets[0].data = this.monthlyPower;
      this.barChartEl.update();

      this.monthlyCostEl.data.datasets[0].data = this.monthlyCost;
      this.monthlyCostEl.update();

      this.barChartItemsEl.data.labels = this.items;
      this.barChartItemsEl.data.datasets[0].data = this.monthlyPowerItem;
      this.barChartItemsEl.data.datasets[1].data = this.yearlyPowerItem;
      this.barChartItemsEl.update();

      this.itemsCostEl.data.labels = this.items;
      this.itemsCostEl.data.datasets[0].data = this.monthlyItemCost;
      this.itemsCostEl.data.datasets[1].data = this.yearlyItemCost;
      this.itemsCostEl.update();

      this.items = [];
      this.dailyPowerItem = [];
      this.monthlyPowerItem = [];
      this.yearlyPowerItem = [];
      this.dailyItemCost = [];
      this.monthlyItemCost = [];
      this.yearlyItemCost = [];
    }

  createBarChart() {
     this.barChartEl = new Chart(this.barChart.nativeElement, {
        type: 'line',
        data: {
           labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
           datasets: [{
              label                 : '',
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
                    display: function(context) {
                      return context.dataset.data[context.dataIndex] >= 0.1;
                    }
              }
           }
         ]
        },
        options : {
          anchor: 'end',
           legend         : {
              display     : true,
              labels: {
                boxWidth    : 0,
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
     this.monthlyCostEl = new Chart(this.monthlyCostChart.nativeElement, {
        type: 'line',
        data: {
           labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
           datasets: [{
              label                 : '',
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
                    display: function(context) {
                      return context.dataset.data[context.dataIndex] >= 0.1;
                    }
                  }
           }
         ]
        },
        options : {
           legend         : {
              display     : true,
              labels: {
                boxWidth    : 0,
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
     this.barChartItemsEl = new Chart(this.barChartItems.nativeElement, {
        type: 'bar',
        data: {
           labels: this.items,
           datasets: [{
               label                 : 'Monthly kWh',
               data                  : this.monthlyPowerItem,
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(255, 99, 132, 0.2)',
               hoverBackgroundColor  : "#FF6384",
               datalabels: {
                     align: 'end',
                     color:'#000',
                     rotation: '-90',
                     display: function(context) {
                       return context.dataset.data[context.dataIndex] >= 0.1;
                     }
                     }
             },{
               label                 : 'Yearly kWh',
               data                  : this.yearlyPowerItem,
               duration              : 2000,
               hidden                : true,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(99, 132, 255, 0.2)',
               hoverBackgroundColor  : "#6384FF",

               datalabels: {
                     align: 'end',
                     color:'#000',
                     rotation: '-90',
                     display: function(context) {
                       return context.dataset.data[context.dataIndex] >= 0.1;
                     }
                     }
             }
         ]
        },
        options : {
          //maintainAspectRatio: false,
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
                   minRotation: 90,
                   maxRotation: 90,
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
               label                 : 'Monthly',
               data                  : this.monthlyItemCost,
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(255, 99, 132, 0.2)',
               hoverBackgroundColor  : "#FF6384",
               datalabels: {
                     color:'#000',
                     align: 'end',
                     rotation: '-90',
                     display: function(context) {
                       return context.dataset.data[context.dataIndex] >= 0.1;
                     }
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
                     align: 'end',
                     rotation: '-90',
                     display: function(context) {
                       return context.dataset.data[context.dataIndex] >= 0.1;
                     }
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

    this.costPerHour.push(((selected) * this.tariffRange).toFixed(1));
    this.kwPerHour.push((selected).toFixed(1));

    this.applianceDetailsEl.data.datasets[0].data = [this.costPerHour, this.kwPerHour];
    this.applianceDetailsEl.data.datasets[1].data = [((this.costPerHour * 12).toFixed(1)), ((this.kwPerHour * 12).toFixed(1))];
    this.applianceDetailsEl.update();
    this.costPerHour = [];
    this.kwPerHour = [];
}

onClearSelected() {
  this.selectedItem = "Custom Input"
  this.hoursRange = 1;
  this.wattsRange = null;
  this.daysRange = 1;
  this.tariffRange = null;
}

   createChartApplianceDetails() {
      this.applianceDetailsEl = new Chart(this.applianceDetails.nativeElement, {
         type: 'bar',
         data: {
            labels: ['Cost', 'kWh'],
            datasets: [
            {
               label                 : 'Month',
               data                  : [this.costPerHour, this.kwPerHour],
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(255, 99, 132, 0.2)',
               hoverBackgroundColor  : "#FF6384",
               datalabels: {
                     color:'#000',
                     align: 'end',
                     display: function(context) {
                       return context.dataset.data[context.dataIndex] >= 0.1;
                     }
                     }
            },
            {
               label                 : 'Year',
               data                  : [((this.costPerHour * 12).toFixed(1)), ((this.kwPerHour * 12).toFixed(1))],
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : 'rgba(99, 132, 255, 0.2)',
               hoverBackgroundColor  : "#6384FF",
               datalabels: {
                     color:'#000',
                     align: 'end',
                     display: function(context) {
                       return context.dataset.data[context.dataIndex] >= 0.1;
                     }
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

   onViewCatalogue() {
     this.navCtrl.push(CataloguePage);
   }
}
