import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthState } from 'src/app/Auth/reducers/auth.reducer';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  category: CategoryDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  css_color: UntypedFormControl;

  categoryForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private categoryId: string | null;

  authState$: Observable<AuthState>;
  private subscription: Subscription = new Subscription();
  userid: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private store: Store<{ auth: AuthState }>,
  ) {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;
    this.authState$ = this.store.select('auth');

    this.title = new UntypedFormControl(this.category.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new UntypedFormControl(this.category.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.css_color = new UntypedFormControl(this.category.css_color, [
      Validators.required,
      Validators.maxLength(7),
    ]);

    this.categoryForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      css_color: this.css_color,
    });
  }

  ngOnInit(): void {
    let errorResponse: any;
    if (this.categoryId) {
      this.isUpdateMode = true;
      this.categoryService.getCategoryById(
        this.categoryId
      ).subscribe((category: CategoryDTO) => {
        this.category = category;
        this.title.setValue(this.category.title);

        this.description.setValue(this.category.description);

        this.css_color.setValue(this.category.css_color);

        this.categoryForm = this.formBuilder.group({
          title: this.title,
          description: this.description,
          css_color: this.css_color,
        })
      }),
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse)
        }
    }
  }

  private editCategory(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    this.subscription.add(
      this.authState$.subscribe((state: AuthState) => {
        if (state.credentials && state.credentials.user_id) {
          this.userid = state.credentials.user_id;
          if (this.userid && this.categoryId) {
            this.category.userId = this.userid;
            this.categoryService.updateCategory(this.categoryId, this.category)
              .pipe(
                finalize(async () => {
                  await this.sharedService.managementToast(
                    'categoryFeedback',
                    responseOK,
                    errorResponse
                  );
                  if (responseOK) {
                    this.router.navigateByUrl('categories');
                  }
                })
              )
              .subscribe(() => {
                responseOK = true;
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

  private createCategory(): void {
    let errorResponse: any;
    let responseOK: boolean = false;
    this.subscription.add(
      this.authState$.subscribe((state: AuthState) => {
        if (state.credentials && state.credentials.user_id) {
          this.userid = state.credentials.user_id;
          this.category.userId = this.userid;
          this.categoryService.createCategory(this.category)
            .pipe(
              finalize(async () => {
                await this.sharedService.managementToast(
                  'categoryFeedback',
                  responseOK,
                  errorResponse
                );
                if (responseOK) {
                  this.router.navigateByUrl('categories');
                }
              })
            )
            .subscribe(() => {
              responseOK = true;
            }),
            (error: HttpErrorResponse) => {
              errorResponse = error.error;
              this.sharedService.errorLog(errorResponse)
            }
        }
      })
    );
  }

  async saveCategory() {
    this.isValidForm = false;

    if (this.categoryForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.category = this.categoryForm.value;

    if (this.isUpdateMode) {
      this.editCategory();
    } else {
      this.createCategory();
    }
  }
}
