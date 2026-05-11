import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  type: NotificationType;
  title: string;
  detail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationSignal = signal<AppNotification | null>(null);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly currentNotification = this.notificationSignal.asReadonly();

  show(notification: AppNotification, durationMs = 4500) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.notificationSignal.set(notification);
    this.timeoutId = setTimeout(() => this.clear(), durationMs);
  }

  success(title: string, detail?: string) {
    this.show({ type: 'success', title, detail });
  }

  error(title: string, detail?: string) {
    this.show({ type: 'error', title, detail }, 6500);
  }

  info(title: string, detail?: string) {
    this.show({ type: 'info', title, detail });
  }

  clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.notificationSignal.set(null);
  }
}