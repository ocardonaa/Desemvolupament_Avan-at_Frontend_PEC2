import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthState } from '../Auth/reducers/auth.reducer';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  private access_token$ = new BehaviorSubject<string | null>(null);
  private subscription: Subscription = new Subscription();
  constructor(private store: Store<{ auth: AuthState }>) {
    this.subscription.add(
      this.store.select('auth').subscribe((state: AuthState) => {
        const token = state?.credentials?.access_token || null;
        this.access_token$.next(token);
      })
    );
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const access_token = this.access_token$.value;
    if (access_token) {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });
    }
    return next.handle(req);
  }
}
