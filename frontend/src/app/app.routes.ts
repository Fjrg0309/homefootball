import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Home } from './pages/home/home';
import { Settings } from './pages/settings/settings';
import { NotFound } from './components/shared/not-found/not-found';
import { authGuard, adminGuard } from './guards/auth.guard';
import { pendingChangesGuard } from './guards/pending-changes.guard';
import { ProductList } from './pages/product-list/product-list';
import { ProductDetail } from './pages/product-detail/product-detail';
import { ProductForm } from './pages/product-form/product-form';
import { productResolver } from './resolvers/product.resolver';

export const routes: Routes = [
  // Página principal
  { path: '', component: Home, data: { breadcrumb: 'Inicio' } },
  
  // Rutas públicas
  { path: 'register', component: Register, data: { breadcrumb: 'Registro' } },
  { path: 'about', component: About, data: { breadcrumb: 'Acerca' } },
  { path: 'ajustes', component: Settings, data: { breadcrumb: 'Ajustes' } },
  
  // Rutas protegidas con authGuard
  {
    path: 'profile', 
    component: Profile,
    canActivate: [authGuard],
    canDeactivate: [pendingChangesGuard],
    data: { breadcrumb: 'Perfil' }
  },
  
  // Lazy Loading con adminGuard
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    data: { breadcrumb: 'Admin' }
  },
  
  // Lazy Loading sin guard (público)
  {
    path: 'shop',
    loadChildren: () => import('./features/shop/shop.routes').then(m => m.SHOP_ROUTES),
    data: { breadcrumb: 'Tienda' }
  },
  
  // Rutas de productos con resolver y CRUD (Tarea 5 + Fase 5)
  { 
    path: 'productos', 
    component: ProductList,
    data: { breadcrumb: 'Productos' }
  },
  {
    path: 'productos/nuevo',
    component: ProductForm,
    canActivate: [authGuard],
    data: { breadcrumb: 'Nuevo Producto' }
  },
  { 
    path: 'productos/:id', 
    component: ProductDetail,
    resolve: { product: productResolver },
    data: { breadcrumb: 'Detalle' }
  },
  {
    path: 'productos/:id/editar',
    component: ProductForm,
    canActivate: [authGuard],
    data: { breadcrumb: 'Editar' }
  },
  
  // Demos de fases anteriores - LAZY LOADING (Fase 4)
  { 
    path: 'style-guide', 
    loadComponent: () => import('./pages/style-guide/style-guide').then(m => m.StyleGuide),
    data: { breadcrumb: 'Guía de Estilos' } 
  },
  { 
    path: 'dom-manipulation', 
    loadComponent: () => import('./pages/dom-manipulation/dom-manipulation').then(m => m.DomManipulation),
    data: { breadcrumb: 'DOM' } 
  },
  { 
    path: 'event-system', 
    loadComponent: () => import('./pages/event-system/event-system').then(m => m.EventSystem),
    data: { breadcrumb: 'Eventos' } 
  },
  { 
    path: 'interactive-components', 
    loadComponent: () => import('./pages/interactive-components/interactive-components').then(m => m.InteractiveComponents),
    data: { breadcrumb: 'Componentes Interactivos' } 
  },
  { 
    path: 'theme-switcher', 
    loadComponent: () => import('./pages/theme-switcher/theme-switcher').then(m => m.ThemeSwitcher),
    data: { breadcrumb: 'Temas' } 
  },
  { 
    path: 'communication', 
    loadComponent: () => import('./pages/communication-demo/communication-demo').then(m => m.CommunicationDemo),
    data: { breadcrumb: 'Comunicación' } 
  },
  { 
    path: 'toast-demo', 
    loadComponent: () => import('./pages/toast-demo/toast-demo').then(m => m.ToastDemo),
    data: { breadcrumb: 'Toast' } 
  },
  { 
    path: 'loading-demo', 
    loadComponent: () => import('./pages/loading-demo/loading-demo').then(m => m.LoadingDemo),
    data: { breadcrumb: 'Loading' } 
  },
  { 
    path: 'user-form', 
    loadComponent: () => import('./pages/user-form/user-form').then(m => m.UserForm),
    data: { breadcrumb: 'Formulario Usuario' } 
  },
  { 
    path: 'invoice-form', 
    loadComponent: () => import('./pages/invoice-form/invoice-form').then(m => m.InvoiceForm),
    data: { breadcrumb: 'Formulario Factura' } 
  },
  { 
    path: 'navigation-demo', 
    loadComponent: () => import('./pages/navigation-demo/navigation-demo').then(m => m.NavigationDemo),
    data: { breadcrumb: 'Navegación' } 
  },
  { 
    path: 'upload-demo', 
    loadComponent: () => import('./pages/upload-demo/upload-demo').then(m => m.UploadDemo),
    data: { breadcrumb: 'Upload' } 
  },
  
  // Demos de estados de carga (Fase 5, Tarea 5) - LAZY LOADING
  { 
    path: 'productos-with-states', 
    loadComponent: () => import('./pages/product-list-with-states/product-list-with-states').then(m => m.ProductListWithStates),
    data: { breadcrumb: 'Productos con Estados' } 
  },
  {
    path: 'productos-with-states/nuevo',
    loadComponent: () => import('./pages/product-form-with-feedback/product-form-with-feedback').then(m => m.ProductFormWithFeedback),
    canActivate: [authGuard],
    data: { breadcrumb: 'Nuevo (con Feedback)' }
  },
  {
    path: 'productos-with-states/:id/editar',
    loadComponent: () => import('./pages/product-form-with-feedback/product-form-with-feedback').then(m => m.ProductFormWithFeedback),
    canActivate: [authGuard],
    data: { breadcrumb: 'Editar (con Feedback)' }
  },
  
  // Liga partidos - Página de partidos de una liga (DEBE IR ANTES de liga/:id)
  {
    path: 'liga/:id/partidos',
    loadComponent: () => import('./pages/league-matches/league-matches').then(m => m.LeagueMatches),
    data: { breadcrumb: 'Partidos' }
  },
  
  // Liga clasificación - Página de clasificación de una liga (DEBE IR ANTES de liga/:id)
  {
    path: 'liga/:id/clasificacion',
    loadComponent: () => import('./pages/league-standings/league-standings').then(m => m.LeagueStandings),
    data: { breadcrumb: 'Clasificación' }
  },
  
  // Liga equipos - Página de equipos de una liga (DEBE IR ANTES de liga/:id)
  {
    path: 'liga/:id/equipos',
    loadComponent: () => import('./pages/league-teams/league-teams').then(m => m.LeagueTeams),
    data: { breadcrumb: 'Equipos' }
  },
  
  // Liga detalle - Página de liga seleccionada (DESPUÉS de las rutas específicas)
  {
    path: 'liga/:id',
    loadComponent: () => import('./pages/league-detail/league-detail').then(m => m.LeagueDetail),
    data: { breadcrumb: 'Liga' }
  },
  
  // Detalle de equipo
  {
    path: 'equipo/:id',
    loadComponent: () => import('./pages/team-detail/team-detail').then(m => m.TeamDetail),
    data: { breadcrumb: 'Equipo' }
  },
  
  // Detalle de partido
  {
    path: 'partido/:id',
    loadComponent: () => import('./pages/match-detail/match-detail').then(m => m.MatchDetail),
    data: { breadcrumb: 'Partido' }
  },
  
  // Búsqueda global
  {
    path: 'buscar',
    loadComponent: () => import('./pages/search-results/search-results').then(m => m.SearchResults),
    data: { breadcrumb: 'Búsqueda' }
  },
  
  // Fichajes (Transfers)
  {
    path: 'fichajes',
    loadComponent: () => import('./pages/transfers/transfers').then(m => m.Transfers),
    data: { breadcrumb: 'Fichajes' }
  },
  
  // Favoritos
  {
    path: 'favoritos',
    loadComponent: () => import('./pages/favorites/favorites').then(m => m.Favorites),
    data: { breadcrumb: 'Favoritos' }
  },
  
  // Detalle de jugador
  {
    path: 'jugador/:id',
    loadComponent: () => import('./pages/player-detail/player-detail').then(m => m.PlayerDetail),
    data: { breadcrumb: 'Jugador' }
  },
  
  // Noticias
  {
    path: 'noticias',
    loadComponent: () => import('./pages/news/news').then(m => m.News),
    data: { breadcrumb: 'Noticias' }
  },
  
  // Detalle de noticia
  {
    path: 'noticia/:id',
    loadComponent: () => import('./pages/news-detail/news-detail').then(m => m.NewsDetail),
    data: { breadcrumb: 'Noticia' }
  },
  
  // Demo de API-Football
  {
    path: 'football-demo',
    loadComponent: () => import('./pages/football-demo/football-demo.component').then(m => m.FootballDemoComponent),
    data: { breadcrumb: 'Football Demo' }
  },

  // TAREA 4: Demo de Paginación y Infinite Scroll
  {
    path: 'pagination-demo',
    loadComponent: () => import('./pages/pagination-demo/pagination-demo').then(m => m.PaginationDemo),
    data: { breadcrumb: 'Paginación Demo' }
  },

  // TAREA 5: Búsqueda y Filtrado en Tiempo Real
  {
    path: 'search-demo',
    loadComponent: () => import('./pages/search-demo/search-demo').then(m => m.SearchDemo),
    data: { breadcrumb: 'Búsqueda Demo' }
  },

  // TAREA 6: WebSockets y Polling (OPCIONAL)
  {
    path: 'realtime-demo',
    loadComponent: () => import('./pages/realtime-demo/realtime-demo').then(m => m.RealtimeDemo),
    data: { breadcrumb: 'Tiempo Real Demo' }
  },
  
  // Wildcard 404 - SIEMPRE AL FINAL
  { path: '**', component: NotFound }
];
