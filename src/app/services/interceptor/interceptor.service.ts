import { Injectable } from '@angular/core';

import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/from';

@Injectable()
export class Interceptor implements HttpInterceptor {
    //#region  members
    private _loadingState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public $loadingState: Observable<boolean> = this._loadingState.asObservable();
    //#endregion

    //#region constructor
    constructor() { }
    //#endregion

    //#region implementation
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // show loader
        this._loadingState.next(true);

        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // hide loader
                this._loadingState.next(false);
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                // hide loader
                this._loadingState.next(false);

                // handle http errors here
                if (err.status === 401) {

                }
            }
        });
    }
    //#endregion
}
