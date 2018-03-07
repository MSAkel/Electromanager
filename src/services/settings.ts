import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Rate } from "../models/rate";

@Injectable()
export class SettingsService {
  private rates: Rate[] = [];

  private tax = 5;
  private flatRate = 10;

  public getTax: number;
  public getFlatRate: number;

  constructor(private storage: Storage) {}

  addRate(rateRange: number, rateCost: number) {
    const rate = new Rate(rateRange, rateCost);
    this.rates.push(rate);
    this.storage.set('rates', this.rates)
      .then()
      .catch(
        err => {
          this.rates.splice(this.rates.indexOf(rate),1);
        }
      );
  }

  getRates() {
    return this.rates.slice();
  }

  fetchRates() {
    return this.storage.get('rates')
      .then(
        (rates: Rate[]) => {
          this.rates = rates != null ? rates : [];
          return this.rates;
        }
      )
      .catch(
        err => console.log(err)
      );
  }

  updateRate(index: number, rateRange: number, rateCost: number) {
    this.rates[index] = new Rate(rateRange, rateCost);
    this.storage.set('rates', this.rates)
      .then()
      .catch(
        err => {
          err => console.log(err)
        }
      );
  }

  removeRates() {
    this.rates = [];
    this.storage.set('rates', this.rates)
      .then()
      .catch(
        err => console.log(err)
      );
  }

  saveSettings(tax: number, flatRate: number) {
      //this.cost = cost;
      this.tax = tax;
      this.flatRate = flatRate;
      //this.storage.set('cost', this.cost)
      this.storage.set('tax', this.tax);
      this.storage.set('flatRate', this.flatRate);
      //console.log(this.cost);
  }

  getSettings() {
    this.storage.get('tax')
    .then((tax) => {
      this.tax = tax;
      //console.log(this.tax);
    }
  );
    this.storage.get('flatRate')
    .then((flat) => {
      this.flatRate = flat;
      //console.log(this.flatRate);
    }
  );
    //this.getCost = this.cost;
    this.getTax = this.tax;
    this.getFlatRate = this.flatRate;
    //console.log(this.cost + 'bot');
  }
}
