import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState } from '../Auth/reducers/auth.reducer';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  authState$: Observable<AuthState>;
  constructor(
    private router: Router,
    private store: Store<{ auth: AuthState }>,
  ) {
    this.authState$ = this.store.select('auth');
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    return this.authState$.pipe(
      map((authState: AuthState) => {
        const hasToken = !!(authState?.credentials?.access_token);
        return hasToken;
      }),
      tap((hasToken: boolean) => {
        if (!hasToken) {
          this.router.navigateByUrl('login');
        }
      })
    );
  }
}
