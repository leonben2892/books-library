import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { IBook } from '../../Models/book.model';

import { IServerResponse } from '../../Models/server-response.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: ReplaySubject<IServerResponse<IBook>> = new ReplaySubject(1);
  public booksData: IBook[] = [];

  constructor(private http: HttpClient) {}

  public initDb() {
    this.http.get('assets/db.json').subscribe((res: IBook[]) => {
      this.booksData = res;
      this.books.next({data: this.booksData, total: this.booksData.length});
    });
  }

  public getAllBooks(): Observable<IServerResponse<IBook>> {
    return this.books.asObservable();
  }

  public getBookById(id: number) {
    const requestedBookIndex = this.booksData.indexOf(this.booksData.find(b => b.id === id));
    if (requestedBookIndex > -1) {
      return this.booksData[requestedBookIndex];
    }
    return null;
  }

  public addBook(book: IBook): Observable<IServerResponse<IBook>> {
    if (this.booksData.length === 0) {
      book.id = 1;
    } else {
      book.id = Math.max.apply(Math, this.booksData.map((o) => o.id)) + 1;
    }
    this.booksData = [...this.booksData, book];
    this.books.next({data: this.booksData, total: this.booksData.length});
    return this.books.asObservable();
  }

  public editBook(id: number, book: IBook): Observable<IServerResponse<IBook>> {
    book.id = id;
    const requestedBookIndex = this.booksData.indexOf(this.booksData.find(b => b.id === id));
    if (requestedBookIndex > -1) {
      this.booksData[requestedBookIndex] = book;
      this.books.next({data: this.booksData, total: this.booksData.length});
    }
    return this.books.asObservable();
  }

  public deleteBook(book: IBook): Observable<IServerResponse<IBook>> {
    const bookIndex = this.booksData.indexOf(book);
    if (bookIndex > -1) {
      this.booksData.splice(bookIndex, 1);
      this.books.next({data: this.booksData, total: this.booksData.length});
    }
    return this.books.asObservable();
  }

}
