import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipoDestacado, UsuarioPublico } from '../../models/landing.model';

/**
 * Componente PRESENTACIONAL (Hijo) - Standalone
 * 
 * Responsabilidades:
 * - Recibir datos a través de decoradores @Input
 * - Renderizar la información del equipo destacado
 * - Mostrar la lista de usuarios registrados
 * - NO tiene lógica de negocio ni inyecta servicios
 * 
 * Este componente es Standalone y reutilizable.
 * Recibe la información del componente padre (Landing).
 * 
 * Arquitectura: Componente Presentacional según patrón Container/Presentational
 * 
 * @author DWEC - Prueba Práctica
 */
@Component({
  selector: 'app-minilanding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minilanding.html',
  styleUrl: './minilanding.scss',
})
export class Minilanding {
  /**
   * Información del equipo destacado recibida del padre.
   * Incluye nombre, escudo, liga, entrenador, etc.
   */
  @Input() equipoDestacado: EquipoDestacado | null = null;

  /**
   * Lista de usuarios registrados en la plataforma.
   * Solo información pública (id, username).
   */
  @Input() usuarios: UsuarioPublico[] = [];

  /**
   * Número total de usuarios registrados.
   */
  @Input() totalUsuarios: number = 0;

  /**
   * Indica si los datos están cargando.
   */
  @Input() loading: boolean = false;

  /**
   * Mensaje de error si hubo problemas al cargar.
   */
  @Input() error: string | null = null;
}
