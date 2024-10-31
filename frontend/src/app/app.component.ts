import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Subscription } from 'rxjs';
import { AuthStatus } from './auth/interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  public isLoading: boolean = true;
  public isLoggedIn?: Subscription;


  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn().subscribe(status => {
      if (status !== AuthStatus.Checking) {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.isLoggedIn?.unsubscribe();
  }

}
