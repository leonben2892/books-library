import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { delay, take } from 'rxjs/operators';

import { IBaseTable } from '../../@Shared/Models/base-table.model';
import { fadeAnimation, slideAnimation } from '../../@Shared/Animations/table-form.animation';
import { NotificationsService, notificationStyle } from 'src/app/notifications/notifications.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideAnimation, fadeAnimation]
})
export class FormComponent implements OnInit {
  public IsComponentOn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public IsFormVisible: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public IsDataLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public IsClosingForm = false;

  public tableForm: FormGroup;
  public config: IBaseTable<any>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.IsComponentOn.next(true);
    this.config = this.route.snapshot.parent.data.config;
    this.createForm();
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    if (event.target.classList.contains('overlay')) {
      this.onCancel();
    }
  }

  private createForm() {
    this.tableForm = this.fb.group({});

    this.config.tableForm.controls.forEach(control => {
      this.tableForm.addControl(control.name, this.fb.control(null, control.validators ? control.validators.validators : [Validators.nullValidator]));
    });
  }

  public onSubmit() {
    if (this.tableForm.valid) {
      this.IsDataLoading.next(true);
      // NOTE: added delay to imitate server response
      this.config.onCreate(this.tableForm).pipe(take(1), delay(1000)).subscribe(_ => { this.onSuccessfulFormSubmission('Created successfully', 'Primary'); }, err => { this.IsDataLoading.next(false); this.notificationsService.AddNotification('Error creating item', 'Danger'); });
    }
  }

  onSuccessfulFormSubmission(message: string, style: notificationStyle) {
    this.IsDataLoading.next(false);
    this.onCancel();
    this.config.refreshTable();
    this.notificationsService.AddNotification(message, style);
  }

  public onCancel() {
    this.IsClosingForm = true;
    this.IsFormVisible.next(false);
  }

  public slideAnimationEnd(event) {
    if (event.toState === 'void' && this.IsClosingForm === true) {
      this.IsComponentOn.next(false);
    }
  }

  public fadeAnimationEnd(event) {
    if (event.toState === 'void') {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.IsFormVisible.next(true);
    }
  }
}
