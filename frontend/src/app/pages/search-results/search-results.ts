import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, catchError } from 'rxjs';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FootballApiService, LeagueData, TeamData, PlayerData } from '../../services/football-api.service';

interface SearchResult {
  id: number | string;
  type: 'league' | 'team' | 'player';
  name: string;
  image: string;
  subtitle: string;
}

// IDs de las principales ligas para búsqueda de jugadores
const MAIN_LEAGUES = [
  140, // La Liga (España)
  39,  // Premier League (Inglaterra)
  135, // Serie A (Italia)
  78,  // Bundesliga (Alemania)
  61,  // Ligue 1 (Francia)
  94,  // Primeira Liga (Portugal)
];

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Header, Footer],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss'
})
export class SearchResults implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private footballApi = inject(FootballApiService);

  // Estado
  searchQuery = signal<string>('');
  results = signal<SearchResult[]>([]);
  
  // Estados de carga
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  searched = signal<boolean>(false);
  
  // Temporada actual (se calcula dinámicamente)
  season = this.getCurrentSeason();

  /**
   * Calcula la temporada actual basándose en la fecha
   * Las temporadas de fútbol van de agosto a mayo
   */
  private getCurrentSeason(): number {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const year = now.getFullYear();
    // Si estamos entre enero y julio, la temporada es año-1
    // Si estamos entre agosto y diciembre, la temporada es el año actual
    return month < 7 ? year - 1 : year;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const query = params.get('q');
      if (query) {
        this.searchQuery.set(query);
        this.performSearch(query);
      }
    });
  }

  /**
   * Realizar búsqueda en la API
   * - Equipos: requiere mínimo 3 caracteres
   * - Jugadores: requiere mínimo 4 caracteres + league + season
   * - Ligas: filtrado local (no tiene endpoint de búsqueda)
   */
  performSearch(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    this.loading.set(true);
    this.error.set(null);
    this.searched.set(true);
    this.results.set([]);
    
    const searchResults: SearchResult[] = [];
    
    // Preparar las peticiones según la longitud del query
    const requests: { [key: string]: any } = {};

    // Búsqueda de ligas (siempre, filtrado local)
    requests['leagues'] = this.footballApi.getLeagues().pipe(
      catchError(() => of({ response: [] }))
    );

    // Búsqueda de equipos (mínimo 3 caracteres para la API)
    if (trimmedQuery.length >= 3) {
      requests['teams'] = this.footballApi.searchTeams(trimmedQuery).pipe(
        catchError(() => of({ response: [] }))
      );
    }

    // Búsqueda de jugadores (mínimo 4 caracteres para la API)
    // Buscamos en múltiples ligas para mejores resultados
    if (trimmedQuery.length >= 4) {
      // Creamos múltiples búsquedas en las principales ligas
      MAIN_LEAGUES.forEach((leagueId, index) => {
        requests[`players_${leagueId}`] = this.footballApi.searchPlayers(trimmedQuery, leagueId, this.season).pipe(
          catchError(() => of({ response: [] }))
        );
      });
    }

    // Ejecutar todas las peticiones en paralelo
    forkJoin(requests).subscribe({
      next: (responses: any) => {
        // Procesar ligas (filtrado local por nombre o país)
        if (responses['leagues']?.response) {
          const queryLower = trimmedQuery.toLowerCase();
          const leagues = responses['leagues'].response.filter((l: LeagueData) => 
            l.league.name.toLowerCase().includes(queryLower) ||
            l.country.name.toLowerCase().includes(queryLower)
          ).slice(0, 10);
          
          leagues.forEach((l: LeagueData) => {
            searchResults.push({
              id: l.league.id,
              type: 'league',
              name: l.league.name,
              image: l.league.logo,
              subtitle: l.country.name
            });
          });
        }

        // Procesar equipos
        if (responses['teams']?.response) {
          responses['teams'].response.slice(0, 10).forEach((t: TeamData) => {
            searchResults.push({
              id: t.team.id,
              type: 'team',
              name: t.team.name,
              image: t.team.logo,
              subtitle: t.team.country
            });
          });
        }

        // Procesar jugadores de todas las ligas (evitar duplicados)
        const playerIds = new Set<number>();
        MAIN_LEAGUES.forEach(leagueId => {
          const playersResponse = responses[`players_${leagueId}`];
          if (playersResponse?.response) {
            playersResponse.response.forEach((p: PlayerData) => {
              // Evitar duplicados
              if (!playerIds.has(p.player.id)) {
                playerIds.add(p.player.id);
                searchResults.push({
                  id: p.player.id,
                  type: 'player',
                  name: p.player.name,
                  image: p.player.photo,
                  subtitle: p.statistics[0]?.team?.name || 'Jugador'
                });
              }
            });
          }
        });

        // Ordenar resultados: ligas primero, luego equipos, luego jugadores
        const sortOrder = { league: 0, team: 1, player: 2 };
        searchResults.sort((a, b) => sortOrder[a.type] - sortOrder[b.type]);

        this.results.set(searchResults);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error en la búsqueda:', err);
        this.error.set('Error al realizar la búsqueda');
        this.loading.set(false);
      }
    });
  }

  /**
   * Nueva búsqueda
   */
  onSearch(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.router.navigate(['/buscar'], { queryParams: { q: query } });
      this.performSearch(query);
    }
  }

  /**
   * Manejar Enter en el input
   */
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  /**
   * Navegar al resultado
   */
  goToResult(result: SearchResult): void {
    switch (result.type) {
      case 'league':
        this.router.navigate(['/liga', result.id]);
        break;
      case 'team':
        this.router.navigate(['/equipo', result.id]);
        break;
      case 'player':
        this.router.navigate(['/jugador', result.id]);
        break;
    }
  }

  /**
   * Obtener icono según tipo
   */
  getTypeIcon(type: string): string {
    switch (type) {
      case 'league': return '🏆';
      case 'team': return '⚽';
      case 'player': return '👤';
      default: return '📋';
    }
  }

  /**
   * Obtener etiqueta del tipo
   */
  getTypeLabel(type: string): string {
    switch (type) {
      case 'league': return 'Liga';
      case 'team': return 'Equipo';
      case 'player': return 'Jugador';
      default: return 'Resultado';
    }
  }
}
