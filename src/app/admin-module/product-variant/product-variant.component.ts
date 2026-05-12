import { OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { VariantService } from '../services/variant.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-variant',
  standalone: true,
  templateUrl: './product-variant.component.html',
  styleUrls: ['./product-variant.component.css'],
  imports: [CommonModule, FormsModule],
})
export class VariantComponent implements OnInit {
  categories: any[] = [];
  products: any[] = [];
  variants: any[] = [];

  selectedCategoryId: number | null = null;
  selectedProductId: string | null = null;

  showModal = false;
  isEditMode = false;
  selectedFile: File | null = null;

  variantForm = { variantId: '', name: '', price: 0, description: '', stockQuantity: 0 };

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private variantService: VariantService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data;
      if (this.categories.length > 0) {
        this.selectedCategoryId = this.categories[0].categoryId;
        this.onCategoryChange();
      }
    });
  }

  onCategoryChange() {
    if (this.selectedCategoryId) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe((data) => {
        this.products = [...data];
        this.selectedProductId = this.products.length > 0 ? this.products[0].productId : null;
        this.loadVariants();
        this.cdr.detectChanges();
      });
    }
  }

  loadVariants() {
    if (this.selectedProductId) {
      this.variantService.getVariantsByProduct(this.selectedProductId).subscribe((data) => {
        this.variants = [...data];
        this.cdr.detectChanges();
      });
    } else {
      this.variants = [];
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  deleteVariant(variantId: string) {
    if (confirm('Are you sure you want to delete this variant?')) {
      this.variantService.deleteVariant(variantId).subscribe(() => {
        this.loadVariants();
      });
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.variantService
        .updateVariant(this.variantForm.variantId, this.variantForm, this.selectedFile)
        .subscribe(() => this.finalize());
    } else {
      this.variantService
        .addVariant(this.selectedProductId!, this.variantForm, this.selectedFile!)
        .subscribe(() => this.finalize());
    }
  }

  openModal() {
    if (!this.selectedProductId) return alert('Please select a product first');
    this.isEditMode = false;
    this.resetForm();
    this.showModal = true;
  }

  editVariant(v: any) {
    this.isEditMode = true;
    this.variantForm = { ...v };
    this.showModal = true;
  }

  finalize() {
    this.loadVariants();
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.variantForm = { variantId: '', name: '', price: 0, description: '', stockQuantity: 0 };
    this.selectedFile = null;
  }
}
