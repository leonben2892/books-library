import { FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { IServerResponse } from './server-response.model';

/**
 * @summary represents a table
 */
export interface IBaseTable<T> {
  tableName: string;
  tableColumns: ITableColumn[];
  tableData$: Observable<IServerResponse<T>>; // Get table data according to current table query data (filters, sorting, etc...)
  actionBtns?: IActionButton<T>[];
  topActionBtns?: IActionButton<T>[];
  tableForm?: IForm;
  onCreate?: (form: FormGroup) => Observable<any>;
  onUpdate?: (id: number, form: FormGroup) => Observable<any>;
  storeRefreshFunc?: (refreshFunc) => any;
  refreshTable?: () => any;
}

/**
 * @summary represents table structure
 */
export interface ITableColumn {
  header: string;
  value: string;
  columnType: DataType;
}

/**
 * @summary represents table row action buttons
 */
export interface IActionButton<T> {
  labelInnerHTML: string;
  style: string;
  onClick: (data: T) => any;
}

/**
 * @summary represent form structure
 */
export interface IForm {
  formLabel: string;
  formSize: 'sm' | 'md' | 'lg' | 'xl';
  controls: IControl[];
}

/**
 * @summary represent form control structure
 */
export interface IControl {
  name: string;
  label: string;
  type: DataType;
  validators?: ControlValidators;
}

/**
 * @summary control validators & error messages
 */
export interface ControlValidators {
  validators: ValidatorFn | ValidatorFn[];
  errorMessages: { [key: string]: string };
}

export enum DataType {
  Text,
  Number,
  Date,
}
