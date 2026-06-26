import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8090/api/cart';

  cartItems = signal<any[]>([]);

  subtotal = computed(() => {
    return this.cartItems().reduce((acc, item) => 
      acc + (item.productVariant.price * item.quantity), 0
    );
  });

  cartCount = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  refreshCart(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.cartItems.set([]); 
      return;
    }

    this.getCart(userId).subscribe({
      next: (data: any) => {
        this.cartItems.set(data.items || []);
        console.log('Cart loaded:', this.cartItems());   
        console.log('Subtotal:', this.subtotal());
      },
      error: (err) => console.error('Auto-refresh failed', err)
    });
  }

  getCart(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}`, {
      headers: this.getHeaders()
    });
  }

  addToCart(userId: string, variantId: string, quantity: number): Observable<any> {
    const params = new HttpParams()
      .set('variantId', variantId)
      .set('quantity', quantity.toString());

    return this.http.post(`${this.baseUrl}/${userId}/add`, null, {
      headers: this.getHeaders(),
      params: params
    });
  }

  updateCart(userId: string, cartItemId: string, variantId: string, quantity: number): Observable<any> {
    const params = new HttpParams()
      .set('variantId', variantId)
      .set('quantity', quantity.toString());

    return this.http.put(`${this.baseUrl}/${userId}/item/${cartItemId}`, null, {
      headers: this.getHeaders(),
      params: params
    });
  }

  deleteItem(userId: string, cartItemId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/item/${cartItemId}`, {
      headers: this.getHeaders()
    });
  }
}