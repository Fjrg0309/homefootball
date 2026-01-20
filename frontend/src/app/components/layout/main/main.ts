import { Component, ViewEncapsulation, signal, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FootballApiService, FixtureData } from '../../../services/football-api.service';
import { forkJoin } from 'rxjs';

// IDs de equipos grandes para buscar sus partidos
const BIG_TEAMS = [
  529,  // Barcelona
  541,  // Real Madrid
  530,  // Atlético Madrid
  33,   // Manchester United
  40,   // Liverpool
  47,   // Chelsea
  50,   // Manchester City
  42,   // Arsenal
  496,  // Juventus
  489,  // AC Milan
  505,  // Inter Milan
  85,   // PSG
  157,  // Bayern Munich
  165   // Borussia Dortmund
];

interface MatchDisplay {
  id: number;
  homeTeam: string;
  homeTeamShort: string;
  homeLogo: string;
  awayTeam: string;
  awayTeamShort: string;
  awayLogo: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  date: Date;
}

interface NewsItem {
  id: number;
  title: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  encapsulation: ViewEncapsulation.None
})
export class Main implements OnInit {
  private footballApi = inject(FootballApiService);
  private router = inject(Router);

  // Signals para estado
  matches = signal<MatchDisplay[]>([]);
  news = signal<NewsItem[]>([]);
  loadingMatches = signal(true);
  searchQuery = signal('');

  // Mock news (en producción vendría de una API de noticias)
  private mockNews: NewsItem[] = [
    { id: 1, title: 'Mbappé brilla en su debut con el Real Madrid' },
    { id: 2, title: 'Barcelona negocia la renovación de Pedri' },
    { id: 3, title: 'Manchester City sigue líder tras goleada' },
    { id: 4, title: 'El Atlético prepara fichaje bomba para enero' },
    { id: 5, title: 'Liverpool vence en Anfield con Hat-trick de Salah' },
    { id: 6, title: 'PSG presenta nuevo proyecto deportivo' }
  ];

  ngOnInit(): void {
    this.loadMatches();
    this.news.set(this.mockNews);
  }

  loadMatches(): void {
    this.loadingMatches.set(true);
    
    // Obtener partidos de las ligas más importantes
    // LaLiga (140), Premier League (39), Serie A (135), Bundesliga (78), Ligue 1 (61)
    const leagueIds = [140, 39, 135, 78, 61];
    const currentSeason = 2024;
    
    // Obtener partidos recientes/próximos de las ligas principales
    const requests = leagueIds.map(leagueId => 
      this.footballApi.getFixturesByLeague(leagueId, currentSeason)
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        const allFixtures: FixtureData[] = [];
        
        responses.forEach(response => {
          if (response.response) {
            allFixtures.push(...response.response);
          }
        });

        // Filtrar partidos de equipos grandes y ordenar por fecha
        const bigTeamMatches = allFixtures
          .filter(fixture => 
            BIG_TEAMS.includes(fixture.teams.home.id) || 
            BIG_TEAMS.includes(fixture.teams.away.id)
          )
          .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime())
          .slice(0, 6); // Mostrar solo 6 partidos

        const displayMatches: MatchDisplay[] = bigTeamMatches.map(fixture => ({
          id: fixture.fixture.id,
          homeTeam: fixture.teams.home.name,
          homeTeamShort: this.getShortName(fixture.teams.home.name),
          homeLogo: fixture.teams.home.logo,
          awayTeam: fixture.teams.away.name,
          awayTeamShort: this.getShortName(fixture.teams.away.name),
          awayLogo: fixture.teams.away.logo,
          homeScore: fixture.goals.home,
          awayScore: fixture.goals.away,
          status: fixture.fixture.status.short,
          date: new Date(fixture.fixture.date)
        }));

        this.matches.set(displayMatches);
        this.loadingMatches.set(false);
      },
      error: (error) => {
        console.error('Error loading matches:', error);
        this.loadingMatches.set(false);
        // Usar datos mock si hay error
        this.setMockMatches();
      }
    });
  }

  private setMockMatches(): void {
    // Datos de respaldo si la API falla
    this.matches.set([
      {
        id: 1,
        homeTeam: 'Barcelona',
        homeTeamShort: 'BAR',
        homeLogo: '',
        awayTeam: 'Chelsea',
        awayTeamShort: 'CHE',
        awayLogo: '',
        homeScore: 1,
        awayScore: 2,
        status: 'FT',
        date: new Date()
      },
      {
        id: 2,
        homeTeam: 'Real Madrid',
        homeTeamShort: 'RMA',
        homeLogo: '',
        awayTeam: 'Arsenal',
        awayTeamShort: 'ARS',
        awayLogo: '',
        homeScore: 2,
        awayScore: 0,
        status: 'FT',
        date: new Date()
      },
      {
        id: 3,
        homeTeam: 'Liverpool',
        homeTeamShort: 'LIV',
        homeLogo: '',
        awayTeam: 'Betis',
        awayTeamShort: 'BET',
        awayLogo: '',
        homeScore: 4,
        awayScore: 0,
        status: 'FT',
        date: new Date()
      }
    ]);
  }

  private getShortName(name: string): string {
    // Mapeo de nombres cortos para equipos conocidos
    const shortNames: Record<string, string> = {
      'Barcelona': 'BAR',
      'FC Barcelona': 'BAR',
      'Real Madrid': 'RMA',
      'Atletico Madrid': 'ATM',
      'Atlético Madrid': 'ATM',
      'Manchester United': 'MUN',
      'Liverpool': 'LIV',
      'Chelsea': 'CHE',
      'Manchester City': 'MCI',
      'Arsenal': 'ARS',
      'Juventus': 'JUV',
      'AC Milan': 'MIL',
      'Inter': 'INT',
      'Inter Milan': 'INT',
      'Paris Saint Germain': 'PSG',
      'Paris Saint-Germain': 'PSG',
      'Bayern Munich': 'BAY',
      'FC Bayern München': 'BAY',
      'Borussia Dortmund': 'BVB',
      'Real Betis': 'BET',
      'Sevilla': 'SEV',
      'Valencia': 'VAL',
      'Villarreal': 'VIL',
      'Real Sociedad': 'RSO',
      'Tottenham': 'TOT',
      'Newcastle': 'NEW',
      'Napoli': 'NAP',
      'AS Roma': 'ROM',
      'Lazio': 'LAZ',
      'Lyon': 'LYO',
      'Marseille': 'MAR',
      'Monaco': 'MON',
      'RB Leipzig': 'LEI',
      'Bayer Leverkusen': 'LEV',
    };

    return shortNames[name] || name.substring(0, 3).toUpperCase();
  }

  onSearch(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.router.navigate(['/buscar'], { queryParams: { q: query } });
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onSearchKeypress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  goToMatch(matchId: number): void {
    this.router.navigate(['/partido', matchId]);
  }

  goToNews(newsId: number): void {
    this.router.navigate(['/noticia', newsId]);
  }

  getMatchStatus(match: MatchDisplay): string {
    switch (match.status) {
      case 'FT':
        return 'Finalizado';
      case 'HT':
        return 'Descanso';
      case '1H':
      case '2H':
        return 'En vivo';
      case 'NS':
        return this.formatMatchDate(match.date);
      case 'PST':
        return 'Aplazado';
      case 'CANC':
        return 'Cancelado';
      default:
        return match.status;
    }
  }

  private formatMatchDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getScoreDisplay(match: MatchDisplay): string {
    if (match.homeScore === null || match.awayScore === null) {
      return 'vs';
    }
    return `${match.homeScore} - ${match.awayScore}`;
  }
}
