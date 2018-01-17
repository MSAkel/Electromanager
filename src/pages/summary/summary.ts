import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { Device } from "../../models/device";
import { Chart } from 'chart.js';
import * as HighCharts from 'highcharts';

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage implements OnInit{

  @ViewChild('doughnutCanvas') doughnutCanvas;

  listDevices: Device[];
  totalPower: number = 0;
  totalHours: number;
  power: number;
  multi: number;
  capacity = 10;
  vat: number;
  consumptionTotal: number;
  totalBill: number;
  check = 0;

  doughnutChart: any;
  public chartLabels: any = [];
  public chartValues: any = [];
  public chartColours: any = [];


  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private dlService: DeviceListService,
     ) {}


  ngOnInit() {
    this.dlService.fetchDevices()
      .then(
        (devices: Device[]) => this.listDevices = devices
      );
    }

  ionViewWillEnter() {
    this.listDevices = this.dlService.getDevices();
    this.calculate();
    this.consumptionTotalFunction();
    this.vatFunction();
    this.totalBillFunction();

    this.defineChartData();
    this.createPieChart();
  }

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
    if(this.doughnutChart != null) {
      this.doughnutChart.destroy();
    }
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

    type: 'doughnut',
    data: {
      labels: this.chartLabels,
      datasets: [{
      label: 'Power consumed',
      data: this.chartValues,
      backgroundColor:  this.chartColours,
      hoverBackgroundColor: this.chartColours
      }]
    },
    options: {
        legend: {
        display: false
      },
      title: {
            display: true,
            text: 'Power Consumption In Watts',
            fontSize: 14
        }
     }
    });

    this.chartLabels = [];
    this.chartValues = [];

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
