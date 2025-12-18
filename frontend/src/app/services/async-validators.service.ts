import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { switchMap, map, catchError, take, delay } from 'rxjs/operators';

/**
 * Servicio que proporciona validadores asíncronos con debounce automático
 * para evitar múltiples llamadas a API durante la escritura
 */
@Injectable({ providedIn: 'root' })
export class AsyncValidatorsService {
  private debounceTime = 500;

  /**
   * Valida que el email no esté registrado (simula API)
   * @param userId ID opcional del usuario para excluir de la validación (modo edición)
   */
  emailUnique(userId?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return timer(this.debounceTime).pipe(
        switchMap(() => this.checkEmail(control.value, userId)),
        take(1)
      );
    };
  }

  /**
   * Valida que el nombre de usuario esté disponible (simula API)
   */
  usernameAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = control.value;
      if (!username || username.length < 3) return of(null);

      return timer(this.debounceTime).pipe(
        switchMap(() => this.checkUsername(username)),
        take(1)
      );
    };
  }

  /**
   * Simula llamada a API para verificar email
   * Delay de 800ms para simular latencia de red realista
   */
  private checkEmail(email: string, userId?: string): Observable<ValidationErrors | null> {
    // Simulación: emails reservados
    const takenEmails = ['admin@example.com', 'test@example.com', 'taken@example.com'];
    const isTaken = takenEmails.includes(email.toLowerCase());

    return of(isTaken ? { emailTaken: true } : null).pipe(
      delay(800) // Simula latencia API
    );
  }

  /**
   * Simula llamada a API para verificar username
   * Delay de 600ms para simular latencia de red
   */
  private checkUsername(username: string): Observable<ValidationErrors | null> {
    // Simulación: usernames reservados
    const takenUsernames = ['admin', 'root', 'test', 'user'];
    const isTaken = takenUsernames.includes(username.toLowerCase());

    return of(isTaken ? { usernameTaken: true } : null).pipe(
      delay(600)
    );
  }
}
