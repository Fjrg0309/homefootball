import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  product = signal<Product | null>(null);
  quantity = signal(1);

  ngOnInit(): void {
    // Leer datos resueltos por el resolver
    this.route.data.subscribe(({ product }) => {
      if (product) {
        this.product.set(product);
      } else {
        // Si el resolver retornó null (error), ya redirigió
        this.router.navigate(['/productos']);
      }
    });
  }

  increaseQuantity(): void {
    const current = this.quantity();
    const stock = this.product()?.stock || 0;
    if (current < stock) {
      this.quantity.set(current + 1);
    }
  }

  decreaseQuantity(): void {
    const current = this.quantity();
    if (current > 1) {
      this.quantity.set(current - 1);
    }
  }

  addToCart(): void {
    const product = this.product();
    const qty = this.quantity();
    alert(`✅ Añadido al carrito:\n${product?.name}\nCantidad: ${qty}\nTotal: €${((product?.price || 0) * qty).toFixed(2)}`);
  }

  goBack(): void {
    this.router.navigate(['/productos']);
  }
}
