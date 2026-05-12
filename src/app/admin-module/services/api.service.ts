import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  addCategory(categoryObj: any, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('category', JSON.stringify(categoryObj));
    formData.append('image', image);
    return this.http.post(`${this.baseUrl}/categories`, formData);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  getProductsByCategory(catId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products/category/${catId}`);
  }

  addProduct(catId: number, productObj: any, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('product', JSON.stringify(productObj));
    formData.append('image', image);
    return this.http.post(`${this.baseUrl}/products/${catId}`, formData);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${productId}`);
  }

  deleteVariant(variantId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/variants/${variantId}`);
  }

  getVariantsByProduct(prodId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/variants/product/${prodId}`);
  }

  addVariant(prodId: number, variantObj: any, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('variant', JSON.stringify(variantObj));
    formData.append('image', image);
    return this.http.post(`${this.baseUrl}/variants/${prodId}`, formData);
  }

  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/user/${userId}`);
  }
}
