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
  @Input() imageAlt?: string;
  @Input() title?: string;
  @Input() description?: string;
  @Input() horizontal: boolean = false;
}
