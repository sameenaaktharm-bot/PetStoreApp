import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router'; // Added Router
import { VariantService } from '../services/variant.service';
import { CartService } from '../services/cart.service'; // Adjust path as needed

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  private variantService = inject(VariantService);
  private cartService = inject(CartService); // Inject CartService
  private route = inject(ActivatedRoute);
  private router = inject(Router); // Inject Router for redirection

  items = signal<any[]>([]);
  product = signal<any>(null); 
  categoryId = signal<string | null>(null);

  readonly imageBaseUrl = 'http://localhost:8090/images/';

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    const productId = this.route.snapshot.paramMap.get('productId');
    this.cartService.refreshCart();
    this.categoryId.set(categoryId);
    

    if (productId) {
      this.variantService.getProductById(productId).subscribe({
        next: (prodData) => this.product.set(prodData),
        error: (err) => console.error('Error fetching product:', err)
      });

      this.variantService.getVariantsByProductId(productId).subscribe({
        next: (itemsData) => this.items.set(itemsData),
        error: (err) => console.error('Error fetching variants:', err)
      });
    }
  }



  // New Method to handle Add to Cart
  onAddToCart(variantId: string): void {

    const selectedItem = this.items().find(i => i.variantId === variantId);
    if (selectedItem && selectedItem.stockQuantity <= 0) {
        return; // Exit silently or show an alert
    }
      
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Please login to add items to the cart');
      this.router.navigate(['/login']);
      return;
    }

    const defaultQuantity = 1;

    this.cartService.addToCart(userId, variantId, defaultQuantity).subscribe({
      next: (response) => {
        console.log('Item added to cart:', response);
        this.cartService.refreshCart();
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        alert('Failed to add item to cart. Please try again.');
      }
    });
  }
}