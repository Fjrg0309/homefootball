import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, retry, of, throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../core/services/api.service';
import { Product, CreateProductDto, UpdateProductDto, PaginatedResponse } from '../models/product.model';
import { ToastService } from './toast.service';

/**
 * ViewModel enriquecido para la UI
 */
export interface ProductViewModel extends Product {
  priceWithTax: number;
  inStock: boolean;
  displayPrice: string;
  createdAtDate?: Date;
}

/**
 * Opciones de filtrado
 */
export interface ProductFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = inject(ApiService);
  private toastService = inject(ToastService);
  private endpoint = 'posts'; // JSONPlaceholder endpoint (simula products)

  /**
   * GET /products - Obtener todos los productos
   * Con retry (2 intentos) y manejo de errores
   */
  getAll(): Observable<Product[]> {
    return this.api.get<any[]>(this.endpoint).pipe(
      retry(2), // Reintentar 2 veces si falla
      map(posts => this.mapPostsToProducts(posts)),
      catchError(err => {
        console.error('❌ Error al cargar productos:', err);
        this.toastService.error('No se pudieron cargar los productos');
        return of([]); // Retornar array vacío en caso de error
      })
    );
  }

  /**
   * GET /products - ViewModel con datos transformados para UI
   * Añade campos calculados: priceWithTax, inStock, displayPrice
   */
  getAllViewModel(): Observable<ProductViewModel[]> {
    return this.getAll().pipe(
      map(products => products.map(p => this.toViewModel(p)))
    );
  }

  /**
   * GET /products?page=1&limit=10 - Obtener productos paginados
   * Con query params usando HttpParams
   */
  getAllPaginated(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', pageSize.toString());

    return this.api.get<any[]>(this.endpoint, { params }).pipe(
      retry(2),
      map(posts => ({
        data: this.mapPostsToProducts(posts),
        total: 100, // Mock total
        page,
        pageSize
      })),
      catchError(err => {
        console.error('❌ Error en paginación:', err);
        return throwError(() => new Error('No se pudo cargar la página de productos'));
      })
    );
  }

  /**
   * GET /products con filtros completos
   * Usa HttpParams para construir query string
   * 
   * @example
   * getFiltered({ page: 1, pageSize: 20, search: 'laptop', minPrice: 100 })
   * → /products?page=1&pageSize=20&search=laptop&minPrice=100
   */
  getFiltered(filters: ProductFilters): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams();
    
    // Añadir solo params con valor
    if (filters.page) params = params.set('_page', filters.page.toString());
    if (filters.pageSize) params = params.set('_limit', filters.pageSize.toString());
    if (filters.search) params = params.set('q', filters.search);
    if (filters.category) params = params.set('userId', filters.category); // Mock category
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy) params = params.set('_sort', filters.sortBy);
    if (filters.sortOrder) params = params.set('_order', filters.sortOrder);

    return this.api.get<any[]>(this.endpoint, { params }).pipe(
      retry(2),
      map(posts => ({
        data: this.mapPostsToProducts(posts),
        total: 100,
        page: filters.page || 1,
        pageSize: filters.pageSize || 10
      })),
      catchError(err => {
        console.error('❌ Error al filtrar productos:', err);
        this.toastService.error('Error al aplicar filtros');
        return of({
          data: [],
          total: 0,
          page: filters.page || 1,
          pageSize: filters.pageSize || 10
        });
      })
    );
  }

  /**
   * GET /products/:id - Obtener producto por ID
   * Con retry y manejo de errores específico
   */
  getById(id: number): Observable<Product> {
    return this.api.get<any>(`${this.endpoint}/${id}`).pipe(
      retry(1), // Solo 1 reintento para GETs de recursos específicos
      map(post => this.mapPostToProduct(post)),
      catchError(err => {
        console.error(`❌ Error al cargar producto ${id}:`, err);
        
        if (err.status === 404) {
          this.toastService.error(`Producto ${id} no encontrado`);
        } else {
          this.toastService.error('Error al cargar el producto');
        }
        
        return throwError(() => new Error(`Producto ${id} no disponible`));
      })
    );
  }

  /**
   * GET /products/:id - ViewModel con transformaciones
   */
  getByIdViewModel(id: number): Observable<ProductViewModel> {
    return this.getById(id).pipe(
      map(product => this.toViewModel(product))
    );
  }

  /**
   * GET /products?category=Electronics - Filtrar por categoría
   * Usa HttpParams para query strings
   */
  getByCategory(category: string): Observable<Product[]> {
    const params = new HttpParams().set('userId', category);
    
    return this.api.get<any[]>(this.endpoint, { params }).pipe(
      retry(2),
      map(posts => this.mapPostsToProducts(posts)),
      catchError(() => of([])) // Retorna vacío si falla
    );
  }

  /**
   * GET /products?search=laptop - Buscar productos
   * Con query params y manejo de búsquedas vacías
   */
  search(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return of([]); // No buscar si query está vacío
    }

    const params = new HttpParams().set('q', query.trim());
    
    return this.api.get<any[]>(this.endpoint, { params }).pipe(
      retry(1),
      map(posts => this.mapPostsToProducts(posts)),
      catchError(err => {
        console.error('❌ Error en búsqueda:', err);
        this.toastService.error('Error al buscar productos');
        return of([]);
      })
    );
  }

  /**
   * POST /products - Crear producto
   * Sin retry (operaciones de escritura no son idempotentes)
   */
  create(product: CreateProductDto): Observable<Product> {
    const body = {
      title: product.name,
      body: product.description,
      userId: 1
    };
    
    return this.api.post<any>(this.endpoint, body).pipe(
      map(post => this.mapPostToProduct(post)),
      catchError(err => {
        console.error('❌ Error al crear producto:', err);
        
        if (err.status === 400) {
          this.toastService.error('Datos inválidos. Revisa el formulario.');
        } else if (err.status === 409) {
          this.toastService.error('El producto ya existe.');
        } else {
          this.toastService.error('No se pudo crear el producto.');
        }
        
        return throwError(() => new Error('Error al crear producto'));
      })
    );
  }

  /**
   * PUT /products/:id - Actualizar producto (completo)
   */
  update(id: number, product: Product): Observable<Product> {
    const body = {
      id,
      title: product.name,
      body: product.description,
      userId: 1
    };
    return this.api.put<any>(`${this.endpoint}/${id}`, body).pipe(
      map(post => this.mapPostToProduct(post))
    );
  }

  /**
   * PATCH /products/:id - Actualizar producto (parcial)
   */
  patch(id: number, changes: UpdateProductDto): Observable<Product> {
    const body: any = {};
    if (changes.name) body.title = changes.name;
    if (changes.description) body.body = changes.description;
    
    return this.api.patch<any>(`${this.endpoint}/${id}`, body).pipe(
      map(post => this.mapPostToProduct(post))
    );
  }

  /**
   * DELETE /products/:id - Eliminar producto
   * Sin retry (operación de escritura)
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`).pipe(
      catchError(err => {
        console.error(`❌ Error al eliminar producto ${id}:`, err);
        
        if (err.status === 404) {
          this.toastService.error('El producto ya no existe.');
        } else if (err.status === 409) {
          this.toastService.error('No se puede eliminar. Tiene dependencias.');
        } else {
          this.toastService.error('No se pudo eliminar el producto.');
        }
        
        return throwError(() => new Error(`Error al eliminar producto ${id}`));
      })
    );
  }

  /**
   * Método auxiliar: verificar si hay stock
   */
  hasStock(productId: number, quantity: number = 1): Observable<boolean> {
    return this.getById(productId).pipe(
      map(product => product.stock >= quantity),
      catchError(() => of(false)) // Si falla, asume sin stock
    );
  }

  /**
   * Transformar Product a ProductViewModel
   * Añade campos calculados para la UI
   */
  private toViewModel(product: Product): ProductViewModel {
    const TAX_RATE = 0.21; // 21% IVA
    const priceWithTax = product.price * (1 + TAX_RATE);
    
    return {
      ...product,
      priceWithTax,
      inStock: product.stock > 0,
      displayPrice: `$${product.price.toFixed(2)}`,
      createdAtDate: product.createdAt ? new Date(product.createdAt) : undefined
    };
  }

  // Mappers para JSONPlaceholder (post -> product)
  private mapPostToProduct(post: any): Product {
    return {
      id: post.id,
      name: post.title || 'Producto sin nombre',
      description: post.body || 'Sin descripción',
      price: Math.random() * 1000 + 50, // Mock price
      category: `Categoría ${post.userId}`,
      stock: Math.floor(Math.random() * 100),
      image: '📦',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private mapPostsToProducts(posts: any[]): Product[] {
    return posts.map(post => this.mapPostToProduct(post));
  }
}
