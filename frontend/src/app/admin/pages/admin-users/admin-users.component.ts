import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { NotificationService } from '../../../shared/services/notification.service';
import { Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styles: ``
})
export class AdminUsersComponent implements OnInit, OnDestroy {

  private usersService = inject(UserService);
  private notifService = inject(NotificationService);
  private usersSub?: Subscription;

  public users: User[] = [];
  public showForm = false;
  public userForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      pin: ['', [Validators.required, Validators.minLength(4)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8,15}$/)]],
      genre: ['', Validators.required],
      notifyme: [0],
      role_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.usersSub = this.usersService.getUsers().pipe(
      switchMap(() => this.usersService.users())
    ).subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy(): void {
    this.usersSub?.unsubscribe();
  }

  onNotifyMeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.userForm.get('notifyme')?.setValue(input.checked ? 1 : 0);
  }

  openAddUserModal(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.userForm.reset();
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const newUser = this.userForm.value;
      this.showForm = false;
      this.usersService.register(newUser).subscribe({
        next: () => {
          this.notifService.show('Usuario agregado exitosamente.', 'success');
          location.reload();
        },
        error: () => this.notifService.show('Algo salio mal.', 'error')
      });
    } else {
      Object.values(this.userForm.controls).forEach(control => {
        if (!control.touched) {
          control.markAsTouched();
        }
      });
      this.notifService.show('Invalid or empty fields.', 'warning');
    }
  }
}
