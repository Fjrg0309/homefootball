import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballApiService, LeagueData, TeamData, Standing } from '../../services/football-api.service';

/**
 * Componente de ejemplo para mostrar datos de API-Football
 * Muestra ligas de España, equipos de La Liga y clasificación
 */
@Component({
  selector: 'app-football-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="football-demo">
      <h1>🏆 Demo API-Football</h1>
      
      <!-- Estado de la API -->
      <section class="status-section">
        <h2>Estado de la API</h2>
        @if (apiStatus()) {
          <div class="status" [class.configured]="apiStatus()?.configured">
            {{ apiStatus()?.message }}
          </div>
        }
      </section>

      <!-- Ligas de España -->
      <section class="leagues-section">
        <h2>⚽ Ligas de España</h2>
        @if (loading()) {
          <div class="loading">Cargando ligas...</div>
        }
        @if (leagues().length > 0) {
          <div class="leagues-grid">
            @for (league of leagues(); track league.league.id) {
              <div class="league-card" (click)="selectLeague(league)">
                <img [src]="league.league.logo" [alt]="league.league.name" class="league-logo">
                <div class="league-info">
                  <h3>{{ league.league.name }}</h3>
                  <p>{{ league.country.name }}</p>
                  <span class="league-type">{{ league.league.type }}</span>
                </div>
              </div>
            }
          </div>
        }
      </section>

      <!-- Equipos de la liga seleccionada -->
      @if (selectedLeague()) {
        <section class="teams-section">
          <h2>👕 Equipos de {{ selectedLeague()?.league?.name }}</h2>
          @if (loadingTeams()) {
            <div class="loading">Cargando equipos...</div>
          }
          @if (teams().length > 0) {
            <div class="teams-grid">
              @for (team of teams(); track team.team.id) {
                <div class="team-card">
                  <img [src]="team.team.logo" [alt]="team.team.name" class="team-logo">
                  <div class="team-info">
                    <h4>{{ team.team.name }}</h4>
                    <p>Fundado: {{ team.team.founded }}</p>
                    @if (team.venue) {
                      <p class="venue">🏟️ {{ team.venue.name }}</p>
                      <p class="capacity">Capacidad: {{ team.venue.capacity | number }}</p>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </section>

        <!-- Clasificación -->
        <section class="standings-section">
          <h2>📊 Clasificación</h2>
          @if (loadingStandings()) {
            <div class="loading">Cargando clasificación...</div>
          }
          @if (standings().length > 0) {
            <table class="standings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Equipo</th>
                  <th>PJ</th>
                  <th>G</th>
                  <th>E</th>
                  <th>P</th>
                  <th>GF</th>
                  <th>GC</th>
                  <th>DG</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                @for (standing of standings(); track standing.team.id) {
                  <tr [class.champions]="standing.rank <= 4" [class.relegation]="standing.rank >= 18">
                    <td>{{ standing.rank }}</td>
                    <td class="team-cell">
                      <img [src]="standing.team.logo" [alt]="standing.team.name" class="table-logo">
                      {{ standing.team.name }}
                    </td>
                    <td>{{ standing.all.played }}</td>
                    <td>{{ standing.all.win }}</td>
                    <td>{{ standing.all.draw }}</td>
                    <td>{{ standing.all.lose }}</td>
                    <td>{{ standing.all.goals.for }}</td>
                    <td>{{ standing.all.goals.against }}</td>
                    <td>{{ standing.goalsDiff }}</td>
                    <td class="points">{{ standing.points }}</td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </section>
      }

      <!-- Errores -->
      @if (error()) {
        <div class="error">
          ❌ {{ error() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .football-demo {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }

    section {
      margin-bottom: 2rem;
    }

    .status {
      padding: 1rem;
      border-radius: 8px;
      background: #fee;
      color: #c00;
    }

    .status.configured {
      background: #efe;
      color: #060;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .leagues-grid, .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .league-card, .team-card {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .league-card:hover, .team-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .league-logo, .team-logo {
      width: 60px;
      height: 60px;
      object-fit: contain;
      margin-right: 1rem;
    }

    .league-info h3, .team-info h4 {
      margin: 0 0 0.25rem 0;
    }

    .league-info p, .team-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .league-type {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: #e0e0e0;
      border-radius: 4px;
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }

    .venue {
      font-weight: 500;
    }

    .capacity {
      font-size: 0.8rem;
    }

    .standings-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .standings-table th,
    .standings-table td {
      padding: 0.75rem;
      text-align: center;
      border-bottom: 1px solid #eee;
    }

    .standings-table th {
      background: #333;
      color: white;
    }

    .standings-table .team-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-align: left;
    }

    .table-logo {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .standings-table .points {
      font-weight: bold;
    }

    .standings-table tr.champions {
      background: #e8f5e9;
    }

    .standings-table tr.relegation {
      background: #ffebee;
    }

    .error {
      padding: 1rem;
      background: #fee;
      color: #c00;
      border-radius: 8px;
      margin-top: 1rem;
    }
  `]
})
export class FootballDemoComponent implements OnInit {
  private footballApi = inject(FootballApiService);

  // Signals para estado reactivo
  apiStatus = signal<{ configured: boolean; message: string } | null>(null);
  leagues = signal<LeagueData[]>([]);
  teams = signal<TeamData[]>([]);
  standings = signal<Standing[]>([]);
  selectedLeague = signal<LeagueData | null>(null);
  
  loading = signal(false);
  loadingTeams = signal(false);
  loadingStandings = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.checkApiStatus();
    this.loadSpanishLeagues();
  }

  checkApiStatus() {
    this.footballApi.getStatus().subscribe({
      next: (status) => this.apiStatus.set(status),
      error: (err) => this.error.set('Error al verificar el estado de la API')
    });
  }

  loadSpanishLeagues() {
    this.loading.set(true);
    this.footballApi.getLeaguesByCountry('Spain').subscribe({
      next: (response) => {
        this.leagues.set(response.response);
        this.loading.set(false);
        
        // Seleccionar La Liga automáticamente (ID 140)
        const laLiga = response.response.find(l => l.league.id === 140);
        if (laLiga) {
          this.selectLeague(laLiga);
        }
      },
      error: (err) => {
        this.error.set('Error al cargar las ligas. ¿Está configurada la API key?');
        this.loading.set(false);
      }
    });
  }

  selectLeague(league: LeagueData) {
    this.selectedLeague.set(league);
    this.loadTeams(league.league.id);
    this.loadStandings(league.league.id);
  }

  loadTeams(leagueId: number) {
    this.loadingTeams.set(true);
    this.footballApi.getTeamsByLeague(leagueId, 2024).subscribe({
      next: (response) => {
        this.teams.set(response.response);
        this.loadingTeams.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los equipos');
        this.loadingTeams.set(false);
      }
    });
  }

  loadStandings(leagueId: number) {
    this.loadingStandings.set(true);
    this.footballApi.getStandings(leagueId, 2024).subscribe({
      next: (response) => {
        if (response.response.length > 0 && response.response[0].league.standings.length > 0) {
          this.standings.set(response.response[0].league.standings[0]);
        }
        this.loadingStandings.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar la clasificación');
        this.loadingStandings.set(false);
      }
    });
  }
}
