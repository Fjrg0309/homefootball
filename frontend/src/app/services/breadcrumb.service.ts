import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  public breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbsSubject.asObservable();

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
        this.breadcrumbsSubject.next(breadcrumbs);
      });
  }

  /**
   * Construye las migas de pan recursivamente desde la raíz de rutas
   */
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    // Si la ruta tiene hijos, procesarlos
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    // Procesar cada hijo
    for (const child of children) {
      // Obtener el segmento de ruta
      const routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join('/');

      // Construir la URL completa
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Obtener el label del breadcrumb desde route.data
      const breadcrumbLabel = child.snapshot.data['breadcrumb'];

      // Si existe label, añadir el breadcrumb
      if (breadcrumbLabel) {
        breadcrumbs.push({
          label: breadcrumbLabel,
          url: url
        });
      }

      // Llamada recursiva para procesar hijos
      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  /**
   * Permite actualizar manualmente las migas (útil para casos especiales)
   */
  public setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  /**
   * Obtiene las migas actuales de forma síncrona
   */
  public getCurrentBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbsSubject.value;
  }
}
