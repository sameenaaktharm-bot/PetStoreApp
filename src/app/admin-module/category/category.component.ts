import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];

  showFormModal = false;
  showDeleteModal = false;

  isEditMode = false;
  selectedCategoryId: number | null = null;
  categoryForm = { name: '', description: '' };
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.categories = [...data];
        } else {
          this.categories = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.categories = [];
      },
    });
  }
  openAddModal() {
    this.isEditMode = false;
    this.categoryForm = { name: '', description: '' };
    this.selectedFile = null;
    this.imagePreview = null;
    this.showFormModal = true;
  }

  openEditModal(cat: any) {
    this.isEditMode = true;
    this.selectedCategoryId = cat.categoryId;
    this.categoryForm = { name: cat.name, description: cat.description };
    this.imagePreview = cat.imageUrl;
    this.showFormModal = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  saveCategory() {
    this.categoryService
      .saveCategory(
        this.categoryForm,
        this.selectedFile,
        this.isEditMode ? this.selectedCategoryId! : undefined,
      )
      .subscribe({
        next: () => {
          this.loadCategories();
          this.closeModals();
        },
        error: (err) => alert('Failed to save category'),
      });
  }

  executeDelete() {
    if (this.selectedCategoryId) {
      this.categoryService.delete(this.selectedCategoryId).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModals();
        },
      });
    }
  }

  confirmDelete(id: number) {
    this.selectedCategoryId = id;
    this.showDeleteModal = true;
  }

  closeModals() {
    this.showFormModal = false;
    this.showDeleteModal = false;
    this.selectedFile = null;
  }
}
