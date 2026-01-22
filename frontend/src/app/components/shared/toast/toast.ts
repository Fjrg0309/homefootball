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
    // Iconos SVG temáticos de fútbol
    const icons = {
      // GOL - para éxito
      success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 2a8 8 0 11-8 8 8 8 0 018-8zm0 2l-2.5 2 1 3h3l1-3z" opacity="0.3"/>
        <polygon points="12,6 9.5,8 10.5,11 13.5,11 14.5,8"/>
        <polygon points="6,10 7.5,13 10.5,11 9.5,8"/>
        <polygon points="7.5,13 9,16.5 12,15 10.5,11"/>
        <polygon points="18,10 16.5,8 13.5,11 14.5,13"/>
        <polygon points="16.5,13 15,16.5 12,15 13.5,11"/>
        <polygon points="9,16.5 12,18 15,16.5 12,15"/>
      </svg>`,
      // TARJETA ROJA - para error
      error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <rect x="5" y="2" width="14" height="20" rx="2" fill="currentColor"/>
        <path d="M9 8h6M9 12h6M9 16h4" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
      // SILBATO - para info
      info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <ellipse cx="16" cy="12" rx="6" ry="5" fill="currentColor"/>
        <circle cx="8" cy="12" r="4" fill="currentColor"/>
        <rect x="4" y="10" width="8" height="4" fill="currentColor"/>
        <circle cx="20" cy="12" r="1.5" fill="rgba(255,255,255,0.5)"/>
      </svg>`,
      // TARJETA AMARILLA - para warning
      warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <rect x="5" y="2" width="14" height="20" rx="2" fill="currentColor"/>
        <path d="M12 7v6M12 16v1" stroke="rgba(0,0,0,0.3)" stroke-width="2" stroke-linecap="round"/>
      </svg>`
    };
    return icons[type as keyof typeof icons] || icons.info;
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
