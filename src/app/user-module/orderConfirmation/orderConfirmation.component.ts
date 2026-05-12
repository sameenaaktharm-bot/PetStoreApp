// orderConfirmation.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrderService, OrderDetails } from '../services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orderConfirmation.component.html',
  styleUrl: './orderConfirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);

  readonly imageBaseUrl = 'http://localhost:8090/images/';
  
  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;
  
  // Signal to store the order data retrieved from LocalStorage
  orderData = signal<OrderDetails | null>(null);

  currentDateTime = new Date();
  showPopup = false;

  ngOnInit(): void {
    this.cartService.refreshCart();
    this.loadOrderData();
  }

  loadOrderData() {
    const saved = localStorage.getItem('temp_order');
    if (saved) {
      this.orderData.set(JSON.parse(saved));
    }
  }

  confirmOrder() {
  const userId = localStorage.getItem('userId');
  const payload = this.orderData();
  const currentItems = this.cartItems();
  const currentTotal = this.subtotal();

  if (userId && payload) {
    this.orderService.postOrder(userId, payload).subscribe({
      next: () => {
        // 1. Store the "snapshot" for the Summary page
        const summaryData = {
          items: currentItems,
          total: currentTotal,
          orderDate: new Date(),
          shippingDetails: payload
        };

        this.cartItems.set([]);
        
        this.showPopup = true;
      },
      error: (err) => alert('Failed to place order.')
    });
  }
}

  togglePopup() {
    this.showPopup = false;
  }
}