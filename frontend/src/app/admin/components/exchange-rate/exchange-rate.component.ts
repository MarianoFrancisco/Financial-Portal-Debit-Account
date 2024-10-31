import { Component, Input, inject } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { ExchangeRate } from '../../interfaces/exchange-rate.interface';

@Component({
  selector: 'admin-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styles: ``
})
export class ExchangeRateComponent {

  @Input({ required: true }) public id!: number;
  @Input({ required: true }) public exchangeRate!: ExchangeRate;

  private notifService = inject(NotificationService);
  private exchangeRateService = inject(ExchangeRateService);
  public newExchangeRate: number = 0;

  ngOnInit(): void {
    this.newExchangeRate = this.exchangeRate.rate;
  }

  public updateExchangeRate(): void {
    const body = {
      origin_currency_id: this.exchangeRate.originCurrencyId,
      destination_currency_id: this.exchangeRate.destinationCurrencyId,
      rate: this.newExchangeRate
    };
    this.exchangeRateService.updateExchangeRate(body).subscribe({
      next: () => this.notifService.show('Divisa actualizada.', 'success'),
      error: () => this.notifService.show('Algo salio mal.', 'error')
    });
  }
}
