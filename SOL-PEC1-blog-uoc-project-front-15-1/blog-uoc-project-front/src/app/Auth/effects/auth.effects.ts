import { Injectable } from '@angular/core';
import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Auth } from '../models/auth.dto';
@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private authService: AuthService) { }
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap(({ auth }) =>
                this.authService.login(auth).pipe(
                    map((resp) => {
                        const newAuth = new Auth(resp.user_id, resp.access_token, auth.email, auth.password);
                        return AuthActions.loginSuccess({ auth: newAuth })
                    }),
                    catchError((error) => of(AuthActions.loginFailure(error)))
                )
            )
        )
    );
}