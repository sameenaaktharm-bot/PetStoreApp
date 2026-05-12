import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './myOrders.component.html',
  styleUrl: './myOrders.component.css'
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  
  readonly imageBaseUrl = 'http://localhost:8090/images/';
  
  orders = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loadCompleteData(userId);
    }
  }

  loadCompleteData(userId: string) {
    // Fetch both orders and all variants simultaneously
    forkJoin({
      orders: this.orderService.getUserOrders(userId),
      variants: this.orderService.getAllVariants()
    }).subscribe({
      next: ({ orders, variants }) => {
        // Map variant images into the order items
        const enrichedOrders = orders.map(order => ({
          ...order,
          items: order.items.map((item: any) => {
            const variantDetails = variants.find(v => v.variantId === item.variantId);
            return {
              ...item,
              imageUrl: variantDetails ? variantDetails.imageUrl : 'default.jpg',
              name: variantDetails ? variantDetails.name : 'Unknown Product'
            };
          })
        }));

        this.orders.set(enrichedOrders.reverse()); // Newest first
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.isLoading.set(false);
      }
    });
  }
}