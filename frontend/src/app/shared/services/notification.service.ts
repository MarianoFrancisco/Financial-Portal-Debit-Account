import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private toastrService = inject(ToastrService);
  private options = {


  };

  constructor() { }

  public show(message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error'): void {
    if (type === 'error') {
      this.toastrService.error(message);
    } else if (type === 'warning') {
      this.toastrService.warning(message);
    } else if (type === 'info') {
      this.toastrService.info(message);
    } else {
      this.toastrService.success(message);
    }
  }

}
