import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FootballApiService, TeamData, LeagueData } from '../../services/football-api.service';

interface Transfer {
  id: number;
  playerId: number;
  playerName: string;
  playerPhoto: string;
  fromTeam: {
    id: number;
    name: string;
    logo: string;
  };
  toTeam: {
    id: number;
    name: string;
    logo: string;
  };
  fee: string;
  date: string;
}

interface FilterOption {
  id: number | string;
  name: string;
  logo?: string;
}

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Header, Footer],
  templateUrl: './transfers.html',
  styleUrl: './transfers.scss'
})
export class Transfers implements OnInit {
  private router = inject(Router);
  private footballApi = inject(FootballApiService);

  // Estado
  transfers = signal<Transfer[]>([]);
  filteredTransfers = signal<Transfer[]>([]);
  
  // Opciones de filtro
  teams = signal<FilterOption[]>([]);
  competitions = signal<FilterOption[]>([]);
  
  // Filtros seleccionados
  selectedTeam = signal<string>('');
  selectedCompetition = signal<string>('');
  showOnlyFavorites = signal<boolean>(false);
  
  // Estados de carga
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Control del sidebar
  sidebarOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.loadCompetitions();
    this.loadTransfers();
  }

  /**
   * Cargar competiciones para el filtro
   */
  loadCompetitions(): void {
    // Ligas principales europeas
    const mainLeagues: FilterOption[] = [
      { id: 140, name: 'LaLiga' },
      { id: 39, name: 'Premier League' },
      { id: 135, name: 'Serie A' },
      { id: 78, name: 'Bundesliga' },
      { id: 61, name: 'Ligue 1' },
      { id: 94, name: 'Primeira Liga' },
      { id: 88, name: 'Eredivisie' }
    ];
    this.competitions.set(mainLeagues);
  }

  /**
   * Cargar fichajes simulados (API no tiene endpoint de transfers gratuito)
   * En producción esto vendría de una API de fichajes
   */
  loadTransfers(): void {
    this.loading.set(true);
    
    // Simulamos fichajes reales recientes de equipos grandes
    const mockTransfers: Transfer[] = [
      {
        id: 1,
        playerId: 278,
        playerName: 'Kylian Mbappé',
        playerPhoto: 'https://media.api-sports.io/football/players/278.png',
        fromTeam: { id: 85, name: 'Paris Saint-Germain', logo: 'https://media.api-sports.io/football/teams/85.png' },
        toTeam: { id: 541, name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
        fee: 'Libre',
        date: '2024-07-01'
      },
      {
        id: 2,
        playerId: 47380,
        playerName: 'Dani Olmo',
        playerPhoto: 'https://media.api-sports.io/football/players/47380.png',
        fromTeam: { id: 173, name: 'RB Leipzig', logo: 'https://media.api-sports.io/football/teams/173.png' },
        toTeam: { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
        fee: '55M€',
        date: '2024-08-10'
      },
      {
        id: 3,
        playerId: 284188,
        playerName: 'Joshua Zirkzee',
        playerPhoto: 'https://media.api-sports.io/football/players/284188.png',
        fromTeam: { id: 505, name: 'Bologna', logo: 'https://media.api-sports.io/football/teams/505.png' },
        toTeam: { id: 33, name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' },
        fee: '42.5M€',
        date: '2024-07-14'
      },
      {
        id: 4,
        playerId: 284434,
        playerName: 'Leny Yoro',
        playerPhoto: 'https://media.api-sports.io/football/players/284434.png',
        fromTeam: { id: 79, name: 'Lille', logo: 'https://media.api-sports.io/football/teams/79.png' },
        toTeam: { id: 33, name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' },
        fee: '62M€',
        date: '2024-07-18'
      },
      {
        id: 5,
        playerId: 289571,
        playerName: 'Riccardo Calafiori',
        playerPhoto: 'https://media.api-sports.io/football/players/289571.png',
        fromTeam: { id: 505, name: 'Bologna', logo: 'https://media.api-sports.io/football/teams/505.png' },
        toTeam: { id: 42, name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
        fee: '45M€',
        date: '2024-07-29'
      },
      {
        id: 6,
        playerId: 212464,
        playerName: 'Nico Williams',
        playerPhoto: 'https://media.api-sports.io/football/players/212464.png',
        fromTeam: { id: 531, name: 'Athletic Club', logo: 'https://media.api-sports.io/football/teams/531.png' },
        toTeam: { id: 531, name: 'Athletic Club', logo: 'https://media.api-sports.io/football/teams/531.png' },
        fee: 'Renovación',
        date: '2024-08-20'
      },
      {
        id: 7,
        playerId: 306658,
        playerName: 'Julian Álvarez',
        playerPhoto: 'https://media.api-sports.io/football/players/306658.png',
        fromTeam: { id: 50, name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' },
        toTeam: { id: 530, name: 'Atlético Madrid', logo: 'https://media.api-sports.io/football/teams/530.png' },
        fee: '75M€',
        date: '2024-08-12'
      },
      {
        id: 8,
        playerId: 70027,
        playerName: 'Pedro Porro',
        playerPhoto: 'https://media.api-sports.io/football/players/70027.png',
        fromTeam: { id: 47, name: 'Tottenham', logo: 'https://media.api-sports.io/football/teams/47.png' },
        toTeam: { id: 47, name: 'Tottenham', logo: 'https://media.api-sports.io/football/teams/47.png' },
        fee: 'Renovación',
        date: '2024-07-05'
      }
    ];
    
    setTimeout(() => {
      this.transfers.set(mockTransfers);
      this.filteredTransfers.set(mockTransfers);
      this.loading.set(false);
    }, 500);
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    let filtered = [...this.transfers()];
    
    const selectedTeam = this.selectedTeam();
    const selectedCompetition = this.selectedCompetition();
    
    // Filtrar por equipo
    if (selectedTeam) {
      filtered = filtered.filter(t => 
        t.fromTeam.name.toLowerCase().includes(selectedTeam.toLowerCase()) ||
        t.toTeam.name.toLowerCase().includes(selectedTeam.toLowerCase())
      );
    }
    
    // Filtrar solo favoritos
    if (this.showOnlyFavorites()) {
      const favTeams = this.getFavoriteTeams();
      filtered = filtered.filter(t => 
        favTeams.includes(t.fromTeam.id.toString()) ||
        favTeams.includes(t.toTeam.id.toString())
      );
    }
    
    this.filteredTransfers.set(filtered);
    this.closeSidebar();
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.selectedTeam.set('');
    this.selectedCompetition.set('');
    this.showOnlyFavorites.set(false);
    this.filteredTransfers.set(this.transfers());
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
   * Toggle sidebar
   */
  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  /**
   * Navegar a detalle de jugador
   */
  goToPlayer(playerId: number): void {
    this.router.navigate(['/jugador', playerId]);
  }

  /**
   * Navegar a detalle de equipo
   */
  goToTeam(teamId: number): void {
    this.router.navigate(['/equipo', teamId]);
  }
}
