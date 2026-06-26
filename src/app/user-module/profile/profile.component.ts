import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { CartService } from '../services/cart.service';

interface UserProfile {
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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  orders: any[] = []; 

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private userService: UserService,
    private cartService: CartService 
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      this.router.navigate(['/login']);
      return;
    }
    this.initForm();
    this.loadOrders();

    const currentData = this.userService.userSignal();
    if (currentData) {
      this.patchForm(currentData);
    } else {
      this.userService.loadUserDetails().subscribe({
        next: (data: UserProfile) => this.patchForm(data)
      });
    }
    this.cartService.refreshCart();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      const payload = {
        userName: formData.userName,
        password: "", 
        email: formData.email,
        phNo: formData.phone,
        address: formData.address, 
        city: formData.city,
        pincode: formData.zip,      
        state: formData.state,
        country: formData.country
      };

      this.userService.updateUserProfile(payload).subscribe({
        next: (updatedUser: UserProfile) => {
          this.patchForm(updatedUser);
          alert('Profile updated successfully!');
        },
        error: (err: any) => {
          console.error('Update failed:', err);
          alert('Failed to update profile.');
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  private patchForm(data: UserProfile): void {
    this.profileForm.patchValue({
      userName: data.userName,
      email: data.email,
      phone: data.phNo,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.pincode,
      country: data.country
    });
  }

  loadOrders(): void {
    this.orders = [
      { id: 'ORD-1001', date: '2024-04-10', total: 45.99, status: 'Delivered' }
    ];
  }


  onLogout(): void {
  this.userService.clearUser();

  this.cartService.cartItems.set([]);

  localStorage.clear();

  this.router.navigate(['/login']);
}
}