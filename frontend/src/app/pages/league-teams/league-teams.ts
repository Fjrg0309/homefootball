import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FootballApiService, TeamData, LeagueData } from '../../services/football-api.service';

interface Team {
  id: number;
  name: string;
  logo: string;
  country: string;
  founded: number;
}

@Component({
  selector: 'app-league-teams',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './league-teams.html',
  styleUrl: './league-teams.scss'
})
export class LeagueTeams implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private footballApi = inject(FootballApiService);

  // Estado
  leagueId = signal<number>(0);
  league = signal<LeagueData | null>(null);
  teams = signal<Team[]>([]);
  
  // Estados de carga
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Temporada
  season = signal<number>(2024);
  
  // Datos computados
  leagueName = computed(() => this.league()?.league?.name || 'Equipos');
  leagueLogo = computed(() => this.league()?.league?.logo || '');
  countryFlag = computed(() => this.league()?.country?.flag || '');

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Intentar parsear como número, si falla, intentar mapear nombre a ID
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
          this.leagueId.set(numericId);
        } else {
          // Mapear nombre de liga a ID de API-Football
          const leagueIds: Record<string, number> = {
            'laliga': 140,
            'premier-league': 39,
            'serie-a': 135,
            'bundesliga': 78,
            'ligue-1': 61,
            'primeira-liga': 94,
            'eredivisie': 88,
            'super-lig': 203,
            'mls': 253,
            'brasileirao': 71,
            'championship': 40,
            'ligue-2': 62
          };
          this.leagueId.set(leagueIds[id] || 140);
        }
        this.loadLeagueData();
        this.loadTeams();
      }
    });
  }

  /**
   * Cargar información de la liga
   */
  loadLeagueData(): void {
    const id = this.leagueId();
    if (!id) return;

    this.footballApi.getLeagueById(id).subscribe({
      next: (response) => {
        if (response.response && response.response.length > 0) {
          this.league.set(response.response[0]);
        }
      },
      error: (err) => {
        console.error('Error cargando liga:', err);
      }
    });
  }

  /**
   * Cargar equipos de la liga
   */
  loadTeams(): void {
    const id = this.leagueId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.footballApi.getTeamsByLeague(id, this.season()).subscribe({
      next: (response) => {
        console.log('✅ Equipos recibidos:', response);
        if (response.response && response.response.length > 0) {
          const teamsList = response.response.map((t: TeamData) => ({
            id: t.team.id,
            name: t.team.name,
            logo: t.team.logo,
            country: t.team.country,
            founded: t.team.founded
          }));
          // Ordenar alfabéticamente
          teamsList.sort((a: Team, b: Team) => a.name.localeCompare(b.name));
          this.teams.set(teamsList);
        } else {
          this.teams.set([]);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando equipos:', err);
        this.error.set('Error al cargar los equipos');
        this.loading.set(false);
      }
    });
  }

  /**
   * Navegar al detalle del equipo
   */
  goToTeam(teamId: number): void {
    this.router.navigate(['/equipo', teamId]);
  }

  /**
   * Volver atrás
   */
  goBack(): void {
    window.history.back();
  }
}
