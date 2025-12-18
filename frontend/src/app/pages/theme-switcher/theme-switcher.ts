import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss'
})
export class ThemeSwitcher implements OnInit {
  systemPreference: 'light' | 'dark' = 'light';
  hasStoredTheme = false;
  storedTheme: Theme | null = null;

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    // Detectar preferencia del sistema
    this.systemPreference = this.themeService.detectSystemPreference() ? 'dark' : 'light';
    
    // Verificar si hay tema guardado
    const stored = localStorage.getItem('theme');
    this.hasStoredTheme = !!stored;
    this.storedTheme = stored as Theme | null;

    // Habilitar escucha de cambios del sistema
    this.themeService.listenToSystemPreference();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.updateStoredTheme();
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
    this.updateStoredTheme();
  }

  clearStoredTheme() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('theme');
      this.hasStoredTheme = false;
      this.storedTheme = null;
      
      // Aplicar preferencia del sistema
      const prefersDark = this.themeService.detectSystemPreference();
      this.themeService.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  private updateStoredTheme() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('theme');
      this.hasStoredTheme = !!stored;
      this.storedTheme = stored as Theme | null;
    }
  }

  getCurrentTheme(): Theme {
    return this.themeService.getTheme();
  }
}
