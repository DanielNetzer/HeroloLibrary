import { Directive, forwardRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NG_VALIDATORS } from '@angular/forms';
import { IBook } from '../interfaces/book.interface';
import { BooksService } from '../services/books/books.service';

function duplicateTitleValidator(books: IBook[], firstCheck: boolean) {
    let originalBookTitle: string;

    return (control: FormControl) => {

        if (firstCheck && control.value) {

            if (books.find((book) => book.title === control.value)) {
                originalBookTitle = books.find((book) => book.title === control.value).title;
            }

            firstCheck = false;
        }

        // if no collection or collection size is equal to 0 then the value is valid
        if (!books || books.length <= 0) {
            return null;
        }

        const bookWithGivenTitle = books.find((book) => book.title === control.value);

        // if not found a book with the same title then the value is valid
        if (!bookWithGivenTitle || originalBookTitle === control.value) {
            return null;
        }

        return {
            appDuplicateTitle: {
                valid: false
            }
        };
    };

}

@Directive({
    selector: '[appDuplicateTitle][ngModel],[appDuplicateTitle][formControl]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DuplicateTitleValidatorDirective),
            multi: true
        }
    ]
})

export class DuplicateTitleValidatorDirective {
    validator: Function;

    constructor(public bService: BooksService) {
        this.validator = duplicateTitleValidator(bService.allBooks, true);
    }

    validate(control: FormControl) {
        return this.validator(control);
    }
}


