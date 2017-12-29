import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DevicesListPage } from './devices-list';

@NgModule({
  declarations: [
    DevicesListPage,
  ],
  imports: [
    IonicPageModule.forChild(DevicesListPage),
  ],
})
export class DevicesListPageModule {}
