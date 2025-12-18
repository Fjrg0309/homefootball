import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // Verificar si hay mensaje de error desde el resolver
    const nav = this.router.getCurrentNavigation();
    const error = nav?.extras.state?.['error'];
    if (error) {
      this.errorMessage.set(error);
    }

    // Cargar productos desde API
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar los productos');
        this.loading.set(false);
      }
    });
  }

  clearError(): void {
    this.errorMessage.set(null);
  }
}
