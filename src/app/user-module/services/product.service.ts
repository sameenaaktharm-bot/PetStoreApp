import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8090/api/products/category';

  constructor(private http: HttpClient) {}

  getProductsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${categoryId}`);
  }
}

