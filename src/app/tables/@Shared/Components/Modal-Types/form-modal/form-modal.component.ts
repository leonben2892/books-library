import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IForm } from '../../../Models/base-table.model';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormModalComponent implements OnInit {
  @Input() header: string;
  @Input() form: IForm;
  @Input() item: any;

  public modalForm = this.fb.group({});

  constructor(public fb: FormBuilder,
              public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.form.controls.forEach(control => {
      this.modalForm.addControl(control.name, this.fb.control(null, control.validators ? control.validators.validators : [Validators.nullValidator]));
    });

    if (this.item) {
      this.modalForm.patchValue(this.item);
    }
  }

  public onSubmit() {
    if (this.modalForm.valid) {
      this.activeModal.close(this.modalForm.value);
    }
  }

}
