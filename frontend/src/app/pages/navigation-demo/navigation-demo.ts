import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navigation-demo',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navigation-demo.html',
  styleUrl: './navigation-demo.scss'
})
export class NavigationDemo {
  private router = inject(Router);
  private toastService = inject(ToastService);

  selectedProductId = signal(1);
  selectedCategory = signal('libros');
  selectedPage = signal(1);

  // 1. Navegación básica
  goHome(): void {
    this.router.navigate(['/home']);
    this.toastService.info('Navegando a Home');
  }

  goToAbout(): void {
    this.router.navigate(['/about']);
    this.toastService.info('Navegando a About');
  }

  // 2. Navegación con query params
  filterProducts(categoria: string, page: number): void {
    this.toastService.info(`Simulando filtrado: ${categoria}, página ${page}`);
  }

  // 3. Navegación con query params y fragment
  goToProductsWithFragment(): void {
    this.toastService.info('Simulando navegación con fragment #comentarios');
  }

  // 4. Navegación con estado (datos en memoria)
  goToCheckoutWithState(): void {
    const order = {
      id: 12345,
      total: 99.99,
      items: ['Producto A', 'Producto B']
    };
    
    this.toastService.success('Simulando navegación con estado (order en memoria)');
  }

  // 5. Navegación sin historial (replaceUrl)
  redirectToLogin(): void {
    this.router.navigate(['/user-form'], {
      replaceUrl: true
    });
    this.toastService.warning('Redirigiendo a formulario sin historial (replaceUrl: true)');
  }

  // 6. Navegación con queryParamsHandling
  addQueryParam(): void {
    this.toastService.info('Simulando agregar query param con merge');
  }

  // 7. Verificar ruta actual
  checkCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.toastService.info(`Ruta actual: ${currentUrl}`);
  }

  // 8. Navegar a URL externa
  goToExternalSite(): void {
    window.open('https://angular.dev', '_blank');
    this.toastService.info('Abriendo sitio externo en nueva pestaña');
  }
}
