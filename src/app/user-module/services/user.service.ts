import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  private logoutUrl = 'http://localhost:8090/api/logout';

  userSignal = signal<UserProfile | null>(null);

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

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

  updateUserProfile(payload: any) {
    return this.http.put(this.updateUrl, payload, { 
      headers: this.getHeaders(), 
      responseType: 'text' 
    }).pipe(
      switchMap(() => this.loadUserDetails())
    );
  }

  logoutBackend(): Observable<any> {
    return this.http.post(this.logoutUrl, {}, { responseType: 'json' });
  }

  clearUser(){
    this.userSignal.set(null);
  }
}