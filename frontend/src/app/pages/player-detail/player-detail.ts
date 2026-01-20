import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FootballApiService, PlayerData, PlayerStatistics } from '../../services/football-api.service';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

interface PlayerInfo {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  height: string;
  weight: string;
  photo: string;
  injured: boolean;
}

interface PlayerStats {
  team: string;
  teamLogo: string;
  league: string;
  leagueLogo: string;
  position: string;
  appearances: number;
  lineups: number;
  minutes: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: string;
  passAccuracy: number;
}

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './player-detail.html',
  styleUrl: './player-detail.scss'
})
export class PlayerDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private footballApi = inject(FootballApiService);
  private favoritoService = inject(FavoritoService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  // Estado
  playerId = signal<number>(0);
  player = signal<PlayerInfo | null>(null);
  stats = signal<PlayerStats | null>(null);
  
  // Estados de carga
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Favorito
  isFavorite = signal<boolean>(false);
  
  // Temporada (usar 2024 para datos más recientes)
  season = 2024;
  
  // Temporada de las estadísticas mostradas
  statsSeason = signal<string>('');

  // Datos computados
  playerName = computed(() => this.player()?.name || 'Jugador');
  playerPhoto = computed(() => this.player()?.photo || '');

  ngOnInit(): void {
    // Verificar sesión primero
    this.authService.checkSession();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.playerId.set(parseInt(id, 10));
        this.loadPlayerData();
        // Pequeño delay para asegurar que la sesión se restaure
        setTimeout(() => this.checkFavoriteStatus(), 50);
      }
    });
  }

  /**
   * Cargar datos del jugador
   */
  loadPlayerData(): void {
    const id = this.playerId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.footballApi.getPlayerById(id, this.season).subscribe({
      next: (response) => {
        console.log('✅ Jugador recibido:', response);
        if (response.response && response.response.length > 0) {
          const data = response.response[0];
          
          // Información del jugador
          this.player.set({
            id: data.player.id,
            name: data.player.name,
            firstname: data.player.firstname,
            lastname: data.player.lastname,
            age: data.player.age,
            birthDate: data.player.birth?.date || '',
            birthPlace: data.player.birth?.place || '',
            nationality: data.player.nationality,
            height: data.player.height || 'N/A',
            weight: data.player.weight || 'N/A',
            photo: data.player.photo,
            injured: data.player.injured
          });
          
          // Estadísticas del jugador (primera temporada disponible)
          if (data.statistics && data.statistics.length > 0) {
            const statData = data.statistics[0];
            this.stats.set({
              team: statData.team.name,
              teamLogo: statData.team.logo,
              league: statData.league.name,
              leagueLogo: statData.league.logo,
              position: this.translatePosition(statData.games.position),
              appearances: statData.games.appearances || 0,
              lineups: statData.games.lineups || 0,
              minutes: statData.games.minutes || 0,
              goals: statData.goals.total || 0,
              assists: statData.goals.assists || 0,
              yellowCards: statData.cards.yellow || 0,
              redCards: statData.cards.red || 0,
              rating: statData.games.rating || 'N/A',
              passAccuracy: statData.passes?.accuracy || 0
            });
            // Guardar la temporada de las estadísticas
            this.statsSeason.set(statData.league.season);
          } else {
            console.warn('⚠️ No hay estadísticas disponibles para la temporada', this.season);
          }
        } else {
          this.error.set('Jugador no encontrado');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando jugador:', err);
        this.error.set('Error al cargar el jugador');
        this.loading.set(false);
      }
    });
  }

  /**
   * Traducir posición
   */
  private translatePosition(position: string): string {
    const translations: Record<string, string> = {
      'Goalkeeper': 'Portero',
      'Defender': 'Defensa',
      'Midfielder': 'Centrocampista',
      'Attacker': 'Delantero'
    };
    return translations[position] || position || 'N/A';
  }

  /**
   * Toggle favorito
   */
  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.warning('Inicia sesión para guardar favoritos');
      return;
    }

    const playerInfo = this.player();
    if (!playerInfo) return;

    const currentIsFavorite = this.isFavorite();
    
    const request = {
      tipo: 'JUGADOR',
      itemId: this.playerId(),
      nombre: playerInfo.name,
      imagen: playerInfo.photo
    };

    this.favoritoService.toggleFavorito(request).subscribe({
      next: (response) => {
        console.log('Toggle response:', response);
        const nowIsFavorite = response.isFavorito;
        this.isFavorite.set(nowIsFavorite);
        
        if (nowIsFavorite) {
          this.toastService.success('Jugador añadido a favoritos');
        } else {
          this.toastService.info('Jugador eliminado de favoritos');
        }
      },
      error: (err) => {
        console.error('Error toggle favorito:', err);
        this.toastService.error('Error al actualizar favoritos');
      }
    });
  }

  /**
   * Verificar estado de favorito
   */
  private checkFavoriteStatus(): void {
    if (!this.authService.isLoggedIn()) {
      this.isFavorite.set(false);
      return;
    }

    const playerId = this.playerId();
    console.log('Checking favorite status for player:', playerId);
    
    this.favoritoService.isFavorito('JUGADOR', playerId).subscribe({
      next: (isFav) => {
        console.log('Player favorite status:', isFav);
        this.isFavorite.set(isFav);
      },
      error: (err) => {
        console.error('Error checking favorite:', err);
        this.isFavorite.set(false);
      }
    });
  }

  /**
   * Ir al equipo
   */
  goToTeam(teamId: number): void {
    // Necesitaríamos el ID del equipo, lo cual no tenemos directamente
    // Simplemente volvemos atrás
    this.goBack();
  }

  /**
   * Volver
   */
  goBack(): void {
    window.history.back();
  }
}
