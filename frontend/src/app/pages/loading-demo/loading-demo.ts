import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-loading-demo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './loading-demo.html',
  styleUrl: './loading-demo.scss'
})
export class LoadingDemo {
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);

  isSaving = signal(false);
  isDeleting = signal(false);
  isUploading = signal(false);

  // Loading global
  simulateGlobalLoading() {
    this.loadingService.show();
    this.toastService.info('Iniciando operación global...');
    
    setTimeout(() => {
      this.loadingService.hide();
      this.toastService.success('Operación completada');
    }, 3000);
  }

  // Loading local en botón
  async simulateLocalLoading() {
    this.isSaving.set(true);
    this.toastService.info('Guardando...');

    setTimeout(() => {
      this.isSaving.set(false);
      this.toastService.success('Guardado exitoso');
    }, 2000);
  }

  // Múltiples operaciones concurrentes
  simulateMultipleOperations() {
    this.loadingService.show();
    this.toastService.info('Iniciando operación 1...');

    setTimeout(() => {
      this.loadingService.show();
      this.toastService.info('Iniciando operación 2...');
    }, 1000);

    setTimeout(() => {
      this.loadingService.hide();
      this.toastService.success('Operación 1 completada');
    }, 2500);

    setTimeout(() => {
      this.loadingService.hide();
      this.toastService.success('Operación 2 completada');
    }, 4000);
  }

  // Simular error
  simulateError() {
    this.isDeleting.set(true);
    this.loadingService.show();
    this.toastService.info('Eliminando...');

    setTimeout(() => {
      this.isDeleting.set(false);
      this.loadingService.hide();
      this.toastService.error('Error en la operación');
    }, 2000);
  }

  // Upload simulado
  simulateUpload() {
    this.isUploading.set(true);
    this.loadingService.show();
    this.toastService.info('Subiendo archivo...');

    setTimeout(() => {
      this.isUploading.set(false);
      this.loadingService.hide();
      this.toastService.success('Archivo subido correctamente');
    }, 3500);
  }

  // Reset manual
  resetLoading() {
    this.loadingService.reset();
    this.isSaving.set(false);
    this.isDeleting.set(false);
    this.isUploading.set(false);
    this.toastService.warning('Estado de loading reseteado');
  }
}
