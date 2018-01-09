import { Component } from '@angular/core';

import { SummaryPage } from "../summary//summary";
import { DevicesListPage } from "../devices-list//devices-list";
//import { AddDevicePage } from "../add-device/add-device";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  summaryPage = SummaryPage;
  dlPage = DevicesListPage;
  //adPage = AddDevicePage;
}
