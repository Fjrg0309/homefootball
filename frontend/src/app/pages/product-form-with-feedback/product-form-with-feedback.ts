import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-form-with-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form-with-feedback.html',
  styleUrl: './product-form-with-feedback.scss'
})
export class ProductFormWithFeedback implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  form!: FormGroup;
  isEditMode = signal(false);
  productId = signal<number | null>(null);
  
  // Estados de operaciones
  isSaving = signal(false);
  saveSuccess = signal(false);
  saveError = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: ['https://via.placeholder.com/400x300', Validators.required]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.loadProduct(+id);
    }
  }

  private loadProduct(id: number): void {
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue(product);
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.toastService.error('No se pudo cargar el producto');
        this.router.navigate(['/productos']);
      }
    });
  }

  /**
   * Guardar con feedback visual completo
   * 
   * Estados:
   * 1. isSaving: true → Botón disabled, texto "Guardando..."
   * 2. Success → isSaving: false, saveSuccess: true, toast, redirección
   * 3. Error → isSaving: false, saveError: string, toast
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Resetear estados previos
    this.saveSuccess.set(false);
    this.saveError.set(null);
    this.isSaving.set(true);

    const operation$ = this.isEditMode()
      ? this.productService.patch(this.productId()!, this.form.value)
      : this.productService.create(this.form.value);

    operation$.subscribe({
      next: () => {
        // SUCCESS STATE
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        
        // Toast global
        const message = this.isEditMode() 
          ? 'Producto actualizado correctamente ✓'
          : 'Producto creado correctamente ✓';
        this.toastService.success(message);
        
        // Esperar 1.5s para mostrar el success antes de redirigir
        setTimeout(() => {
          this.router.navigate(['/productos-with-states']);
        }, 1500);
      },
      error: (err) => {
        // ERROR STATE
        console.error('Error al guardar producto:', err);
        this.isSaving.set(false);
        
        // Mensaje específico según código de error
        let errorMsg = 'No se pudo guardar el producto';
        if (err.status === 400) {
          errorMsg = 'Los datos del producto son inválidos';
        } else if (err.status === 409) {
          errorMsg = 'Ya existe un producto con ese nombre';
        } else if (err.status === 0) {
          errorMsg = 'Sin conexión al servidor';
        }
        
        this.saveError.set(errorMsg);
        this.toastService.error(errorMsg);
        
        // Auto-limpiar error después de 5 segundos
        setTimeout(() => {
          this.saveError.set(null);
        }, 5000);
      }
    });
  }

  /**
   * Cancelar y volver a la lista
   */
  cancel(): void {
    if (this.form.dirty && !confirm('¿Descartar cambios?')) {
      return;
    }
    this.router.navigate(['/productos-with-states']);
  }

  /**
   * Verificar si un campo tiene error y fue tocado
   */
  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Obtener mensaje de error para un campo
   */
  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['min']) {
      return `El valor debe ser mayor a ${control.errors['min'].min}`;
    }

    return 'Valor inválido';
  }
}
