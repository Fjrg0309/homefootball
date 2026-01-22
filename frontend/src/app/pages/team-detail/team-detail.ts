import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FootballApiService, TeamData, PlayerData, LeagueData, SquadData, SquadPlayer } from '../../services/football-api.service';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

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
  private favoritoService = inject(FavoritoService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  teamId = signal<number>(0);
  team = signal<TeamData | null>(null);
  players = signal<Player[]>([]);
  teamLeague = signal<string>('');
  
  // Estados de carga
  loading = signal<boolean>(false);
  loadingPlayers = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Temporada actual (2024 para datos actualizados)
  season = signal<number>(2024);
  
  // Datos computados
  teamName = computed(() => this.team()?.team?.name || 'Equipo');
  teamLogo = computed(() => this.team()?.team?.logo || '');
  leagueName = computed(() => this.teamLeague());
  
  // Verificar si es favorito
  isFavorite = signal<boolean>(false);
  
  // Usuario logueado
  isLoggedIn = this.authService.isLoggedIn;

  ngOnInit(): void {
    // Verificar sesión primero
    this.authService.checkSession();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.teamId.set(parseInt(id, 10));
        this.loadTeamData();
        this.loadPlayers();
        this.loadTeamLeague();
        // Pequeño delay para asegurar que la sesión se restaure
        setTimeout(() => this.checkFavoriteStatus(), 50);
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
   * Cargar la liga del equipo
   */
  loadTeamLeague(): void {
    const id = this.teamId();
    if (!id) return;

    // Obtener ligas donde juega el equipo
    this.footballApi.getLeaguesByTeam(id, this.season()).subscribe({
      next: (response) => {
        console.log('✅ Ligas del equipo recibidas:', response);
        if (response.response && response.response.length > 0) {
          // Buscar la liga principal (tipo "League", no copa)
          const mainLeague = response.response.find(
            (l: LeagueData) => l.league.type === 'League'
          );
          if (mainLeague) {
            this.teamLeague.set(mainLeague.league.name);
          } else {
            // Si no hay liga, usar la primera competición
            this.teamLeague.set(response.response[0].league.name);
          }
        }
      },
      error: (err) => {
        console.error('❌ Error cargando liga del equipo:', err);
      }
    });
  }

  /**
   * Cargar jugadores del equipo - Usa endpoint /squads que devuelve SOLO primer equipo
   */
  loadPlayers(): void {
    const id = this.teamId();
    if (!id) return;

    this.loadingPlayers.set(true);
    
    console.log(`🔍 Cargando plantilla del primer equipo ID: ${id}`);
    
    // Usar el endpoint de squads que solo devuelve jugadores del primer equipo
    this.footballApi.getTeamSquad(id).subscribe({
      next: (response) => {
        console.log('✅ Plantilla recibida:', response);
        if (response.response && response.response.length > 0 && response.response[0].players) {
          const squad = response.response[0];
          const playersList = squad.players.map((p: SquadPlayer) => ({
            id: p.id,
            name: p.name,
            firstname: p.name.split(' ')[0] || p.name,
            lastname: p.name.split(' ').slice(1).join(' ') || '',
            photo: p.photo,
            age: p.age,
            nationality: '', // El endpoint squads no incluye nacionalidad
            position: this.translatePosition(p.position),
            number: p.number
          }));
          // Ordenar por dorsal (null al final)
          playersList.sort((a: Player, b: Player) => {
            if (a.number === null) return 1;
            if (b.number === null) return -1;
            return a.number - b.number;
          });
          this.players.set(playersList);
        } else {
          this.players.set([]);
        }
        this.loadingPlayers.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando plantilla:', err);
        this.loadingPlayers.set(false);
      }
    });
  }

  /**
   * Traduce la posición del inglés al español
   */
  private translatePosition(position: string): string {
    const translations: Record<string, string> = {
      'Goalkeeper': 'Portero',
      'Defender': 'Defensa',
      'Midfielder': 'Centrocampista',
      'Attacker': 'Delantero'
    };
    return translations[position] || position;
  }

  /**
   * Toggle favorito
   */
  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.error('Inicia sesión para guardar favoritos');
      return;
    }

    const team = this.team();
    if (!team) return;

    const request = {
      tipo: 'EQUIPO',
      itemId: this.teamId(),
      nombre: team.team.name,
      imagen: team.team.logo
    };

    this.favoritoService.toggleFavorito(request).subscribe({
      next: (response) => {
        console.log('Toggle response:', response);
        const nowIsFavorite = response.isFavorito;
        this.isFavorite.set(nowIsFavorite);
        
        if (nowIsFavorite) {
          this.toastService.success('Equipo añadido a favoritos');
        } else {
          this.toastService.info('Equipo eliminado de favoritos');
        }
      },
      error: (err) => {
        console.error('Error toggle favorito:', err);
        this.toastService.error('Error al actualizar favoritos');
      }
    });
  }

  /**
   * Verificar si el equipo está en favoritos
   */
  private checkFavoriteStatus(): void {
    if (!this.authService.isLoggedIn()) {
      this.isFavorite.set(false);
      return;
    }

    const teamId = this.teamId();
    console.log('Checking favorite status for team:', teamId);
    
    this.favoritoService.isFavorito('EQUIPO', teamId).subscribe({
      next: (isFav) => {
        console.log('Team favorite status:', isFav);
        this.isFavorite.set(isFav);
      },
      error: (err) => {
        console.error('Error checking favorite:', err);
        this.isFavorite.set(false);
      }
    });
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
