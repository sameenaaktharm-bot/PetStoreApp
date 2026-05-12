import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);

  // Link directly to the shared service signals
  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.subtotal;

  private userId: string = localStorage.getItem('userId') || '';
  readonly imageBaseUrl = 'http://localhost:8090/images/';

  ngOnInit(): void {
    this.cartService.refreshCart();
  }



  updateQuantity(item: any, change: number): void {
    const newQuantity = item.quantity + change;

    // Guard 1: If quantity drops to 0, remove the item
    if (newQuantity <= 0) {
      this.removeFromCart(item);
      return;
    }

    // Guard 2: If increasing, check against stock quantity
    if (change > 0 && newQuantity > item.productVariant.stockQuantity) {
      return; 
    }

    this.cartService.updateCart(this.userId, item.cartItemId, item.productVariant.variantId, newQuantity).subscribe({
      next: () => this.cartService.refreshCart(),
      error: (err) => console.error('Update failed:', err)
    });
  }

  removeFromCart(item: any): void {
    this.cartService.deleteItem(this.userId, item.cartItemId).subscribe({
      next: () => {
        // Optimistic update for immediate UI feel
        this.cartService.cartItems.update(items => 
          items.filter(i => i.cartItemId !== item.cartItemId)
        );
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }
}