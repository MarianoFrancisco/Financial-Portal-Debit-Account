import { Component, Input } from '@angular/core';
import { ExchangeRate } from '../../interfaces/exchange-rate.interface';

@Component({
  selector: 'user-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styles: ``
})
export class ExchangeRateComponent {

  @Input({ required: true }) public id!: number;
  @Input({ required: true }) public exchangeRate!: ExchangeRate;

}
