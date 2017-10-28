import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IBook } from '../../interfaces/book.interface';

@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.css']
})
export class BookModalComponent implements OnInit {

  formBook: IBook;
  dialogTitle: string;

  // Validators
  maxDate: Date = new Date(Date.now());

  bookFormGroup: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<BookModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: IBook) {
    // initialise all form controls and add validators
    this.bookFormGroup = new FormGroup({
      authorFormControl: new FormControl('', [
        Validators.required,
        Validators.pattern('[A-Za-z() 0-9,.]+')]),

      titleFormControl: new FormControl('', [
        Validators.required,
        Validators.pattern('[A-Za-z() 0-9,.]+')]),

      dateFormControl: new FormControl('', [
        Validators.required]),

      imageUrlFormControl: new FormControl('', [
        Validators.required]),

      descriptionFormControl: new FormControl('', [
        Validators.required])
    });
  }

  ngOnInit() {
    // if we get data bind to form model else init empty model for form.
    if (this.data) {
      this.formBook = Object.assign({}, this.data);
      this.formBook.date = new Date(this.data.date);
    } else {
      this.dialogTitle = 'Create New Book';
      this.formBook = {
        id: null,
        title: null,
        author: null,
        description: null,
        date: null,
      };
    }
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  saveBook() {
    this.dialogRef.close(this.formBook);
  }

}
