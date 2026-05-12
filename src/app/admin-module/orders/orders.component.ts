import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchUserId: string = '';
  filterDate: string = '';
  filterStatus: string = '';
  selectedOrder: any = null;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetchAllOrders();
  }

  fetchAllOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data.map((o: any) => ({
          ...o,
          status: o.status || 'PENDING',
          orderDate: o.created_at || o.createdAt,
        }));
        this.filteredOrders = [...this.orders];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading all orders', err),
    });
  }

  fetchOrders() {
    if (!this.searchUserId) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(
        (order) => order.userId?.toString() === this.searchUserId.trim(),
      );
    }
    this.cdr.detectChanges();
  }

  applyFilters() {
    let temp = [...this.orders];

    if (this.filterDate) {
      temp = temp.filter((order) => {
        if (!order.orderDate) return false;
        return order.orderDate.startsWith(this.filterDate);
      });
    }

    if (this.filterStatus) {
      temp = temp.filter((o) => o.status === this.filterStatus);
    }

    this.filteredOrders = temp;
    this.cdr.detectChanges();
  }

  viewOrder(order: any) {
    this.selectedOrder = { ...order };
  }

  updateStatus() {
    if (!this.selectedOrder || !this.selectedOrder.orderId) return;

    this.orderService
      .updateStatus(this.selectedOrder.orderId, this.selectedOrder.status)
      .subscribe({
        next: () => {
          alert('Status updated successfully!');
          this.fetchAllOrders();
          this.selectedOrder = null;
          this.fetchAllOrders();
        },
        error: (err) => alert('Update failed: Check Admin permissions.'),
      });
  }
}
