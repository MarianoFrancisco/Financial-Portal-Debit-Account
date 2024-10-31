import { Component, Input, inject } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'admin-users',
  templateUrl: './users.component.html',
  styles: ``
})
export class UserComponent {

  @Input({ required: true }) public id!: number;
  @Input({ required: true }) public user!: User;


  private notifService = inject(NotificationService);
  private userService = inject(UserService);

  changeState(id: number, active: number): void {
    active = active === 1 ? 0 : 1;
    const body = {
      userId: id,
      activeStatus: active,
    };
    this.userService.updateStatus(body).subscribe({
      next: () => {
        this.notifService.show('Estado del usuario actualizado.', 'success');
        location.reload();
      },
      error: () => this.notifService.show('Algo salió mal.', 'error')
    });
  }
}
