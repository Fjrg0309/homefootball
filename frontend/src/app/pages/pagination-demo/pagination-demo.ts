import { 
  Component, 
  inject, 
  signal, 
  computed,
  OnInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef,
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

/**
 * Estado para paginación clásica
 */
interface PaginationState {
  loading: boolean;
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Estado para infinite scroll
 */
interface InfiniteScrollState {
  loading: boolean;
  data: Product[];
  page: number;
  eof: boolean; // End Of File - no hay más datos
}

/**
 * ============================================================================
 * PaginationDemo - Demostración de Paginación e Infinite Scroll
 * ============================================================================
 * 
 * TAREA 4: Paginación y Scroll Infinito
 * 
 * Este componente demuestra dos patrones de carga de datos:
 * 
 * 1. PAGINACIÓN CLÁSICA
 *    - Botones "Anterior" / "Siguiente"
 *    - Carga una página a la vez, reemplazando la anterior
 *    - Loading state bloquea toda la lista
 *    - Ideal para: tablas de administración, búsquedas con filtros
 * 
 * 2. INFINITE SCROLL
 *    - Carga automática al hacer scroll hacia abajo
 *    - Usa IntersectionObserver para detectar el "anchor"
 *    - Loading state solo en el pie de lista
 *    - Ideal para: feeds, redes sociales, catálogos de productos
 * 
 * Gestión de Loading States:
 * --------------------------
 * - Paginación: loading bloquea toda la lista, spinner central
 * - Infinite: loading solo en el footer, datos previos visibles
 * - Ambos: flag 'eof' para evitar llamadas innecesarias
 */
@Component({
  selector: 'app-pagination-demo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagination-demo.html',
  styleUrl: './pagination-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationDemo implements OnInit, AfterViewInit, OnDestroy {
  private productService = inject(ProductService);

  // ==========================================
  // MODO DE VISUALIZACIÓN
  // ==========================================
  
  /** Toggle entre paginación clásica e infinite scroll */
  viewMode = signal<'pagination' | 'infinite'>('pagination');

  // ==========================================
  // ESTADO PARA PAGINACIÓN CLÁSICA
  // ==========================================
  
  /**
   * Estado de paginación clásica con Signal
   * 
   * Estructura:
   * - loading: indica si está cargando
   * - data: productos de la página actual
   * - total: total de productos (para calcular páginas)
   * - page: página actual (1-indexed)
   * - pageSize: elementos por página
   */
  paginationState = signal<PaginationState>({
    loading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 6
  });

  /**
   * Computed: número total de páginas
   */
  totalPages = computed(() => {
    const state = this.paginationState();
    return Math.ceil(state.total / state.pageSize) || 1;
  });

  /**
   * Computed: ¿puede ir a página anterior?
   */
  canGoPrevious = computed(() => this.paginationState().page > 1);

  /**
   * Computed: ¿puede ir a página siguiente?
   */
  canGoNext = computed(() => {
    const state = this.paginationState();
    return state.page < this.totalPages();
  });

  /**
   * Computed: array de números de página para mostrar
   */
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.paginationState().page;
    const pages: number[] = [];
    
    // Mostrar máximo 5 páginas alrededor de la actual
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });

  // ==========================================
  // ESTADO PARA INFINITE SCROLL
  // ==========================================
  
  /**
   * Estado de infinite scroll con Signal
   * 
   * Estructura:
   * - loading: indica si está cargando más datos
   * - data: todos los productos cargados (acumulativo)
   * - page: próxima página a cargar
   * - eof: End Of File, no hay más datos que cargar
   */
  infiniteState = signal<InfiniteScrollState>({
    loading: false,
    data: [],
    page: 1,
    eof: false
  });

  /**
   * Referencia al elemento "anchor" para IntersectionObserver
   * Cuando este elemento entra en viewport, cargamos más datos
   */
  @ViewChild('scrollAnchor', { static: false }) 
  scrollAnchor!: ElementRef<HTMLElement>;

  /**
   * IntersectionObserver para detectar cuándo el anchor es visible
   */
  private observer: IntersectionObserver | null = null;

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================

  ngOnInit(): void {
    // Cargar primera página de paginación clásica
    this.loadPage(1);
  }

  ngAfterViewInit(): void {
    // Configurar IntersectionObserver después de que el view esté listo
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    // Limpiar el observer al destruir el componente
    this.cleanupObserver();
  }

  // ==========================================
  // PAGINACIÓN CLÁSICA
  // ==========================================

  /**
   * Cargar una página específica
   * 
   * Flujo:
   * 1. Actualizar estado con loading: true
   * 2. Llamar a la API con page y pageSize
   * 3. Actualizar estado con los datos recibidos
   * 
   * @param page Número de página (1-indexed)
   */
  loadPage(page: number): void {
    const state = this.paginationState();
    
    // Validar que la página sea válida
    if (page < 1) return;
    
    // Activar loading y actualizar página
    this.paginationState.update(s => ({
      ...s,
      loading: true,
      page
    }));

    // Llamar a la API
    this.productService.getAllPaginated(page, state.pageSize).subscribe({
      next: (response) => {
        this.paginationState.update(s => ({
          ...s,
          loading: false,
          data: response.data,
          total: response.total
        }));
      },
      error: (err) => {
        console.error('Error cargando página:', err);
        this.paginationState.update(s => ({
          ...s,
          loading: false
        }));
      }
    });
  }

  /**
   * Ir a la página anterior
   */
  previousPage(): void {
    if (this.canGoPrevious()) {
      this.loadPage(this.paginationState().page - 1);
    }
  }

  /**
   * Ir a la página siguiente
   */
  nextPage(): void {
    if (this.canGoNext()) {
      this.loadPage(this.paginationState().page + 1);
    }
  }

  /**
   * Ir a una página específica
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.loadPage(page);
    }
  }

  // ==========================================
  // INFINITE SCROLL
  // ==========================================

  /**
   * Configurar IntersectionObserver
   * 
   * IntersectionObserver es una API del navegador que permite
   * detectar cuándo un elemento entra o sale del viewport.
   * 
   * Usamos esto para:
   * - Detectar cuándo el usuario hace scroll hasta el final
   * - Cargar automáticamente más datos
   * - Evitar usar eventos de scroll (mejor rendimiento)
   */
  private setupIntersectionObserver(): void {
    // Limpiar observer previo si existe
    this.cleanupObserver();

    // Crear el observer con opciones
    this.observer = new IntersectionObserver(
      (entries) => {
        // entries contiene todos los elementos observados
        const isIntersecting = entries.some(entry => entry.isIntersecting);
        
        if (isIntersecting && this.viewMode() === 'infinite') {
          this.loadMore();
        }
      },
      {
        // root: null significa el viewport del navegador
        root: null,
        // rootMargin: cargar un poco antes de que sea visible
        rootMargin: '100px',
        // threshold: 0 significa que se dispara cuando cualquier parte es visible
        threshold: 0
      }
    );

    // Empezar a observar el anchor (si existe)
    if (this.scrollAnchor?.nativeElement) {
      this.observer.observe(this.scrollAnchor.nativeElement);
    }
  }

  /**
   * Limpiar el IntersectionObserver
   */
  private cleanupObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Cargar más datos (infinite scroll)
   * 
   * Flujo:
   * 1. Verificar que no está cargando y no ha llegado al final
   * 2. Activar loading
   * 3. Llamar a la API con la página actual
   * 4. AÑADIR datos a los existentes (no reemplazar)
   * 5. Incrementar página y verificar si hay más datos
   */
  loadMore(): void {
    const state = this.infiniteState();
    
    // No cargar si ya está cargando o llegó al final
    if (state.loading || state.eof) {
      return;
    }

    // Activar loading
    this.infiniteState.update(s => ({
      ...s,
      loading: true
    }));

    // Cargar siguiente página
    this.productService.getAllPaginated(state.page, 8).subscribe({
      next: (response) => {
        this.infiniteState.update(s => ({
          loading: false,
          // IMPORTANTE: Añadir a los datos existentes, no reemplazar
          data: [...s.data, ...response.data],
          // Incrementar página para la próxima carga
          page: s.page + 1,
          // Si no hay datos, llegamos al final
          eof: response.data.length === 0
        }));
      },
      error: (err) => {
        console.error('Error cargando más datos:', err);
        this.infiniteState.update(s => ({
          ...s,
          loading: false
        }));
      }
    });
  }

  /**
   * Resetear infinite scroll (para cambiar de modo)
   */
  resetInfiniteScroll(): void {
    this.infiniteState.set({
      loading: false,
      data: [],
      page: 1,
      eof: false
    });
  }

  // ==========================================
  // CAMBIO DE MODO
  // ==========================================

  /**
   * Cambiar entre paginación clásica e infinite scroll
   */
  setViewMode(mode: 'pagination' | 'infinite'): void {
    this.viewMode.set(mode);
    
    if (mode === 'infinite') {
      // Resetear y cargar primera página de infinite scroll
      this.resetInfiniteScroll();
      // Re-setup observer después de un tick para que el anchor exista
      setTimeout(() => {
        this.setupIntersectionObserver();
        this.loadMore();
      }, 0);
    }
  }

  /**
   * trackBy para optimizar @for
   */
  trackById(index: number, item: Product): number {
    return item.id;
  }
}
