import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryItemsService {
  headers = { 'content-type': 'application/json' };
  constructor(private http: HttpClient) {}

  getDropdownList(): Observable<any> {
    return this.http.get(
      environment.API +
        `/categoryitems/GetCategoryList
      `
    );
  }

  postCategory(data: any): Observable<any> {
    return this.http.post(
      environment.API + `/categoryitems/CreateCategoryItem`,
      data,
      {
        headers: this.headers,
        responseType: 'json',
      }
    );
  }
  getAllCategories(): Observable<any> {
    return this.http.get(
      environment.API + `/categoryitems/GetAllCategoryItems`
    );
  }
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(
      environment.API + `/categories/DeleteCategory/${id}`
    );
  }

  editCategory(id: number, data: {}): Observable<any> {
    return this.http.put(
      environment.API + `/categories/UpdateCategory/${id}`,
      data
    );
  }
}
