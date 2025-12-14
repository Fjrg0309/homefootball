import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  @Input() variant: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() dismissible: boolean = false;
  @Input() show: boolean = true;
  
  @Output() dismissed = new EventEmitter<void>();

  dismiss(): void {
    this.show = false;
    this.dismissed.emit();
  }
}
