import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];

  selectedCategoryId: number | null = null;

  productForm = {
    productId: '',
    name: '',
    description: '',
    categoryId: null as number | null,
  };

  selectedFile: File | null = null;
  isEditMode = false;
  showModal = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.categories = data;
          if (this.categories.length > 0) {
            this.selectedCategoryId = Number(this.categories[0].categoryId);
            this.loadProducts();
          }
        } else {
          console.warn('Received empty or invalid category data:', data);
          this.categories = [];
        }
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.categories = [];
      },
    });
  }

  loadProducts() {
    if (this.selectedCategoryId) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe({
        next: (data) => {
          this.products = [...data];
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading products', err),
      });
    }
  }

  onCategoryChange() {
    this.loadProducts();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  openModal() {
    this.isEditMode = false;
    this.resetFormFields();
    this.productForm.categoryId = this.selectedCategoryId;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetFormFields();
  }

  onSubmit() {
    if (!this.productForm.categoryId) {
      return alert('Please select a category for this product.');
    }

    const dataToSend = {
      productId: this.productForm.productId,
      name: this.productForm.name,
      description: this.productForm.description,
    };

    if (this.isEditMode) {
      this.productService
        .updateProduct(this.productForm.productId, dataToSend, this.selectedFile)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeModal();
          },
          error: (err) => console.error('Update failed', err),
        });
    } else {
      if (!this.selectedFile) return alert('Select an image.');
      this.productService
        .addProduct(this.productForm.categoryId, dataToSend, this.selectedFile)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeModal();
          },
          error: (err) => console.error('Add failed', err),
        });
    }
  }

  editProduct(prod: any) {
    this.isEditMode = true;
    this.productForm = {
      productId: prod.productId,
      name: prod.name,
      description: prod.description,
      categoryId: this.selectedCategoryId,
    };
    this.showModal = true;
  }

  deleteProduct(id: string) {
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  resetFormFields() {
    this.productForm = { productId: '', name: '', description: '', categoryId: null };
    this.selectedFile = null;
  }
}
