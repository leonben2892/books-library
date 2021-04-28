import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type notificationStyle = 'Primary' | 'Success' | 'Warning' | 'Danger' | 'Info';
export type notification = {message: string, createdAt: number, duration: number, style: notificationStyle};

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  public notifications: BehaviorSubject<notification[]> = new BehaviorSubject([]);
  private notificationsArr: notification[] = [];

  constructor() { }

  public AddNotification(message: string, style: notificationStyle, duration = 2000) {
    this.notificationsArr.push({message, createdAt: Date.now(), duration: 2000, style});
    this.notifications.next(this.notificationsArr);
  }

  public removeNotification(index: number) {
    this.notificationsArr.splice(index, 1);
    this.notifications.next(this.notificationsArr);
  }

  public getNotifications(): notification[] {
    return this.notificationsArr;
  }
}
