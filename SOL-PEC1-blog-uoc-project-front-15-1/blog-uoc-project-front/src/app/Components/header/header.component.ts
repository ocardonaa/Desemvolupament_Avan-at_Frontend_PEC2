import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { logout } from 'src/app/Auth/actions/auth.actions';
import { AuthState } from 'src/app/Auth/reducers/auth.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showAuthSection: boolean;
  showNoAuthSection: boolean;
  authState$: Observable<AuthState>;
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private store: Store<{ auth: AuthState }>,
  ) {
    this.showAuthSection = false;
    this.showNoAuthSection = true;
    this.authState$ = this.store.select('auth');
  }

  ngOnInit(): void {
    this.store.select('auth').subscribe(state => {
      if (state.credentials && state.credentials.user_id) {
        this.showAuthSection = true;
        this.showNoAuthSection = false;
      }
    })
  }

  dashboard(): void {
    this.router.navigateByUrl('dashboard');
  }

  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  adminPosts(): void {
    this.router.navigateByUrl('posts');
  }

  adminCategories(): void {
    this.router.navigateByUrl('categories');
  }

  profile(): void {
    this.router.navigateByUrl('profile');
  }

  logout(): void {
    this.showAuthSection = false;
    this.showNoAuthSection = true;
    this.store.dispatch(logout());
    this.router.navigateByUrl('home');
  }
}
