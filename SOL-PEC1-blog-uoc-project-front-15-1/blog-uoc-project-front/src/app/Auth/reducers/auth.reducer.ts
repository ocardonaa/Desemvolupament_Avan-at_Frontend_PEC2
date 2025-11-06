import { createReducer, on } from "@ngrx/store";
import { Auth } from "../models/auth.dto";
import { login, loginFailure, loginSuccess, logout } from "../actions/auth.actions";

export interface AuthState {
    credentials: Auth;
    loading: boolean;
    loaded: boolean;
    error: any;
}

export const initialState: AuthState = {
    credentials: new Auth('', '', '', ''),
    loading: false,
    loaded: false,
    error: null
};

const _authReducer = createReducer(
    initialState,
    on(login, (state) => ({
        ...state,
        loading: true,
        loaded: false,
        error: null
    })),
    on(loginSuccess, (state, { auth }) => ({
        ...state,
        credentials: auth,
        loading: false,
        loaded: true,
        error: null
    })),
    on(loginFailure, (state, { payload }) => ({
        ...state,
        loading: false,
        loaded: false,
        error: { payload }
    })),
    on(logout, () => ({
        ...initialState, 
        loading: false, 
        loaded: false, 
        error: null
    }))
);

export function authReducer(state: any, action: any) {
    return _authReducer(state, action);
}