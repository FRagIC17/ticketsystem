import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-banner.html',
  styleUrl: './notification-banner.css',
})
export class NotificationBanner {
  readonly notificationService = inject(NotificationService);
  readonly currentNotification = this.notificationService.currentNotification;

  close() {
    this.notificationService.clear();
  }
}