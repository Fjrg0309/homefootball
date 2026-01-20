import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FootballApiService } from '../../services/football-api.service';
import { FavoritoService, Favorito } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { LoginModalService } from '../../services/login-modal.service';

interface FavoriteItem {
  id: string | number;
  type: 'team' | 'league' | 'player';
  name: string;
  image: string;
  subtitle?: string;
  favoritoId?: number; // ID del favorito en la BD
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class Favorites implements OnInit {
  private router = inject(Router);
  private footballApi = inject(FootballApiService);
  private favoritoService = inject(FavoritoService);
  private authService = inject(AuthService);
  private loginModalService = inject(LoginModalService);

  // Estado
  favorites = signal<FavoriteItem[]>([]);
  
  // Estados de carga
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Tabs
  activeTab = signal<'all' | 'teams' | 'leagues' | 'players'>('all');
  
  // Usuario logueado
  isLoggedIn = this.authService.isLoggedIn;

  ngOnInit(): void {
    // Verificar sesión primero
    this.authService.checkSession();
    // Pequeño delay para asegurar que la sesión se restaure
    setTimeout(() => this.loadFavorites(), 50);
  }

  /**
   * Abrir modal de login
   */
  openLoginModal(): void {
    this.loginModalService.openLogin('/favoritos');
  }

  /**
   * Cargar favoritos desde el backend o localStorage
   */
  loadFavorites(): void {
    this.loading.set(true);
    
    if (this.authService.isLoggedIn()) {
      // Cargar desde backend
      this.favoritoService.loadFavoritos().subscribe({
        next: (favoritos) => {
          const items: FavoriteItem[] = favoritos.map(f => ({
            id: f.itemId,
            type: this.mapTipoToType(f.tipo),
            name: f.nombre,
            image: f.imagen,
            favoritoId: f.id
          }));
          this.favorites.set(items);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error cargando favoritos:', err);
          this.error.set('Error al cargar favoritos');
          this.loading.set(false);
        }
      });
    } else {
      // Cargar desde localStorage (sin login)
      this.loadFavoritesFromLocalStorage();
    }
  }

  /**
   * Cargar favoritos desde localStorage (modo sin login)
   */
  private loadFavoritesFromLocalStorage(): void {
    const allFavorites: FavoriteItem[] = [];
    let pendingRequests = 0;
    
    const favoriteTeams = this.getFavoriteTeams();
    const favoriteLeagues = this.getFavoriteLeagues();
    const favoritePlayers = this.getFavoritePlayers();
    
    pendingRequests = favoriteTeams.length + favoriteLeagues.length + favoritePlayers.length;
    
    if (pendingRequests === 0) {
      this.favorites.set([]);
      this.loading.set(false);
      return;
    }
    
    const checkComplete = () => {
      pendingRequests--;
      if (pendingRequests <= 0) {
        this.favorites.set(allFavorites);
        this.loading.set(false);
      }
    };
    
    // Obtener datos de equipos favoritos
    favoriteTeams.forEach(teamId => {
      this.footballApi.getTeamById(parseInt(teamId)).subscribe({
        next: (response) => {
          if (response.response && response.response.length > 0) {
            const team = response.response[0];
            allFavorites.push({
              id: team.team.id,
              type: 'team',
              name: team.team.name,
              image: team.team.logo,
              subtitle: team.team.country
            });
          }
          checkComplete();
        },
        error: () => checkComplete()
      });
    });
    
    // Obtener datos de ligas favoritas
    favoriteLeagues.forEach(leagueId => {
      this.footballApi.getLeagueById(parseInt(leagueId)).subscribe({
        next: (response) => {
          if (response.response && response.response.length > 0) {
            const league = response.response[0];
            allFavorites.push({
              id: league.league.id,
              type: 'league',
              name: league.league.name,
              image: league.league.logo,
              subtitle: league.country.name
            });
          }
          checkComplete();
        },
        error: () => checkComplete()
      });
    });
    
    // Obtener datos de jugadores favoritos
    favoritePlayers.forEach(playerId => {
      this.footballApi.getPlayerById(parseInt(playerId)).subscribe({
        next: (response) => {
          if (response.response && response.response.length > 0) {
            const player = response.response[0];
            allFavorites.push({
              id: player.player.id,
              type: 'player',
              name: player.player.name,
              image: player.player.photo,
              subtitle: player.statistics[0]?.team?.name || 'Jugador'
            });
          }
          checkComplete();
        },
        error: () => checkComplete()
      });
    });
  }

  private mapTipoToType(tipo: string): 'team' | 'league' | 'player' {
    switch (tipo) {
      case 'EQUIPO': return 'team';
      case 'LIGA': return 'league';
      case 'JUGADOR': return 'player';
      default: return 'team';
    }
  }

  /**
   * Filtrar favoritos por tab
   */
  getFilteredFavorites(): FavoriteItem[] {
    const tab = this.activeTab();
    const all = this.favorites();
    
    if (tab === 'all') return all;
    if (tab === 'teams') return all.filter(f => f.type === 'team');
    if (tab === 'leagues') return all.filter(f => f.type === 'league');
    if (tab === 'players') return all.filter(f => f.type === 'player');
    
    return all;
  }

  /**
   * Cambiar tab
   */
  setTab(tab: 'all' | 'teams' | 'leagues' | 'players'): void {
    this.activeTab.set(tab);
  }

  /**
   * Navegar al favorito
   */
  goToFavorite(fav: FavoriteItem): void {
    switch (fav.type) {
      case 'team':
        this.router.navigate(['/equipo', fav.id]);
        break;
      case 'league':
        this.router.navigate(['/liga', fav.id]);
        break;
      case 'player':
        this.router.navigate(['/jugador', fav.id]);
        break;
    }
  }

  /**
   * Eliminar favorito
   */
  removeFavorite(fav: FavoriteItem, event: Event): void {
    event.stopPropagation();
    
    const idStr = fav.id.toString();
    
    if (this.authService.isLoggedIn()) {
      // Eliminar del backend
      const tipo = this.mapTypeToTipo(fav.type);
      this.favoritoService.removeFavorito(tipo, Number(fav.id)).subscribe({
        next: (removed) => {
          if (removed) {
            this.favorites.update(favs => favs.filter(f => !(f.id === fav.id && f.type === fav.type)));
          }
        },
        error: (err) => console.error('Error eliminando favorito:', err)
      });
    } else {
      // Eliminar de localStorage
      if (fav.type === 'team') {
        const teams = this.getFavoriteTeams().filter(t => t !== idStr);
        localStorage.setItem('favorite-teams', JSON.stringify(teams));
      } else if (fav.type === 'league') {
        const leagues = this.getFavoriteLeagues().filter(l => l !== idStr);
        localStorage.setItem('favorite-leagues', JSON.stringify(leagues));
      } else if (fav.type === 'player') {
        const players = this.getFavoritePlayers().filter(p => p !== idStr);
        localStorage.setItem('favorite-players', JSON.stringify(players));
      }
      
      this.favorites.update(favs => favs.filter(f => !(f.id === fav.id && f.type === fav.type)));
    }
  }

  private mapTypeToTipo(type: string): string {
    switch (type) {
      case 'team': return 'EQUIPO';
      case 'league': return 'LIGA';
      case 'player': return 'JUGADOR';
      default: return 'EQUIPO';
    }
  }

  /**
   * Obtener equipos favoritos
   */
  private getFavoriteTeams(): string[] {
    try {
      const json = localStorage.getItem('favorite-teams');
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }

  /**
   * Obtener ligas favoritas
   */
  private getFavoriteLeagues(): string[] {
    try {
      const json = localStorage.getItem('favorite-leagues');
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }

  /**
   * Obtener jugadores favoritos
   */
  private getFavoritePlayers(): string[] {
    try {
      const json = localStorage.getItem('favorite-players');
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }

  /**
   * Obtener icono del tipo
   */
  getTypeIcon(type: string): string {
    switch (type) {
      case 'team': return '⚽';
      case 'league': return '🏆';
      case 'player': return '👤';
      default: return '📋';
    }
  }
}
