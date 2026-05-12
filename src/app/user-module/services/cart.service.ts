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
      this.cartItems.set([]); // Clear if logged out
      return;
    }

    this.getCart(userId).subscribe({
      next: (data: any) => {
        // Pushing data here triggers the UI update everywhere
        this.cartItems.set(data.items || []);
        console.log('Cart loaded:', this.cartItems());   // ✅ logs after data arrives
        console.log('Subtotal:', this.subtotal());
      },
      error: (err) => console.error('Auto-refresh failed', err)
    });
  }

  // 1. Fetch Cart Items
  getCart(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}`, {
      headers: this.getHeaders()
    });
  }

  // 2. Add Item (Used in Product/Category pages)
  addToCart(userId: string, variantId: string, quantity: number): Observable<any> {
    const params = new HttpParams()
      .set('variantId', variantId)
      .set('quantity', quantity.toString());

    return this.http.post(`${this.baseUrl}/${userId}/add`, null, {
      headers: this.getHeaders(),
      params: params
    });
  }

  // 3. Update Quantity (Used in Cart page)
  updateCart(userId: string, cartItemId: string, variantId: string, quantity: number): Observable<any> {
    const params = new HttpParams()
      .set('variantId', variantId)
      .set('quantity', quantity.toString());

    return this.http.put(`${this.baseUrl}/${userId}/item/${cartItemId}`, null, {
      headers: this.getHeaders(),
      params: params
    });
  }

  // 4. Remove Item
  deleteItem(userId: string, cartItemId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/item/${cartItemId}`, {
      headers: this.getHeaders()
    });
  }
}