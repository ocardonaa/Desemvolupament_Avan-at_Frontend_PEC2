import { createAction, props } from "@ngrx/store";
import { Auth } from "../models/auth.dto";
import { HttpErrorResponse } from "@angular/common/http";

export const login = createAction(
    '[AUTH] login',
    props<{ auth: Auth }>()
);

export const loginSuccess = createAction(
    '[AUTH] login Success',
    props<{ auth: Auth }>()
);

export const loginFailure = createAction(
    '[AUTH] login Failure',
    props<{ payload: HttpErrorResponse }>()
);

export const logout = createAction('[AUTH] logout');