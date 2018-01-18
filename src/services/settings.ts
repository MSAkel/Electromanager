import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SettingsService {
  private language = 'en';
  constructor(private storage: Storage, private translateService: TranslateService,) {}

  setLanguage(event: string) {
    this.language = event;
    this.translateService.use(this.language);
    this.storage.set('language', this.language);
    console.log(this.language);
  }

  getLanguage() {
    this.storage.get('language').then((lang) => {
      this.translateService.use(lang);
    });
  }
  // private language = false;
  //
  // setLanguage(selected: boolean) {
  //   this.language = selected;
  // }
  //
  // isArabic() {
  //   return this.language;
  // }
}
