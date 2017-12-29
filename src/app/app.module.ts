import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AddDevicePage } from "../pages/add-device/add-device";
import { CreatePage } from "../pages/add-device/create/create";
import { SelectPage } from "../pages/add-device/select/select";
import { DevicesListPage } from "../pages/devices-list/devices-list";
import { SummaryPage } from "../pages/summary/summary";
import { TabsPage } from "../pages/tabs/tabs";
import { DeviceListService } from "../services/devices-list";

@NgModule({
  declarations: [
    MyApp,
    AddDevicePage,
    CreatePage,
    SelectPage,
    DevicesListPage,
    SummaryPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddDevicePage,
    CreatePage,
    SelectPage,
    DevicesListPage,
    SummaryPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DeviceListService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
