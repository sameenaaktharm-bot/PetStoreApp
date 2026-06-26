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
  
  currentOrder = signal<any>(null);
  isLoading = signal(true);

  ngOnInit() {
    const userId = localStorage.getItem('userId');
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
          selectedOrder = orders.find(o => o.orderId.toString() === paramId);
        } else {
          selectedOrder = orders.reduce((prev, current) => (prev.orderId > current.orderId) ? prev : current);
        }

        if (selectedOrder) {
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
    console.log('Navigating back to shop...');
  }
}