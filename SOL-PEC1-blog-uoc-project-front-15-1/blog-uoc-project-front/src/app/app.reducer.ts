import { ActionReducerMap } from '@ngrx/store';
import { AuthState, authReducer } from './Auth/reducers';
import { AuthEffects } from './Auth/effects/auth.effects';

export interface AppState {
    auth: AuthState;
}

export const appReducers: ActionReducerMap<AppState> = {
    auth: authReducer,
};

export const EffectsArray: any[] = [
    AuthEffects
];