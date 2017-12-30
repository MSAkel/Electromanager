import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisplayCatPage } from './display-cat';

@NgModule({
  declarations: [
    DisplayCatPage,
  ],
  imports: [
    IonicPageModule.forChild(DisplayCatPage),
  ],
})
export class DisplayCatPageModule {}
