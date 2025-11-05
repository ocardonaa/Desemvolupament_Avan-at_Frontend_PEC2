import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthState } from 'src/app/Auth/reducers/auth.reducer';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent {
  posts!: PostDTO[];
  authState$: Observable<AuthState>;
  private subscription: Subscription = new Subscription();
  userid: string = '';

  constructor(
    private postService: PostService,
    private router: Router,
    private store: Store<{ auth: AuthState }>,
    private sharedService: SharedService
  ) {
    this.authState$ = this.store.select('auth');
    this.loadPosts();
  }

  private loadPosts(): void {
    let errorResponse: any;
    this.subscription.add(
      this.authState$.subscribe((state: AuthState) => {
        if (state.credentials && state.credentials.user_id) {
          this.userid = state.credentials.user_id;
          if (this.userid) {
            this.postService.getPostsByUserId(this.userid).subscribe((posts: PostDTO[]) => {
              this.posts = posts;
            }),
              (error: HttpErrorResponse) => {
                errorResponse = error.error;
                this.sharedService.errorLog(errorResponse)
              }
          }
        }
      })
    );

  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  deletePost(postId: string): void {
    let errorResponse: any;

    // show confirmation popup
    let result = confirm('Confirm delete post with id: ' + postId + ' .');
    if (result) {
      this.postService.deletePost(postId).subscribe(() => {
        this.loadPosts();
      }),
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
    }
  }
}

