import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  
  readonly imageBaseUrl = 'http://localhost:8090/images/';
  
  // State
  private allProducts = signal<any[]>([]);
  query = signal<string>('');
  loading = signal(true);

  // Computed signal that filters products automatically when either changes
  results = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return [];
    return this.allProducts().filter(p => p.name.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8090/api/products/search')
      .subscribe(data => {
        this.allProducts.set(data);
        this.loading.set(false);
      });

      
    this.route.params.subscribe(params => {
      this.query.set(params['query'] || '');
    });
  }
}