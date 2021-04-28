import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { noop } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { NotificationsService } from 'src/app/notifications/notifications.service';
import { ConfirmModalComponent } from '../../Components/Modal-Types/confirm-modal/confirm-modal.component';
import { FormModalComponent } from '../../Components/Modal-Types/form-modal/form-modal.component';
import { DataType, IBaseTable, IForm } from '../../Models/base-table.model';
import { IBook } from '../../Models/book.model';
import { bookTitleExistsValidator } from '../../Validators/book-title-exists.validator';
import { bookTitlePatternValidator } from '../../Validators/book-title-pattern.validator';
import { BookService } from '../Http-Services/book.service';

@Injectable({
  providedIn: 'root'
})
export class BookResolverService {

  constructor(private router: Router,
              private bookService: BookService,
              private modalService: NgbModal,
              private notificationsService: NotificationsService) { this.bookService.initDb(); }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IBaseTable<IBook> {
    let refreshTable: () => any;

    return {
      tableName: 'Books',
      tableColumns: [
        {
          header: 'ID',
          value: 'id',
          columnType: DataType.Number
        },
        {
          header: 'Author',
          value: 'author',
          columnType: DataType.Text
        },
        {
          header: 'Date',
          value: 'date',
          columnType: DataType.Date
        },
        {
          header: 'Title',
          value: 'title',
          columnType: DataType.Text
        },
      ],
      actionBtns: [
        {
          labelInnerHTML: '<i class="fas fa-pencil-alt"></i>',
          style: 'btn btn-outline-success m-1',
          onClick: (data) => {
            const modalRef = this.modalService.open(FormModalComponent);
            modalRef.componentInstance.header = 'Update Book';
            modalRef.componentInstance.form = this.generateForm(true);
            modalRef.componentInstance.item = this.bookService.getBookById(data.id);
            modalRef.result.then(res => {
              this.bookService.editBook(data.id, res);
              refreshTable();
              this.notificationsService.AddNotification('Updated successfully', 'Success');
            }, err => {});
          },
        },
        {
          labelInnerHTML: '<i class="far fa-trash-alt"></i>',
          style: 'btn btn-outline-danger m-1',
          onClick: (data) => {
            const modalRef = this.modalService.open(ConfirmModalComponent);
            modalRef.componentInstance.header = 'Delete Book';
            modalRef.componentInstance.confirmMessage = `Are you sure you want to delete ${data.title} by ${data.author}?`;
            modalRef.result.then(res => {
              if (res === 'confirmed') {
                this.bookService.deleteBook(data);
                refreshTable();
                this.notificationsService.AddNotification('Deleted successfully', 'Success');
              }
            }, err => {});
          }
        }
      ],
      topActionBtns: [
        {
          labelInnerHTML: 'Create',
          style: 'btn btn-outline-primary m-1',
          onClick: () => {
            this.router.navigateByUrl('admin/books/create');
          }
        }
      ],
      tableForm: this.generateForm(false),
      onCreate: (form: FormGroup) => {
        return this.bookService.addBook(form.value);
      },
      tableData$: this.bookService.getAllBooks().pipe(map(res => {
        const modifiedData = res.data.map(book => {
          book.title = this.modifyBookTitle(book.title);
          return book;
        });
        return { data: modifiedData, total: modifiedData.length };
      })),
      storeRefreshFunc: (refreshFunc) => {
        refreshTable = refreshFunc;
      },
      refreshTable: () => refreshTable()
    };
  }

  private generateForm(IsEditMode: boolean): IForm {
    const form: IForm = {
      formLabel: 'Book',
      formSize: 'sm',
      controls:
      [
        {
          name: 'author',
          label: 'Author',
          type: DataType.Text,
          validators: {
            validators: [Validators.required],
            errorMessages: {
              required: 'Author is required',
            }
          }
        },
        {
          name: 'date',
          label: 'Date',
          type: DataType.Date,
          validators: {
            validators: [Validators.required],
            errorMessages: {
              required: 'Date is required',
            }
          }
        },
      ]
    };

    if (IsEditMode === false) {
      form.controls.push
      (
        {
          name: 'title',
          label: 'Title',
          type: DataType.Text,
          validators: {
            validators: [Validators.required, bookTitleExistsValidator(this.bookService), bookTitlePatternValidator(this.bookService)],
            errorMessages: {
              required: 'Title is required',
              titleExists: 'Title already exists',
              titleInvalidPattern: 'Title should only contain alphabetic letters'
            }
          }
        }
      );
    } else {
      form.controls.push
      (
        {
          name: 'title',
          label: 'Title',
          type: DataType.Text,
          validators: {
            validators: [Validators.required, bookTitlePatternValidator(this.bookService)],
            errorMessages: {
              required: 'Title is required',
              titleInvalidPattern: 'Title should only contain alphabetic letters'
            }
          }
        }
      );
    }

    return form;
  }

  private modifyBookTitle(bookTitle: string): string {
    bookTitle = bookTitle.replace(/[^a-z ]/gi, ''); // remove all non-alphabetic characters
    bookTitle = bookTitle.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); // Capitlize first character of every word and lower case all other characters.
    return bookTitle;
  }
}
