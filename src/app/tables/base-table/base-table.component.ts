import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { fadeAnimation } from '../@Shared/Animations/table-form.animation';

import { IBaseTable } from '../@Shared/Models/base-table.model';
import { IServerResponse } from '../@Shared/Models/server-response.model';

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation]
})
export class BaseTableComponent implements OnInit, AfterViewInit {
  public config: IBaseTable<any>;
  public tableData: IServerResponse<any>;
  public IsDataLoading: BehaviorSubject<boolean> = new BehaviorSubject(true);

  public refreshTable = () => {
    this.IsDataLoading.next(true);
    // NOTE: added delay to imitate server response
    this.config.tableData$.pipe(take(1), delay(1000)).subscribe(res => {
      this.tableData = {...res};
      this.IsDataLoading.next(false);
    }, err => this.IsDataLoading.next(false));
  }

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.config = this.route.snapshot.data.config;
    this.config.storeRefreshFunc(this.refreshTable);
  }

  ngAfterViewInit() {
    this.refreshTable();
  }

}
