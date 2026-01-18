import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FootballApiService, TeamData, PlayerData } from '../../services/football-api.service';

interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  photo: string;
  age: number;
  nationality: string;
  position: string;
  number: number | null;
}

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.scss'
})
export class TeamDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private footballApi = inject(FootballApiService);
  
  teamId = signal<number>(0);
  team = signal<TeamData | null>(null);
  players = signal<Player[]>([]);
  
  // Estados de carga
  loading = signal<boolean>(false);
  loadingPlayers = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Temporada actual
  season = signal<number>(2023);
  
  // Datos computados
  teamName = computed(() => this.team()?.team?.name || 'Equipo');
  teamLogo = computed(() => this.team()?.team?.logo || '');
  leagueName = computed(() => {
    // Intentar obtener la liga del primer jugador
    const playersList = this.players();
    if (playersList.length > 0) {
      const stats = (playersList[0] as any).statistics;
      if (stats && stats.length > 0) {
        return stats[0].league?.name || '';
      }
    }
    return '';
  });
  
  // Verificar si es favorito
  isFavorite = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.teamId.set(parseInt(id, 10));
        this.loadTeamData();
        this.loadPlayers();
        this.checkFavoriteStatus();
      }
    });
  }

  /**
   * Cargar información del equipo
   */
  loadTeamData(): void {
    const id = this.teamId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);
    
    console.log(`🔍 Cargando equipo ID: ${id}`);
    
    this.footballApi.getTeamById(id).subscribe({
      next: (response) => {
        console.log('✅ Equipo recibido:', response);
        if (response.response && response.response.length > 0) {
          this.team.set(response.response[0]);
        } else {
          this.error.set('Equipo no encontrado');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando equipo:', err);
        this.error.set('Error al cargar el equipo');
        this.loading.set(false);
      }
    });
  }

  /**
   * Cargar jugadores del equipo
   */
  loadPlayers(): void {
    const id = this.teamId();
    if (!id) return;

    this.loadingPlayers.set(true);
    
    console.log(`🔍 Cargando jugadores del equipo ID: ${id}, Temporada: ${this.season()}`);
    
    this.footballApi.getPlayersByTeam(id, this.season()).subscribe({
      next: (response) => {
        console.log('✅ Jugadores recibidos:', response);
        if (response.response && response.response.length > 0) {
          const playersList = response.response.map((p: PlayerData) => ({
            id: p.player.id,
            name: p.player.name,
            firstname: p.player.firstname,
            lastname: p.player.lastname,
            photo: p.player.photo,
            age: p.player.age,
            nationality: p.player.nationality,
            position: p.statistics?.[0]?.games?.position || 'N/A',
            number: p.statistics?.[0]?.games?.number ?? null
          }));
          this.players.set(playersList);
        } else {
          this.players.set([]);
        }
        this.loadingPlayers.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando jugadores:', err);
        this.loadingPlayers.set(false);
      }
    });
  }

  /**
   * Toggle favorito
   */
  toggleFavorite(): void {
    const teamId = this.teamId().toString();
    const favorites = this.getFavoriteTeams();
    
    if (favorites.includes(teamId)) {
      const index = favorites.indexOf(teamId);
      favorites.splice(index, 1);
      this.isFavorite.set(false);
    } else {
      favorites.push(teamId);
      this.isFavorite.set(true);
    }
    
    localStorage.setItem('favorite-teams', JSON.stringify(favorites));
  }

  /**
   * Verificar si el equipo está en favoritos
   */
  private checkFavoriteStatus(): void {
    const teamId = this.teamId().toString();
    const favorites = this.getFavoriteTeams();
    this.isFavorite.set(favorites.includes(teamId));
  }

  /**
   * Obtener equipos favoritos
   */
  private getFavoriteTeams(): string[] {
    try {
      const favoritesJson = localStorage.getItem('favorite-teams');
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch {
      return [];
    }
  }

  /**
   * Obtener nombre formateado del jugador
   */
  getPlayerDisplayName(player: Player): string {
    if (player.firstname && player.lastname) {
      return `${player.firstname} ${player.lastname}`;
    }
    return player.name;
  }

  /**
   * Obtener temporada formateada
   */
  getFormattedSeason(): string {
    const year = this.season();
    const nextYear = (year + 1).toString().slice(-2);
    return `${year}/${nextYear}`;
  }
}
