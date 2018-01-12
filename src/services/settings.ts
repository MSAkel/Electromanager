export class SettingsService {
  private language = false;

  setLanguage(selected: boolean) {
    this.language = selected;
  }

  isArabic() {
    return this.language;
  }
}
