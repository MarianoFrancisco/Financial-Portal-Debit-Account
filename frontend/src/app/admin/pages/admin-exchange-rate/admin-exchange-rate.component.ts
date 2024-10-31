import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { ExchangeRate } from '../../interfaces/exchange-rate.interface';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-admin-exchange-rate',
  templateUrl: './admin-exchange-rate.component.html',
  styles: ``
})
export class AdminExchangeRateComponent implements OnInit, OnDestroy {

  private exchangeRateService = inject(ExchangeRateService);
  private exchangeRateSub?: Subscription;

  public exchangeRates: ExchangeRate[] = [];

  ngOnInit(): void {
    this.exchangeRateSub = this.exchangeRateService.getExchangeRates().pipe(
      switchMap(() => this.exchangeRateService.exchangeRates())
    ).subscribe(exchange_rates => {
      this.exchangeRates = exchange_rates;
    });
  }

  ngOnDestroy(): void {
    this.exchangeRateSub?.unsubscribe();
  }

}
