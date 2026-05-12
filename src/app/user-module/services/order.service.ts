import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UserProfile, UserService } from './user.service';
import { Observable } from 'rxjs';

export interface OrderDetails {
  fullName: string;
  mobileNumber: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
  cardType: string;
  cardNumber: string;
  expiryDate: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private checkoutUrl = 'http://localhost:8090/api/orders/checkout';
  private userOrdersUrl = 'http://localhost:8090/api/orders/user';

  userData : UserProfile | null | undefined;


  constructor(private http: HttpClient, private userService: UserService) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // Fetch orders for a specific user
  getUserOrders(userId: string) {
    return this.http.get<any[]>(`${this.userOrdersUrl}/${userId}`, { headers: this.getHeaders() });
  }

  getAllVariants(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8090/api/variants/search');
}

  // Submit the order
  postOrder(userId: string, payload: OrderDetails) {
    return this.http.post(`${this.checkoutUrl}/${userId}`, payload, { headers: this.getHeaders() });
  }


resetOrderSignal(): OrderDetails | null {
  const userData = this.userService.userSignal();
  
  // Log this to see if it's null in your console
  console.log('User data in Service:', userData);

  if (!userData) return null;

  const defaultOrder: OrderDetails = {
    fullName: userData.userName,
    mobileNumber: userData.phNo,
    address: userData.address,
    city: userData.city,
    pincode: userData.pincode,
    state: userData.state,
    country: userData.country,
    cardType: 'Visa',
    cardNumber: '',
    expiryDate: ''
  };
  
  localStorage.setItem('temp_order', JSON.stringify(defaultOrder));
  return defaultOrder;
}
}