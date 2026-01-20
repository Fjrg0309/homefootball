import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Comment {
  id: number;
  matchId: number;
  usuarioId: number;
  username: string;
  texto: string;
  fechaCreacion: string;
  isOwner: boolean;
}

export interface CreateCommentRequest {
  userId: number;
  texto: string;
}

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/comentarios';

  /**
   * Obtener comentarios de un partido
   */
  getCommentsByMatch(matchId: number, userId?: number): Observable<Comment[]> {
    let url = `${this.apiUrl}/match/${matchId}`;
    if (userId) {
      url += `?userId=${userId}`;
    }
    return this.http.get<Comment[]>(url).pipe(
      map(comments => comments.map(c => ({
        ...c,
        // Mapear al formato esperado por el componente
        user: c.username,
        text: c.texto
      }))),
      catchError(error => {
        console.error('Error al obtener comentarios:', error);
        return of([]);
      })
    );
  }

  /**
   * Crear un nuevo comentario
   */
  createComment(matchId: number, userId: number, texto: string): Observable<Comment | null> {
    const body: CreateCommentRequest = { userId, texto };
    return this.http.post<Comment>(`${this.apiUrl}/match/${matchId}`, body).pipe(
      map(comment => ({
        ...comment,
        user: comment.username,
        text: comment.texto
      })),
      catchError(error => {
        console.error('Error al crear comentario:', error);
        return of(null);
      })
    );
  }

  /**
   * Eliminar un comentario
   */
  deleteComment(commentId: number, userId: number): Observable<boolean> {
    return this.http.delete<{ deleted: boolean }>(
      `${this.apiUrl}/${commentId}?userId=${userId}`
    ).pipe(
      map(response => response.deleted),
      catchError(error => {
        console.error('Error al eliminar comentario:', error);
        return of(false);
      })
    );
  }
}
