import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  posts!: PostDTO[];

  numLikes: number = 0;
  numDislikes: number = 0;

  constructor(
    private postService: PostService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    let errorResponse: any;
    this.postService.getPosts().subscribe((posts: PostDTO[]) => {
      this.posts = posts;
      this.posts.forEach((post) => {
        this.numLikes += post.num_likes;
        this.numDislikes += post.num_dislikes;
      });
    }),
      (error: HttpErrorResponse) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse)
      }
  }
}
