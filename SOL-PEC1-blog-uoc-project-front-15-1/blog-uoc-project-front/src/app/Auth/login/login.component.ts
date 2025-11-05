import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Auth } from '../models/auth.dto';
import { Store } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';
import { login } from '../actions/auth.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser: Auth;
  email: UntypedFormControl;
  password: UntypedFormControl;
  loginForm: UntypedFormGroup;
  authState$: Observable<AuthState>;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.loginUser = new Auth('', '', '', '');
    this.authState$ = this.store.select('auth');
    this.email = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void { }

  login(): void {
    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;
    this.loginUser.access_token = '';
    this.loginUser.user_id = '';
    this.store.dispatch(login({ auth: this.loginUser }));
  }
}
