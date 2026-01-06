import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

/**
 * ============================================================================
 * ProductsStore - Store reactivo con BehaviorSubject (TAREA 1)
 * ============================================================================
 * 
 * NOTA: Este store se mantiene como REFERENCIA EDUCATIVA.
 * Para nuevos desarrollos, se recomienda usar ProductsSignalStore (TAREA 2).
 * 
 * Comparación BehaviorSubject vs Signals:
 * =======================================
 * 
 * | Aspecto              | BehaviorSubject (este)        | Signals (recomendado)     |
 * |----------------------|-------------------------------|---------------------------|
 * | Lectura en template  | products$ \| async             | store.products()          |
 * | Lectura en TS        | products$.subscribe()         | store.products()          |
 * | Actualizar valor     | subject.next(value)           | signal.set(value)         |
 * | Valores derivados    | pipe(map(...))                | computed(() => ...)       |
 * | Memory leaks         | Posibles sin unsubscribe      | No hay suscripciones      |
 * | Boilerplate          | Más código                    | Menos código              |
 * | Integración Angular  | RxJS (externo)                | Nativo desde Angular 16+  |
 * 
 * ¿Cuándo usar BehaviorSubject?
 * -----------------------------
 * 1. Proyectos legacy que ya usan RxJS extensivamente
 * 2. Cuando necesitas operadores RxJS avanzados (debounceTime, switchMap, etc.)
 * 3. Integración con librerías que esperan Observables
 * 
 * ¿Cuándo usar Signals? (ProductsSignalStore)
 * -------------------------------------------
 * 1. Nuevos proyectos Angular 16+
 * 2. Componentes con ChangeDetectionStrategy.OnPush
 * 3. Cuando quieres evitar memory leaks
 * 4. Código más limpio y menos boilerplate
 */
@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private productService = inject(ProductService);

  /**
   * BehaviorSubject que mantiene la lista de productos en memoria
   * - Es privado para que solo el store pueda modificarlo
   * - Inicializado con array vacío
   */
  private productsSubject = new BehaviorSubject<Product[]>([]);

  /**
   * Observable público para que los componentes se suscriban
   * - Solo pueden leer, no modificar directamente
   * - Se usa con | async en templates
   */
  products$: Observable<Product[]> = this.productsSubject.asObservable();

  /**
   * Estado de carga reactivo
   */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Estado de error reactivo
   */
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$: Observable<string | null> = this.errorSubject.asObservable();

  // ==========================================
  // OBSERVABLES DERIVADOS (Estadísticas en tiempo real)
  // ==========================================

  /**
   * Contador total de productos
   * Se recalcula automáticamente cada vez que cambia products$
   */
  totalCount$: Observable<number> = this.products$.pipe(
    map(list => list.length)
  );

  /**
   * Valor total del inventario (suma de precios)
   */
  totalPrice$: Observable<number> = this.products$.pipe(
    map(list => list.reduce((acc, p) => acc + p.price, 0))
  );

  /**
   * Stock total disponible
   */
  totalStock$: Observable<number> = this.products$.pipe(
    map(list => list.reduce((acc, p) => acc + p.stock, 0))
  );

  /**
   * Productos con bajo stock (menos de 10 unidades)
   */
  lowStockProducts$: Observable<Product[]> = this.products$.pipe(
    map(list => list.filter(p => p.stock < 10))
  );

  /**
   * Cantidad de productos con bajo stock
   */
  lowStockCount$: Observable<number> = this.lowStockProducts$.pipe(
    map(list => list.length)
  );

  /**
   * Precio promedio de productos
   */
  averagePrice$: Observable<number> = this.products$.pipe(
    map(list => {
      if (list.length === 0) return 0;
      return list.reduce((acc, p) => acc + p.price, 0) / list.length;
    })
  );

  /**
   * Productos agrupados por categoría
   */
  productsByCategory$: Observable<Map<string, Product[]>> = this.products$.pipe(
    map(list => {
      const grouped = new Map<string, Product[]>();
      list.forEach(product => {
        const category = product.category;
        if (!grouped.has(category)) {
          grouped.set(category, []);
        }
        grouped.get(category)!.push(product);
      });
      return grouped;
    })
  );

  constructor() {
    // Carga inicial de productos al crear el store
    this.refresh();
  }

  // ==========================================
  // MÉTODOS DEL STORE (Operaciones CRUD)
  // ==========================================

  /**
   * Refresca la lista completa desde la API
   * Útil para sincronización inicial o forzar recarga
   */
  refresh(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.productService.getAll().subscribe({
      next: (list) => {
        this.productsSubject.next(list);
        this.loadingSubject.next(false);
        console.log('✅ Store: Productos cargados:', list.length);
      },
      error: (err) => {
        this.errorSubject.next('Error al cargar productos');
        this.loadingSubject.next(false);
        console.error('❌ Store: Error al cargar:', err);
      }
    });
  }

  /**
   * Añade un producto a la lista (después de crearlo en la API)
   * 
   * ¿Por qué actualización inmutable?
   * - Angular detecta cambios por referencia
   * - [...current, product] crea un nuevo array
   * - Esto dispara la actualización en todos los suscriptores
   */
  add(product: Product): void {
    const current = this.productsSubject.value;
    this.productsSubject.next([...current, product]);
    console.log('✅ Store: Producto añadido:', product.name);
  }

  /**
   * Actualiza un producto existente en la lista
   * Reemplaza el producto que coincida con el ID
   */
  update(product: Product): void {
    const current = this.productsSubject.value;
    const updated = current.map(p => 
      p.id === product.id ? product : p
    );
    this.productsSubject.next(updated);
    console.log('✅ Store: Producto actualizado:', product.name);
  }

  /**
   * Elimina un producto de la lista por ID
   * Filtra el array para excluir el producto eliminado
   */
  remove(id: number): void {
    const current = this.productsSubject.value;
    const filtered = current.filter(p => p.id !== id);
    this.productsSubject.next(filtered);
    console.log('✅ Store: Producto eliminado, ID:', id);
  }

  /**
   * Obtiene el valor actual de los productos (síncrono)
   * Útil cuando necesitas el valor sin suscribirte
   */
  getCurrentProducts(): Product[] {
    return this.productsSubject.value;
  }

  /**
   * Busca un producto por ID en el estado actual
   */
  getById(id: number): Product | undefined {
    return this.productsSubject.value.find(p => p.id === id);
  }

  /**
   * Limpia el error actual
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}
