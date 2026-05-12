// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../services/category.service'; 
import { CartService } from '../services/cart.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  categories = signal<any[]>([]);
  readonly imageBaseUrl = 'http://localhost:8090/images/';

  constructor(private categoryService: CategoryService, private cartService:CartService) {}

  ngOnInit(): void {
    console.log(this.categories());
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        console.log(this.categories());
        this.cartService.refreshCart();

      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  
}