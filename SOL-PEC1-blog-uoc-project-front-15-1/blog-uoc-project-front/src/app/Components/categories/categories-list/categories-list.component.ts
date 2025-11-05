import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthState } from 'src/app/Auth/reducers/auth.reducer';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent {
  categories!: CategoryDTO[];
  authState$: Observable<AuthState>;
  private subscription: Subscription = new Subscription();
  userid: string = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private store: Store<{ auth: AuthState }>,
    private sharedService: SharedService
  ) {
    this.authState$ = this.store.select('auth');
    this.loadCategories();
  }

  private loadCategories(): void {
    let errorResponse: any;
    this.subscription.add(
      this.authState$.subscribe((state: AuthState) => {
        if (state.credentials && state.credentials.user_id) {
          this.userid = state.credentials.user_id;
          this.categoryService.getCategoriesByUserId(
            this.userid
          ).subscribe((categories: CategoryDTO[]) => {
            this.categories = categories;
          }),
            (error: HttpErrorResponse) => {
              errorResponse = error.error;
              this.sharedService.errorLog(errorResponse)
            }
        }
      })
    );
  }

  createCategory(): void {
    this.router.navigateByUrl('/user/category/');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  deleteCategory(categoryId: string): void {
    let errorResponse: any;

    // show confirmation popup
    let result = confirm('Confirm delete category with id: ' + categoryId + ' .');
    if (result) {
      this.categoryService.deleteCategory(categoryId).subscribe(() => {
        this.loadCategories();
      }),
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
    }
  }
}
