import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

import { DeviceListService } from "../../services/devices-list";
import { SettingsService } from "../../services/settings";
import { TranslateService } from '@ngx-translate/core';

import { AddBillPage } from "./add-bill/add-bill";
import { DisplayGroupPage } from "./display-group/display-group";

import { Device } from "../../models/device";
import { Adjust } from "../../models/adjust";
import { Group } from "../../models/group";
import { GroupList } from "../../models/group-list";
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

  listGroup: Group[];
  listGroupDevices: GroupList[];

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
    this.dlService.fetchGroup()
        .then(
          (group: Group[]) => this.listGroup = group
        );
    this.dlService.fetchDevices()
      .then(
        (devices: Device[]) => this.listDevices = devices
      );
      this.dlService.fetchGroupList()
        .then(
          (GroupListDevices: GroupList[]) => this.listGroupDevices = GroupListDevices
        );

    }

  ionViewWillEnter() {
    this.category = "close";
    this.setLanguage();
    this.settingsService.getSettings();
    this.listDevices = this.dlService.getDevices();
    this.listAdjust = this.dlService.getAdjust();
    this.listGroup = this.dlService.getGroup();
    this.listGroupDevices = this.dlService.getGroupList();

    this.calculate();
    this.consumptionTotalFunction();
    this.capacityFunction();
    this.vatFunction();
    this.totalBillFunction();

    this.adjust();

    this.defineChartData();
    this.createPieChart();
    //console.log(this.listAdjust);
    console.log(this.listGroup);
    this.groupDetails();
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

  onDeleteAdjust(index: number) {
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
      //console.log("Avg. difference: " + avgDifference);
      avgAppBill += this.listAdjust[index].appBill * 1;
    //  console.log("Avg. App Bill: " + avgAppBill);
    }
    avgPercentage = (avgDifference/avgAppBill) * 100;
    //console.log("avg%: " + avgPercentage);
    //console.log("Total Bill: " + this.totalBill);
    this.adjusting = (avgPercentage/100) * this.totalBill;
    //console.log("adjusting: " + this.adjusting);
    this.adjusting = this.totalBill - this.adjusting;
    return this.adjusting;
  }


  groupDetails() {
    let groupHours: number;
    let groupPower: number;
    let groupMulti: number;
    let groupVat: number;
    let groupConsumptionTotal: number;
    let groupTotalPower = 0;
    let groupTotalCost = 0;
    for(let groupIndex = 0; groupIndex < this.listGroup.length; groupIndex++){
      for(let deviceIndex = 0; deviceIndex < this.listGroupDevices.length; deviceIndex++) {
        if(this.listGroupDevices[deviceIndex].group === this.listGroup[groupIndex].name) {
          groupHours = this.listGroupDevices[deviceIndex].hours * this.listGroupDevices[deviceIndex].quantity;
          groupPower = this.listGroupDevices[deviceIndex].power;
          groupMulti = groupHours * groupPower * this.listGroupDevices[deviceIndex].daysUsed;
          groupTotalPower = groupTotalPower + groupMulti;
          console.log("Group Power 4th: ", groupTotalPower);
        }
        if(groupTotalPower > 0 && groupTotalPower <= 6000000){
          groupConsumptionTotal = groupTotalPower/1000 * this.settingsService.getCost;
        } else if (groupTotalPower > 60000000) {
          groupConsumptionTotal = groupTotalPower/1000 * 0.30;
        }
        console.log("Consumption: ", groupConsumptionTotal);
        groupVat = (this.settingsService.getTax/100) * (this.capacity + groupConsumptionTotal);
        console.log("Tax: ", groupVat);
        console.log("Capacity: ", this.capacity);
        groupTotalCost = groupConsumptionTotal + this.capacity + groupVat;
      }
      this.dlService.updateGroup(groupIndex, this.listGroup[groupIndex].name, groupTotalPower, groupTotalCost);
      groupHours = 0;
      groupPower = 0;
      groupMulti = 0;
      groupVat = 0;
      groupConsumptionTotal = 0;
      groupTotalPower = 0;
      groupTotalCost = 0;
    }
    this.listGroup = this.dlService.getGroup();
  }

  onLoadGroup(group: Group) {
    const modal = this.modalCtrl.create(DisplayGroupPage, {group: group});
    modal.present();
  }

  onDeleteGroup(index: number) {
    for (let deviceIndex = 0; deviceIndex < this.listGroupDevices.length; deviceIndex++) {
      try {
        while(this.listGroupDevices[deviceIndex].group === this.listGroup[index].name) {
              this.dlService.removeGroupList(deviceIndex);
              this.listGroupDevices = this.dlService.getGroupList();
        }
      }
      catch(err) {
        continue;
      }
    }
    this.dlService.removeGroup(index);
    this.listGroup = this.dlService.getGroup();
    const toast = this.toastCtrl.create({
      message: 'Group Deleted',
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
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
       console.log("flat rate: ", this.settingsService.getFlatRate)
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

     sortBy(sort){
       this.column = sort;
       this.descending = !this.descending;
       this.order = this.descending ? 1 : -1;
     }
}
