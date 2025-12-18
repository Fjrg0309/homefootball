import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbService, Breadcrumb } from '../../../services/breadcrumb.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss'
})
export class BreadcrumbComponent {
  private breadcrumbService = inject(BreadcrumbService);
  
  // Convertir Observable a Signal con tipo explícito
  breadcrumbs: Signal<Breadcrumb[]> = toSignal(this.breadcrumbService.breadcrumbs$, { initialValue: [] });
}
