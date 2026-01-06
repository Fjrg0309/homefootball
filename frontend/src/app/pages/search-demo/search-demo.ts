// =============================================
// TAREA 5: Búsqueda y Filtrado en Tiempo Real
// =============================================
// Este componente demuestra:
// 1. Input reactivo con debounceTime (300ms)
// 2. distinctUntilChanged para evitar búsquedas duplicadas
// 3. Filtrado LOCAL (datos en memoria) y REMOTO (API)
// 4. trackBy para evitar flickering
// 5. Estados de carga y vacío
// =============================================

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { 
  debounceTime, 
  distinctUntilChanged, 
  switchMap, 
  tap, 
  catchError,
  Subject,
  takeUntil,
  of,
  Observable,
  startWith,
  combineLatest
} from 'rxjs';

// =============================================
// Interfaces
// =============================================
interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

interface SearchState {
  results: Product[];
  loading: boolean;
  searchTerm: string;
  totalFound: number;
  searchMode: 'local' | 'remote';
}

// =============================================
// Datos de ejemplo (simula API)
// =============================================
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Camiseta Real Madrid', description: 'Camiseta oficial temporada 2024-25', category: 'Camisetas', price: 89.99, stock: 45, image: '⚪' },
  { id: 2, name: 'Camiseta Barcelona', description: 'Camiseta oficial blaugrana', category: 'Camisetas', price: 89.99, stock: 38, image: '🔵' },
  { id: 3, name: 'Balón Champions League', description: 'Balón oficial de la UEFA Champions League', category: 'Balones', price: 149.99, stock: 20, image: '⚽' },
  { id: 4, name: 'Botas Nike Mercurial', description: 'Botas de fútbol profesionales', category: 'Calzado', price: 199.99, stock: 15, image: '👟' },
  { id: 5, name: 'Guantes de Portero', description: 'Guantes profesionales con grip', category: 'Portero', price: 79.99, stock: 25, image: '🧤' },
  { id: 6, name: 'Espinilleras Adidas', description: 'Protección ligera y resistente', category: 'Protección', price: 29.99, stock: 60, image: '🦵' },
  { id: 7, name: 'Bolsa de Deporte', description: 'Bolsa espaciosa para equipamiento', category: 'Accesorios', price: 49.99, stock: 40, image: '👜' },
  { id: 8, name: 'Camiseta Manchester United', description: 'Camiseta oficial Red Devils', category: 'Camisetas', price: 89.99, stock: 30, image: '🔴' },
  { id: 9, name: 'Balón La Liga', description: 'Balón oficial de La Liga española', category: 'Balones', price: 129.99, stock: 18, image: '⚽' },
  { id: 10, name: 'Botas Adidas Predator', description: 'Botas con control excepcional', category: 'Calzado', price: 189.99, stock: 22, image: '👟' },
  { id: 11, name: 'Camiseta Liverpool', description: 'Camiseta oficial The Reds', category: 'Camisetas', price: 89.99, stock: 35, image: '🔴' },
  { id: 12, name: 'Red de Portería', description: 'Red profesional resistente', category: 'Equipamiento', price: 59.99, stock: 10, image: '🥅' },
  { id: 13, name: 'Cono de Entrenamiento', description: 'Set de 20 conos de colores', category: 'Entrenamiento', price: 19.99, stock: 100, image: '🔶' },
  { id: 14, name: 'Silbato de Árbitro', description: 'Silbato profesional Fox 40', category: 'Arbitraje', price: 12.99, stock: 50, image: '📣' },
  { id: 15, name: 'Tarjetas de Árbitro', description: 'Set de tarjetas amarilla y roja', category: 'Arbitraje', price: 8.99, stock: 80, image: '🟨' },
  { id: 16, name: 'Camiseta PSG', description: 'Camiseta oficial Paris Saint-Germain', category: 'Camisetas', price: 94.99, stock: 28, image: '🔵' },
  { id: 17, name: 'Calcetines de Fútbol', description: 'Pack de 3 pares profesionales', category: 'Ropa', price: 24.99, stock: 90, image: '🧦' },
  { id: 18, name: 'Bomba de Aire', description: 'Bomba manual con aguja incluida', category: 'Accesorios', price: 14.99, stock: 70, image: '💨' },
  { id: 19, name: 'Botella de Agua', description: 'Botella deportiva 750ml', category: 'Accesorios', price: 9.99, stock: 120, image: '🍶' },
  { id: 20, name: 'Brazalete de Capitán', description: 'Brazalete elástico ajustable', category: 'Accesorios', price: 7.99, stock: 65, image: '💪' },
];

@Component({
  selector: 'app-search-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-demo.html',
  styleUrl: './search-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDemo implements OnInit, OnDestroy {
  // =============================================
  // CONTROL DEL INPUT DE BÚSQUEDA
  // =============================================
  searchControl = new FormControl('');
  categoryFilter = new FormControl('all');
  
  // =============================================
  // SEÑALES DE ESTADO
  // =============================================
  searchState = signal<SearchState>({
    results: [],
    loading: false,
    searchTerm: '',
    totalFound: 0,
    searchMode: 'local'
  });

  // Datos locales (para filtrado local)
  private allProducts: Product[] = [...MOCK_PRODUCTS];
  
  // Categorías disponibles (computadas)
  categories = computed(() => {
    const cats = new Set(this.allProducts.map(p => p.category));
    return ['all', ...Array.from(cats).sort()];
  });

  // Resultados filtrados (para template)
  results = computed(() => this.searchState().results);
  loading = computed(() => this.searchState().loading);
  searchTerm = computed(() => this.searchState().searchTerm);
  totalFound = computed(() => this.searchState().totalFound);
  searchMode = computed(() => this.searchState().searchMode);
  
  // Para unsubscribe
  private destroy$ = new Subject<void>();

  // =============================================
  // OBSERVABLE DE BÚSQUEDA CON DEBOUNCE
  // =============================================
  // Este es el patrón clave de la Tarea 5:
  // 1. valueChanges emite cada vez que el usuario escribe
  // 2. debounceTime(300) espera 300ms de inactividad
  // 3. distinctUntilChanged() evita búsquedas repetidas
  // =============================================
  search$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged()
  );

  category$ = this.categoryFilter.valueChanges.pipe(
    startWith('all')
  );

  ngOnInit(): void {
    // Inicializar con todos los productos
    this.updateState({
      results: this.allProducts,
      totalFound: this.allProducts.length
    });

    // Combinar búsqueda y categoría para filtrado
    combineLatest([this.search$, this.category$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([term, category]) => {
        this.performLocalSearch(term || '', category || 'all');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =============================================
  // FILTRADO LOCAL (Dataset pequeño en memoria)
  // =============================================
  // Ventajas:
  // - Instantáneo, sin latencia de red
  // - Funciona offline
  // - Ideal para < 1000 elementos
  // =============================================
  private performLocalSearch(term: string, category: string): void {
    const searchTerm = term.toLowerCase().trim();
    
    // Mostrar loading brevemente para UX consistente
    this.updateState({ loading: true, searchTerm: term });

    // Simular pequeño delay para mostrar el estado de carga
    setTimeout(() => {
      let filtered = this.allProducts;

      // Filtrar por término de búsqueda
      if (searchTerm) {
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
        );
      }

      // Filtrar por categoría
      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }

      // =============================================
      // ACTUALIZACIÓN INMUTABLE
      // Creamos un nuevo array, no mutamos el existente
      // Esto es clave para evitar flickering con OnPush
      // =============================================
      this.updateState({
        results: [...filtered], // Nuevo array (inmutable)
        loading: false,
        totalFound: filtered.length
      });
    }, 150); // Delay mínimo para mostrar loading
  }

  // =============================================
  // FILTRADO REMOTO (API externa)
  // =============================================
  // Ventajas:
  // - Maneja millones de registros
  // - Filtros complejos en servidor
  // - Paginación server-side
  // =============================================
  switchToRemoteMode(): void {
    this.updateState({ searchMode: 'remote' });
    // En modo remoto, usaríamos switchMap para cancelar
    // peticiones anteriores automáticamente:
    //
    // this.search$.pipe(
    //   switchMap(term => this.productService.search(term))
    // ).subscribe(results => this.updateState({ results }));
  }

  switchToLocalMode(): void {
    this.updateState({ searchMode: 'local' });
    this.performLocalSearch(
      this.searchControl.value || '',
      this.categoryFilter.value || 'all'
    );
  }

  // =============================================
  // SIMULACIÓN DE BÚSQUEDA REMOTA
  // =============================================
  performRemoteSearch(): void {
    const term = this.searchControl.value || '';
    
    this.updateState({ loading: true, searchTerm: term });

    // Simular llamada HTTP con delay
    setTimeout(() => {
      const searchTerm = term.toLowerCase().trim();
      const results = this.allProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );

      this.updateState({
        results: [...results],
        loading: false,
        totalFound: results.length
      });
    }, 800); // Simular latencia de red
  }

  // =============================================
  // TRACK BY - Evita recrear elementos DOM
  // =============================================
  // Angular usa el ID para identificar elementos
  // Si el ID no cambia, el DOM se reutiliza
  // Esto evita flickering y mejora rendimiento
  // =============================================
  trackById(index: number, item: Product): number {
    return item.id;
  }

  // =============================================
  // HELPER: Actualizar estado parcialmente
  // =============================================
  private updateState(partial: Partial<SearchState>): void {
    this.searchState.update(current => ({
      ...current,
      ...partial
    }));
  }

  // =============================================
  // LIMPIAR BÚSQUEDA
  // =============================================
  clearSearch(): void {
    this.searchControl.setValue('');
    this.categoryFilter.setValue('all');
  }

  // Highlight del término de búsqueda en resultados
  highlightTerm(text: string): string {
    const term = this.searchTerm();
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}
