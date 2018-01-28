import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { Device } from "../../models/device";

///import { Chart } from 'chart.js';
import * as HighCharts from 'highcharts';

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage implements OnInit{

//  @ViewChild('lineCanvas') lineCanvas;

  listDevices: Device[];
  public totalPower: any = [];

  //lineChart: any;
  public chartLabels: any = [];
  public chartValues: any = [];

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
    }

  ionViewWillEnter() {
    this.setLanguage();
    this.settingsService.getSettings();
    this.listDevices = this.dlService.getDevices();

    this.calculate();

    this.consumptionChartData();
    this.consumptionChart();
  }

  calculate(){
    for(let index = 0; index < this.listDevices.length; index++){
      let totalHours = this.listDevices[index].hours * this.listDevices[index].quantity;
      let power = this.listDevices[index].power;
      let multi = totalHours * power * this.listDevices[index].daysUsed;
      this.totalPower = this.totalPower + multi;
    }
    console.log(this.totalPower);
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

  consumptionChartData()
     {
        for(var index = 0; index < this.listDevices.length; index++)
        {
          var getPower = this.listDevices[index].quantity * this.listDevices[index].power *
                         this.listDevices[index].hours * this.listDevices[index].daysUsed;
          var name = this.listDevices[index].name;

          this.chartLabels.push(name);
          this.chartValues.push(getPower);
      }
     }

  consumptionChart(){
    HighCharts.chart('container', {
    chart: {
        type: 'column'
    },
    credits: {
      enabled: false
      },
    title: {
        text: 'Monthly Average Consumption'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: {
            text: 'Watts Consumed'
        }
    },
    plotOptions: {
      series: {
          borderWidth: 0,
          dataLabels: {
              enabled: true,
              format: '{point.y:.1f} W'
          }
      }
  },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: 'Total: <b>{point.y:.2f}</b> Watts<br/>'
  },
    series: [{
        name: 'Monthly Consumption',
        data: this.chartValues,
    }]
  });
  }

  // consumptionChart(){
  //   HighCharts.chart('container', {
  //   chart: {
  //       type: 'line'
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
  //       line: {
  //           dataLabels: {
  //               enabled: true
  //           },
  //           enableMouseTracking: false,
  //       }
  //   },
  //   series: [{
  //       name: 'Monthly Consumption',
  //       data: this.chartValues,
  //   }, {
  //       name: 'Bill Correction',
  //       data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
  //   }]
  // });
  // }
}
