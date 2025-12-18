import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input() imageSrc?: string;
  @Input() imageWebp?: string;      // Versión WebP de la imagen
  @Input() imageSrcset?: string;    // srcset para imágenes responsivas
  @Input() imageSizes?: string;     // sizes para srcset
  @Input() imageAlt?: string;
  @Input() title?: string;
  @Input() description?: string;
  @Input() horizontal: boolean = false;
  @Input() lazyLoad: boolean = true; // Lazy loading por defecto
}
