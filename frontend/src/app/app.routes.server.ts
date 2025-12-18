import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // La página principal se renderiza en el cliente para evitar problemas de hidratación
  {
    path: '',
    renderMode: RenderMode.Client
  },
  // El resto se renderiza en el servidor
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
