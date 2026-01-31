import { Injectable } from '@angular/core';

/**
 * Servicio para optimización de imágenes
 * Gestiona la selección del formato correcto (WebP, AVIF, fallback)
 * y tamaño según el contexto
 */
@Injectable({
  providedIn: 'root'
})
export class ImageOptimizerService {
  
  /**
   * Detecta soporte de formatos modernos de imagen
   */
  private formatSupport = {
    webp: this.supportsWebP(),
    avif: this.supportsAVIF()
  };

  /**
   * Genera srcset para imágenes responsive
   * @param basePath - Ruta base de la imagen (sin extensión)
   * @param sizes - Tamaños disponibles
   * @returns srcset string
   */
  generateSrcset(basePath: string, sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large']): string {
    const widths = {
      small: '400w',
      medium: '800w',
      large: '1200w'
    };

    return sizes
      .map(size => `${this.getOptimizedPath(basePath, size)} ${widths[size]}`)
      .join(', ');
  }

  /**
   * Obtiene la ruta optimizada de la imagen según el formato soportado
   * @param basePath - Ruta base de la imagen
   * @param size - Tamaño deseado
   * @returns URL de la imagen optimizada
   */
  getOptimizedPath(basePath: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    // Si la imagen viene de una API externa, devolverla tal cual
    if (basePath.startsWith('http://') || basePath.startsWith('https://')) {
      return basePath;
    }

    const extension = this.getImageExtension(basePath);
    const pathWithoutExt = basePath.replace(/\.(png|jpg|jpeg|webp|avif)$/i, '');

    // Prioridad: AVIF > WebP > Original
    if (this.formatSupport.avif) {
      return `/assets/images/avif/${size}/${pathWithoutExt}.avif`;
    } else if (this.formatSupport.webp) {
      return `/assets/images/webp/${size}/${pathWithoutExt}.webp`;
    } else {
      return `/assets/images/optimized/${size}/${pathWithoutExt}.${extension}`;
    }
  }

  /**
   * Genera elemento picture con múltiples formatos
   * @param basePath - Ruta base de la imagen
   * @param alt - Texto alternativo
   * @param sizes - Atributo sizes para srcset
   * @returns Objeto con configuración de picture
   */
  getPictureConfig(basePath: string, alt: string, sizes: string = '100vw') {
    const pathWithoutExt = basePath.replace(/\.(png|jpg|jpeg|webp|avif)$/i, '');
    const extension = this.getImageExtension(basePath);

    return {
      sources: [
        {
          type: 'image/avif',
          srcset: this.generateFormatSrcset(pathWithoutExt, 'avif'),
          sizes
        },
        {
          type: 'image/webp',
          srcset: this.generateFormatSrcset(pathWithoutExt, 'webp'),
          sizes
        }
      ],
      fallback: {
        src: `/assets/images/optimized/medium/${pathWithoutExt}.${extension}`,
        srcset: this.generateFormatSrcset(pathWithoutExt, extension),
        alt,
        sizes
      }
    };
  }

  /**
   * Genera srcset para un formato específico
   */
  private generateFormatSrcset(pathWithoutExt: string, format: string): string {
    const folder = format === 'avif' || format === 'webp' ? format : 'optimized';
    return [
      `/assets/images/${folder}/small/${pathWithoutExt}.${format} 400w`,
      `/assets/images/${folder}/medium/${pathWithoutExt}.${format} 800w`,
      `/assets/images/${folder}/large/${pathWithoutExt}.${format} 1200w`
    ].join(', ');
  }

  /**
   * Obtiene la extensión de la imagen
   */
  private getImageExtension(path: string): string {
    const match = path.match(/\.(png|jpg|jpeg)$/i);
    return match ? match[1].toLowerCase() : 'png';
  }

  /**
   * Detecta soporte de WebP
   */
  private supportsWebP(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }

  /**
   * Detecta soporte de AVIF
   */
  private supportsAVIF(): boolean {
    if (typeof window === 'undefined') return false;
    
    const avif = new Image();
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    
    return new Promise<boolean>((resolve) => {
      avif.onload = () => resolve(true);
      avif.onerror = () => resolve(false);
    }).then(result => result).catch(() => false) as any;
  }
}
