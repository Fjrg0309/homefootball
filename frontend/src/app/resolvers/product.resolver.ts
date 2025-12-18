import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

// Resolver básico que retorna Product o null
export const productResolver: ResolveFn<Product | null> = (route, state) => {
  const service = inject(ProductService);
  const router = inject(Router);
  const id = parseInt(route.paramMap.get('id')!);

  return service.getById(id).pipe(
    catchError(err => {
      // Redirigir a la lista con mensaje de error en state
      router.navigate(['/productos'], {
        state: { error: `No se pudo cargar el producto con id ${id}` }
      });
      return of(null);
    })
  );
};
