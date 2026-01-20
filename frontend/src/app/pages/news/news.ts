import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  category: string;
  teamId?: number;
  leagueId?: number;
  playerId?: number;
}

interface FilterOption {
  id: number | string;
  name: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Header, Footer],
  templateUrl: './news.html',
  styleUrl: './news.scss'
})
export class News implements OnInit {
  private router = inject(Router);

  // Estado
  news = signal<NewsItem[]>([]);
  filteredNews = signal<NewsItem[]>([]);
  
  // Opciones de filtro
  teams = signal<FilterOption[]>([]);
  competitions = signal<FilterOption[]>([]);
  
  // Filtros seleccionados
  selectedTeam = signal<string>('');
  selectedCompetition = signal<string>('');
  selectedPlayer = signal<string>('');
  showOnlyFavorites = signal<boolean>(false);
  
  // Estados de carga
  loading = signal<boolean>(false);
  
  // Control del sidebar
  sidebarOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.loadFilters();
    this.loadNews();
  }

  /**
   * Cargar opciones de filtro
   */
  loadFilters(): void {
    const mainTeams: FilterOption[] = [
      { id: 541, name: 'Real Madrid' },
      { id: 529, name: 'Barcelona' },
      { id: 530, name: 'Atlético Madrid' },
      { id: 33, name: 'Manchester United' },
      { id: 50, name: 'Manchester City' },
      { id: 40, name: 'Liverpool' },
      { id: 42, name: 'Arsenal' },
      { id: 47, name: 'Tottenham' },
      { id: 85, name: 'Paris Saint-Germain' },
      { id: 157, name: 'Bayern Munich' },
      { id: 496, name: 'Juventus' },
      { id: 489, name: 'AC Milan' }
    ];
    this.teams.set(mainTeams);

    const mainLeagues: FilterOption[] = [
      { id: 140, name: 'LaLiga' },
      { id: 39, name: 'Premier League' },
      { id: 135, name: 'Serie A' },
      { id: 78, name: 'Bundesliga' },
      { id: 61, name: 'Ligue 1' },
      { id: 2, name: 'Champions League' }
    ];
    this.competitions.set(mainLeagues);
  }

  /**
   * Cargar noticias simuladas
   */
  loadNews(): void {
    this.loading.set(true);
    
    const mockNews: NewsItem[] = [
      {
        id: 1,
        title: 'Real Madrid prepara una revolución en el mercado invernal',
        summary: 'El conjunto blanco busca reforzar varias posiciones para la segunda parte de la temporada.',
        image: 'https://media.api-sports.io/football/teams/541.png',
        date: '2024-01-15',
        category: 'Fichajes',
        teamId: 541
      },
      {
        id: 2,
        title: 'Barcelona cierra la renovación de su joven estrella',
        summary: 'El club catalán asegura el futuro de una de sus mayores promesas con un contrato a largo plazo.',
        image: 'https://media.api-sports.io/football/teams/529.png',
        date: '2024-01-14',
        category: 'Fichajes',
        teamId: 529
      },
      {
        id: 3,
        title: 'Premier League: La carrera por el título se intensifica',
        summary: 'Tres equipos separados por apenas dos puntos en las primeras posiciones de la tabla.',
        image: 'https://media.api-sports.io/football/leagues/39.png',
        date: '2024-01-13',
        category: 'Liga',
        leagueId: 39
      },
      {
        id: 4,
        title: 'Manchester City sufre nueva baja por lesión',
        summary: 'El equipo de Guardiola pierde a otro jugador clave para las próximas semanas.',
        image: 'https://media.api-sports.io/football/teams/50.png',
        date: '2024-01-12',
        category: 'Lesiones',
        teamId: 50
      },
      {
        id: 5,
        title: 'Champions League: Sorteo de octavos de final',
        summary: 'Definidos los emparejamientos para la próxima fase de la máxima competición europea.',
        image: 'https://media.api-sports.io/football/leagues/2.png',
        date: '2024-01-11',
        category: 'Champions',
        leagueId: 2
      },
      {
        id: 6,
        title: 'Bayern Munich anuncia nuevo fichaje estrella',
        summary: 'El gigante alemán refuerza su plantilla con una incorporación de nivel mundial.',
        image: 'https://media.api-sports.io/football/teams/157.png',
        date: '2024-01-10',
        category: 'Fichajes',
        teamId: 157
      },
      {
        id: 7,
        title: 'PSG busca competir en todas las competiciones',
        summary: 'El club parisino mantiene sus aspiraciones en Liga, Copa y Champions League.',
        image: 'https://media.api-sports.io/football/teams/85.png',
        date: '2024-01-09',
        category: 'General',
        teamId: 85
      },
      {
        id: 8,
        title: 'El derbi de Manchester promete emociones fuertes',
        summary: 'United y City se preparan para el clásico de la ciudad con mucho en juego.',
        image: 'https://media.api-sports.io/football/teams/33.png',
        date: '2024-01-08',
        category: 'Partidos',
        teamId: 33
      }
    ];
    
    setTimeout(() => {
      this.news.set(mockNews);
      this.filteredNews.set(mockNews);
      this.loading.set(false);
    }, 500);
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    let filtered = [...this.news()];
    
    const selectedTeam = this.selectedTeam();
    const selectedCompetition = this.selectedCompetition();
    const selectedPlayer = this.selectedPlayer();
    
    // Filtrar por equipo
    if (selectedTeam) {
      filtered = filtered.filter(n => 
        n.teamId?.toString() === selectedTeam ||
        n.title.toLowerCase().includes(this.getTeamName(selectedTeam).toLowerCase())
      );
    }
    
    // Filtrar por competición
    if (selectedCompetition) {
      filtered = filtered.filter(n => 
        n.leagueId?.toString() === selectedCompetition
      );
    }
    
    // Filtrar por jugador (búsqueda en título)
    if (selectedPlayer.trim()) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(selectedPlayer.toLowerCase()) ||
        n.summary.toLowerCase().includes(selectedPlayer.toLowerCase())
      );
    }
    
    // Filtrar solo favoritos
    if (this.showOnlyFavorites()) {
      const favTeams = this.getFavoriteTeams();
      filtered = filtered.filter(n => 
        n.teamId && favTeams.includes(n.teamId.toString())
      );
    }
    
    this.filteredNews.set(filtered);
    this.closeSidebar();
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.selectedTeam.set('');
    this.selectedCompetition.set('');
    this.selectedPlayer.set('');
    this.showOnlyFavorites.set(false);
    this.filteredNews.set(this.news());
  }

  /**
   * Obtener nombre del equipo
   */
  private getTeamName(teamId: string): string {
    const team = this.teams().find(t => t.id.toString() === teamId);
    return team?.name || '';
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
   * Toggle sidebar
   */
  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  /**
   * Ir a detalle de noticia
   */
  goToNews(newsId: number): void {
    this.router.navigate(['/noticia', newsId]);
  }

  /**
   * Formatear fecha
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
