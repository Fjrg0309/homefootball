import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'finished' | 'live' | 'upcoming';
}

@Component({
  selector: 'app-league-matches',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './league-matches.html',
  styleUrl: './league-matches.scss'
})
export class LeagueMatches implements OnInit {
  
  leagueId = signal<string>('');
  leagueName = signal<string>('');
  
  matches = signal<Match[]>([
    { id: 1, homeTeam: 'Real Madrid', awayTeam: 'Villarreal', homeScore: 2, awayScore: 0, status: 'finished' },
    { id: 2, homeTeam: 'Barcelona', awayTeam: 'Atlético', homeScore: 1, awayScore: 0, status: 'finished' },
    { id: 3, homeTeam: 'Mallorca', awayTeam: 'Sevilla', homeScore: 0, awayScore: 0, status: 'finished' },
    { id: 4, homeTeam: 'Betis', awayTeam: 'Celta', homeScore: 3, awayScore: 1, status: 'finished' },
    { id: 5, homeTeam: 'Levante', awayTeam: 'Athletic', homeScore: 1, awayScore: 2, status: 'finished' }
  ]);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.leagueId.set(id);
      this.setLeagueName(id);
    });
  }

  private setLeagueName(id: string): void {
    const names: Record<string, string> = {
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
      'championship': 'Championship'
    };
    this.leagueName.set(names[id] || id);
  }

  getWinnerClass(match: Match, team: 'home' | 'away'): string {
    if (match.status !== 'finished') return '';
    
    if (team === 'home' && match.homeScore > match.awayScore) return 'winner';
    if (team === 'away' && match.awayScore > match.homeScore) return 'winner';
    return '';
  }
}
