import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // ms, default por tipo
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  public toast$ = this.toastSubject.asObservable();

  private show(message: string, type: ToastMessage['type'], duration: number): void {
    this.toastSubject.next({ message, type, duration });
  }

  success(message: string, duration = 4000): void { 
    this.show(message, 'success', duration); 
  }

  error(message: string, duration = 8000): void { 
    this.show(message, 'error', duration); 
  }

  info(message: string, duration = 3000): void { 
    this.show(message, 'info', duration); 
  }

  warning(message: string, duration = 6000): void { 
    this.show(message, 'warning', duration); 
  }
}
