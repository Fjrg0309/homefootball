import { Component, ChangeDetectionStrategy, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService, ToastMessage } from '../../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class Toast implements OnDestroy {
  toast = signal<ToastMessage | null>(null);
  private timeoutId: any = null;
  private subscription?: Subscription;
  private toastService = inject(ToastService);

  constructor() {
    this.subscription = this.toastService.toast$.subscribe(msg => {
      this.dismiss(); // Cancela timeout anterior
      this.toast.set(msg);

      if (msg?.duration && msg.duration > 0) {
        this.timeoutId = setTimeout(() => {
          this.toast.set(null);
        }, msg.duration);
      }
    });
  }

  getIcon(type: string): string {
    // Iconos SVG temáticos de fútbol más originales
    const icons = {
      // PORTERÍA CON GOL - para éxito
      success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <!-- Portería -->
        <rect x="2" y="8" width="20" height="12" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="6" y1="8" x2="6" y2="20" stroke="currentColor" stroke-width="1.5"/>
        <line x1="18" y1="8" x2="18" y2="20" stroke="currentColor" stroke-width="1.5"/>
        <line x1="2" y1="14" x2="22" y2="14" stroke="currentColor" stroke-width="1" opacity="0.5"/>
        <!-- Balón entrando -->
        <circle cx="16" cy="6" r="2" fill="currentColor" opacity="0.8"/>
        <path d="M14.5 5l3 2" stroke="currentColor" stroke-width="1" opacity="0.6"/>
        <!-- Efecto de movimiento -->
        <circle cx="14" cy="4" r="1" fill="currentColor" opacity="0.4"/>
        <circle cx="12" cy="3" r="0.5" fill="currentColor" opacity="0.3"/>
      </svg>`,
      
      // TARJETA ROJA CON DETALLES - para error
      error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <!-- Tarjeta roja -->
        <rect x="6" y="3" width="12" height="18" rx="2" fill="#dc2626" stroke="#991b1b" stroke-width="1"/>
        <!-- Brillo -->
        <rect x="6" y="3" width="12" height="6" rx="2" fill="url(#redGradient)" opacity="0.3"/>
        <!-- Líneas de la tarjeta -->
        <line x1="8" y1="8" x2="16" y2="8" stroke="white" stroke-width="1" opacity="0.8"/>
        <line x1="8" y1="11" x2="16" y2="11" stroke="white" stroke-width="1" opacity="0.6"/>
        <line x1="8" y1="14" x2="14" y2="14" stroke="white" stroke-width="1" opacity="0.4"/>
        <!-- X de expulsión -->
        <path d="M10 16l4 4M14 16l-4 4" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <defs>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="white" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="white" stop-opacity="0"/>
          </linearGradient>
        </defs>
      </svg>`,
      
      // SILBATO DE ÁRBITRO - para info  
      info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <!-- Cuerpo del silbato -->
        <ellipse cx="14" cy="12" rx="7" ry="4" fill="currentColor"/>
        <circle cx="8" cy="12" r="3.5" fill="currentColor"/>
        <!-- Boquilla -->
        <rect x="4" y="10.5" width="8" height="3" rx="1.5" fill="currentColor"/>
        <!-- Agujeros del silbato -->
        <circle cx="16" cy="10" r="0.8" fill="rgba(255,255,255,0.6)"/>
        <circle cx="18" cy="12" r="0.8" fill="rgba(255,255,255,0.6)"/>
        <circle cx="16" cy="14" r="0.8" fill="rgba(255,255,255,0.6)"/>
        <!-- Cordón -->
        <path d="M8 8c-2-2-4-1-4 1s2 3 4 1" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <!-- Notas musicales (sonido) -->
        <path d="M20 6c1 0 1.5 1 1 2s-1.5 1-1 0M21.5 8.5c1 0 1.5 1 1 2s-1.5 1-1 0" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.7"/>
      </svg>`,
      
      // TARJETA AMARILLA CON DETALLES - para warning
      warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <!-- Tarjeta amarilla -->
        <rect x="6" y="3" width="12" height="18" rx="2" fill="#eab308" stroke="#ca8a04" stroke-width="1"/>
        <!-- Brillo -->
        <rect x="6" y="3" width="12" height="6" rx="2" fill="url(#yellowGradient)" opacity="0.4"/>
        <!-- Líneas de la tarjeta -->
        <line x1="8" y1="8" x2="16" y2="8" stroke="#92400e" stroke-width="1" opacity="0.8"/>
        <line x1="8" y1="11" x2="16" y2="11" stroke="#92400e" stroke-width="1" opacity="0.6"/>
        <line x1="8" y1="14" x2="14" y2="14" stroke="#92400e" stroke-width="1" opacity="0.4"/>
        <!-- Símbolo de advertencia -->
        <path d="M12 16l0 2M12 10l0 4" stroke="#92400e" stroke-width="2.5" stroke-linecap="round"/>
        <defs>
          <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="white" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="white" stop-opacity="0"/>
          </linearGradient>
        </defs>
      </svg>`
    };
    return icons[type as keyof typeof icons] || icons.info;
  }

  getLabel(type: string): string {
    const labels: Record<string, string> = {
      success: '¡GOL!',
      error: 'TARJETA ROJA',
      info: 'ÁRBITRO',
      warning: 'TARJETA AMARILLA'
    };
    return labels[type] || 'INFO';
  }

  dismiss() {
    this.toast.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  ngOnDestroy() {
    this.dismiss();
    this.subscription?.unsubscribe();
  }
}
