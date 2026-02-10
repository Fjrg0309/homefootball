import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { Minilanding } from '../minilanding/minilanding';
import { LandingService } from '../../services/landing.service';
import { AuthService } from '../../services/auth.service';
import { LandingPageData, EquipoDestacado, UsuarioPublico } from '../../models/landing.model';

/**
 * Componente CONTENEDOR (Padre) de la Landing Page.
 * 
 * Responsabilidades:
 * - Inyectar el servicio LandingService
 * - Recuperar los datos del backend
 * - Gestionar el control de flujo (loading, error, datos)
 * - Pasar datos al componente hijo (Minilanding) vía @Input
 * 
 * Arquitectura: Componente Contenedor según patrón Container/Presentational
 * 
 * @author DWEC - Prueba Práctica
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer, Minilanding],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
})
export class Landing implements OnInit {
  // Inyección de servicios
  private landingService = inject(LandingService);
  private authService = inject(AuthService);

  // Signals reactivos del servicio
  loading = computed(() => this.landingService.loading());
  error = computed(() => this.landingService.error());
  landingData = computed(() => this.landingService.landingData());
  
  // Estado de autenticación
  isLoggedIn = computed(() => this.authService.isLoggedIn());

  // Computed para extraer datos específicos para el hijo
  equipoDestacado = computed<EquipoDestacado | null>(() => {
    const data = this.landingData();
    return data?.equipoDestacado ?? null;
  });

  usuariosRegistrados = computed<UsuarioPublico[]>(() => {
    const data = this.landingData();
    return data?.usuariosRegistrados ?? [];
  });

  totalUsuarios = computed<number>(() => {
    const data = this.landingData();
    return data?.totalUsuarios ?? 0;
  });

  mensajeBienvenida = computed<string>(() => {
    const data = this.landingData();
    return data?.mensajeBienvenida ?? '¡Bienvenido a HomeFootball!';
  });

  ngOnInit(): void {
    // Cargar datos al iniciar el componente
    this.loadLandingData();
  }

  /**
   * Carga los datos de la landing page desde el backend.
   * Si el usuario está autenticado, obtiene datos completos.
   * Si no, muestra datos públicos por defecto.
   */
  loadLandingData(): void {
    if (this.isLoggedIn()) {
      this.landingService.getLandingData().subscribe();
    } else {
      // Cargar datos públicos si no está autenticado
      this.landingService.getLandingSummary().subscribe();
    }
  }

  /**
   * Reintenta cargar los datos (para el botón de reintentar).
   */
  retry(): void {
    this.loadLandingData();
  }
}
