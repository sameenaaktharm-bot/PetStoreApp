// services/variant.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VariantService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8090/api/variants/product';
  private productApi = 'http://localhost:8090/api/products';

  getVariantsByProductId(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}`);
  }

  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`${this.productApi}/${productId}`);
  }
}