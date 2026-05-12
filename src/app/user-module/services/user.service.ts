import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';

export interface UserProfile {
  userId: string;
  userName: string;
  email: string;
  phNo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private profileApi = 'http://localhost:8090/api/user/me';
  private updateUrl = 'http://localhost:8090/api/user/update';
  
  // This signal will be accessible by any component (Header, Profile, etc.)
  userSignal = signal<UserProfile | null>(null);

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // Method to fetch user details and update the signal
  loadUserDetails() {
    return this.http.get<UserProfile>(this.profileApi, { headers: this.getHeaders() }).pipe(
      tap(userData => {
        this.userSignal.set(userData);
        if (userData.userId) {
          localStorage.setItem('userId', userData.userId.toString());
        }
      })
    );
  }

  // Method to update user and then immediately re-fetch fresh data
  updateUserProfile(payload: any) {
    return this.http.put(this.updateUrl, payload, { 
      headers: this.getHeaders(), 
      responseType: 'text' 
    }).pipe(
      // switchMap ensures we only return the result of the fresh GET call
      switchMap(() => this.loadUserDetails())
    );
  }

  clearUser(){
    this.userSignal.set(null);
  }
}