import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router'; // Added Router
import { VariantService } from '../services/variant.service'; 
import { CartService } from '../services/cart.service'; // Added CartService

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.css'
})
export class ItemDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private variantService = inject(VariantService);
  private cartService = inject(CartService); // Inject the Service

  item = signal<any | null>(null);
  product = signal<any>(null); 
  quantity = signal<number>(1);
  
  readonly imageBaseUrl = 'http://localhost:8090/images/';
  categoryId = '';
  productId = '';

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId') || '';
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    const itemId = this.route.snapshot.paramMap.get('itemId');

    this.cartService.refreshCart();

    if (this.productId && itemId) {
      this.variantService.getProductById(this.productId).subscribe({
        next: (prodData) => this.product.set(prodData),
        error: (err) => console.error('Error fetching product:', err)
      });
      this.fetchAndFilterItem(this.productId, itemId);
    }
  }

  fetchAndFilterItem(productId: string, itemId: string) {
    this.variantService.getVariantsByProductId(productId).subscribe({
      next: (variants: any[]) => {
        const foundItem = variants.find(v => v.variantId === itemId);
        if (foundItem) {
          this.item.set(foundItem);
        }
      },
      error: (err) => console.error('Error fetching variants:', err)
    });
  }

  increaseQuantity() {
    const currentItem = this.item();
    // Logic: Don't exceed 10 or the available stock quantity
    if (currentItem && this.quantity() < Math.min(10, currentItem.stockQuantity)) {
      this.quantity.update(v => v + 1);
    }
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(v => v - 1);
    }
  }

  addToCart() {
    const userId = localStorage.getItem('userId');
    const currentItem = this.item();

    // 1. Safety Guard: Check stock before proceeding
    if (!currentItem || currentItem.stockQuantity <= 0) {
        return;
    }

    if (!userId) {
      alert('Please login to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }

    if (currentItem) {
      this.cartService.addToCart(userId, currentItem.variantId, this.quantity()).subscribe({
        next: (response) => {
          console.log('Added to cart:', response);
          
          // --- THE CRITICAL STEP ---
          // This refreshes the Signal in the Service, which triggers the Navbar update
          this.cartService.refreshCart(); 
        },
        error: (err) => {
          console.error('Add to cart failed:', err);
          alert('Could not add item to cart. Please try again.');
        }
      });
    }
  }
}