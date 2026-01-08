import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FootballApiService, FixtureData } from '../../services/football-api.service';

// Configuración de temporadas por liga
const LEAGUE_SEASONS: Record<number, number> = {
  140: 2023,  // LaLiga
  39: 2023,   // Premier League
  135: 2023,  // Serie A
  78: 2023,   // Bundesliga
  61: 2023,   // Ligue 1
  62: 2023,   // Ligue 2
  94: 2023,   // Primeira Liga
  88: 2023,   // Eredivisie
  203: 2023,  // Süper Lig
  253: 2023,  // MLS
  262: 2023,  // Liga MX
  40: 2023,   // Championship
  2: 2023,    // Champions League
  3: 2023,    // Europa League
  848: 2023   // Conference League
};

// Última jornada disponible por liga
const LEAGUE_LAST_ROUND: Record<number, number> = {
  140: 38,  // LaLiga - 38 jornadas
  39: 38,   // Premier League - 38 jornadas
  135: 38,  // Serie A - 38 jornadas
  78: 34,   // Bundesliga - 34 jornadas
  61: 34,   // Ligue 1 - 34 jornadas
  62: 38,   // Ligue 2 - 38 jornadas
  94: 34,   // Primeira Liga - 34 jornadas
  88: 34,   // Eredivisie - 34 jornadas
  203: 38,  // Süper Lig - 38 jornadas
  253: 34,  // MLS - 34 jornadas
  262: 34,  // Liga MX - 34 jornadas
  40: 46,   // Championship - 46 jornadas
  2: 8,     // Champions League - fase de grupos
  3: 8,     // Europa League - fase de grupos
  848: 8    // Conference League - fase de grupos
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
  'liga-mx': 262,
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
  'liga-mx': 'Liga MX',
  'championship': 'Championship',
  'champions-league': 'Champions League',
  'europa-league': 'Europa League',
  'conference-league': 'Conference League'
};

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'finished' | 'live' | 'upcoming' | 'postponed' | 'cancelled';
  time: string; // Hora del partido (HH:MM)
  minute: number | null; // Minuto actual si está en vivo
  statusShort: string; // Estado corto de la API (FT, 1H, 2H, HT, etc.)
}

@Component({
  selector: 'app-league-matches',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './league-matches.html',
  styleUrl: './league-matches.scss'
})
export class LeagueMatches implements OnInit {
  private route = inject(ActivatedRoute);
  private footballApi = inject(FootballApiService);
  
  leagueId = signal<string>('');
  leagueApiId = signal<number>(0);
  leagueName = signal<string>('');
  
  // Jornada actual seleccionada
  currentRound = signal<number>(38);
  maxRound = signal<number>(38);
  season = signal<number>(2024);
  
  // Fecha de los partidos de la jornada (se obtiene del primer partido)
  roundDate = signal<string>('');
  
  // Partidos de la jornada
  matches = signal<Match[]>([]);
  
  // Estados de carga
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Texto formateado de la jornada
  formattedRound = computed(() => {
    return `Jornada ${this.currentRound()}`;
  });

  // Verificar si es la última jornada
  isLastRound = computed(() => {
    return this.currentRound() === this.maxRound();
  });
  
  // Verificar si es la primera jornada
  isFirstRound = computed(() => {
    return this.currentRound() === 1;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.leagueId.set(id);
      const apiId = LEAGUE_ID_MAP[id] || 0;
      this.leagueApiId.set(apiId);
      this.leagueName.set(LEAGUE_NAMES[id] || id);
      
      // Configurar temporada y jornada máxima para esta liga
      this.season.set(LEAGUE_SEASONS[apiId] || 2024);
      this.maxRound.set(LEAGUE_LAST_ROUND[apiId] || 38);
      this.currentRound.set(this.maxRound());
      
      // Cargar partidos de la última jornada
      this.loadMatchesForRound(this.currentRound());
    });
  }

  /**
   * Cargar partidos para una jornada específica
   */
  loadMatchesForRound(round: number): void {
    const apiId = this.leagueApiId();
    if (!apiId) {
      this.error.set('Liga no encontrada');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    
    const roundStr = `Regular Season - ${round}`;
    
    this.footballApi.getFixturesByRound(apiId, this.season(), roundStr).subscribe({
      next: (response) => {
        if (response.response && response.response.length > 0) {
          // Obtener la fecha del primer partido de la jornada
          const firstMatch = response.response[0];
          if (firstMatch.fixture && firstMatch.fixture.date) {
            const matchDate = new Date(firstMatch.fixture.date);
            const options: Intl.DateTimeFormatOptions = { 
              day: 'numeric',
              month: 'long', 
              year: 'numeric' 
            };
            this.roundDate.set(matchDate.toLocaleDateString('es-ES', options));
          }
          this.matches.set(this.mapFixturesToMatches(response.response));
        } else {
          this.matches.set([]);
          this.roundDate.set('');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando partidos:', err);
        this.error.set('Error al cargar los partidos. Intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  /**
   * Mapear datos de la API a nuestro modelo
   */
  private mapFixturesToMatches(fixtures: FixtureData[]): Match[] {
    return fixtures.map(fixture => {
      const status = this.getMatchStatus(fixture.fixture.status.short);
      const matchTime = new Date(fixture.fixture.date);
      
      return {
        id: fixture.fixture.id,
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        homeLogo: fixture.teams.home.logo,
        awayLogo: fixture.teams.away.logo,
        homeScore: fixture.goals.home,
        awayScore: fixture.goals.away,
        status: status,
        time: matchTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        minute: fixture.fixture.status.elapsed,
        statusShort: fixture.fixture.status.short
      };
    }).sort((a, b) => {
      // Ordenar: en vivo primero, luego por hora
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (b.status === 'live' && a.status !== 'live') return 1;
      return a.time.localeCompare(b.time);
    });
  }

  /**
   * Convertir estado de la API a nuestro enum
   */
  private getMatchStatus(apiStatus: string): 'finished' | 'live' | 'upcoming' | 'postponed' | 'cancelled' {
    const liveStatuses = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'];
    const finishedStatuses = ['FT', 'AET', 'PEN'];
    const postponedStatuses = ['PST', 'SUSP', 'INT'];
    const cancelledStatuses = ['CANC', 'ABD', 'AWD', 'WO'];
    
    if (liveStatuses.includes(apiStatus)) return 'live';
    if (finishedStatuses.includes(apiStatus)) return 'finished';
    if (postponedStatuses.includes(apiStatus)) return 'postponed';
    if (cancelledStatuses.includes(apiStatus)) return 'cancelled';
    return 'upcoming'; // NS, TBD, etc.
  }

  /**
   * Ir a la jornada anterior
   */
  goToPreviousRound(): void {
    if (this.currentRound() > 1) {
      const newRound = this.currentRound() - 1;
      this.currentRound.set(newRound);
      this.loadMatchesForRound(newRound);
    }
  }

  /**
   * Ir a la jornada siguiente
   */
  goToNextRound(): void {
    if (this.currentRound() < this.maxRound()) {
      const newRound = this.currentRound() + 1;
      this.currentRound.set(newRound);
      this.loadMatchesForRound(newRound);
    }
  }

  /**
   * Ir a la última jornada
   */
  goToLastRound(): void {
    const lastRound = this.maxRound();
    this.currentRound.set(lastRound);
    this.loadMatchesForRound(lastRound);
  }

  /**
   * Ir a la primera jornada
   */
  goToFirstRound(): void {
    this.currentRound.set(1);
    this.loadMatchesForRound(1);
  }

  /**
   * Obtener clase CSS para el ganador
   */
  getWinnerClass(match: Match, team: 'home' | 'away'): string {
    if (match.status !== 'finished' || match.homeScore === null || match.awayScore === null) return '';
    
    if (team === 'home' && match.homeScore > match.awayScore) return 'winner';
    if (team === 'away' && match.awayScore > match.homeScore) return 'winner';
    return '';
  }

  /**
   * Obtener texto a mostrar en el marcador
   */
  getScoreDisplay(match: Match): string {
    if (match.status === 'upcoming') {
      return match.time;
    }
    if (match.status === 'postponed') {
      return 'APLZ';
    }
    if (match.status === 'cancelled') {
      return 'SUSP';
    }
    
    const home = match.homeScore ?? 0;
    const away = match.awayScore ?? 0;
    return `${home} - ${away}`;
  }

  /**
   * Obtener texto del estado del partido
   */
  getStatusText(match: Match): string {
    if (match.status === 'live') {
      if (match.statusShort === 'HT') return 'Descanso';
      if (match.minute) return `${match.minute}'`;
      return 'En vivo';
    }
    if (match.status === 'finished') return 'Finalizado';
    if (match.status === 'postponed') return 'Aplazado';
    if (match.status === 'cancelled') return 'Suspendido';
    return '';
  }
}
