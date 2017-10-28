import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IBook } from '../../interfaces/book.interface';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class BooksService {

  allBooks: IBook[];
  allBooksForCurrentPage: IBook[];

  constructor(private http: HttpClient) { }

  GetAll(): Observable<IBook[]> {
    return this.http
      .get('api/books')
      .map(response => {
        this.allBooks = response as IBook[];
        return response as IBook[];
      });
  }

  GetAllPerPage(pageSize: number, pageIndex: number): Observable<IBook[]> {
    return this.http
      .get('api/books')
      .map(response => response as IBook[])
      .map(data => {
        this.allBooksForCurrentPage = data.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
        return this.allBooksForCurrentPage;
      });
  }

  AddBook(book: IBook): Observable<void> {
    return this.http
      .post('api/books', book)
      .map(() => { });
  }

}
