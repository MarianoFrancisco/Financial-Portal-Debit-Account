import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimestampService {
  private timestamp: number | null = null;

  constructor() {}

  public setTimestamp(timestamp: number): void {
    this.timestamp = timestamp;
  }

  public getTimestamp(): number | null {
    return this.timestamp;
  }

  public clearTimestamp(): void {
    this.timestamp = null;
  }
}
