import { Component, Input, OnInit, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'shared-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit {

  @Input({ required: true }) public message!: string;

  private notifService = inject(NotificationService);

  ngOnInit(): void {
    this.notifService.show(this.message, 'info');
  }

}
