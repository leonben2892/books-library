import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { BookService } from '../Services/Http-Services/book.service';

/**
 * @summary check if the book contains forbidden characters
 * @returns validator error or null if no error found
 */
export function bookTitlePatternValidator(bookService: BookService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
          return null;
      }

      const IsTitlePatternValid = /^[a-zA-Z ]+$/.test(value);

      return !IsTitlePatternValid ? { titleInvalidPattern: true } : null;
  };
}
