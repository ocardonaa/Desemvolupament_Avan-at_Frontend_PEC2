import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryDTO } from '../Models/category.dto';
import { Observable } from 'rxjs';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'categories';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getCategoriesByUserId(userId: string): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>('http://localhost:3000/users/categories/' + userId);
  }

  createCategory(category: CategoryDTO): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(this.urlBlogUocApi, category);
  }

  getCategoryById(categoryId: string): Observable<CategoryDTO> {
    return this.http.get<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId);
  }

  updateCategory(categoryId: string, category: CategoryDTO): Observable<CategoryDTO> {
    return this.http.put<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId, category);
  }

  // delete category (si esta vinculada a un post no dixarem eliminar)
  deleteCategory(categoryId: string): Observable<deleteResponse> {
    return this.http.delete<deleteResponse>(this.urlBlogUocApi + '/' + categoryId);
  }
}
