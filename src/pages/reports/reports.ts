import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import {format, parse, getMinutes, getHours, getDate, addMonths } from 'date-fns'

import { Device } from "../../models/device";
import { Month } from "../../models/month";
import { Chart } from 'chart.js';
//import * as HighCharts from 'highcharts';

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage implements OnInit{

  @ViewChild('barChart') barChart;

  listDevices: Device[];
  public totalPower: any = [];


  public barChartEl: any;
  //public months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  listMonths: Month[];

  // public months: any = {
  //    										        "months" : [
  //                                                   {
  //                                                      'monthName': 'Jan',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'Feb',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'Mar',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'Apr',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'May',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'Jun',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'Jul',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'Aug',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'Sep',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'Oct',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'Nov',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //                                                   {
  //                                                      'monthName': 'Dec',
  //                                                      'monthlyPower': 0,
  //                                                      'monthlyCost': 0
  //                                                   },
  //
  //    										       ]
  //    										    };
  // public chartMonthName: any = [];
  // public chartMonthlyPower: any = [];
  //lineChart: any;
  // public chartLabels: any = [];
  // public chartValues: any = [];

  public monthName: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public monthlyPower: any = [];
  public monthlyCost: any = [];

  language: string;
  rtl: string;
  arabic = false;
  slide: string;

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
    }

  ionViewWillEnter() {
    this.setLanguage();
    this.settingsService.getSettings();
    this.listDevices = this.dlService.getDevices();
    this.listMonths = this.dlService.getMonths();

    // this.consumptionChartData();
    // this.consumptionChart();
    //this.monthFun();
    this.calculate();
    this.createBarChart();
  }

  calculate(){
    var thisMonth = format(new Date(), 'MMM')
    console.log(thisMonth);
    let count : any;
    let total = 0;
    for(let index = 0; index < this.listDevices.length; index++){
      let totalHours = this.listDevices[index].hours * this.listDevices[index].quantity;
      let power = this.listDevices[index].power;
      let multi = totalHours * power * this.listDevices[index].daysUsed;
      total = total + multi;
    }
    for(count in this.monthName)
      {
        console.log('Count:', count, this.monthName[count]);
         //var data = this.monthName;
         if(this.monthName[count] == thisMonth){
              // data.monthlyPower = 0;
              // data.monthlyPower += total;
              this.dlService.updateMonth(count, this.listMonths[count].monthName, total, this.listMonths[count].monthlyCost);
              this.listMonths = this.dlService.getMonths();
          }
          if(this.listMonths.length <= 0){
         this.dlService.addMonth(this.monthName, 0, 0);
           //this.monthName.push[data.monthName];
           //this.monthlyPower.push[0];
           //this.monthlyCost.push[0];
       } else {
         this.dlService.updateMonth(count, this.listMonths[count].monthName, this.listMonths[count].monthlyPower, this.listMonths[count].monthlyCost);
         //this.monthName.push[this.listMonths[count].monthName];
         this.monthlyPower.push(this.listMonths[count].monthlyPower);
         this.monthlyCost.push(this.listMonths[count].monthlyCost);
       }
          // this.chartMonthName.push(data.monthName);
          // this.chartMonthlyPower.push(data.monthlyPower)
      }
     this.listMonths = this.dlService.getMonths();
      //console.log('monthyl' ,this.monthlyPower);
     //console.log('monthyl' ,this.monthlyCost);
  }

  createBarChart()
{
   this.barChartEl = new Chart(this.barChart.nativeElement,
   {
      type: 'bar',
      data: {
         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
         datasets: [{
            label                 : 'Monthly Watts Usage',
            data                  : this.monthlyPower,
            duration              : 2000,
            easing                : 'easeInQuart',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
     hoverBackgroundColor: "#FF6384",
         }]
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
   this.monthlyCost = [];
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

  // consumptionChartData()
  //    {
  //       for(var index = 0; index < this.listDevices.length; index++)
  //       {
  //         var getPower = this.listDevices[index].quantity * this.listDevices[index].power *
  //                        this.listDevices[index].hours * this.listDevices[index].daysUsed;
  //         var name = this.listDevices[index].name;
  //
  //         // this.chartLabels.push(name);
  //         // this.chartValues.push(getPower);
  //     }
  //    }
  //
  //    onDelete(index: number) {
  //      this.dlService.removeMonth(index);
  //      this.listMonths = this.dlService.getMonths();
  //    }
  //
  // consumptionChart(){
  //   HighCharts.chart('container', {
  //   chart: {
  //       type: 'column'
  //   },
  //   credits: {
  //     enabled: false
  //     },
  //   title: {
  //       text: 'Monthly Average Consumption'
  //   },
  //   xAxis: {
  //       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  //   },
  //   yAxis: {
  //       title: {
  //           text: 'Watts Consumed'
  //       }
  //   },
  //   plotOptions: {
  //     series: {
  //         borderWidth: 0,
  //         dataLabels: {
  //             enabled: true,
  //             format: '{point.y:.1f} W'
  //         }
  //     }
  // },
  //   tooltip: {
  //     headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
  //     pointFormat: 'Total: <b>{point.y:.2f}</b> Watts<br/>'
  // },
  //   series: [{
  //       name: 'Monthly Consumption',
  //       data: this.totalPower,
  //   }]
  // });
  // }
}
