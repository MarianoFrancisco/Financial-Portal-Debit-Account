import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MovementService } from '../../../user/services/movement.service';
import { Movement } from '../../interfaces/movement.interface';
import { Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-movements',
  templateUrl: './user-movements.component.html',
  styleUrl: './user-movements.component.css'
})
export class UserMovementsComponent implements OnInit, OnDestroy {

  private movementService = inject(MovementService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movementsSub?: Subscription;

  public myMovements: Movement = {
    total_ingresos: '0',
    total_egresos: '0',
    count_ingresos: 0,
    count_egresos: 0
  };
  public accountId: number = 0;
  public timestamp: number = Date.now();
  public load: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.accountId = Number(params.get('accountId'));
      this.timestamp = Number(params.get('timestamp')) || Date.now();
      this.movementsSub = this.movementService.getMyMovements(this.timestamp, this.accountId).pipe(
        switchMap(() => this.movementService.myMovements())
      ).subscribe(movements => {
        this.myMovements = movements;
        this.load = true;
      });
    });
  }

  ngOnDestroy(): void {
    this.movementsSub?.unsubscribe();
  }
  goBack(): void {
    this.router.navigate(['../']);
  }
}
