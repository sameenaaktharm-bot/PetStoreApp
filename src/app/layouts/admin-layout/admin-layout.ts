import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../admin-module/navbar/navbar.component';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css'],
  imports: [NavbarComponent, RouterOutlet, CommonModule],
})
export class AdminLayoutComponent implements OnInit {
  title = 'PetStore-Admin-Panel';

  constructor(private router: Router) {}

ngOnInit(): void {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Security Check: No token found in LocalStorage.');
    this.router.navigate(['/login']);
    return;
  }

  try {
    const decoded: any = jwtDecode(token);
    const roles = decoded.role || decoded.authorities || [];
    
    if (!roles.includes('ROLE_ADMIN')) {
      console.warn('Forbidden: User does not have ROLE_ADMIN');
      this.router.navigate(['/login']);
    }
  } catch (err) {
    console.error('Token validation failed', err);
    this.router.navigate(['/login']);
  }
}
}
