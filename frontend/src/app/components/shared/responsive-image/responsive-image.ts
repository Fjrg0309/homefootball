import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

/**
 * Componente de imagen responsive optimizada
 * 
 * Características:
 * - Soporte para múltiples formatos (AVIF, WebP, JPG)
 * - srcset automático para diferentes tamaños
 * - Lazy loading por defecto
 * - Soporte para aspect ratio
 * - Art direction con elemento <picture>
 * 
 * @example
 * ```html
 * <app-responsive-image
 *   basePath="/assets/images/optimized/"
 *   imageName="hero-banner"
 *   alt="Banner principal"
 *   [aspectRatio]="16/9"
 *   [priority]="false"
 * />
 * ```
 */
@Component({
  selector: 'app-responsive-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <figure class="responsive-image" [class.responsive-image--priority]="priority">
      <picture class="responsive-image__picture">
        <!-- AVIF para navegadores modernos (mejor compresión) -->
        @if (supportsAvif) {
          <source 
            type="image/avif"
            [srcset]="getAvifSrcset()"
            [sizes]="getSizes()">
        }
        
        <!-- WebP como fallback intermedio -->
        @if (supportsWebp) {
          <source 
            type="image/webp"
            [srcset]="getWebpSrcset()"
            [sizes]="getSizes()">
        }
        
        <!-- Imagen fallback (JPG/PNG) -->
        <img 
          [src]="getFallbackSrc()"
          [srcset]="getFallbackSrcset()"
          [sizes]="getSizes()"
          [alt]="alt"
          [loading]="priority ? 'eager' : 'lazy'"
          [decoding]="priority ? 'sync' : 'async'"
          [width]="width"
          [height]="height"
          [style.aspect-ratio]="aspectRatio ? aspectRatio.toString() : null"
          class="responsive-image__img"
          [class.responsive-image__img--cover]="objectFit === 'cover'"
          [class.responsive-image__img--contain]="objectFit === 'contain'"
          (load)="onImageLoad()"
          (error)="onImageError($event)">
      </picture>
      
      <!-- Placeholder de carga -->
      @if (showPlaceholder && !loaded) {
        <div class="responsive-image__placeholder" [style.aspect-ratio]="aspectRatio">
          <div class="responsive-image__spinner"></div>
        </div>
      }
      
      <!-- Caption opcional -->
      @if (caption) {
        <figcaption class="responsive-image__caption">{{ caption }}</figcaption>
      }
    </figure>
  `,
  styleUrl: './responsive-image.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsiveImage {
  /** Ruta base donde se encuentran las imágenes */
  @Input() basePath: string = '/assets/images/';
  
  /** Nombre base de la imagen (sin extensión ni tamaño) */
  @Input({ required: true }) imageName!: string;
  
  /** Texto alternativo (obligatorio para accesibilidad) */
  @Input({ required: true }) alt!: string;
  
  /** Extensión del formato fallback */
  @Input() fallbackFormat: 'jpg' | 'png' = 'jpg';
  
  /** Ancho intrínseco de la imagen */
  @Input() width?: number;
  
  /** Alto intrínseco de la imagen */
  @Input() height?: number;
  
  /** Aspect ratio para mantener proporciones */
  @Input() aspectRatio?: number;
  
  /** Si es imagen prioritaria (above the fold) */
  @Input() priority: boolean = false;
  
  /** Comportamiento de ajuste de la imagen */
  @Input() objectFit: 'cover' | 'contain' | 'fill' = 'cover';
  
  /** Mostrar placeholder durante la carga */
  @Input() showPlaceholder: boolean = true;
  
  /** Caption o descripción de la imagen */
  @Input() caption?: string;
  
  /** Tamaños personalizados para srcset */
  @Input() customSizes?: string;
  
  /** Habilitar soporte AVIF */
  @Input() supportsAvif: boolean = true;
  
  /** Habilitar soporte WebP */
  @Input() supportsWebp: boolean = true;
  
  /** Estado de carga */
  loaded: boolean = false;
  
  /** Estado de error */
  error: boolean = false;

  // Tamaños estándar en píxeles
  private readonly sizes = {
    small: 400,
    medium: 800,
    large: 1200
  };

  /**
   * Genera el srcset para formato AVIF
   */
  getAvifSrcset(): string {
    return this.generateSrcset('avif');
  }

  /**
   * Genera el srcset para formato WebP
   */
  getWebpSrcset(): string {
    return this.generateSrcset('webp');
  }

  /**
   * Genera el srcset para formato fallback (JPG/PNG)
   */
  getFallbackSrcset(): string {
    return this.generateSrcset(this.fallbackFormat);
  }

  /**
   * Obtiene la URL de la imagen fallback (tamaño medium)
   */
  getFallbackSrc(): string {
    return `${this.basePath}${this.imageName}-medium.${this.fallbackFormat}`;
  }

  /**
   * Genera el srcset para un formato específico
   */
  private generateSrcset(format: string): string {
    const paths = Object.entries(this.sizes).map(([size, width]) => {
      const folder = format === this.fallbackFormat ? 'optimized' : format;
      return `${this.basePath}${folder}/${size}/${this.imageName}-${size}.${format} ${width}w`;
    });
    return paths.join(', ');
  }

  /**
   * Obtiene el atributo sizes para srcset
   */
  getSizes(): string {
    if (this.customSizes) {
      return this.customSizes;
    }
    // Configuración responsive por defecto
    return '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px';
  }

  /**
   * Manejador cuando la imagen carga correctamente
   */
  onImageLoad(): void {
    this.loaded = true;
    this.error = false;
  }

  /**
   * Manejador cuando hay error al cargar la imagen
   */
  onImageError(event: Event): void {
    this.error = true;
    this.loaded = true;
    console.warn(`Error loading image: ${this.imageName}`);
    
    // Intentar cargar imagen de fallback
    const img = event.target as HTMLImageElement;
    if (!img.src.includes('placeholder')) {
      img.src = `${this.basePath}placeholder.jpg`;
    }
  }
}
