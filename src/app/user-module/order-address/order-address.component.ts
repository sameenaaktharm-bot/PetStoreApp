import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { CartService } from '../services/cart.service';
import { OrderService, OrderDetails } from '../services/order.service';

@Component({
  selector: 'app-order-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './order-address.component.html',
  styleUrls: ['./order-address.component.css']
})
export class OrderAddressComponent implements OnInit {
  orderForm!: FormGroup;
  data!: OrderDetails | null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private orderService: OrderService,
    private cartService: CartService 
  ) {}

ngOnInit(): void {
  this.initForm();
  this.cartService.refreshCart();
  const savedData = localStorage.getItem('temp_order');
  
  if (savedData) {
    // If we have local storage, we are good to go!
    const parsedData = JSON.parse(savedData);
    this.patchFormWithOrderData(parsedData);
  } 
  else {
    // No local storage? Check if User Signal is ready
    if (this.userService.userSignal()) {
      this.data = this.orderService.resetOrderSignal();
      console.log(this.data)
      if (this.data) this.patchFormWithOrderData(this.data);
    } else {
      // User Signal is empty (Refresh scenario), fetch it first!
      this.userService.loadUserDetails().subscribe({
        next: () => {
          this.data = this.orderService.resetOrderSignal();
          if (this.data) this.patchFormWithOrderData(this.data);
        }
      });
    }
  }
}


  initForm(): void {
    this.orderForm = this.fb.group({
      // Payment Details
      cardType: ['Visa', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/\\d{4}$')]],
      
      // Shipping/Billing Details
      fullName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  /**
   * Maps OrderDetails interface fields to Form Control names
   */
  private patchFormWithOrderData(data: OrderDetails) {
    this.orderForm.patchValue({
      fullName: data.fullName,
      mobile: data.mobileNumber,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.pincode,
      country: data.country,
      cardType: data.cardType,
      cardNumber: data.cardNumber,
      expiryDate: data.expiryDate
    });
  }

  onContinue(): void {
    if (this.orderForm.valid) {
      const formData = this.orderForm.value;

      // Map the form values back into the OrderDetails structure
      const updatedOrder: OrderDetails = {
        fullName: formData.fullName,
        mobileNumber: formData.mobile,
        address: formData.address,
        city: formData.city,
        pincode: formData.zip,
        state: formData.state,
        country: formData.country,
        cardType: formData.cardType,
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate
      };

      localStorage.setItem('temp_order', JSON.stringify(updatedOrder));
      // Proceed to the next step
      this.router.navigate(['cart/orderConfirmation']);
    } else {
      // Highlight errors if the form is invalid
      this.orderForm.markAllAsTouched();
    }
  }
}