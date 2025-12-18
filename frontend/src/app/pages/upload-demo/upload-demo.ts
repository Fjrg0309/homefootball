import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { UploadService } from '../../core/services/upload.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-upload-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-demo.html',
  styleUrl: './upload-demo.scss'
})
export class UploadDemo {
  uploadService = inject(UploadService); // public para el template
  private toastService = inject(ToastService);

  selectedFile = signal<File | null>(null);
  uploadProgress = signal<number>(0);
  uploading = signal(false);
  uploadedUrl = signal<string | null>(null);
  
  // Para preview de imagen
  imagePreview = signal<string | null>(null);

  /**
   * Cuando usuario selecciona archivo
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validar archivo
      const validation = this.uploadService.validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });

      if (!validation.valid) {
        this.toastService.error(validation.error!);
        return;
      }

      this.selectedFile.set(file);
      
      // Generar preview
      this.generatePreview(file);
    }
  }

  /**
   * Generar preview de imagen
   */
  private generatePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  /**
   * Subir archivo con barra de progreso
   */
  uploadFile(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.uploadProgress.set(0);

    this.uploadService.uploadWithProgress(file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Calcular porcentaje de progreso
          if (event.total) {
            const progress = Math.round(100 * event.loaded / event.total);
            this.uploadProgress.set(progress);
          }
        } else if (event.type === HttpEventType.Response) {
          // Subida completada
          this.uploadedUrl.set(event.body!.url);
          this.toastService.success('Archivo subido exitosamente ✓');
          this.uploading.set(false);
        }
      },
      error: (err) => {
        console.error('Error al subir archivo:', err);
        this.toastService.error('Error al subir el archivo');
        this.uploading.set(false);
        this.uploadProgress.set(0);
      }
    });
  }

  /**
   * Subir imagen de producto (sin progreso)
   */
  uploadProductImage(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    const mockProductId = '123';

    this.uploadService.uploadProductImage(mockProductId, file).subscribe({
      next: (response) => {
        this.uploadedUrl.set(response.url);
        this.toastService.success(`Imagen subida: ${response.filename}`);
        this.uploading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toastService.error('Error al subir la imagen');
        this.uploading.set(false);
      }
    });
  }

  /**
   * Descargar reporte en PDF
   */
  downloadPDF(): void {
    this.toastService.info('Generando PDF...');
    
    this.uploadService.downloadReport('pdf').subscribe({
      next: (blob) => {
        // Crear URL temporal para el blob
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.toastService.success('PDF descargado ✓');
      },
      error: (err) => {
        console.error('Error al descargar PDF:', err);
        this.toastService.error('Error al generar el PDF');
      }
    });
  }

  /**
   * Limpiar formulario
   */
  clear(): void {
    this.selectedFile.set(null);
    this.imagePreview.set(null);
    this.uploadedUrl.set(null);
    this.uploadProgress.set(0);
  }

  /**
   * Formatear tamaño de archivo
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
