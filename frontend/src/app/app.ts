import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { Toast } from './components/shared/toast/toast';
import { Loading } from './components/shared/loading/loading';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toast, Loading],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    // Inicializar el tema al cargar la aplicación
    this.themeService.initializeTheme();
    
    // Escuchar cambios en la preferencia del sistema
    this.themeService.listenToSystemPreference();
  }
}
