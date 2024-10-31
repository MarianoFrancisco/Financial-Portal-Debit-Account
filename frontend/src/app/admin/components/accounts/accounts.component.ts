import { Component, Input, inject } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { BankService } from '../../services/accounts.service';
import { AccountClosureService } from '../../services/accounts-closure.service';
import { BankAccount } from '../../interfaces/bank-account.interface';

@Component({
  selector: 'admin-accounts',
  templateUrl: './accounts.component.html',
  styles: ``
})
export class AccountComponent {

  @Input({ required: true }) public id!: number;
  @Input({ required: true }) public bank!: BankAccount;


  private notifService = inject(NotificationService);
  private accountClosureService = inject(AccountClosureService);
  private bankService = inject(BankService);
  public selectedAccountTier: number = 1;
  public retainAccount: boolean = false;
  public closeReason = '';

  activateAccount(id: number): void {
    this.accountClosureService.active(id).subscribe({
      next: () => {
        this.notifService.show('Cuenta cerrada exitosamente.', 'success');
        location.reload();
      },
      error: () => this.notifService.show('Algo salió mal.', 'error')
    });
  }

  closeAccount(id: number, reason: string): void {
    const body = {
      closure_reason: reason,
    };
    if (!reason.trim()) {
      this.notifService.show('Por favor ingrese un motivo para el cierre.', 'warning');
      return;
    }
    this.accountClosureService.close(id, body).subscribe({
      next: () => {
        this.notifService.show('Cuenta cerrada exitosamente.', 'success');
        location.reload();
      },
      error: () => {
        this.notifService.show('Error al cerrar la cuenta.', 'error');
      }
    });
  }

  changeAccount(username: string, bankId: number, accountTier: number, retain: boolean): void {
    const body = {
      username: username,
      old_account_id: bankId,
      new_account_tier_id: accountTier,
      keep_old_account: retain
    };
    this.bankService.changeType(body).subscribe({
      next: () => {
        this.notifService.show('Cuenta cambiada exitosamente.', 'success');
        location.reload();
      },
      error: () => this.notifService.show('Error al cambiar la cuenta.', 'error')
    });
  }
}
