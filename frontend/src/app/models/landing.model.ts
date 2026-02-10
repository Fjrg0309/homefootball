/**
 * Interfaces para los datos de la Landing Page.
 * Tipado obligatorio según requisitos DWEC (prohibido any).
 * 
 * Estas interfaces reflejan la estructura del LandingPageDTO del backend.
 */

/**
 * Información pública de un usuario registrado.
 * Solo contiene datos no sensibles.
 */
export interface UsuarioPublico {
  id: number;
  username: string;
}

/**
 * Información del equipo destacado para mostrar en la landing.
 * Incluye el escudo/logo del equipo.
 */
export interface EquipoDestacado {
  id: number;
  nombre: string;
  fechaFundacion: string;
  ligaNombre: string;
  entrenadorNombre: string;
  totalJugadores: number;
  /** URL del escudo del equipo */
  escudoUrl: string;
}

/**
 * DTO principal de la Landing Page.
 * Contiene toda la información necesaria para mostrar en la página principal.
 */
export interface LandingPageData {
  /** Número total de usuarios registrados */
  totalUsuarios: number;
  /** Lista de usuarios con información pública */
  usuariosRegistrados: UsuarioPublico[] | null;
  /** Equipo destacado con escudo */
  equipoDestacado: EquipoDestacado;
  /** Mensaje de bienvenida personalizado */
  mensajeBienvenida: string;
}
