import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageOptimizerService } from '../../../services/image-optimizer.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card implements OnInit {
  private imageOptimizer = inject(ImageOptimizerService);

  @Input() imageSrc?: string;
  @Input() imageWebp?: string;      // Versión WebP de la imagen (deprecated, usar imageSrc)
  @Input() imageSrcset?: string;    // srcset para imágenes responsivas (auto-generado)
  @Input() imageSizes?: string = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  @Input() imageAlt?: string;
  @Input() title?: string;
  @Input() description?: string;
  @Input() horizontal: boolean = false;
  @Input() lazyLoad: boolean = true; // Lazy loading por defecto
  @Input() useOptimization: boolean = true; // Usar optimización automática

  // Propiedades generadas automáticamente
  optimizedSrcset?: string;
  optimizedWebpSrcset?: string;
  optimizedAvifSrcset?: string;

  ngOnInit(): void {
    if (this.imageSrc && this.useOptimization) {
      // Si la imagen es local (no viene de API), generar srcsets optimizados
      if (!this.imageSrc.startsWith('http://') && !this.imageSrc.startsWith('https://')) {
        const config = this.imageOptimizer.getPictureConfig(this.imageSrc, this.imageAlt || '', this.imageSizes || '100vw');
        
        // Extraer srcsets de cada formato
        const avifSource = config.sources.find(s => s.type === 'image/avif');
        const webpSource = config.sources.find(s => s.type === 'image/webp');
        
        this.optimizedAvifSrcset = avifSource?.srcset;
        this.optimizedWebpSrcset = webpSource?.srcset || this.imageWebp;
        this.optimizedSrcset = config.fallback.srcset;
      } else {
        // Para imágenes externas, usar tal cual
        this.optimizedSrcset = this.imageSrcset;
        this.optimizedWebpSrcset = this.imageWebp;
      }
    }
  }
}
