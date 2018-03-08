import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { CreatePage } from "../pages/add-device/create/create";
import { DevicesListPage } from "../pages/devices-list/devices-list";
import { SummaryPage } from "../pages/summary/summary";
import { ReportsPage } from "../pages/reports/reports";
import { SettingsPage } from "../pages/settings/settings";
import { TabsPage } from "../pages/tabs/tabs";
import { DeviceListService } from "../services/devices-list";
import { SettingsService } from "../services/settings";
import { DisplayCatPage } from "../pages/add-device/display-cat/display-cat";
import { CataloguePage } from "../pages/add-device/catalogue/catalogue";
import { TutorialPage } from "../pages/tutorial/tutorial";
import { HelpPage } from '../pages/help/help';
import { SearchPipe } from '../pipes/search/search';

@NgModule({
  declarations: [
    MyApp,
    DisplayCatPage,
    CreatePage,
    DevicesListPage,
    SummaryPage,
    ReportsPage,
    SettingsPage,
    CataloguePage,
    TutorialPage,
    HelpPage,
    SearchPipe,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DisplayCatPage,
    CreatePage,
    DevicesListPage,
    SummaryPage,
    ReportsPage,
    SettingsPage,
    CataloguePage,
    TutorialPage,
    HelpPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DeviceListService,
    SettingsService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
