import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  products = signal<any[]>([]);
  categoryId: string = '';
  readonly imageBaseUrl = 'http://localhost:8090/images/';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['categoryId']; 
      
      if (id) {
        this.categoryId = id;
        this.cartService.refreshCart();
        this.loadProducts(this.categoryId);
      }
    });
  }

  loadProducts(id: string) {
    this.productService.getProductsByCategory(id).subscribe({
      next: (data) =>
      {
        this.products.set(data);
      },
      error:(err) => {
        this.products.set([]);
      }
    })
  }
}