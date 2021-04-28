import { Pipe, PipeTransform } from '@angular/core';

/**
 * @summary return a required length from a string (Also removes all <br>s from the string)
 */
@Pipe({name: 'modifyStringLengthPipe'})
export class ModifyStringLengthPipe implements PipeTransform {
  transform(stringToModify: string, requestedLength: number): string {
    if (!!stringToModify) {
      stringToModify = stringToModify.replace(/(?:\r<br>|\r|<br>)/g, ' ');
      if (stringToModify.length <= requestedLength) {
        return stringToModify;
      } else {
        return stringToModify.substring(0, requestedLength - 3) + '...';
      }
    }
    return;
  }
}
