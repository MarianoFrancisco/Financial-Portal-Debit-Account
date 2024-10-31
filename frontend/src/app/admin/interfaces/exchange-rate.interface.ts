export interface ExchangeRate {
    id: number;
    originCurrencyId: number;
    destinationCurrencyId: number;
    originCurrencyName: string;
    destinationCurrencyName: string;
    rate: number;
    lastUpdate: number;
}