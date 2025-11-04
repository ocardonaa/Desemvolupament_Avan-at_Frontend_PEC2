import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthState } from 'src/app/Auth/reducers/auth.reducer';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  posts!: PostDTO[];
  showButtons: boolean;
  authState$: Observable<AuthState>;
  private subscription: Subscription = new Subscription();
  userid: string = '';

  constructor(
    private postService: PostService,
    private store: Store<{ auth: AuthState }>,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.showButtons = false;
    this.authState$ = this.store.select('auth');
    this.loadPosts();
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
  }

  private loadPosts(): void {
    let errorResponse: any;
    this.subscription.add(
      this.authState$.subscribe((state: AuthState) => {
        if (state.credentials && state.credentials.user_id) {
          this.showButtons = true;
        }
      })
    );
    this.postService.getPosts().subscribe((posts: PostDTO[]) => {
      this.posts = posts;
      this.posts.sort((p1, p2) => p1.postId.localeCompare(p2.postId)); // esto evita que al dar un like el orden de los posts cambie
    }),
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse)
      }
  }

  like(postId: string): void {
    let errorResponse: any;
    this.postService.likePost(postId).subscribe(() => {
      this.loadPosts();
    }),
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse)
      }
  }

  dislike(postId: string): void {
    let errorResponse: any;
    this.postService.dislikePost(postId).subscribe(() => {
      this.loadPosts();
    }),
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse)
      }
  }
}
