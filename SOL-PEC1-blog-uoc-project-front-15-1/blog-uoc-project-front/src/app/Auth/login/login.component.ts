import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Auth } from '../models/auth.dto';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';
import { login } from '../actions/auth.actions';

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

  constructor(
    private store: Store<AuthState>,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.loginUser = new Auth('', '', '', '');

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

  ngOnInit(): void {
    //this.store.select('auth').subscribe(loginUser -> this.loginUser = loginUser)
  }

  login(): void {
    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;
    this.store.dispatch(login({ auth: this.loginUser }))
    /*
    let responseOK: boolean = false;
    let errorResponse: any;

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;

    this.authService.login(this.loginUser).pipe(
      finalize(async () => {
        await this.sharedService.managementToast(
          'loginFeedback',
          responseOK,
          errorResponse
        );
        if (responseOK) {
          const headerInfo: HeaderMenus = {
            showAuthSection: true,
            showNoAuthSection: false,
          };
          // update options menu
          this.headerMenusService.headerManagement.next(headerInfo);
          this.router.navigateByUrl('home');
        }
      })
    ).subscribe((authToken) => {
      responseOK = true;
      this.loginUser.user_id = authToken.user_id;
      this.loginUser.access_token = authToken.access_token;
      // save token to localstorage for next requests
      this.localStorageService.set('user_id', this.loginUser.user_id);
      this.localStorageService.set('access_token', this.loginUser.access_token)
    }),
      (error: HttpErrorResponse) => {
        responseOK = false;
        errorResponse = error.error;
        const headerInfo: HeaderMenus = {
          showAuthSection: false,
          showNoAuthSection: true,
        };
        this.headerMenusService.headerManagement.next(headerInfo);

        this.sharedService.errorLog(error.error);
      }
        */
  }
}
