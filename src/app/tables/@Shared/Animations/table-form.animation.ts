import {
  trigger,
  animate,
  transition,
  style,
  query, group
} from '@angular/animations';

export const slideAnimation = trigger('slideAnimation', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('0.18s', style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('0.18s', style({ transform: 'translateX(100%)', opacity: 0 })),
  ]),
]);

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: '0' }),
    animate('0.1s', style({ opacity: '1' })),
  ]),
  transition(':leave', [
    animate('0.1s', style({ opacity: '0' })),
  ]),
]);
