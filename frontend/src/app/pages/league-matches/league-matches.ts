import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FootballApiService, FixtureData } from '../../services/football-api.service';

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
  
  // Fecha actual seleccionada
  currentDate = signal<Date>(new Date());
  
  // Partidos del día
  matches = signal<Match[]>([]);
  
  // Estados de carga
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Texto formateado de la fecha actual
  formattedDate = computed(() => {
    const date = this.currentDate();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  });

  // Verificar si es hoy
  isToday = computed(() => {
    const today = new Date();
    const current = this.currentDate();
    return today.toDateString() === current.toDateString();
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.leagueId.set(id);
      this.leagueApiId.set(LEAGUE_ID_MAP[id] || 0);
      this.leagueName.set(LEAGUE_NAMES[id] || id);
      
      // Cargar partidos del día actual
      this.loadMatchesForDate(this.currentDate());
    });
  }

  /**
   * Cargar partidos para una fecha específica
   */
  loadMatchesForDate(date: Date): void {
    const apiId = this.leagueApiId();
    if (!apiId) {
      this.error.set('Liga no encontrada');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    
    const dateStr = this.formatDateForApi(date);
    
    this.footballApi.getFixturesByDate(dateStr).subscribe({
      next: (response) => {
        // Filtrar partidos de esta liga
        const leagueMatches = response.response.filter(
          fixture => fixture.league.id === apiId
        );
        
        this.matches.set(this.mapFixturesToMatches(leagueMatches));
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
   * Formatear fecha para la API (YYYY-MM-DD)
   */
  private formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Ir al día anterior
   */
  goToPreviousDay(): void {
    const newDate = new Date(this.currentDate());
    newDate.setDate(newDate.getDate() - 1);
    this.currentDate.set(newDate);
    this.loadMatchesForDate(newDate);
  }

  /**
   * Ir al día siguiente
   */
  goToNextDay(): void {
    const newDate = new Date(this.currentDate());
    newDate.setDate(newDate.getDate() + 1);
    this.currentDate.set(newDate);
    this.loadMatchesForDate(newDate);
  }

  /**
   * Volver a hoy
   */
  goToToday(): void {
    const today = new Date();
    this.currentDate.set(today);
    this.loadMatchesForDate(today);
  }

  /**
   * Buscar el día anterior con partidos
   */
  findPreviousDayWithMatches(): void {
    this.loading.set(true);
    this.searchForMatchesInDirection(-1, 30);
  }

  /**
   * Buscar el día siguiente con partidos
   */
  findNextDayWithMatches(): void {
    this.loading.set(true);
    this.searchForMatchesInDirection(1, 30);
  }

  /**
   * Buscar partidos en una dirección (pasado o futuro)
   */
  private searchForMatchesInDirection(direction: number, maxDays: number): void {
    const apiId = this.leagueApiId();
    let daysSearched = 0;
    
    const searchNextDay = (date: Date) => {
      if (daysSearched >= maxDays) {
        this.loading.set(false);
        this.error.set(`No se encontraron partidos en los próximos ${maxDays} días`);
        return;
      }
      
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + direction);
      daysSearched++;
      
      const dateStr = this.formatDateForApi(newDate);
      
      this.footballApi.getFixturesByDate(dateStr).subscribe({
        next: (response) => {
          const leagueMatches = response.response.filter(
            fixture => fixture.league.id === apiId
          );
          
          if (leagueMatches.length > 0) {
            this.currentDate.set(newDate);
            this.matches.set(this.mapFixturesToMatches(leagueMatches));
            this.loading.set(false);
          } else {
            // Seguir buscando
            searchNextDay(newDate);
          }
        },
        error: (err) => {
          console.error('Error buscando partidos:', err);
          this.loading.set(false);
          this.error.set('Error al buscar partidos');
        }
      });
    };
    
    searchNextDay(this.currentDate());
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
