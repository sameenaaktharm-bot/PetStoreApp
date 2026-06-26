import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { HttpClient} from '@angular/common/http'; 
import { jwtDecode } from 'jwt-decode';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private cartService: CartService 
  ) {}
 
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
 
  onLogin(): void {
  if (this.loginForm.valid) {
    const { username, password } = this.loginForm.value;
    const loginPayload = { email: username, password: password };
    const apiUrl = 'http://localhost:8090/api/login';

    this.http.post<{token: string}>(apiUrl, loginPayload).subscribe({
      next: (response: {token: string}) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', username);

        const decoded: any = jwtDecode(response.token);
        console.log('Decoded Token:', decoded);

        const roles = decoded.role || decoded.authorities || [];
        const isAdmin = roles.includes('ROLE_ADMIN');

        this.userService.loadUserDetails().subscribe({
          next: (userData) => {
            this.cartService.refreshCart();
            
            if (isAdmin) {
              console.log('Redirecting to Admin Side');
              this.router.navigate(['/admin/categories']);
            } else {
              console.log('Redirecting to User Side');
              this.router.navigate(['/']);
            }
          },
          error: (err) => console.error('Failed to load user details', err)
        });
      },
      error: (err: any) => {
        const errorMessage = typeof err.error === 'string' ? err.error : 'Invalid credentials';
        alert(errorMessage);
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
  }
}
}