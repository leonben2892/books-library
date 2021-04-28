import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ transform: 'translateY(10px)', opacity: 0 }),
            animate('0.3s ease-out',
                    style({ transform: 'translateY(0)', opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ transform: 'translateY(0)', opacity: 1 }),
            animate('0.3s ease-in',
                    style({ transform: 'translateY(-10px)', opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notificationsAutoRemovalInterval;

  constructor(public notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.notificationsAutoRemoval();
  }

  notificationsAutoRemoval() {
    this.notificationsAutoRemovalInterval = setInterval(() => {
      this.notificationsService.getNotifications().forEach((item, index) => {
        if (item.createdAt + item.duration < Date.now()) {
          this.notificationsService.removeNotification(index);
        }
      });
    }, 1000);
  }

  ngOnDestroy() {
    if (this.notificationsAutoRemovalInterval) {
      clearInterval(this.notificationsAutoRemovalInterval);
    }
  }

}
