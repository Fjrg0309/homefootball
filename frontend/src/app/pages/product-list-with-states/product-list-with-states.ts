import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

/**
 * View Model para gestionar estados de la petición
 */
interface ProductsState {
  loading: boolean;
  error: string | null;
  data: Product[] | null;
}

/**
 * Estado para operaciones de escritura (DELETE)
 */
interface DeletionState {
  isDeleting: boolean;
  deletingId: number | null;
}

@Component({
  selector: 'app-product-list-with-states',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list-with-states.html',
  styleUrl: './product-list-with-states.scss'
})
export class ProductListWithStates implements OnInit {
  private productService = inject(ProductService);

  // Estado principal de la lista
  state = signal<ProductsState>({
    loading: false,
    error: null,
    data: null
  });

  // Estado para operaciones de eliminación
  deletionState = signal<DeletionState>({
    isDeleting: false,
    deletingId: null
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Cargar productos con gestión de estados
   * 
   * Estados:
   * 1. loading: true → Mostrar spinner
   * 2. success → loading: false, data: Product[]
   * 3. error → loading: false, error: string
   */
  loadProducts(): void {
    // Estado inicial: loading
    this.state.update(() => ({ 
      loading: true, 
      error: null, 
      data: null 
    }));

    this.productService.getAll().subscribe({
      next: (products) => {
        // Estado success: datos cargados
        this.state.update(() => ({ 
          loading: false, 
          error: null, 
          data: products 
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        
        // Estado error: mensaje al usuario
        this.state.update(() => ({ 
          loading: false, 
          error: 'Error al cargar productos. Por favor, inténtalo de nuevo.', 
          data: null 
        }));
      }
    });
  }

  /**
   * Eliminar producto con estado de carga local
   */
  deleteProduct(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    // Establecer estado de eliminación
    this.deletionState.set({ 
      isDeleting: true, 
      deletingId: id 
    });

    this.productService.delete(id).subscribe({
      next: () => {
        // Éxito: resetear estado y recargar lista
        this.deletionState.set({ 
          isDeleting: false, 
          deletingId: null 
        });
        
        // Opcional: eliminar del estado local sin recargar
        this.state.update(current => ({
          ...current,
          data: current.data?.filter(p => p.id !== id) || null
        }));
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
        
        // Error: resetear estado
        this.deletionState.set({ 
          isDeleting: false, 
          deletingId: null 
        });
        
        // Mostrar error en el estado principal
        this.state.update(current => ({
          ...current,
          error: 'No se pudo eliminar el producto'
        }));
      }
    });
  }

  /**
   * Determinar si un producto está siendo eliminado
   */
  isDeleting(productId: number): boolean {
    return this.deletionState().isDeleting && 
           this.deletionState().deletingId === productId;
  }

  /**
   * Limpiar mensaje de error
   */
  clearError(): void {
    this.state.update(current => ({
      ...current,
      error: null
    }));
  }
}
