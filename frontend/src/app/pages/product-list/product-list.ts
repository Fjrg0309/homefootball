import { Component, inject, OnInit, ChangeDetectionStrategy, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductsSignalStore } from '../../services/products-signal.store';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';

/**
 * ============================================================================
 * ProductList - Lista de productos con Signals y OnPush
 * ============================================================================
 * 
 * TAREA 2: Patrón de gestión de estado con Signals
 * TAREA 3: Optimización de rendimiento
 * 
 * Optimizaciones implementadas:
 * -----------------------------
 * 
 * 1. ChangeDetectionStrategy.OnPush
 *    - Angular solo revisa este componente cuando:
 *      a) Cambian sus @Input()
 *      b) Se dispara un evento en el template
 *      c) Se actualiza un Signal que se usa en el template
 *    - Reduce drásticamente los ciclos de detección de cambios
 * 
 * 2. Signals en lugar de Observables
 *    - No necesitamos | async pipe
 *    - No hay riesgo de memory leaks
 *    - Sintaxis más limpia: store.products()
 * 
 * 3. trackBy en @for
 *    - Angular reutiliza nodos DOM existentes
 *    - Solo actualiza los elementos que cambiaron
 *    - Preserva el scroll y el estado del DOM
 * 
 * 4. Inmutabilidad
 *    - El store siempre crea nuevos arrays
 *    - OnPush detecta cambios por referencia
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  /**
   * TAREA 3: ChangeDetectionStrategy.OnPush
   * 
   * ¿Qué hace OnPush?
   * -----------------
   * Por defecto, Angular usa ChangeDetectionStrategy.Default que revisa
   * TODOS los componentes en cada ciclo de detección.
   * 
   * Con OnPush, Angular solo revisa este componente cuando:
   * 1. Un @Input() cambia (comparación por referencia)
   * 2. Un evento del template se dispara (click, submit, etc.)
   * 3. Un Signal usado en el template cambia
   * 4. Se llama manualmente a ChangeDetectorRef.markForCheck()
   * 
   * Beneficios:
   * - Menos ciclos de detección = mejor rendimiento
   * - Funciona perfectamente con Signals
   * - Ideal para componentes "puros" que solo dependen de sus inputs
   */
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList implements OnInit {
  // Inyección de dependencias
  private productService = inject(ProductService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  /**
   * Store basado en Signals
   * Exponemos como protected para usar en el template
   */
  protected store = inject(ProductsSignalStore);

  // ==========================================
  // SIGNALS DEL STORE (Lectura directa)
  // ==========================================
  
  /**
   * Con Signals, accedemos directamente a los valores:
   * - En TypeScript: this.store.products()
   * - En Template: store.products()
   * 
   * No necesitamos:
   * - | async pipe
   * - Suscripciones manuales
   * - Preocuparnos por unsubscribe
   */
  
  // Los signals se acceden directamente desde el store en el template
  // Ejemplo: store.products(), store.loading(), store.totalCount()

  ngOnInit(): void {
    // Verificar si hay mensaje de error desde el resolver (navegación)
    const nav = this.router.getCurrentNavigation();
    const error = nav?.extras.state?.['error'];
    if (error) {
      this.toastService.error(error);
    }

    // El store ya carga los datos en su constructor
    // Si necesitas forzar recarga: this.store.load();
  }

  /**
   * TAREA 3: trackBy para optimizar @for
   * 
   * ¿Por qué es importante para el rendimiento?
   * -------------------------------------------
   * Sin trackBy:
   * - Angular destruye y recrea TODOS los elementos del DOM
   * - Pierde el estado (scroll, inputs, focus)
   * - Más trabajo para el navegador = peor rendimiento
   * 
   * Con trackBy:
   * - Angular compara IDs para identificar elementos
   * - Reutiliza nodos DOM existentes
   * - Solo actualiza los elementos que cambiaron
   * - Preserva el scroll y el estado
   * 
   * Ejemplo de lo que hace Angular:
   * 
   * Lista anterior: [{ id: 1 }, { id: 2 }, { id: 3 }]
   * Lista nueva:    [{ id: 1 }, { id: 3 }, { id: 4 }]
   * 
   * Sin trackBy: Destruye 3 nodos, crea 3 nodos nuevos
   * Con trackBy: 
   *   - id: 1 → Reutiliza nodo
   *   - id: 2 → Elimina nodo
   *   - id: 3 → Reutiliza nodo
   *   - id: 4 → Crea nodo nuevo
   */
  trackById(index: number, item: Product): number {
    return item.id;
  }

  /**
   * Refresca manualmente la lista desde la API
   */
  refreshList(): void {
    this.store.load();
    this.toastService.info('Actualizando lista...');
  }

  /**
   * Eliminar producto con confirmación
   * Demuestra actualización reactiva con Signals
   */
  deleteProduct(product: Product, event: Event): void {
    // Prevenir navegación al detalle
    event.stopPropagation();
    event.preventDefault();

    if (confirm(`¿Eliminar "${product.name}"?`)) {
      this.productService.delete(product.id).subscribe({
        next: () => {
          // Actualizar el store (Signal se actualiza automáticamente)
          this.store.remove(product.id);
          this.toastService.success(`"${product.name}" eliminado`);
        },
        error: (err) => {
          this.toastService.error('Error al eliminar el producto');
          console.error('Error eliminando:', err);
        }
      });
    }
  }

  /**
   * Limpia el error del store
   */
  clearError(): void {
    this.store.clearError();
  }
}
