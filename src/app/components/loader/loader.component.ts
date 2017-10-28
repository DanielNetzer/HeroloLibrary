import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Interceptor } from '../../services/interceptor/interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-loader',
  templateUrl: 'loader.component.html',
  styleUrls: ['loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {

  show = false;
  private loaderSubscription: Subscription;

  constructor(
    @Inject(HTTP_INTERCEPTORS) private httpInterceptor: Interceptor
  ) { }

  ngOnInit() {
    this.loaderSubscription = this.httpInterceptor[1].$loadingState
      .subscribe((state: boolean) => {
        this.show = state;
      }, (err) => {
        console.error(err);
      });
  }

  ngOnDestroy() {
    this.loaderSubscription.unsubscribe();
  }
}
