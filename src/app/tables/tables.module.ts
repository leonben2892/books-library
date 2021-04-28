import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TablesRoutingModule } from './tables-routing.module';
import { BasePageComponent } from './base-page/base-page.component';
import { BaseTableComponent } from './base-table/base-table.component';
import { HeaderComponent } from './header/header.component';

import { ModifyStringLengthPipe } from './@Shared/Pipes/modifyStringLength.pipe';
import { FormComponent } from './base-table/form/form.component';
import { ConfirmModalComponent } from './@Shared/Components/Modal-Types/confirm-modal/confirm-modal.component';
import { FormModalComponent } from './@Shared/Components/Modal-Types/form-modal/form-modal.component';

@NgModule({
  declarations: [
    BaseTableComponent,
    BasePageComponent,
    HeaderComponent,
    FormComponent,
    ModifyStringLengthPipe,
    ConfirmModalComponent,
    FormModalComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TablesRoutingModule,
    NgbModule
  ]
})
export class TablesModule { }
