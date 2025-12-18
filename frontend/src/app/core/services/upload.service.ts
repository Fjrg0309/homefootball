import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Respuesta del servidor tras subir archivo
 */
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Progreso de subida
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Servicio para subida de archivos con FormData
 */
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  /**
   * Subir imagen de producto
   * Usa FormData para enviar archivo + metadata
   * 
   * @example
   * this.uploadService.uploadProductImage(productId, file).subscribe({
   *   next: (response) => console.log('URL:', response.url),
   *   error: (err) => console.error('Error:', err)
   * });
   */
  uploadProductImage(productId: string, file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('productId', productId);
    
    // No establecer Content-Type manualmente
    // El navegador añade el boundary correcto automáticamente
    return this.http.post<UploadResponse>(
      `${this.baseUrl}/products/${productId}/image`,
      formData
    );
  }

  /**
   * Subir archivo con progreso
   * Reporta eventos de progreso para mostrar barra de carga
   * 
   * @example
   * this.uploadService.uploadWithProgress(file).subscribe({
   *   next: (event) => {
   *     if (event.type === HttpEventType.UploadProgress) {
   *       const progress = Math.round(100 * event.loaded / event.total!);
   *       console.log(`Progreso: ${progress}%`);
   *     }
   *   }
   * });
   */
  uploadWithProgress(file: File): Observable<HttpEvent<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', Date.now().toString());

    return this.http.post<UploadResponse>(
      `${this.baseUrl}/upload`,
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    );
  }

  /**
   * Subir múltiples archivos
   * 
   * @example
   * this.uploadService.uploadMultiple(files, 'gallery').subscribe({
   *   next: (response) => console.log('Archivos subidos:', response.length)
   * });
   */
  uploadMultiple(files: File[], category: string): Observable<UploadResponse[]> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    formData.append('category', category);
    formData.append('count', files.length.toString());

    return this.http.post<UploadResponse[]>(
      `${this.baseUrl}/upload/multiple`,
      formData
    );
  }

  /**
   * Descargar archivo como Blob (PDF, CSV, etc.)
   * Con headers personalizados
   * 
   * @example
   * this.uploadService.downloadReport('pdf').subscribe({
   *   next: (blob) => {
   *     const url = window.URL.createObjectURL(blob);
   *     const a = document.createElement('a');
   *     a.href = url;
   *     a.download = 'reporte.pdf';
   *     a.click();
   *   }
   * });
   */
  downloadReport(format: 'pdf' | 'csv' | 'excel'): Observable<Blob> {
    const headers = new HttpHeaders()
      .set('X-Report-Format', format)
      .set('X-Client-Version', 'web-1.0.0')
      .set('X-Export-Timestamp', new Date().toISOString());

    return this.http.get(`${this.baseUrl}/reports/sales`, {
      headers,
      responseType: 'blob'
    });
  }

  /**
   * Validar archivo antes de subir
   */
  validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
  }): { valid: boolean; error?: string } {
    const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB por defecto
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif'];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `El archivo excede el tamaño máximo de ${maxSize / 1024 / 1024}MB`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }
}
