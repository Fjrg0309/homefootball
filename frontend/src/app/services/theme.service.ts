import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal para el tema actual
  currentTheme = signal<Theme>('light');

  constructor() {
    this.initializeTheme();
  }

  /**
   * Inicializa el tema al cargar la aplicación
   * 1. Lee localStorage
   * 2. Si no hay valor, detecta preferencia del sistema
   * 3. Aplica el tema
   */
  public initializeTheme(): void {
    // 1. Intentar leer tema guardado en localStorage
    const savedTheme = this.getStoredTheme();
    
    if (savedTheme) {
      // Si hay tema guardado, usarlo
      this.setTheme(savedTheme);
    } else {
      // Si no, detectar preferencia del sistema
      const prefersDark = this.detectSystemPreference();
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  /**
   * Detecta la preferencia de color del sistema usando matchMedia
   * @returns true si el sistema prefiere modo oscuro
   */
  detectSystemPreference(): boolean {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  /**
   * Lee el tema guardado en localStorage
   * @returns El tema guardado o null si no existe
   */
  private getStoredTheme(): Theme | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
    return null;
  }

  /**
   * Guarda el tema en localStorage
   * @param theme Tema a guardar
   */
  private storeTheme(theme: Theme): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }

  /**
   * Establece el tema actual
   * @param theme Tema a aplicar
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.applyThemeToDOM(theme);
    this.storeTheme(theme);
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Aplica el tema al DOM agregando/quitando clases
   * @param theme Tema a aplicar
   */
  private applyThemeToDOM(theme: Theme): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Remover ambas clases primero
      root.classList.remove('theme-light', 'theme-dark');
      
      // Agregar la clase del tema actual
      root.classList.add(`theme-${theme}`);
      
      // Opcional: actualizar atributo data-theme para CSS
      root.setAttribute('data-theme', theme);
    }
  }

  /**
   * Escucha cambios en la preferencia del sistema
   * Útil para reaccionar automáticamente a cambios del sistema operativo
   */
  listenToSystemPreference(): void {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Solo aplicar si no hay tema guardado por el usuario
        const savedTheme = this.getStoredTheme();
        if (!savedTheme) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  /**
   * Obtiene el tema actual
   * @returns El tema actual
   */
  getTheme(): Theme {
    return this.currentTheme();
  }

  /**
   * Verifica si el tema actual es oscuro
   * @returns true si el tema es oscuro
   */
  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  /**
   * Verifica si el tema actual es claro
   * @returns true si el tema es claro
   */
  isLight(): boolean {
    return this.currentTheme() === 'light';
  }
}
