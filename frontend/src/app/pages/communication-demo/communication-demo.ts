import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sender } from './components/sender';
import { Receiver } from './components/receiver';

@Component({
  selector: 'app-communication-demo',
  standalone: true,
  imports: [RouterModule, Sender, Receiver],
  templateUrl: './communication-demo.html',
  styleUrl: './communication-demo.scss'
})
export class CommunicationDemo {
  // Componente padre solo contiene a los hermanos
  // No gestiona la comunicación entre ellos
}
