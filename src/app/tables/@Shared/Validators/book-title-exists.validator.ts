import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { BookService } from '../Services/Http-Services/book.service';

/**
 * @summary check if the book title already exists
 * @returns validator error or null if no error found
 */
export function bookTitleExistsValidator(bookService: BookService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;

      if (!value) {
          return null;
      }

      const IsTitleExists = bookService.booksData.some(b => b.title.toLowerCase() === value.toLowerCase());

      return IsTitleExists ? { titleExists: true } : null;
  };
}
