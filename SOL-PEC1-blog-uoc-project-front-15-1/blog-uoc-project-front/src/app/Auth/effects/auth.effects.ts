import { Injectable } from '@angular/core';
import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private authService: AuthService) { }
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap(({ auth }) =>
                this.authService.login(auth).pipe(
                    map((resp) => AuthActions.loginSuccess({ auth: resp })),
                    catchError((error) => of(AuthActions.loginFailure(error)))
                )
            )
        )
    );
}