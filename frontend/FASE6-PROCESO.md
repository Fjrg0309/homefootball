# Fase 6: Gestión de Estado y Optimización - Proceso de Implementación

## Objetivos de la Fase 6
1. **Tarea 1:** Actualización dinámica sin recargas (BehaviorSubject, async pipe, trackBy)
2. **Tarea 2:** Patrón de gestión de estado con Signals (signal, computed, asReadonly)
3. **Tarea 3:** Optimización de rendimiento (OnPush, trackBy, inmutabilidad)
4. **Tarea 4:** Paginación y Scroll Infinito (IntersectionObserver, estados de carga)
5. **Tarea 5:** Búsqueda y filtrado en tiempo real (debounceTime, distinctUntilChanged)
6. **Tarea 6:** WebSockets y Polling (OPCIONAL - tiempo real sin intervención del usuario)

---

## Tarea 1: Actualización Dinámica sin Recargas

### Objetivo
Crear un store de productos utilizando BehaviorSubject de RxJS que permita actualización reactiva de la UI sin recargar la página, utilizando el async pipe en templates y trackBy para optimizar el rendimiento del DOM.

### Estado: ✅ COMPLETADA

---

### Conceptos de BehaviorSubject

**BehaviorSubject** es un tipo especial de Observable de RxJS que:
- Mantiene un valor actual que emite a nuevos suscriptores inmediatamente
- Permite emitir nuevos valores con `.next()`
- Es la base del patrón de store reactivo con RxJS

**Características:**
- Requiere un valor inicial
- `.getValue()` obtiene el valor actual sincrónicamente
- `.asObservable()` expone solo lectura
- Ideal para estado que cambia a lo largo del tiempo

---

### Paso 1: Crear ProductsStore con BehaviorSubject

**Archivo:** `src/app/services/products.store.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, catchError, of, tap } from 'rxjs';
import { Product, CreateProduct, UpdateProduct } from '../models/product.model';
import { ProductService } from './product.service';

/**
 * TAREA 1: Store de productos con BehaviorSubject
 * 
 * Este store implementa el patrón de estado reactivo usando RxJS.
 * Mantiene el estado de los productos y notifica a los componentes
 * cuando hay cambios, permitiendo actualización dinámica sin recargas.
 * 
 * NOTA: Este store se mantiene como referencia educativa.
 * Para nuevos desarrollos, se recomienda usar ProductsSignalStore (Tarea 2)
 * que utiliza Angular Signals para una integración más nativa.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductsStore {
  private productService = inject(ProductService);
  
  // BehaviorSubject privado - solo el store puede modificarlo
  private _products$ = new BehaviorSubject<Product[]>([]);
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _error$ = new BehaviorSubject<string | null>(null);
  
  // Observables públicos de solo lectura
  readonly products$ = this._products$.asObservable();
  readonly loading$ = this._loading$.asObservable();
  readonly error$ = this._error$.asObservable();
  
  // Estadísticas computadas (derivadas del estado)
  readonly totalCount$ = this._products$.pipe(map(p => p.length));
  readonly totalPrice$ = this._products$.pipe(
    map(products => products.reduce((sum, p) => sum + p.price, 0))
  );
  readonly totalStock$ = this._products$.pipe(
    map(products => products.reduce((sum, p) => sum + p.stock, 0))
  );

  constructor() {
    this.loadProducts();
  }

  // Cargar productos desde la API
  loadProducts(): void {
    this._loading$.next(true);
    this._error$.next(null);
    
    this.productService.getAll().pipe(
      tap(products => {
        this._products$.next(products);
        this._loading$.next(false);
      }),
      catchError(error => {
        this._error$.next(error.message || 'Error al cargar productos');
        this._loading$.next(false);
        return of([]);
      })
    ).subscribe();
  }

  // Añadir producto (actualización inmutable)
  addProduct(product: Product): void {
    const current = this._products$.getValue();
    this._products$.next([...current, product]);
  }

  // Actualizar producto (actualización inmutable)
  updateProduct(updated: Product): void {
    const current = this._products$.getValue();
    this._products$.next(
      current.map(p => p.id === updated.id ? { ...p, ...updated } : p)
    );
  }

  // Eliminar producto (actualización inmutable)
  removeProduct(id: number): void {
    const current = this._products$.getValue();
    this._products$.next(current.filter(p => p.id !== id));
  }
}
```

**Conceptos Clave:**
- **BehaviorSubject privado:** Solo el store puede modificar el estado
- **asObservable():** Expone solo lectura a los componentes
- **Inmutabilidad:** Siempre crear nuevos arrays/objetos, nunca mutar
- **Estadísticas computadas:** Derivar datos del estado con `map()`

---

### Paso 2: Usar async pipe en el Template

**Archivo:** `src/app/pages/product-list/product-list.html`

```html
<!-- El async pipe gestiona automáticamente la suscripción -->
<div class="products-container">
  <!-- Loading State -->
  @if (loading$ | async) {
    <div class="loading-spinner">Cargando productos...</div>
  }

  <!-- Error State -->
  @if (error$ | async; as error) {
    <div class="error-message">{{ error }}</div>
  }

  <!-- Product List con trackBy -->
  @if ((products$ | async); as products) {
    <div class="product-grid">
      @for (product of products; track trackById($index, product)) {
        <div class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.price | currency:'EUR' }}</p>
        </div>
      }
    </div>
  }

  <!-- Estadísticas en tiempo real -->
  <div class="stats-dashboard">
    <div class="stat">Total: {{ totalCount$ | async }}</div>
    <div class="stat">Valor: {{ totalPrice$ | async | currency:'EUR' }}</div>
    <div class="stat">Stock: {{ totalStock$ | async }}</div>
  </div>
</div>
```

**Ventajas del async pipe:**
- ✅ **Gestión automática de suscripciones** - No hay memory leaks
- ✅ **Unsubscribe automático** - Al destruir el componente
- ✅ **Triggers Change Detection** - Actualiza la vista automáticamente
- ✅ **Código más limpio** - Sin subscribe() ni OnDestroy manual

---

### Paso 3: Implementar trackBy para Optimización

**Archivo:** `src/app/pages/product-list/product-list.ts`

```typescript
@Component({
  // ...
})
export class ProductList {
  /**
   * trackBy permite a Angular identificar elementos únicos
   * Cuando los datos cambian, Angular solo actualiza los elementos
   * que realmente cambiaron, en lugar de recrear toda la lista.
   * 
   * Sin trackBy: Angular destruye y recrea todos los elementos DOM
   * Con trackBy: Angular reutiliza elementos existentes si el ID coincide
   */
  trackById(index: number, product: Product): number {
    return product.id;
  }
}
```

**Beneficios de trackBy:**
- **Rendimiento:** Menos operaciones DOM
- **Estado preservado:** Animaciones y focus se mantienen
- **Flickering eliminado:** Sin parpadeos al actualizar datos

---

## Tarea 2: Patrón de Gestión de Estado con Signals

### Objetivo
Implementar un store utilizando Angular Signals como alternativa moderna a BehaviorSubject, aprovechando `signal()`, `computed()` y `asReadonly()` para una gestión de estado más integrada con Angular.

### Estado: ✅ COMPLETADA

---

### Conceptos de Angular Signals

**Signals** son primitivas reactivas introducidas en Angular 16+ que proporcionan:
- Reactividad granular sin RxJS
- Mejor integración con Change Detection
- Sintaxis más simple que Observables
- Valores computados automáticos

**API Principal:**
- `signal<T>(initialValue)` - Crear señal con valor inicial
- `signal.set(value)` - Reemplazar valor
- `signal.update(fn)` - Actualizar basándose en valor anterior
- `computed(() => ...)` - Derivar valores automáticamente
- `signal.asReadonly()` - Exponer solo lectura

---

### Paso 1: Crear ProductsSignalStore

**Archivo:** `src/app/services/products-signal.store.ts`

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { Product, CreateProduct, UpdateProduct } from '../models/product.model';
import { ProductService } from './product.service';
import { catchError, of, tap } from 'rxjs';

/**
 * TAREA 2: Store de productos con Angular Signals
 * 
 * Esta es la implementación RECOMENDADA para gestión de estado.
 * Utiliza Signals de Angular para una integración nativa con
 * el sistema de detección de cambios.
 * 
 * Ventajas sobre BehaviorSubject:
 * - Sintaxis más simple y declarativa
 * - Mejor rendimiento con OnPush
 * - Valores computados automáticos con computed()
 * - No requiere async pipe ni subscribe
 */
@Injectable({
  providedIn: 'root'
})
export class ProductsSignalStore {
  private productService = inject(ProductService);
  
  // =========================================
  // SIGNALS PRIVADOS (estado interno)
  // =========================================
  private _products = signal<Product[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _selectedId = signal<number | null>(null);
  
  // =========================================
  // SIGNALS PÚBLICOS (solo lectura)
  // =========================================
  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedId = this._selectedId.asReadonly();
  
  // =========================================
  // COMPUTED SIGNALS (valores derivados)
  // =========================================
  
  // Contadores básicos
  readonly totalCount = computed(() => this._products().length);
  readonly isEmpty = computed(() => this._products().length === 0);
  
  // Estadísticas financieras
  readonly totalPrice = computed(() => 
    this._products().reduce((sum, p) => sum + p.price, 0)
  );
  
  readonly totalStock = computed(() => 
    this._products().reduce((sum, p) => sum + p.stock, 0)
  );
  
  readonly averagePrice = computed(() => {
    const products = this._products();
    if (products.length === 0) return 0;
    return this.totalPrice() / products.length;
  });
  
  // Alertas de stock
  readonly lowStockCount = computed(() => 
    this._products().filter(p => p.stock < 10).length
  );
  
  readonly lowStockProducts = computed(() => 
    this._products().filter(p => p.stock < 10)
  );
  
  // Producto seleccionado
  readonly selectedProduct = computed(() => {
    const id = this._selectedId();
    if (!id) return null;
    return this._products().find(p => p.id === id) ?? null;
  });
  
  // Agrupación por categoría
  readonly productsByCategory = computed(() => {
    const products = this._products();
    const grouped = new Map<string, Product[]>();
    
    products.forEach(product => {
      const category = product.category || 'Sin categoría';
      const existing = grouped.get(category) || [];
      grouped.set(category, [...existing, product]);
    });
    
    return grouped;
  });

  constructor() {
    this.loadProducts();
  }

  // =========================================
  // MÉTODOS DE CARGA
  // =========================================
  
  loadProducts(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.productService.getAll().pipe(
      tap(products => {
        this._products.set(products);
        this._loading.set(false);
      }),
      catchError(error => {
        this._error.set(error.message || 'Error al cargar productos');
        this._loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  // =========================================
  // MÉTODOS DE MUTACIÓN (CRUD)
  // =========================================
  
  addProduct(product: Product): void {
    // update() recibe el valor actual y devuelve el nuevo
    this._products.update(current => [...current, product]);
  }
  
  updateProduct(updated: Product): void {
    this._products.update(current =>
      current.map(p => p.id === updated.id ? { ...p, ...updated } : p)
    );
  }
  
  removeProduct(id: number): void {
    this._products.update(current => current.filter(p => p.id !== id));
    
    // Limpiar selección si era el producto eliminado
    if (this._selectedId() === id) {
      this._selectedId.set(null);
    }
  }
  
  // =========================================
  // MÉTODOS DE SELECCIÓN
  // =========================================
  
  selectProduct(id: number | null): void {
    this._selectedId.set(id);
  }
  
  clearSelection(): void {
    this._selectedId.set(null);
  }
}
```

**Conceptos Clave:**
- **signal():** Crea una señal reactiva con valor inicial
- **computed():** Deriva valores automáticamente cuando cambian las dependencias
- **asReadonly():** Expone la señal sin permitir modificaciones externas
- **set():** Reemplaza el valor completo
- **update():** Modifica basándose en el valor anterior (inmutable)

---

### Paso 2: Usar Signals en Componentes

**Archivo:** `src/app/pages/product-list/product-list.ts`

```typescript
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ProductsSignalStore } from '../../services/products-signal.store';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList {
  // Inyectar el store
  protected store = inject(ProductsSignalStore);
  
  // trackBy para optimización
  trackById(index: number, product: Product): number {
    return product.id;
  }
  
  onDelete(id: number): void {
    if (confirm('¿Eliminar producto?')) {
      this.store.removeProduct(id);
    }
  }
}
```

**Archivo:** `src/app/pages/product-list/product-list.html`

```html
<!-- Con Signals, llamamos como funciones: store.products() -->
<div class="products-container">
  <!-- Loading State -->
  @if (store.loading()) {
    <div class="loading-spinner">Cargando...</div>
  }

  <!-- Error State -->
  @if (store.error(); as error) {
    <div class="error-message">{{ error }}</div>
  }

  <!-- Product Grid -->
  @if (!store.isEmpty()) {
    <div class="product-grid">
      @for (product of store.products(); track trackById($index, product)) {
        <div class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.price | currency:'EUR' }}</p>
          <button (click)="onDelete(product.id)">Eliminar</button>
        </div>
      }
    </div>
  }

  <!-- Stats Dashboard (valores computados) -->
  <div class="stats-dashboard">
    <div class="stat">Total: {{ store.totalCount() }}</div>
    <div class="stat">Valor: {{ store.totalPrice() | currency:'EUR' }}</div>
    <div class="stat">Promedio: {{ store.averagePrice() | currency:'EUR' }}</div>
    <div class="stat">Stock bajo: {{ store.lowStockCount() }}</div>
  </div>
</div>
```

**Diferencias clave con BehaviorSubject:**

| Aspecto | BehaviorSubject | Signals |
|---------|-----------------|---------|
| Template | `products$ \| async` | `store.products()` |
| Suscripción | Automática con async | No necesaria |
| Valores derivados | `pipe(map(...))` | `computed(() => ...)` |
| Change Detection | Requiere markForCheck | Automático con OnPush |

---

## Tarea 3: Optimización de Rendimiento

### Objetivo
Aplicar estrategias de optimización en componentes Angular usando `ChangeDetectionStrategy.OnPush`, `trackBy` y actualizaciones inmutables para mejorar el rendimiento de la aplicación.

### Estado: ✅ COMPLETADA

---

### Conceptos de Change Detection

**Change Detection** es el mecanismo de Angular para detectar cambios en el estado y actualizar la vista.

**Estrategias:**
- **Default:** Angular verifica TODOS los componentes en cada ciclo
- **OnPush:** Angular solo verifica si:
  - Un `@Input()` cambió (referencia)
  - Un evento del template se disparó
  - Un Observable emitió (con async pipe)
  - Se llamó `markForCheck()` manualmente

---

### Paso 1: Aplicar OnPush a Componentes

**Archivo:** `src/app/pages/product-list/product-list.ts`

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  // OnPush: Solo re-renderiza cuando cambian inputs o eventos
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList {
  // ...
}
```

**Archivo:** `src/app/pages/product-form/product-form.ts`

```typescript
@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductForm {
  // ...
}
```

---

### Paso 2: Configurar Scroll Position Restoration

**Archivo:** `src/app/app.config.ts`

```typescript
import { provideRouter, withInMemoryScrolling } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      // Restaurar posición de scroll al navegar
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    // ...
  ]
};
```

---

### Paso 3: Checklist de Optimización

| Optimización | Implementación | Beneficio |
|--------------|----------------|-----------|
| **OnPush** | `changeDetection: ChangeDetectionStrategy.OnPush` | Menos ciclos de CD |
| **trackBy** | `@for (item of items; track trackById)` | Reutiliza DOM |
| **Inmutabilidad** | `[...array, newItem]` | OnPush detecta cambios |
| **async pipe** | `observable$ \| async` | Unsubscribe automático |
| **Signals** | `signal()`, `computed()` | Reactividad granular |
| **Lazy Loading** | `loadComponent: () => import(...)` | Carga bajo demanda |

---

## Tarea 4: Paginación y Scroll Infinito

### Objetivo
Implementar dos estrategias para cargar datos en listas largas: paginación clásica (con controles prev/next) e infinite scroll (carga automática con IntersectionObserver).

### Estado: ✅ COMPLETADA

---

### Conceptos de Paginación

**Paginación Clásica:**
- Reemplaza datos al cambiar de página
- Controles de navegación (prev/next, números)
- Ideal para tablas de administración

**Infinite Scroll:**
- Acumula datos al hacer scroll
- Usa IntersectionObserver para detectar el final
- Ideal para feeds y catálogos

---

### Paso 1: Crear Componente de Paginación

**Archivo:** `src/app/pages/pagination-demo/pagination-demo.ts`

```typescript
import { Component, signal, computed, ViewChild, ElementRef, 
         AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfaces de estado
interface PaginationState {
  data: Product[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
}

interface InfiniteScrollState {
  data: Product[];
  loading: boolean;
  page: number;
  pageSize: number;
  eof: boolean; // End Of File - no hay más datos
}

@Component({
  selector: 'app-pagination-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-demo.html',
  styleUrl: './pagination-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationDemo implements AfterViewInit, OnDestroy {
  // Estado de paginación clásica
  paginationState = signal<PaginationState>({
    data: [],
    loading: false,
    page: 1,
    pageSize: 8,
    total: 0
  });
  
  // Estado de infinite scroll
  infiniteState = signal<InfiniteScrollState>({
    data: [],
    loading: false,
    page: 1,
    pageSize: 10,
    eof: false
  });
  
  // Modo de visualización
  viewMode = signal<'pagination' | 'infinite'>('pagination');
  
  // Referencia al elemento anchor para IntersectionObserver
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;
  private observer: IntersectionObserver | null = null;
  
  // Computed signals para paginación
  totalPages = computed(() => {
    const state = this.paginationState();
    return Math.ceil(state.total / state.pageSize);
  });
  
  canGoPrevious = computed(() => this.paginationState().page > 1);
  canGoNext = computed(() => this.paginationState().page < this.totalPages());

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.loadPage(1);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  // =========================================
  // INTERSECTION OBSERVER PARA INFINITE SCROLL
  // =========================================
  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Cuando el anchor entra en el viewport
        if (entry.isIntersecting && 
            this.viewMode() === 'infinite' && 
            !this.infiniteState().loading && 
            !this.infiniteState().eof) {
          this.loadMore();
        }
      },
      { rootMargin: '100px' } // Cargar antes de llegar al final
    );
  }

  // =========================================
  // PAGINACIÓN CLÁSICA
  // =========================================
  loadPage(page: number): void {
    this.paginationState.update(s => ({ ...s, loading: true }));
    
    // Simular llamada API
    setTimeout(() => {
      const start = (page - 1) * this.paginationState().pageSize;
      const data = MOCK_PRODUCTS.slice(start, start + this.paginationState().pageSize);
      
      this.paginationState.update(s => ({
        ...s,
        data,
        page,
        total: MOCK_PRODUCTS.length,
        loading: false
      }));
    }, 500);
  }

  previousPage(): void {
    if (this.canGoPrevious()) {
      this.loadPage(this.paginationState().page - 1);
    }
  }

  nextPage(): void {
    if (this.canGoNext()) {
      this.loadPage(this.paginationState().page + 1);
    }
  }

  // =========================================
  // INFINITE SCROLL
  // =========================================
  loadMore(): void {
    if (this.infiniteState().loading || this.infiniteState().eof) return;
    
    this.infiniteState.update(s => ({ ...s, loading: true }));
    
    setTimeout(() => {
      const start = (this.infiniteState().page - 1) * this.infiniteState().pageSize;
      const newData = MOCK_PRODUCTS.slice(start, start + this.infiniteState().pageSize);
      
      this.infiniteState.update(s => ({
        ...s,
        // ACUMULAR datos (no reemplazar)
        data: [...s.data, ...newData],
        page: s.page + 1,
        loading: false,
        eof: newData.length < s.pageSize // No hay más datos
      }));
    }, 500);
  }
}
```

---

### Paso 2: Template con Ambos Modos

**Archivo:** `src/app/pages/pagination-demo/pagination-demo.html`

```html
<div class="pagination-demo-container">
  <!-- Mode Selector -->
  <div class="mode-selector">
    <button [class.active]="viewMode() === 'pagination'" 
            (click)="setViewMode('pagination')">
      📋 Paginación Clásica
    </button>
    <button [class.active]="viewMode() === 'infinite'" 
            (click)="setViewMode('infinite')">
      ♾️ Infinite Scroll
    </button>
  </div>

  <!-- PAGINACIÓN CLÁSICA -->
  @if (viewMode() === 'pagination') {
    <section class="pagination-section">
      @if (paginationState().loading) {
        <div class="loading-overlay">
          <div class="spinner"></div>
        </div>
      }

      <div class="products-grid">
        @for (product of paginationState().data; track trackById($index, product)) {
          <div class="product-card">{{ product.name }}</div>
        }
      </div>

      <!-- Controles de paginación -->
      <div class="pagination-controls">
        <button (click)="previousPage()" [disabled]="!canGoPrevious()">
          ◀ Anterior
        </button>
        <span>Página {{ paginationState().page }} de {{ totalPages() }}</span>
        <button (click)="nextPage()" [disabled]="!canGoNext()">
          Siguiente ▶
        </button>
      </div>
    </section>
  }

  <!-- INFINITE SCROLL -->
  @if (viewMode() === 'infinite') {
    <section class="infinite-section">
      <div class="infinite-list">
        @for (product of infiniteState().data; track trackById($index, product)) {
          <div class="product-card-horizontal">{{ product.name }}</div>
        }

        <!-- ANCHOR para IntersectionObserver -->
        <div #scrollAnchor class="scroll-anchor"></div>

        @if (infiniteState().loading) {
          <div class="infinite-loading">
            <div class="spinner-small"></div>
            Cargando más...
          </div>
        }

        @if (infiniteState().eof) {
          <div class="end-of-data">🏁 No hay más productos</div>
        }
      </div>
    </section>
  }
</div>
```

---

### Comparativa: Paginación vs Infinite Scroll

| Aspecto | Paginación | Infinite Scroll |
|---------|------------|-----------------|
| **Datos** | Reemplaza al cambiar página | Acumula al hacer scroll |
| **Loading** | Bloquea toda la lista | Solo footer |
| **Navegación** | Usuario controla | Automático |
| **Uso ideal** | Tablas admin, búsquedas | Feeds, catálogos |
| **Implementación** | Query params page/pageSize | IntersectionObserver |

---

## Tarea 5: Búsqueda y Filtrado en Tiempo Real

### Objetivo
Implementar búsqueda reactiva combinando un input con FormControl, debounceTime para evitar llamadas excesivas, y filtrado local o remoto según el volumen de datos.

### Estado: ✅ COMPLETADA

---

### Conceptos de Búsqueda Reactiva

**Operadores RxJS clave:**
- `debounceTime(ms)` - Espera X ms de inactividad antes de emitir
- `distinctUntilChanged()` - Solo emite si el valor cambió
- `switchMap()` - Cancela peticiones anteriores (para remoto)

---

### Paso 1: Crear Componente de Búsqueda

**Archivo:** `src/app/pages/search-demo/search-demo.ts`

```typescript
import { Component, OnInit, OnDestroy, signal, computed, 
         ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, 
         takeUntil, combineLatest, startWith } from 'rxjs';

interface SearchState {
  results: Product[];
  loading: boolean;
  searchTerm: string;
  totalFound: number;
  searchMode: 'local' | 'remote';
}

@Component({
  selector: 'app-search-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-demo.html',
  styleUrl: './search-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDemo implements OnInit, OnDestroy {
  // FormControl para el input de búsqueda
  searchControl = new FormControl('');
  categoryFilter = new FormControl('all');
  
  // Estado
  searchState = signal<SearchState>({
    results: [],
    loading: false,
    searchTerm: '',
    totalFound: 0,
    searchMode: 'local'
  });
  
  // Datos locales para filtrado
  private allProducts: Product[] = [...MOCK_PRODUCTS];
  private destroy$ = new Subject<void>();
  
  // Computed signals
  results = computed(() => this.searchState().results);
  loading = computed(() => this.searchState().loading);
  
  // =========================================
  // OBSERVABLE DE BÚSQUEDA CON DEBOUNCE
  // =========================================
  search$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),        // Espera 300ms de inactividad
    distinctUntilChanged()    // Solo si el valor cambió
  );

  ngOnInit(): void {
    // Combinar búsqueda y categoría
    combineLatest([this.search$, this.categoryFilter.valueChanges.pipe(startWith('all'))])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([term, category]) => {
        this.performLocalSearch(term || '', category || 'all');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================================
  // FILTRADO LOCAL (dataset pequeño)
  // =========================================
  private performLocalSearch(term: string, category: string): void {
    const searchTerm = term.toLowerCase().trim();
    
    this.updateState({ loading: true, searchTerm: term });

    // Simular pequeño delay para UX
    setTimeout(() => {
      let filtered = this.allProducts;

      // Filtrar por término
      if (searchTerm) {
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        );
      }

      // Filtrar por categoría
      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }

      // Actualización INMUTABLE
      this.updateState({
        results: [...filtered],
        loading: false,
        totalFound: filtered.length
      });
    }, 150);
  }

  // trackBy para evitar flickering
  trackById(index: number, item: Product): number {
    return item.id;
  }
}
```

---

### Paso 2: Template de Búsqueda

**Archivo:** `src/app/pages/search-demo/search-demo.html`

```html
<div class="search-demo-container">
  <!-- Barra de búsqueda -->
  <div class="search-section">
    <div class="search-bar">
      <input 
        type="search" 
        [formControl]="searchControl"
        placeholder="Buscar productos..."
        class="search-input"
      >

      <select [formControl]="categoryFilter" class="category-select">
        @for (cat of categories(); track cat) {
          <option [value]="cat">{{ cat }}</option>
        }
      </select>
    </div>

    <!-- Info de búsqueda -->
    <div class="search-info">
      @if (searchTerm()) {
        <span>Buscando: "<strong>{{ searchTerm() }}</strong>"</span>
      }
      <span>{{ totalFound() }} productos encontrados</span>
    </div>
  </div>

  <!-- Resultados -->
  <div class="results-section">
    @if (loading()) {
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Buscando...</p>
      </div>
    }

    @if (!loading() && results().length === 0) {
      <div class="empty-state">
        <h3>Sin resultados</h3>
        <p>No se encontraron productos para "{{ searchTerm() }}"</p>
      </div>
    }

    @if (!loading() && results().length > 0) {
      <div class="results-grid">
        @for (product of results(); track trackById($index, product)) {
          <div class="product-card">
            <h3 [innerHTML]="highlightTerm(product.name)"></h3>
            <p>{{ product.price | currency:'EUR' }}</p>
          </div>
        }
      </div>
    }
  </div>
</div>
```

---

### Filtrado Local vs Remoto

| Aspecto | Local | Remoto |
|---------|-------|--------|
| **Datos** | Cargados en memoria | API externa |
| **Latencia** | Instantáneo | Depende de red |
| **Volumen ideal** | < 1000 elementos | Miles o millones |
| **Offline** | ✅ Funciona | ❌ Requiere conexión |
| **Operador RxJS** | subscribe directo | `switchMap()` |

**Filtrado Remoto (ejemplo):**
```typescript
results$ = this.search$.pipe(
  filter(term => term.length >= 2), // Mínimo 2 caracteres
  switchMap(term => this.productService.search(term))
);
```

---

## Tarea 6: WebSockets y Polling (OPCIONAL)

### Objetivo
Documentar e implementar dos enfoques para actualización de datos en tiempo real sin intervención del usuario: WebSockets para conexiones bidireccionales y Polling HTTP periódico como alternativa simple.

### Estado: ✅ COMPLETADA

---

### Conceptos de Tiempo Real

**WebSocket:**
- Conexión bidireccional persistente
- El servidor puede enviar datos sin petición del cliente
- Ideal para chat, notificaciones, datos en vivo

**Polling:**
- Peticiones HTTP periódicas (cada X segundos)
- Más simple, funciona con cualquier API REST
- Menos eficiente pero más compatible

---

### Paso 1: Servicio de WebSocket

**Archivo:** `src/app/core/services/realtime.service.ts`

```typescript
import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject, BehaviorSubject, timer, retry, 
         catchError, EMPTY, takeUntil } from 'rxjs';

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private socket$: WebSocketSubject<WebSocketMessage> | null = null;
  private destroy$ = new Subject<void>();
  
  private connectionState$ = new BehaviorSubject<ConnectionState>({
    connected: false,
    reconnecting: false,
    lastConnected: null,
    error: null
  });

  /**
   * Conectar al WebSocket
   */
  connect(url = 'wss://api.example.com/ws'): WebSocketSubject<WebSocketMessage> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<WebSocketMessage>({
        url,
        openObserver: {
          next: () => {
            this.updateConnectionState({ connected: true, reconnecting: false });
          }
        },
        closeObserver: {
          next: () => {
            this.updateConnectionState({ connected: false });
          }
        }
      });
    }
    return this.socket$;
  }

  /**
   * Escuchar mensajes con reconexión automática
   */
  listen(): Observable<WebSocketMessage> {
    return this.connect().pipe(
      retry({
        count: 5,
        delay: (error, retryCount) => {
          // Backoff exponencial: 1s, 2s, 4s, 8s, 16s
          const delayMs = Math.min(1000 * Math.pow(2, retryCount), 30000);
          this.updateConnectionState({ reconnecting: true });
          return timer(delayMs);
        }
      }),
      catchError(error => {
        this.updateConnectionState({ connected: false, error: error.message });
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    );
  }

  /**
   * Enviar mensaje al servidor
   */
  send(message: WebSocketMessage): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(message);
    }
  }

  /**
   * Cerrar conexión
   */
  close(): void {
    this.socket$?.complete();
    this.socket$ = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.close();
  }
}
```

---

### Paso 2: Servicio de Polling

**Archivo:** `src/app/core/services/polling.service.ts`

```typescript
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, timer, switchMap, shareReplay, 
         catchError, of, takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PollingService implements OnDestroy {
  private stopPolling$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  /**
   * Crear polling genérico
   * 
   * timer(0, intervalMs):
   * - 0: emitir inmediatamente
   * - intervalMs: luego cada X milisegundos
   * 
   * switchMap: cancela petición anterior si hay una nueva
   * shareReplay(1): comparte la última respuesta entre suscriptores
   */
  poll<T>(url: string, intervalMs = 30000): Observable<T> {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.http.get<T>(url).pipe(
        catchError(error => {
          console.error('[Polling] Error:', error);
          return of(null as unknown as T);
        })
      )),
      shareReplay(1),
      takeUntil(this.stopPolling$)
    );
  }

  /**
   * Polling específico para notificaciones
   */
  pollNotifications(intervalMs = 30000): Observable<Notification[]> {
    return this.poll<Notification[]>('/api/notifications', intervalMs);
  }

  /**
   * Detener todo el polling
   */
  stopAll(): void {
    this.stopPolling$.next();
    this.stopPolling$ = new Subject<void>();
  }

  ngOnDestroy(): void {
    this.stopAll();
  }
}
```

---

### Paso 3: Demo Interactivo

**Archivo:** `src/app/pages/realtime-demo/realtime-demo.ts`

```typescript
@Component({
  selector: 'app-realtime-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './realtime-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealtimeDemo implements OnInit, OnDestroy {
  connectionState = signal<ConnectionState>({
    mode: 'disconnected',
    connected: false,
    lastUpdate: null,
    messageCount: 0
  });

  notifications = signal<Notification[]>([]);
  
  unreadCount = computed(() => 
    this.notifications().filter(n => !n.read).length
  );

  connectWebSocket(): void {
    // Simula conexión WebSocket
    this.updateConnectionState({ mode: 'websocket', connected: true });
    this.simulateWebSocketMessages();
  }

  startPolling(): void {
    // Simula polling
    this.updateConnectionState({ mode: 'polling', connected: true });
    interval(this.pollingInterval() * 1000)
      .pipe(takeUntil(this.stopSimulation$))
      .subscribe(() => this.fetchNotifications());
  }

  disconnect(): void {
    this.stopSimulation$.next();
    this.updateConnectionState({ mode: 'disconnected', connected: false });
  }
}
```

---

### Comparativa: WebSocket vs Polling

| Aspecto | WebSocket | Polling |
|---------|-----------|---------|
| **Conexión** | Persistente | Múltiples HTTP |
| **Latencia** | Muy baja (~ms) | Depende del intervalo |
| **Eficiencia** | Alta (solo datos nuevos) | Baja (pide todo) |
| **Bidireccional** | ✅ Sí | ❌ No |
| **Complejidad servidor** | Alta | Baja (REST normal) |
| **Firewall/Proxy** | ⚠️ Puede bloquear | ✅ Sin problemas |
| **Uso ideal** | Chat, gaming, live | Dashboards, feeds |

---

## Tarea 7: Documentación

### Objetivo
Documentar el patrón de estado elegido, las estrategias de optimización aplicadas y las alternativas evaluadas.

### Estado: ✅ COMPLETADA (este documento)

---

### Patrón de Estado Elegido

**Patrón:** Servicios de dominio (store por feature) que exponen estado mediante `signal`, `computed` y métodos para mutarlo (`set`, `update`).

**Justificación:**
1. **Integración nativa** con Angular moderno (mejor change detection)
2. **Curva de aprendizaje adecuada** para proyecto docente
3. **Flujo de datos unidireccional** claro sin la complejidad de NgRx
4. **Componentes ligeros** - lógica de negocio en servicios

**Ejemplo del patrón:**
```typescript
@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private _products = signal<Product[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Solo lectura
  products = this._products.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  
  // Valores computados
  totalCount = computed(() => this._products().length);

  // Mutaciones
  add(product: Product) { 
    this._products.update(list => [...list, product]); 
  }
}
```

---

### Estrategias de Optimización Aplicadas

| Estrategia | Implementación | Beneficio |
|------------|----------------|-----------|
| **OnPush** | `changeDetection: ChangeDetectionStrategy.OnPush` | Menos ciclos de CD |
| **trackBy** | `@for (item; track item.id)` | Reutiliza nodos DOM |
| **async pipe** | `observable$ \| async` | Unsubscribe automático |
| **Signals** | `signal()`, `computed()` | Reactividad granular |
| **Inmutabilidad** | `[...array, newItem]` | OnPush detecta cambios |
| **debounceTime** | `debounceTime(300)` | Menos llamadas API |
| **Lazy Loading** | `loadComponent()` | Carga bajo demanda |
| **IntersectionObserver** | Infinite scroll | Carga progresiva |

---

### Comparativa de Opciones de Estado

| Opción | Complejidad | Ventajas | Inconvenientes |
|--------|-------------|----------|----------------|
| **BehaviorSubject** | Baja | Patrón conocido, comunicación entre componentes | Más RxJS "plumbing", riesgo de memory leaks |
| **Signals (elegida)** | Media | Integración nativa Angular, sintaxis simple, OnPush | Requiere Angular 16+, menos documentación legacy |
| **NgRx** | Alta | Escalable, tooling avanzado, time-travel debugging | Sobredimensionado para este proyecto |
| **NGXS** | Media-Alta | Menos boilerplate que NgRx | Dependencia externa, curva de aprendizaje |
| **Akita** | Media | API simple, entity stores | Menos popular, documentación limitada |

---

## Rutas de las Demos

| Demo | Ruta | Descripción |
|------|------|-------------|
| Productos (Signals) | `/productos` | CRUD con Signal Store |
| Paginación | `/pagination-demo` | Paginación clásica + Infinite Scroll |
| Búsqueda | `/search-demo` | Filtrado en tiempo real con debounce |
| Tiempo Real | `/realtime-demo` | WebSocket + Polling simulados |

---

## Resumen de Archivos Creados

### Stores
- `src/app/services/products.store.ts` - Store con BehaviorSubject (referencia)
- `src/app/services/products-signal.store.ts` - Store con Signals (recomendado)

### Servicios
- `src/app/core/services/realtime.service.ts` - WebSocket con RxJS
- `src/app/core/services/polling.service.ts` - Polling HTTP periódico

### Componentes Demo
- `src/app/pages/pagination-demo/` - Demo de paginación
- `src/app/pages/search-demo/` - Demo de búsqueda
- `src/app/pages/realtime-demo/` - Demo de tiempo real

### Configuración
- `src/app/app.config.ts` - withInMemoryScrolling para scroll restoration
- `src/app/app.routes.ts` - Rutas lazy loading para demos

---

## Conclusiones

La Fase 6 implementa un sistema completo de gestión de estado y optimización para Angular:

1. **Estado reactivo** con Signals como solución principal y BehaviorSubject como alternativa documentada
2. **Optimización de rendimiento** con OnPush, trackBy e inmutabilidad
3. **Carga de datos eficiente** con paginación, infinite scroll y debounce
4. **Tiempo real opcional** con WebSocket y Polling como alternativas

El enfoque elegido (Signals + servicios de dominio) proporciona un balance óptimo entre simplicidad, rendimiento y mantenibilidad para un proyecto educativo.
