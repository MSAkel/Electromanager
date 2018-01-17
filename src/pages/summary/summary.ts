import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { Device } from "../../models/device";
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage implements OnInit{
   @ViewChild('doughnutCanvas') doughnutCanvas;

   doughnutChart: any;

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
     private dlService: DeviceListService,
     ) {}

     ngOnInit() {
       this.dlService.fetchDevices()
          .then(
            (devices: Device[]) => this.listDevices = devices
          );
     }

     ionViewDidLoad() {
       this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

            type: 'doughnut',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
            }

        });
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
