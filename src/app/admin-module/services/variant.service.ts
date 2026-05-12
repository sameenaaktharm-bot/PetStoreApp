import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VariantService {
  private baseUrl = 'http://localhost:8090/api/variants';

  constructor(private http: HttpClient) {}

  getVariantsByProduct(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/product/${productId}`);
  }

  addVariant(productId: string, variantData: any, image: File): Observable<any> {
    const formData = new FormData();

    formData.append('variant', JSON.stringify(variantData));
    formData.append('image', image);

    return this.http.post(`${this.baseUrl}/${productId}`, formData, { responseType: 'text' });
  }

  updateVariant(variantId: string, variantData: any, image: File | null): Observable<any> {
    const formData = new FormData();

    formData.append('variant', JSON.stringify(variantData));
    if (image) {
      formData.append('image', image);
    }

    return this.http.put(`${this.baseUrl}/${variantId}`, formData, { responseType: 'text' });
  }

  deleteVariant(variantId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${variantId}`, { responseType: 'text' });
  }
}
