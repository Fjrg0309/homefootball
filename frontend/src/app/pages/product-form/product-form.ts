import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductsSignalStore } from '../../services/products-signal.store';
import { ToastService } from '../../services/toast.service';
import { CreateProductDto, UpdateProductDto } from '../../models/product.model';

/**
 * ProductForm - Formulario de productos con Signals y OnPush
 * 
 * TAREA 2: Integración con ProductsSignalStore
 * TAREA 3: Optimización con OnPush
 * 
 * Al crear/editar un producto, el store (Signal) se actualiza automáticamente
 * y la lista de productos en otros componentes se refresca sin recargar.
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
  /**
   * TAREA 3: OnPush para optimización
   * 
   * En formularios, OnPush funciona bien porque:
   * - Los eventos de usuario (input, click) disparan detección
   * - Los signals locales (loading, isEditMode) se detectan automáticamente
   */
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private productsStore = inject(ProductsSignalStore); // Store con Signals
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  form!: FormGroup;
  isEditMode = signal(false);
  productId = signal<number | null>(null);
  loading = signal(false);

  categories = [
    'Electrónica',
    'Audio',
    'Fotografía',
    'Wearables',
    'Gaming',
    'Hogar',
    'Deportes',
    'Libros'
  ];

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(parseInt(id));
      this.loadProduct(parseInt(id));
    }
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          image: product.image
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.toastService.error('Error al cargar el producto');
        this.router.navigate(['/productos']);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    if (this.isEditMode()) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  /**
   * Crear producto y actualizar el store (Signal)
   * 
   * TAREA 2: Flujo con Signals:
   * 1. Llamar a la API para crear el producto
   * 2. La API devuelve el producto con ID asignado
   * 3. Añadir el producto al store con productsStore.add()
   * 4. El Signal _products se actualiza con .update()
   * 5. Todos los computed() se recalculan automáticamente
   * 6. Los componentes con OnPush que usan el Signal se actualizan
   */
  createProduct(): void {
    const dto: CreateProductDto = this.form.value;
    
    this.productService.create(dto).subscribe({
      next: (product) => {
        // TAREA 2: Añadir al store Signal para actualización reactiva
        this.productsStore.add(product);
        this.toastService.success('Producto creado exitosamente');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.toastService.error('Error al crear el producto');
        this.loading.set(false);
      }
    });
  }

  /**
   * Actualizar producto y sincronizar el store (Signal)
   * 
   * El store.update() usa signal.update() internamente,
   * lo que dispara la actualización en todos los componentes que leen el Signal.
   */
  updateProduct(): void {
    const id = this.productId();
    if (!id) return;

    const dto: UpdateProductDto = this.form.value;
    
    this.productService.patch(id, dto).subscribe({
      next: (product) => {
        // TAREA 2: Actualizar en el store Signal para actualización reactiva
        this.productsStore.update(product);
        this.toastService.success('Producto actualizado exitosamente');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.toastService.error('Error al actualizar el producto');
        this.loading.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/productos']);
  }

  // Helpers para validaciones
  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors || !control.touched) return '';

    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control.hasError('min')) {
      const min = control.errors['min'].min;
      return `Valor mínimo: ${min}`;
    }
    return '';
  }
}
