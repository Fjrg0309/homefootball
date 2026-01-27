import { Component, ViewEncapsulation, signal, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FootballApiService, FixtureData } from '../../../services/football-api.service';
import { MatchCarousel, CarouselMatch } from '../../shared/match-carousel/match-carousel';
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
  165,  // Borussia Dortmund
  // Equipos adicionales para más partidos
  492,  // Napoli
  487,  // Lazio
  499,  // AS Roma
  80,   // Lyon
  81,   // Marseille
  91,   // Monaco
  173,  // RB Leipzig
  168,  // Bayer Leverkusen
  49,   // Tottenham
  34,   // Newcastle
  66,   // Aston Villa
  48,   // West Ham
  45,   // Everton
  541,  // Sevilla
  533,  // Villarreal
  532,  // Valencia
  531,  // Athletic Bilbao
  536,  // Real Sociedad
  548,  // Real Betis
  194,  // Ajax
  197,  // PSV
  211,  // Benfica
  212,  // Porto
  228,  // Sporting CP
];

// Mapeo de IDs de liga a nombres y logos
const LEAGUE_INFO: Record<number, { name: string; logo: string }> = {
  140: { name: 'LaLiga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
  39: { name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
  135: { name: 'Serie A', logo: 'https://media.api-sports.io/football/leagues/135.png' },
  78: { name: 'Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
  61: { name: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  2: { name: 'Champions League', logo: 'https://media.api-sports.io/football/leagues/2.png' },
  3: { name: 'Europa League', logo: 'https://media.api-sports.io/football/leagues/3.png' },
  88: { name: 'Eredivisie', logo: 'https://media.api-sports.io/football/leagues/88.png' },
  94: { name: 'Primeira Liga', logo: 'https://media.api-sports.io/football/leagues/94.png' },
};

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
  league?: string;
  leagueLogo?: string;
}

interface NewsItem {
  id: number;
  title: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, MatchCarousel],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  encapsulation: ViewEncapsulation.None
})
export class Main implements OnInit {
  private footballApi = inject(FootballApiService);
  private router = inject(Router);

  // Signals para estado - Usamos CarouselMatch para compatibilidad con el carrusel
  matches = signal<CarouselMatch[]>([]);
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
    
    // Obtener partidos recientes/en vivo de las ligas más importantes
    // LaLiga (140), Premier League (39), Serie A (135), Bundesliga (78), Ligue 1 (61)
    // Champions League (2), Europa League (3)
    const leagueIds = [140, 39, 135, 78, 61, 2, 3];
    const currentSeason = 2024;
    
    // Obtener partidos de la última jornada/ronda de cada liga
    const requests = leagueIds.map(leagueId => 
      this.footballApi.getLatestRound(leagueId, currentSeason)
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
          .slice(0, 12); // Mostrar 12 partidos para el carrusel

        const displayMatches: CarouselMatch[] = bigTeamMatches.map(fixture => {
          const leagueInfo = LEAGUE_INFO[fixture.league.id];
          return {
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
            date: new Date(fixture.fixture.date),
            league: leagueInfo?.name,
            leagueLogo: leagueInfo?.logo
          };
        });

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
        homeLogo: 'https://media.api-sports.io/football/teams/529.png',
        awayTeam: 'Chelsea',
        awayTeamShort: 'CHE',
        awayLogo: 'https://media.api-sports.io/football/teams/47.png',
        homeScore: 1,
        awayScore: 2,
        status: 'FT',
        date: new Date(),
        league: 'Champions League',
        leagueLogo: 'https://media.api-sports.io/football/leagues/2.png'
      },
      {
        id: 2,
        homeTeam: 'Real Madrid',
        homeTeamShort: 'RMA',
        homeLogo: 'https://media.api-sports.io/football/teams/541.png',
        awayTeam: 'Arsenal',
        awayTeamShort: 'ARS',
        awayLogo: 'https://media.api-sports.io/football/teams/42.png',
        homeScore: 2,
        awayScore: 0,
        status: 'FT',
        date: new Date(),
        league: 'Champions League',
        leagueLogo: 'https://media.api-sports.io/football/leagues/2.png'
      },
      {
        id: 3,
        homeTeam: 'Liverpool',
        homeTeamShort: 'LIV',
        homeLogo: 'https://media.api-sports.io/football/teams/40.png',
        awayTeam: 'Bayern Munich',
        awayTeamShort: 'BAY',
        awayLogo: 'https://media.api-sports.io/football/teams/157.png',
        homeScore: 4,
        awayScore: 1,
        status: 'FT',
        date: new Date(),
        league: 'Champions League',
        leagueLogo: 'https://media.api-sports.io/football/leagues/2.png'
      },
      {
        id: 4,
        homeTeam: 'Manchester City',
        homeTeamShort: 'MCI',
        homeLogo: 'https://media.api-sports.io/football/teams/50.png',
        awayTeam: 'PSG',
        awayTeamShort: 'PSG',
        awayLogo: 'https://media.api-sports.io/football/teams/85.png',
        homeScore: 3,
        awayScore: 2,
        status: 'FT',
        date: new Date(),
        league: 'Champions League',
        leagueLogo: 'https://media.api-sports.io/football/leagues/2.png'
      },
      {
        id: 5,
        homeTeam: 'Juventus',
        homeTeamShort: 'JUV',
        homeLogo: 'https://media.api-sports.io/football/teams/496.png',
        awayTeam: 'Inter Milan',
        awayTeamShort: 'INT',
        awayLogo: 'https://media.api-sports.io/football/teams/505.png',
        homeScore: 1,
        awayScore: 1,
        status: 'FT',
        date: new Date(),
        league: 'Serie A',
        leagueLogo: 'https://media.api-sports.io/football/leagues/135.png'
      },
      {
        id: 6,
        homeTeam: 'Atlético Madrid',
        homeTeamShort: 'ATM',
        homeLogo: 'https://media.api-sports.io/football/teams/530.png',
        awayTeam: 'Borussia Dortmund',
        awayTeamShort: 'BVB',
        awayLogo: 'https://media.api-sports.io/football/teams/165.png',
        homeScore: 2,
        awayScore: 1,
        status: 'FT',
        date: new Date(),
        league: 'Champions League',
        leagueLogo: 'https://media.api-sports.io/football/leagues/2.png'
      },
      {
        id: 7,
        homeTeam: 'Manchester United',
        homeTeamShort: 'MUN',
        homeLogo: 'https://media.api-sports.io/football/teams/33.png',
        awayTeam: 'AC Milan',
        awayTeamShort: 'MIL',
        awayLogo: 'https://media.api-sports.io/football/teams/489.png',
        homeScore: null,
        awayScore: null,
        status: 'NS',
        date: new Date(Date.now() + 86400000),
        league: 'Europa League',
        leagueLogo: 'https://media.api-sports.io/football/leagues/3.png'
      },
      {
        id: 8,
        homeTeam: 'Napoli',
        homeTeamShort: 'NAP',
        homeLogo: 'https://media.api-sports.io/football/teams/492.png',
        awayTeam: 'Roma',
        awayTeamShort: 'ROM',
        awayLogo: 'https://media.api-sports.io/football/teams/499.png',
        homeScore: null,
        awayScore: null,
        status: 'NS',
        date: new Date(Date.now() + 172800000),
        league: 'Serie A',
        leagueLogo: 'https://media.api-sports.io/football/leagues/135.png'
      },
      {
        id: 9,
        homeTeam: 'Sevilla',
        homeTeamShort: 'SEV',
        homeLogo: 'https://media.api-sports.io/football/teams/541.png',
        awayTeam: 'Valencia',
        awayTeamShort: 'VAL',
        awayLogo: 'https://media.api-sports.io/football/teams/532.png',
        homeScore: null,
        awayScore: null,
        status: 'NS',
        date: new Date(Date.now() + 259200000),
        league: 'LaLiga',
        leagueLogo: 'https://media.api-sports.io/football/leagues/140.png'
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
