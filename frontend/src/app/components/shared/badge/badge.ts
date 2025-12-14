import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  @Input() variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() rounded: boolean = false;
}
