import { Component, inject } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'app-sender',
  standalone: true,
  templateUrl: './sender.html',
  styleUrl: './sender.scss'
})
export class Sender {
  private commService = inject(CommunicationService);
  messageCount = 0;

  onAction() {
    this.messageCount++;
    this.commService.sendNotification(`Mensaje #${this.messageCount} desde Emisor`);
  }

  sendCustomMessage(message: string) {
    if (message.trim()) {
      this.commService.sendNotification(message);
    }
  }
}
