import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { DeviceListService } from "../../../services/devices-list";
import { Device } from "../../../models/device";
import { GroupList } from "../../../models/group-list";

@IonicPage()
@Component({
  selector: 'page-add-group',
  templateUrl: 'add-group.html',
})
export class AddGroupPage implements OnInit{
  groupForm: FormGroup;
  listDevices: Device[];
  listGroupDevices: GroupList[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public toastCtrl: ToastController,
    private dlService: DeviceListService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  ionViewWillEnter() {
    this.listDevices = this.dlService.getDevices();
  }

  onSubmit() {
    const value = this.groupForm.value;
    this.dlService.addGroup(value.name, 0, 0);
    for(let index = 0; index < this.listDevices.length; index++) {
      console.log("GroupList size: ", this.listGroupDevices);
      console.log("Count: ", index);
      this.dlService.addGroupList(
        this.listDevices[index].name,
        this.listDevices[index].quantity,
        this.listDevices[index].power,
        this.listDevices[index].hours,
        this.listDevices[index].daysUsed,
        this.listDevices[index].category,
        value.name
      )
    }
    this.groupForm.reset();
    const toast = this.toastCtrl.create({
      message: 'Group Added Successfully',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
    this.viewCtrl.dismiss();
  }

  private initializeForm() {
    let name = null;

    this.groupForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
    });
  }

  onClose() {
    this.viewCtrl.dismiss();
  }

}
