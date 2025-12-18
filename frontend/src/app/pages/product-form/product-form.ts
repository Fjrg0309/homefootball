import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { CreateProductDto, UpdateProductDto } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
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

  createProduct(): void {
    const dto: CreateProductDto = this.form.value;
    
    this.productService.create(dto).subscribe({
      next: (product) => {
        this.toastService.success('Producto creado exitosamente');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.toastService.error('Error al crear el producto');
        this.loading.set(false);
      }
    });
  }

  updateProduct(): void {
    const id = this.productId();
    if (!id) return;

    const dto: UpdateProductDto = this.form.value;
    
    this.productService.patch(id, dto).subscribe({
      next: (product) => {
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
