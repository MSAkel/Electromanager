// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl, Validators } from "@angular/forms";
// import { IonicPage, NavController, ViewController, NavParams, ToastController } from 'ionic-angular';
//
// import { SettingsService } from "../../../services/settings";
// import { TranslateService } from '@ngx-translate/core';
// import { DeviceListService } from "../../../services/devices-list";
//
// import { Device } from "../../../models/device";
//
// import { Adjust } from '../../../models/adjust';
//
// @IonicPage()
// @Component({
//   selector: 'page-add-bill',
//   templateUrl: 'add-bill.html',
// })
// export class AddBillPage implements OnInit {
//   mode = 'Add';
//   billForm: FormGroup;
//
//   adjust: Adjust;
//   listAdjust: Adjust[];
//   index: number;
//
//   language: string;
//   rtl: string;
//   arabic = false;
//
//   listDevices: Device[];
//   totalPower: number = 0;
//   totalHours: number;
//   flat: number;
//   power: number;
//   multi: number;
//   capacity: number;
//   vat: number;
//   consumptionTotal: number;
//   totalBill: number;
//
//   constructor(
//     private viewCtrl: ViewController,
//     public navCtrl: NavController,
//     public navParams: NavParams,
//     public toastCtrl: ToastController,
//     private dlService: DeviceListService,
//     private settingsService: SettingsService,
//     private translateService: TranslateService
//   ) {}
//
//   ngOnInit() {
//     this.settingsService.getLanguage();
//     // this.dlService.fetchAdjust()
//     //   .then(
//     //     (adjust: Adjust[]) => this.listAdjust = adjust
//     //   );
//     this.mode = this.navParams.get('mode');
//     if(this.mode == 'Edit') {
//       this.adjust = this.navParams.get('bill');
//       this.index = this.navParams.get('index');
//     }
//     this.initializeForm();
//   }
//
//   ionViewWillEnter() {
//     this.setLanguage();
//     this.settingsService.getSettings();
//     this.listDevices = this.dlService.getDevices();
//     this.listAdjust = this.dlService.getAdjust();
//
//     this.calculate();
//     this.consumptionTotalFunction();
//     this.capacityFunction();
//     this.vatFunction();
//     this.totalBillFunction();
//   }
//
//   setLanguage() {
//     this.language = this.translateService.currentLang;
//     if(this.language == 'ar')
//     {
//       this.rtl = 'rtl';
//       this.arabic = true;
//     }
//     return this.rtl;
//   }
//
//   calculate(){
//     this.totalPower = 0;
//     for(var index = 0; index < this.listDevices.length; index++){
//       this.totalHours = this.listDevices[index].hours * this.listDevices[index].quantity;
//       this.power = this.listDevices[index].power;
//       this.multi = (this.totalHours * this.listDevices[index].daysUsed * this.power) * this.listDevices[index].compressor;
//
//       this.totalPower = this.totalPower + this.multi;
//       console.log("Add Bill Power:",this.totalPower);
//     }
//     return this.totalPower;
//   }
//
//   consumptionTotalFunction() {
//        if(this.totalPower > 0 && this.totalPower <= 6000000){
//          this.consumptionTotal = this.totalPower/1000 * this.settingsService.getCost;
//        } else if (this.totalPower > 60000000) {
//          this.consumptionTotal = this.totalPower/1000 * 0.30;
//        }
//        console.log('Add Bill consumption total:',this.consumptionTotal);
//        return this.consumptionTotal;
//      }
//
//   capacityFunction() {
//        this.capacity = this.settingsService.getFlatRate * 1;
//        return this.capacity;
//      }
//
//   vatFunction() {
//        this.vat = (this.settingsService.getTax/100) * (this.capacity + this.consumptionTotal);
//        return this.vat;
//      }
//
//   totalBillFunction(){
//         this.totalBill = +(this.consumptionTotal + this.vat + this.capacity).toFixed(2);
//           console.log(this.totalBill);
//         return this.totalBill;
//      }
//
//   onSubmit() {
//     const value = this.billForm.value;
//     console.log('Bill: ' + value.bill + " appBill: " + this.totalBill);
//     value.difference = this.totalBill - value.bill;
//     if (this.mode == 'Edit') {
//       this.dlService.updateAdjust(this.index, value.bill, this.totalBill, value.difference);
//       const toast = this.toastCtrl.create({
//         message: 'Edit Successful',
//         duration: 2000,
//         position: 'bottom'
//       });
//       toast.present();
//     } else if (this.mode == 'Add') {
//         this.dlService.addAdjust(value.bill, this.totalBill, value.difference);
//         const toast = this.toastCtrl.create({
//           message: 'Bill Added Successfully',
//           duration: 2000,
//           position: 'bottom'
//         });
//         toast.present();
//       }
//
//     this.billForm.reset();
//     this.viewCtrl.dismiss();
//   }
//
//   onDelete(index: number) {
//     this.dlService.removeAdjust(index);
//     this.listAdjust = this.dlService.getAdjust();
//
//     const toast = this.toastCtrl.create({
//       message: 'Record Deleted',
//       duration: 1500,
//       position: 'bottom'
//     });
//     toast.present();
//   }
//
//   private initializeForm() {
//     let bill = null;
//     //let appbill = null;
//
//     this.billForm = new FormGroup({
//       'bill': new FormControl(bill, Validators.required),
//       //'appBill': new FormControl(appbill, Validators.required),
//     });
//   }
// }
