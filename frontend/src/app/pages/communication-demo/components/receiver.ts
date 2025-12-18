import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../../services/communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-receiver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receiver.html',
  styleUrl: './receiver.scss'
})
export class Receiver implements OnInit, OnDestroy {
  private commService = inject(CommunicationService);
  private subscription?: Subscription;
  
  receivedMessages: string[] = [];
  lastMessage = '';

  ngOnInit() {
    // Suscripción al Observable de notificaciones
    this.subscription = this.commService.notifications$.subscribe((msg: string) => {
      if (msg) {
        this.lastMessage = msg;
        this.receivedMessages.unshift(msg);
      }
    });
  }

  ngOnDestroy() {
    // Limpiar suscripción para evitar memory leaks
    this.subscription?.unsubscribe();
  }

  clearMessages() {
    this.receivedMessages = [];
    this.lastMessage = '';
  }
}
