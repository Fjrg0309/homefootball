import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FootballApiService, Standing } from '../../services/football-api.service';

// Configuración de temporadas por liga (2024 = temporada 2024-2025)
const LEAGUE_SEASONS: Record<number, number> = {
  140: 2024,  // LaLiga (temporada 2024-2025)
  39: 2024,   // Premier League
  135: 2024,  // Serie A
  78: 2024,   // Bundesliga
  61: 2024,   // Ligue 1
  62: 2024,   // Ligue 2
  94: 2024,   // Primeira Liga
  88: 2024,   // Eredivisie
  203: 2024,  // Süper Lig
  253: 2024,  // MLS
  71: 2024,   // Brasileirão
  40: 2024,   // Championship
  2: 2024,    // Champions League
  3: 2024,    // Europa League
  848: 2024   // Conference League
};

// Mapeo de IDs de slug a IDs numéricos de la API
const LEAGUE_ID_MAP: Record<string, number> = {
  'laliga': 140,
  'premier-league': 39,
  'serie-a': 135,
  'bundesliga': 78,
  'ligue-1': 61,
  'ligue-2': 62,
  'primeira-liga': 94,
  'eredivisie': 88,
  'super-lig': 203,
  'mls': 253,
  'brasileirao': 71,
  'championship': 40,
  'champions-league': 2,
  'europa-league': 3,
  'conference-league': 848
};

const LEAGUE_NAMES: Record<string, string> = {
  'laliga': 'LaLiga',
  'premier-league': 'Premier League',
  'serie-a': 'Serie A',
  'bundesliga': 'Bundesliga',
  'ligue-1': 'Ligue 1',
  'ligue-2': 'Ligue 2',
  'primeira-liga': 'Primeira Liga',
  'eredivisie': 'Eredivisie',
  'super-lig': 'Süper Lig',
  'mls': 'MLS',
  'brasileirao': 'Brasileirão',
  'championship': 'Championship',
  'champions-league': 'Champions League',
  'europa-league': 'Europa League',
  'conference-league': 'Conference League'
};

// Posiciones que califican a competiciones europeas por liga
const LEAGUE_POSITIONS: Record<number, { champions: number[]; europa: number[]; conference: number[]; relegation: number[] }> = {
  140: { champions: [1, 2, 3, 4], europa: [5], conference: [6], relegation: [18, 19, 20] },     // LaLiga
  39: { champions: [1, 2, 3, 4], europa: [5], conference: [6], relegation: [18, 19, 20] },      // Premier League
  135: { champions: [1, 2, 3, 4], europa: [5], conference: [6], relegation: [18, 19, 20] },     // Serie A
  78: { champions: [1, 2, 3, 4], europa: [5], conference: [6], relegation: [16, 17, 18] },      // Bundesliga
  61: { champions: [1, 2, 3], europa: [4], conference: [5], relegation: [16, 17, 18] },         // Ligue 1
  62: { champions: [], europa: [], conference: [], relegation: [19, 20] },                       // Ligue 2
  94: { champions: [1, 2], europa: [3], conference: [4], relegation: [16, 17, 18] },            // Primeira Liga
  88: { champions: [1, 2], europa: [3], conference: [4, 5], relegation: [16, 17, 18] },         // Eredivisie
  203: { champions: [1, 2], europa: [3], conference: [4], relegation: [16, 17, 18, 19, 20] },   // Süper Lig
  40: { champions: [1, 2], europa: [], conference: [], relegation: [22, 23, 24] },              // Championship
};

type ViewType = 'general' | 'home' | 'away';

interface StandingDisplay {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDiff: number;
  form: string;
  positionClass: string;
}

@Component({
  selector: 'app-league-standings',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './league-standings.html',
  styleUrl: './league-standings.scss'
})
export class LeagueStandings implements OnInit {
  private route = inject(ActivatedRoute);
  private footballApi = inject(FootballApiService);
  
  leagueId = signal<string>('');
  leagueApiId = signal<number>(0);
  leagueName = signal<string>('');
  season = signal<number>(2024);
  
  // Datos de clasificación
  standings = signal<Standing[]>([]);
  
  // Vista actual: general, local, visitante
  currentView = signal<ViewType>('general');
  
  // Estados de carga
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Clasificación procesada según la vista
  displayStandings = computed(() => {
    const rawStandings = this.standings();
    const view = this.currentView();
    const apiId = this.leagueApiId();
    const positions = LEAGUE_POSITIONS[apiId] || { champions: [], europa: [], conference: [], relegation: [] };
    
    let sortedStandings: StandingDisplay[];
    
    if (view === 'general') {
      sortedStandings = rawStandings.map(s => ({
        rank: s.rank,
        team: s.team,
        points: s.points,
        played: s.all.played,
        won: s.all.win,
        drawn: s.all.draw,
        lost: s.all.lose,
        goalsFor: s.all.goals.for,
        goalsAgainst: s.all.goals.against,
        goalsDiff: s.goalsDiff,
        form: s.form || '',
        positionClass: this.getPositionClass(s.rank, positions)
      }));
    } else if (view === 'home') {
      // Ordenar por puntos de local
      const homeStandings = [...rawStandings].map(s => ({
        ...s,
        homePoints: (s.home.win * 3) + s.home.draw
      })).sort((a, b) => {
        if (b.homePoints !== a.homePoints) return b.homePoints - a.homePoints;
        const aDiff = a.home.goals.for - a.home.goals.against;
        const bDiff = b.home.goals.for - b.home.goals.against;
        if (bDiff !== aDiff) return bDiff - aDiff;
        return b.home.goals.for - a.home.goals.for;
      });
      
      sortedStandings = homeStandings.map((s, index) => ({
        rank: index + 1,
        team: s.team,
        points: s.homePoints,
        played: s.home.played,
        won: s.home.win,
        drawn: s.home.draw,
        lost: s.home.lose,
        goalsFor: s.home.goals.for,
        goalsAgainst: s.home.goals.against,
        goalsDiff: s.home.goals.for - s.home.goals.against,
        form: '',
        positionClass: ''
      }));
    } else {
      // Ordenar por puntos de visitante
      const awayStandings = [...rawStandings].map(s => ({
        ...s,
        awayPoints: (s.away.win * 3) + s.away.draw
      })).sort((a, b) => {
        if (b.awayPoints !== a.awayPoints) return b.awayPoints - a.awayPoints;
        const aDiff = a.away.goals.for - a.away.goals.against;
        const bDiff = b.away.goals.for - b.away.goals.against;
        if (bDiff !== aDiff) return bDiff - aDiff;
        return b.away.goals.for - a.away.goals.for;
      });
      
      sortedStandings = awayStandings.map((s, index) => ({
        rank: index + 1,
        team: s.team,
        points: s.awayPoints,
        played: s.away.played,
        won: s.away.win,
        drawn: s.away.draw,
        lost: s.away.lose,
        goalsFor: s.away.goals.for,
        goalsAgainst: s.away.goals.against,
        goalsDiff: s.away.goals.for - s.away.goals.against,
        form: '',
        positionClass: ''
      }));
    }
    
    return sortedStandings;
  });

  // Título según la vista
  viewTitle = computed(() => {
    const view = this.currentView();
    const name = this.leagueName();
    switch (view) {
      case 'home': return `Clasificación de ${name} - Local`;
      case 'away': return `Clasificación de ${name} - Visitante`;
      default: return `Clasificación de ${name}`;
    }
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.leagueId.set(id);
      const apiId = LEAGUE_ID_MAP[id] || 0;
      this.leagueApiId.set(apiId);
      this.leagueName.set(LEAGUE_NAMES[id] || id);
      
      // Configurar temporada para esta liga
      this.season.set(LEAGUE_SEASONS[apiId] || 2024);
      
      // Cargar clasificación
      this.loadStandings();
    });
  }

  /**
   * Cargar clasificación desde la API
   */
  loadStandings(): void {
    const apiId = this.leagueApiId();
    if (!apiId) {
      this.error.set('Liga no encontrada');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    
    console.log(`🔍 Cargando clasificación - Liga: ${apiId}, Temporada: ${this.season()}`);
    
    this.footballApi.getStandings(apiId, this.season()).subscribe({
      next: (response) => {
        console.log('✅ Clasificación recibida:', response);
        console.log('📊 Número de resultados:', response.results);
        
        if (response.response && response.response.length > 0) {
          const leagueData = response.response[0];
          console.log('🏆 Datos de liga:', leagueData.league.name);
          
          if (leagueData.league.standings && leagueData.league.standings.length > 0) {
            console.log('📈 Equipos en clasificación:', leagueData.league.standings[0].length);
            this.standings.set(leagueData.league.standings[0]);
          } else {
            console.warn('⚠️ No hay datos de standings en la respuesta');
            this.standings.set([]);
            this.error.set('No hay datos de clasificación disponibles para esta temporada');
          }
        } else {
          console.warn('⚠️ Respuesta vacía de la API');
          this.standings.set([]);
          // Intentar con temporada anterior si estamos en 2024
          if (this.season() === 2024) {
            console.log('🔄 Intentando con temporada 2023...');
            this.season.set(2023);
            this.loadStandings();
            return;
          }
          this.error.set('No hay datos de clasificación disponibles');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando clasificación:', err);
        console.error('📍 Detalles del error:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url
        });
        
        // Mensajes más específicos según el error
        if (err.status === 0) {
          this.error.set('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
        } else if (err.status === 404) {
          this.error.set('No se encontraron datos de clasificación para esta liga y temporada.');
        } else if (err.status >= 500) {
          this.error.set('Error del servidor al obtener los datos. La API externa puede estar saturada.');
        } else {
          this.error.set(`Error al cargar la clasificación (${err.status}). Intenta de nuevo.`);
        }
        
        this.loading.set(false);
      }
    });
  }

  /**
   * Cambiar vista de clasificación
   */
  setView(view: ViewType): void {
    this.currentView.set(view);
  }

  /**
   * Obtener clase CSS según la posición
   */
  private getPositionClass(rank: number, positions: { champions: number[]; europa: number[]; conference: number[]; relegation: number[] }): string {
    if (rank === 1) return 'champion';
    if (positions.champions.includes(rank)) return 'champions-league';
    if (positions.europa.includes(rank)) return 'europa-league';
    if (positions.conference.includes(rank)) return 'conference-league';
    if (positions.relegation.includes(rank)) return 'relegation';
    return '';
  }

  /**
   * Obtener temporada formateada (2022 -> "2022/23")
   */
  getFormattedSeason(): string {
    const year = this.season();
    const nextYear = (year + 1).toString().slice(-2);
    return `${year}/${nextYear}`;
  }
}
