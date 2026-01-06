import { Injectable, inject, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

/**
 * ============================================================================
 * ProductsSignalStore - Store reactivo basado en Angular Signals
 * ============================================================================
 * 
 * TAREA 2: Patrón de gestión de estado con Signals (RECOMENDADO)
 * 
 * ¿Por qué Signals en lugar de BehaviorSubject?
 * ---------------------------------------------
 * 1. Integración nativa con Angular 16+ y su nuevo motor de reactividad
 * 2. Sintaxis más simple: store.products() en lugar de | async
 * 3. Menos boilerplate: no necesitas Observable, subscribe, unsubscribe
 * 4. Mejor rendimiento: Angular sabe exactamente qué cambió
 * 5. Computed values: valores derivados que se recalculan automáticamente
 * 6. No hay riesgo de memory leaks (no hay suscripciones manuales)
 * 
 * Conceptos clave:
 * ----------------
 * - signal<T>(): Estado mutable privado
 * - .asReadonly(): Expone el signal como solo lectura
 * - computed(): Valores derivados que se recalculan automáticamente
 * - .set(): Reemplaza el valor completo
 * - .update(): Actualiza basándose en el valor anterior
 * 
 * Comparación con BehaviorSubject:
 * --------------------------------
 * | BehaviorSubject              | Signal                        |
 * |------------------------------|-------------------------------|
 * | products$.subscribe()        | products() - llamada directa  |
 * | products$ \| async            | products() - en template      |
 * | productsSubject.next(value)  | _products.set(value)          |
 * | productsSubject.value        | _products() - lectura directa |
 * | map() para derivados         | computed() para derivados     |
 */
@Injectable({ providedIn: 'root' })
export class ProductsSignalStore {
  private productService = inject(ProductService);

  // ==========================================
  // ESTADO PRIVADO (Signals mutables)
  // ==========================================
  
  /**
   * Signal privado para la lista de productos
   * Solo el store puede modificarlo con .set() o .update()
   */
  private _products = signal<Product[]>([]);
  
  /**
   * Signal privado para estado de carga
   */
  private _loading = signal<boolean>(false);
  
  /**
   * Signal privado para errores
   */
  private _error = signal<string | null>(null);

  // ==========================================
  // ESTADO PÚBLICO (Signals de solo lectura)
  // ==========================================
  
  /**
   * Signal público de solo lectura
   * Los componentes pueden leer con products() pero no modificar
   * 
   * Uso en componente:
   * - TypeScript: this.store.products()
   * - Template: {{ store.products() }}
   */
  readonly products = this._products.asReadonly();
  
  /**
   * Estado de carga público
   */
  readonly loading = this._loading.asReadonly();
  
  /**
   * Estado de error público
   */
  readonly error = this._error.asReadonly();

  // ==========================================
  // VALORES COMPUTADOS (Estadísticas en tiempo real)
  // ==========================================
  
  /**
   * computed() - Valores derivados que se recalculan automáticamente
   * 
   * ¿Cómo funciona?
   * - Angular rastrea qué signals se leen dentro del computed
   * - Cuando cualquiera de esos signals cambia, el computed se recalcula
   * - Es lazy: solo se calcula cuando se accede al valor
   * - Es cached: no recalcula si las dependencias no cambiaron
   */
  
  /**
   * Total de productos - se recalcula cuando _products cambia
   */
  readonly totalCount = computed(() => this._products().length);
  
  /**
   * Valor total del inventario
   */
  readonly totalPrice = computed(() => 
    this._products().reduce((acc, p) => acc + p.price, 0)
  );
  
  /**
   * Stock total disponible
   */
  readonly totalStock = computed(() => 
    this._products().reduce((acc, p) => acc + p.stock, 0)
  );
  
  /**
   * Productos con bajo stock (menos de 10 unidades)
   */
  readonly lowStockProducts = computed(() => 
    this._products().filter(p => p.stock < 10)
  );
  
  /**
   * Cantidad de productos con bajo stock
   */
  readonly lowStockCount = computed(() => this.lowStockProducts().length);
  
  /**
   * Precio promedio de productos
   */
  readonly averagePrice = computed(() => {
    const products = this._products();
    if (products.length === 0) return 0;
    return products.reduce((acc, p) => acc + p.price, 0) / products.length;
  });

  /**
   * Productos agrupados por categoría
   */
  readonly productsByCategory = computed(() => {
    const grouped = new Map<string, Product[]>();
    this._products().forEach(product => {
      const category = product.category;
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(product);
    });
    return grouped;
  });

  /**
   * Categorías únicas disponibles
   */
  readonly categories = computed(() => 
    [...new Set(this._products().map(p => p.category))]
  );

  /**
   * ¿Hay productos disponibles?
   */
  readonly hasProducts = computed(() => this._products().length > 0);

  /**
   * ¿Está vacío? (no loading, no error, sin productos)
   */
  readonly isEmpty = computed(() => 
    !this._loading() && !this._error() && this._products().length === 0
  );

  constructor() {
    // Carga inicial de productos al crear el store
    this.load();
  }

  // ==========================================
  // MÉTODOS DEL STORE (Operaciones CRUD)
  // ==========================================

  /**
   * Carga la lista completa desde la API
   * 
   * Flujo:
   * 1. Activar loading
   * 2. Limpiar error previo
   * 3. Llamar a la API
   * 4. Actualizar el signal con .set()
   * 5. Desactivar loading
   */
  load(): void {
    this._loading.set(true);
    this._error.set(null);

    this.productService.getAll().subscribe({
      next: (list) => {
        this._products.set(list);
        this._loading.set(false);
        console.log('✅ SignalStore: Productos cargados:', list.length);
      },
      error: (err) => {
        this._error.set('Error al cargar productos');
        this._loading.set(false);
        console.error('❌ SignalStore: Error al cargar:', err);
      }
    });
  }

  /**
   * Añade un producto a la lista
   * 
   * .update() recibe una función que:
   * - Recibe el valor actual
   * - Retorna el nuevo valor
   * - Debe ser INMUTABLE (crear nuevo array)
   */
  add(product: Product): void {
    this._products.update(list => [...list, product]);
    console.log('✅ SignalStore: Producto añadido:', product.name);
  }

  /**
   * Actualiza un producto existente
   * Reemplaza el producto que coincida con el ID
   */
  update(product: Product): void {
    this._products.update(list => 
      list.map(p => p.id === product.id ? product : p)
    );
    console.log('✅ SignalStore: Producto actualizado:', product.name);
  }

  /**
   * Elimina un producto por ID
   * Filtra el array para excluir el producto
   */
  remove(id: number): void {
    this._products.update(list => list.filter(p => p.id !== id));
    console.log('✅ SignalStore: Producto eliminado, ID:', id);
  }

  /**
   * Busca un producto por ID
   * Acceso directo al signal con ()
   */
  getById(id: number): Product | undefined {
    return this._products().find(p => p.id === id);
  }

  /**
   * Limpia el error actual
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Resetea el store a su estado inicial
   */
  reset(): void {
    this._products.set([]);
    this._loading.set(false);
    this._error.set(null);
  }
}
