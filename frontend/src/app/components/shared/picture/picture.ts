import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface para configurar diferentes imágenes por breakpoint (Art Direction)
 */
export interface ArtDirectionSource {
  /** URL de la imagen */
  src: string;
  /** Media query para este source */
  media: string;
  /** Tipo MIME opcional */
  type?: string;
  /** srcset para densidades de pantalla */
  srcset?: string;
}

/**
 * Componente Picture para Art Direction
 * 
 * Permite mostrar diferentes imágenes según el tamaño de pantalla.
 * Ideal para cuando la composición de la imagen debe cambiar
 * (no solo el tamaño).
 * 
 * @example
 * ```html
 * <app-picture
 *   [sources]="[
 *     { src: '/images/hero-mobile.webp', media: '(max-width: 600px)', type: 'image/webp' },
 *     { src: '/images/hero-tablet.webp', media: '(max-width: 1024px)', type: 'image/webp' },
 *     { src: '/images/hero-desktop.webp', media: '(min-width: 1025px)', type: 'image/webp' }
 *   ]"
 *   fallbackSrc="/images/hero-desktop.jpg"
 *   alt="Banner principal"
 *   [aspectRatio]="16/9"
 * />
 * ```
 */
@Component({
  selector: 'app-picture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <figure class="picture" [class]="containerClass">
      <picture class="picture__element">
        <!-- Sources con art direction -->
        @for (source of sources; track source.src) {
          <source 
            [srcset]="source.srcset || source.src"
            [media]="source.media"
            [type]="source.type">
        }
        
        <!-- Imagen fallback -->
        <img 
          [src]="fallbackSrc"
          [srcset]="fallbackSrcset"
          [sizes]="sizes"
          [alt]="alt"
          [loading]="loading"
          [decoding]="decoding"
          [width]="width"
          [height]="height"
          [style.aspect-ratio]="aspectRatio ? aspectRatio.toString() : null"
          [style.object-position]="objectPosition"
          class="picture__img"
          [class.picture__img--cover]="objectFit === 'cover'"
          [class.picture__img--contain]="objectFit === 'contain'"
          [class.picture__img--loaded]="isLoaded"
          (load)="handleLoad()"
          (error)="handleError($event)">
      </picture>
      
      <!-- Overlay opcional -->
      @if (showOverlay) {
        <div class="picture__overlay">
          <ng-content select="[overlay]"></ng-content>
        </div>
      }
      
      <!-- Caption -->
      @if (caption) {
        <figcaption class="picture__caption">{{ caption }}</figcaption>
      }
    </figure>
  `,
  styles: [`
    .picture {
      position: relative;
      margin: 0;
      padding: 0;
      line-height: 0;
      overflow: hidden;

      &__element {
        display: block;
        width: 100%;
      }

      &__img {
        display: block;
        width: 100%;
        height: auto;
        opacity: 0;
        transition: opacity 300ms ease-out;

        &--cover {
          object-fit: cover;
          height: 100%;
        }

        &--contain {
          object-fit: contain;
        }

        &--loaded {
          opacity: 1;
        }
      }

      &__overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          to bottom,
          transparent 0%,
          rgba(0, 0, 0, 0.5) 100%
        );
        pointer-events: none;

        > * {
          pointer-events: auto;
        }
      }

      &__caption {
        padding: var(--spacing-2);
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        text-align: center;
        line-height: 1.5;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Picture {
  /** Array de sources para art direction */
  @Input({ required: true }) sources: ArtDirectionSource[] = [];
  
  /** URL de imagen fallback */
  @Input({ required: true }) fallbackSrc!: string;
  
  /** srcset para la imagen fallback */
  @Input() fallbackSrcset?: string;
  
  /** Atributo sizes */
  @Input() sizes?: string;
  
  /** Texto alternativo (obligatorio) */
  @Input({ required: true }) alt!: string;
  
  /** Ancho de la imagen */
  @Input() width?: number;
  
  /** Alto de la imagen */
  @Input() height?: number;
  
  /** Aspect ratio */
  @Input() aspectRatio?: number;
  
  /** Comportamiento de carga */
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  
  /** Decodificación */
  @Input() decoding: 'async' | 'sync' | 'auto' = 'async';
  
  /** Object fit */
  @Input() objectFit: 'cover' | 'contain' | 'fill' = 'cover';
  
  /** Object position */
  @Input() objectPosition: string = 'center';
  
  /** Mostrar overlay */
  @Input() showOverlay: boolean = false;
  
  /** Caption */
  @Input() caption?: string;
  
  /** Clase CSS adicional */
  @Input() containerClass?: string;
  
  /** Evento cuando la imagen carga */
  @Output() imageLoaded = new EventEmitter<void>();
  
  /** Evento cuando hay error */
  @Output() imageError = new EventEmitter<Event>();
  
  /** Estado de carga */
  isLoaded: boolean = false;

  handleLoad(): void {
    this.isLoaded = true;
    this.imageLoaded.emit();
  }

  handleError(event: Event): void {
    this.isLoaded = true;
    this.imageError.emit(event);
    console.warn('Picture: Error loading image', this.fallbackSrc);
  }
}
