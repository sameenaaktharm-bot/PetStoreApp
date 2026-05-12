import { Component, inject, computed, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../user-module/services/cart.service';
import { CategoryService } from '../../user-module/services/category.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayoutComponent implements OnInit {
  private cartService = inject(CartService);
  private categoryService = inject(CategoryService);

  categories = signal<any[]>([]);

  cartCount = this.cartService.cartCount;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  handleUserClick(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  @ViewChild('searchField') searchField!: ElementRef;
  showSearch = false;

  toggleSearch() {
    this.showSearch = !this.showSearch;

    if (this.showSearch) {
      setTimeout(() => {
        this.searchField.nativeElement.focus();
      }, 100);
    }
  }

  onSearch(event: any) {
    const query = event.target.value;
    if (query) {
      this.router.navigate(['/search', query]);
      if (this.searchField) {
        this.searchField.nativeElement.value = '';
      }
      this.showSearch = false;
    }
  }
}
