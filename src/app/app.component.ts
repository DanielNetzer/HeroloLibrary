import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent, MatSnackBar, MatDialog } from '@angular/material';

// Services
import { BooksService } from './services/books/books.service';

// Pipes
import { CapitalizePipe } from './pipes/capitalize.pipe';

// Interfaces
import { IBook } from './interfaces/book.interface';

// Modals
import { BookModalComponent } from './modals/book-modal/book-modal.component';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  allBooks: IBook[] = [];
  booksForCurrentPage: IBook[] = [];

  // MatPaginator Inputs
  length = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  // Subscritions
  subscriptions: Subscription[] = [];

  constructor(private bService: BooksService,
    private snackBar: MatSnackBar,
    private capitalize: CapitalizePipe,
    public dialog: MatDialog) { }

  ngOnInit() {
    console.log('Component AppComponent Init Started!');
    this.getBooks();
    this.getBooksPerPage(this.pageSize, 0);
    this.initViewModel();
  }

  /**
   * Initialise all of the current component view model
   */
  initViewModel(): void {
    this.pageEvent = new PageEvent;
    this.pageEvent.length = this.allBooks.length;
    this.pageEvent.pageIndex = 0;
  }

  /**
   * Get all books from API
   */
  getBooks(): void {
    this.subscriptions.push(
      this.bService.GetAll().subscribe((books: IBook[]) => {
        this.allBooks = books;
      }, (err) => {
        console.error(err);
      })
    );
  }

  /**
   * Return number of books according to pageSize and to the appropriate pageIndex
   * @param pageSize Number of books per page
   * @param pageIndex Page Number
   */
  getBooksPerPage(pageSize: number, pageIndex: number) {
    this.subscriptions.push(
      this.bService.GetAllPerPage(pageSize, pageIndex).subscribe((books: IBook[]) => {
        this.booksForCurrentPage = books;
      }, (err) => {
        console.error(err);
      })
    );
  }

  /**
   * Handle delete book click event
   * @param book
   */
  deleteSnackbar(book: IBook) {
    const deleteQuestion = `Are you sure you want to delete ${this.capitalize.transform(book.title)}?`;
    const deleteSuccess = `${this.capitalize.transform(book.title)} deleted succesfully`;

    const deleteSnackBarRef = this.snackBar.open(deleteQuestion, 'Yes', {
      duration: 2000,
    });

    // will listen to the action button on the snackBar
    this.subscriptions.push(
      deleteSnackBarRef.onAction().subscribe(() => {
        this.booksForCurrentPage = this.booksForCurrentPage.filter(b => b.id !== book.id);
        this.allBooks = this.allBooks.filter(b => b.id !== book.id);
        this.snackBar.open(deleteSuccess, null, {
          duration: 2000,
        });
      })
    );

  }

  /**
   * Handle edit/new dialog button click
   * @param book
   */
  editDialog(book: IBook) {

    const dialogRef = this.dialog.open(BookModalComponent, {
      data: book,
      disableClose: true
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((response: IBook) => {

        if (response === null) {
          return;
        }

        let isNew = false;
        if (response.id === null) {
          response.id = this.allBooks.length;
          isNew = true;
        }

        this.subscriptions.push(
          this.bService.AddBook(response).subscribe(() => {

            if (isNew) {
              this.allBooks = [...this.allBooks, response];
            } else {
              this.allBooks[response.id - 1] = response;
              this.booksForCurrentPage[response.id - 1] = response;
            }

          }, (err) => {
            console.error(err);
          })
        );

      })
    );
  }

  /**
   * Handle pagination event
   * @param event
   */
  onPaginationChanged(event: PageEvent): void {
    this.getBooksPerPage(event.pageSize, event.pageIndex);
  }

  /**
   * Dispose all subscriptions when component destroyed
   */
  ngOnDestroy() {
    console.log('Component AppComponent Destroyed!');
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
