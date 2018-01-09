import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';
import { AddDevicePage } from "../pages/add-device/add-device";
import { CreatePage } from "../pages/add-device/create/create";
import { SelectPage } from "../pages/add-device/select/select";
import { DevicesListPage } from "../pages/devices-list/devices-list";
import { SummaryPage } from "../pages/summary/summary";
import { SettingsPage } from "../pages/settings/settings";
import { AddModalPage } from "../pages/add-device/display-cat/add-modal/add-modal";
import { TabsPage } from "../pages/tabs/tabs";
import { DeviceListService } from "../services/devices-list";
import { DisplayCatPage } from "../pages/add-device/display-cat/display-cat";

@NgModule({
  declarations: [
    MyApp,
    AddDevicePage,
    DisplayCatPage,
    CreatePage,
    SelectPage,
    DevicesListPage,
    SummaryPage,
    SettingsPage,
    AddModalPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddDevicePage,
    DisplayCatPage,
    CreatePage,
    SelectPage,
    DevicesListPage,
    SummaryPage,
    SettingsPage,
    AddModalPage,
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
