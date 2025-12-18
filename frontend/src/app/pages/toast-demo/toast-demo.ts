import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './toast-demo.html',
  styleUrl: './toast-demo.scss'
})
export class ToastDemo {
  private toastService = inject(ToastService);

  showSuccess() {
    this.toastService.success('¡Operación exitosa!');
  }

  showError() {
    this.toastService.error('Error de validación');
  }

  showInfo() {
    this.toastService.info('Información importante');
  }

  showWarning() {
    this.toastService.warning('Advertencia del sistema');
  }

  showCustomDuration() {
    this.toastService.success('Toast corto (2 segundos)', 2000);
  }

  showPersistent() {
    this.toastService.error('Sin auto-dismiss (click para cerrar)', 0);
  }

  showLongMessage() {
    this.toastService.info('Este es un mensaje largo que demuestra cómo el toast maneja textos extensos de manera adecuada con el diseño responsive.', 5000);
  }
}
