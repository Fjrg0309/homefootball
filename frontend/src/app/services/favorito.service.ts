import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Favorito {
  id: number;
  usuarioId: number;
  tipo: 'LIGA' | 'EQUIPO' | 'JUGADOR';
  itemId: number;
  nombre: string;
  imagen: string;
  fechaCreacion: string;
}

export interface FavoritoRequest {
  tipo: string;
  itemId: number;
  nombre: string;
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl + '/favoritos';

  // Cache local de favoritos
  favoritos = signal<Favorito[]>([]);
  loading = signal<boolean>(false);

  // Cargar favoritos del usuario actual
  loadFavoritos(): Observable<Favorito[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.favoritos.set([]);
      return of([]);
    }

    this.loading.set(true);
    return this.http.get<Favorito[]>(`${this.apiUrl}/usuario/${userId}`).pipe(
      tap(favoritos => {
        this.favoritos.set(favoritos);
        this.loading.set(false);
      }),
      catchError(error => {
        console.error('Error cargando favoritos:', error);
        this.loading.set(false);
        return of([]);
      })
    );
  }

  // Cargar favoritos por tipo
  loadFavoritosByTipo(tipo: string): Observable<Favorito[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return of([]);
    }

    return this.http.get<Favorito[]>(`${this.apiUrl}/usuario/${userId}/tipo/${tipo}`).pipe(
      catchError(error => {
        console.error('Error cargando favoritos por tipo:', error);
        return of([]);
      })
    );
  }

  // Verificar si un elemento es favorito
  isFavorito(tipo: string, itemId: number): Observable<boolean> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return of(false);
    }

    return this.http.get<{ isFavorito: boolean }>(`${this.apiUrl}/check`, {
      params: { usuarioId: userId.toString(), tipo, itemId: itemId.toString() }
    }).pipe(
      map(response => response.isFavorito),
      catchError(() => of(false))
    );
  }

  // Verificar si un elemento es favorito (síncrono desde cache)
  isFavoritoSync(tipo: string, itemId: number): boolean {
    return this.favoritos().some(f => f.tipo === tipo && f.itemId === itemId);
  }

  // Añadir a favoritos
  addFavorito(request: FavoritoRequest): Observable<Favorito | null> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return of(null);
    }

    return this.http.post<Favorito>(`${this.apiUrl}/usuario/${userId}`, request).pipe(
      tap(favorito => {
        if (favorito) {
          this.favoritos.update(favs => [...favs, favorito]);
        }
      }),
      catchError(error => {
        console.error('Error añadiendo favorito:', error);
        return of(null);
      })
    );
  }

  // Eliminar de favoritos
  removeFavorito(tipo: string, itemId: number): Observable<boolean> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return of(false);
    }

    return this.http.delete<{ removed: boolean }>(`${this.apiUrl}/usuario/${userId}`, {
      params: { tipo, itemId: itemId.toString() }
    }).pipe(
      tap(response => {
        if (response.removed) {
          this.favoritos.update(favs => 
            favs.filter(f => !(f.tipo === tipo && f.itemId === itemId))
          );
        }
      }),
      map(response => response.removed),
      catchError(() => of(false))
    );
  }

  // Toggle favorito (añadir o eliminar)
  toggleFavorito(request: FavoritoRequest): Observable<{ action: string; isFavorito: boolean }> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return of({ action: 'error', isFavorito: false });
    }

    return this.http.post<any>(`${this.apiUrl}/usuario/${userId}/toggle`, request).pipe(
      tap(response => {
        if (response.action === 'added' && response.favorito) {
          this.favoritos.update(favs => [...favs, response.favorito]);
        } else if (response.action === 'removed') {
          this.favoritos.update(favs => 
            favs.filter(f => !(f.tipo === request.tipo.toUpperCase() && f.itemId === request.itemId))
          );
        }
      }),
      catchError(error => {
        console.error('Error toggle favorito:', error);
        return of({ action: 'error', isFavorito: false });
      })
    );
  }

  // Limpiar favoritos (al logout)
  clearFavoritos(): void {
    this.favoritos.set([]);
  }
}
