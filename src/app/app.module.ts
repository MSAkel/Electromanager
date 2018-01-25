import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from "@ionic/storage";
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


import { MyApp } from './app.component';
import { AddDevicePage } from "../pages/add-device/add-device";
import { CreatePage } from "../pages/add-device/create/create";
import { SelectPage } from "../pages/add-device/select/select";
import { DevicesListPage } from "../pages/devices-list/devices-list";
import { SummaryPage } from "../pages/summary/summary";
import { SettingsPage } from "../pages/settings/settings";
import { AddModalPage } from "../pages/add-device/display-cat/add-modal/add-modal";
import { AddCategoryPage } from "../pages/add-device/add-category/add-category";
import { AddBillPage } from "../pages/summary/add-bill/add-bill";
import { AddGroupPage } from "../pages/devices-list/add-group/add-group";
import { TabsPage } from "../pages/tabs/tabs";
import { DeviceListService } from "../services/devices-list";
import { SettingsService } from "../services/settings";
import { DisplayCatPage } from "../pages/add-device/display-cat/display-cat";
import { DisplayGroupPage } from "../pages/summary/display-group/display-group";
import { TutorialPage } from "../pages/tutorial/tutorial";
import { HelpPage } from '../pages/help/help';
import { SortPipe } from '../pipes/sort/sort';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    AddDevicePage,
    DisplayCatPage,
    CreatePage,
    SelectPage,
    DevicesListPage,
    SummaryPage,
    DisplayGroupPage,
    SettingsPage,
    AddModalPage,
    AddCategoryPage,
    AddBillPage,
    AddGroupPage,
    TutorialPage,
    HelpPage,
    SortPipe,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
       TranslateModule.forRoot({
           loader: {
               provide: TranslateLoader,
               useFactory: (createTranslateLoader),
               deps: [HttpClient]
           }
       })
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
    DisplayGroupPage,
    SettingsPage,
    AddModalPage,
    AddCategoryPage,
    AddBillPage,
    AddGroupPage,
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
