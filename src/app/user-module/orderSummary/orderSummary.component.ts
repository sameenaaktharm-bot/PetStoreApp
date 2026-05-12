// order-summary.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orderSummary.component.html',
  styleUrl: './orderSummary.component.css'
})
export class OrderSummaryComponent implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  readonly imageBaseUrl = 'http://localhost:8090/images/';
  
  // Use a single signal for the entire order object
  currentOrder = signal<any>(null);
  isLoading = signal(true);

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    // Check if orderId was passed in the URL (e.g., ?orderId=5)
    const paramId = this.route.snapshot.queryParamMap.get('orderId');

    if (userId) {
      this.loadOrderData(userId, paramId);
    }
  }

  loadOrderData(userId: string, paramId: string | null) {
    forkJoin({
      orders: this.orderService.getUserOrders(userId),
      variants: this.orderService.getAllVariants()
    }).subscribe({
      next: ({ orders, variants }) => {
        let selectedOrder;

        if (paramId) {
          // 1. If coming from Order History, find the matching ID
          selectedOrder = orders.find(o => o.orderId.toString() === paramId);
        } else {
          // 2. If coming from Confirmation, get the latest (highest ID or last in list)
          selectedOrder = orders.reduce((prev, current) => (prev.orderId > current.orderId) ? prev : current);
        }

        if (selectedOrder) {
          // Enrich items with variant details (names/images)
          selectedOrder.enrichedItems = selectedOrder.items.map((item: any) => {
            const v = variants.find(varnt => varnt.variantId === item.variantId);
            return {
              ...item,
              name: v ? v.name : 'Product',
              imageUrl: v ? v.imageUrl : ''
            };
          });
          this.currentOrder.set(selectedOrder);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  printPage() {
    window.print();
  }

  clear() {
    // No longer needing to clear localStorage as we use the database!
    console.log('Navigating back to shop...');
  }
}