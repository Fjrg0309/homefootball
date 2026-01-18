import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { 
  FootballApiService, 
  FixtureData, 
  FixtureEvent, 
  FixtureStatistics 
} from '../../services/football-api.service';

// Interfaz para comentarios (mock por ahora)
interface Comment {
  id: number;
  user: string;
  text: string;
  isOwner: boolean;
}

// Interfaz para goles procesados
interface GoalEvent {
  playerName: string;
  minute: number;
  extra: number | null;
  type: string; // 'Normal Goal', 'Penalty', 'Own Goal'
  assistName: string | null;
  teamId: number;
}

// Interfaz para estadísticas procesadas
interface ProcessedStatistic {
  type: string;
  homeValue: number | string | null;
  awayValue: number | string | null;
}

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './match-detail.html',
  styleUrl: './match-detail.scss'
})
export class MatchDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private footballApi = inject(FootballApiService);
  
  // ID del partido
  fixtureId = signal<number>(0);
  
  // Datos del partido
  fixture = signal<FixtureData | null>(null);
  events = signal<FixtureEvent[]>([]);
  statistics = signal<FixtureStatistics[]>([]);
  
  // Estados de UI
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  showStatistics = signal<boolean>(false);
  
  // Comentarios (mock)
  comments = signal<Comment[]>([
    { id: 1, user: 'User', text: 'Ejemplo de comentario...', isOwner: false },
    { id: 2, user: 'User2', text: 'Ejemplo de comentario 2...', isOwner: false },
    { id: 3, user: 'User3', text: 'Ejemplo de comentario 3...', isOwner: false },
  ]);
  newComment = signal<string>('');
  currentUser = signal<string>('Tu User');

  // Computed: Goles del equipo local
  homeGoals = computed(() => {
    const fixture = this.fixture();
    if (!fixture) return [];
    
    return this.events()
      .filter(e => e.type === 'Goal' && e.team.id === fixture.teams.home.id)
      .map(e => ({
        playerName: e.player.name || 'Desconocido',
        minute: e.time.elapsed,
        extra: e.time.extra,
        type: e.detail,
        assistName: e.assist?.name || null,
        teamId: e.team.id
      } as GoalEvent));
  });

  // Computed: Goles del equipo visitante
  awayGoals = computed(() => {
    const fixture = this.fixture();
    if (!fixture) return [];
    
    return this.events()
      .filter(e => e.type === 'Goal' && e.team.id === fixture.teams.away.id)
      .map(e => ({
        playerName: e.player.name || 'Desconocido',
        minute: e.time.elapsed,
        extra: e.time.extra,
        type: e.detail,
        assistName: e.assist?.name || null,
        teamId: e.team.id
      } as GoalEvent));
  });

  // Computed: Todos los goles ordenados por minuto
  allGoals = computed(() => {
    return this.events()
      .filter(e => e.type === 'Goal')
      .map(e => ({
        playerName: e.player.name || 'Desconocido',
        minute: e.time.elapsed,
        extra: e.time.extra,
        type: e.detail,
        assistName: e.assist?.name || null,
        teamId: e.team.id
      } as GoalEvent))
      .sort((a, b) => a.minute - b.minute);
  });

  // Computed: Tarjetas amarillas
  yellowCards = computed(() => {
    return this.events().filter(e => e.type === 'Card' && e.detail === 'Yellow Card');
  });

  // Computed: Tarjetas rojas
  redCards = computed(() => {
    return this.events().filter(e => e.type === 'Card' && (e.detail === 'Red Card' || e.detail === 'Second Yellow card'));
  });

  // Computed: Estadísticas procesadas
  processedStats = computed((): ProcessedStatistic[] => {
    const stats = this.statistics();
    if (stats.length < 2) return [];

    const homeStats = stats[0]?.statistics || [];
    const awayStats = stats[1]?.statistics || [];

    const statTypes = [
      'Shots on Goal',
      'Shots off Goal', 
      'Total Shots',
      'Blocked Shots',
      'Corner Kicks',
      'Offsides',
      'Ball Possession',
      'Fouls',
      'Yellow Cards',
      'Red Cards',
      'Goalkeeper Saves',
      'Total passes',
      'Passes accurate',
      'Passes %'
    ];

    return statTypes.map(type => {
      const homeStat = homeStats.find(s => s.type === type);
      const awayStat = awayStats.find(s => s.type === type);
      return {
        type: this.translateStatType(type),
        homeValue: homeStat?.value ?? '-',
        awayValue: awayStat?.value ?? '-'
      };
    }).filter(s => s.homeValue !== '-' || s.awayValue !== '-');
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fixtureId.set(parseInt(id, 10));
        this.loadMatchData();
      }
    });
  }

  /**
   * Cargar todos los datos del partido
   */
  loadMatchData(): void {
    this.loading.set(true);
    this.error.set(null);

    const id = this.fixtureId();
    
    // Cargar datos del partido
    this.footballApi.getFixtureById(id).subscribe({
      next: (response) => {
        if (response.response && response.response.length > 0) {
          this.fixture.set(response.response[0]);
        }
        this.loadEvents();
      },
      error: (err) => {
        console.error('Error cargando partido:', err);
        this.error.set('Error al cargar los datos del partido');
        this.loading.set(false);
      }
    });
  }

  /**
   * Cargar eventos del partido
   */
  private loadEvents(): void {
    const id = this.fixtureId();
    
    this.footballApi.getFixtureEvents(id).subscribe({
      next: (response) => {
        this.events.set(response.response || []);
        this.loadStatistics();
      },
      error: (err) => {
        console.error('Error cargando eventos:', err);
        // Continuar aunque fallen los eventos
        this.loadStatistics();
      }
    });
  }

  /**
   * Cargar estadísticas del partido
   */
  private loadStatistics(): void {
    const id = this.fixtureId();
    
    this.footballApi.getFixtureStatistics(id).subscribe({
      next: (response) => {
        this.statistics.set(response.response || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando estadísticas:', err);
        this.loading.set(false);
      }
    });
  }

  /**
   * Traducir tipo de estadística
   */
  private translateStatType(type: string): string {
    const translations: Record<string, string> = {
      'Shots on Goal': 'Tiros a puerta',
      'Shots off Goal': 'Tiros fuera',
      'Total Shots': 'Tiros totales',
      'Blocked Shots': 'Tiros bloqueados',
      'Corner Kicks': 'Córners',
      'Offsides': 'Fueras de juego',
      'Ball Possession': 'Posesión',
      'Fouls': 'Faltas',
      'Yellow Cards': 'Tarjetas amarillas',
      'Red Cards': 'Tarjetas rojas',
      'Goalkeeper Saves': 'Paradas del portero',
      'Total passes': 'Pases totales',
      'Passes accurate': 'Pases acertados',
      'Passes %': 'Precisión de pases'
    };
    return translations[type] || type;
  }

  /**
   * Formatear minuto del evento
   */
  formatMinute(minute: number, extra: number | null): string {
    if (extra) {
      return `${minute}+${extra}'`;
    }
    return `${minute}'`;
  }

  /**
   * Toggle mostrar/ocultar estadísticas
   */
  toggleStatistics(): void {
    this.showStatistics.update(v => !v);
  }

  /**
   * Obtener icono del tipo de gol
   */
  getGoalIcon(type: string): string {
    switch (type) {
      case 'Penalty':
        return '(P)';
      case 'Own Goal':
        return '(AG)';
      default:
        return '';
    }
  }

  /**
   * Enviar comentario
   */
  submitComment(): void {
    const text = this.newComment().trim();
    if (!text) return;

    const newComment: Comment = {
      id: Date.now(),
      user: this.currentUser(),
      text: text,
      isOwner: true
    };

    this.comments.update(comments => [...comments, newComment]);
    this.newComment.set('');
  }

  /**
   * Actualizar valor del comentario
   */
  updateNewComment(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newComment.set(input.value);
  }

  /**
   * Manejar tecla Enter en el input de comentario
   */
  handleCommentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.submitComment();
    }
  }
}
