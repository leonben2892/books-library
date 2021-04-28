import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BasePageComponent } from './base-page/base-page.component';
import { BaseTableComponent } from './base-table/base-table.component';
import { FormComponent } from './base-table/form/form.component';

import { BookResolverService } from './@Shared/Services/Table-Resolvers/book-resolver.service';

const routes: Routes = [
  { path: 'admin', component: BasePageComponent, children: [
    {
      path: 'books', component: BaseTableComponent, resolve: { config: BookResolverService },
      children:
      [
        { path: 'create', component: FormComponent },
      ]
    },
  ]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesRoutingModule {}
