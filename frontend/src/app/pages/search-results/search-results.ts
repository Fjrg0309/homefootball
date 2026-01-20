import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  
  // Temporada
  season = 2024;

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
   */
  performSearch(query: string): void {
    if (!query.trim()) return;
    
    this.loading.set(true);
    this.error.set(null);
    this.searched.set(true);
    this.results.set([]);
    
    const searchResults: SearchResult[] = [];
    let completedRequests = 0;
    const totalRequests = 3;
    
    const checkComplete = () => {
      completedRequests++;
      if (completedRequests >= totalRequests) {
        this.results.set(searchResults);
        this.loading.set(false);
      }
    };

    // Buscar ligas
    this.footballApi.getLeagues().subscribe({
      next: (response) => {
        if (response.response) {
          const leagues = response.response.filter((l: LeagueData) => 
            l.league.name.toLowerCase().includes(query.toLowerCase()) ||
            l.country.name.toLowerCase().includes(query.toLowerCase())
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
        checkComplete();
      },
      error: () => checkComplete()
    });

    // Buscar equipos
    this.footballApi.searchTeams(query).subscribe({
      next: (response) => {
        if (response.response) {
          response.response.slice(0, 10).forEach((t: TeamData) => {
            searchResults.push({
              id: t.team.id,
              type: 'team',
              name: t.team.name,
              image: t.team.logo,
              subtitle: t.team.country
            });
          });
        }
        checkComplete();
      },
      error: () => checkComplete()
    });

    // Buscar jugadores (necesita league, usamos LaLiga por defecto)
    this.footballApi.searchPlayers(query, 140, this.season).subscribe({
      next: (response) => {
        if (response.response) {
          response.response.slice(0, 10).forEach((p: PlayerData) => {
            searchResults.push({
              id: p.player.id,
              type: 'player',
              name: p.player.name,
              image: p.player.photo,
              subtitle: p.statistics[0]?.team?.name || 'Jugador'
            });
          });
        }
        checkComplete();
      },
      error: () => checkComplete()
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
