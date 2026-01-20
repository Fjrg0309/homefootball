import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FootballApiService, FixtureData } from '../../services/football-api.service';

/**
 * Ejemplo de uso de la API Football para obtener la última jornada
 * Este componente muestra cómo obtener datos recientes sin acceso a datos en vivo
 */
@Component({
  selector: 'app-latest-round-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="latest-round-container">
      <h1>🏆 Última Jornada de la Liga</h1>
      
      <div class="controls">
        <label for="league">Selecciona una liga:</label>
        <select id="league" [(ngModel)]="selectedLeagueId" (change)="onLeagueChange()">
          <option value="140">La Liga (España)</option>
          <option value="39">Premier League (Inglaterra)</option>
          <option value="135">Serie A (Italia)</option>
          <option value="78">Bundesliga (Alemania)</option>
          <option value="61">Ligue 1 (Francia)</option>
          <option value="2">Champions League</option>
        </select>

        <label for="season">Temporada:</label>
        <select id="season" [(ngModel)]="selectedSeason" (change)="onLeagueChange()">
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>

        <button (click)="loadLatestRound()" [disabled]="loading()">
          {{ loading() ? 'Cargando...' : 'Cargar Última Jornada' }}
        </button>
      </div>

      @if (error()) {
        <div class="error-message">
          ❌ Error: {{ error() }}
        </div>
      }

      @if (loading()) {
        <div class="loading">
          ⏳ Cargando datos...
        </div>
      }

      @if (fixtures().length > 0 && !loading()) {
        <div class="results">
          <h2>Resultados de la última jornada</h2>
          <p class="info">Se encontraron {{ fixtures().length }} partidos</p>
          
          <div class="fixtures-grid">
            @for (fixture of fixtures(); track fixture.fixture.id) {
              <div class="fixture-card">
                <div class="fixture-header">
                  <span class="league-name">{{ fixture.league.name }}</span>
                  <span class="round">{{ fixture.league.round }}</span>
                </div>
                
                <div class="match-info">
                  <div class="team home">
                    <img [src]="fixture.teams.home.logo" [alt]="fixture.teams.home.name">
                    <span>{{ fixture.teams.home.name }}</span>
                  </div>
                  
                  <div class="score">
                    <span class="result">
                      {{ fixture.goals.home }} - {{ fixture.goals.away }}
                    </span>
                    <span class="status">{{ fixture.fixture.status.short }}</span>
                  </div>
                  
                  <div class="team away">
                    <img [src]="fixture.teams.away.logo" [alt]="fixture.teams.away.name">
                    <span>{{ fixture.teams.away.name }}</span>
                  </div>
                </div>
                
                <div class="fixture-footer">
                  <span class="date">📅 {{ formatDate(fixture.fixture.date) }}</span>
                  @if (fixture.fixture.venue && fixture.fixture.venue.name) {
                    <span class="venue">🏟️ {{ fixture.fixture.venue.name }}</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

      @if (!loading() && fixtures().length === 0 && !error()) {
        <div class="no-data">
          ℹ️ No hay datos disponibles. Selecciona una liga y haz clic en "Cargar Última Jornada"
        </div>
      }

      <div class="info-section">
        <h3>ℹ️ Información</h3>
        <ul>
          <li>Este endpoint obtiene la <strong>última jornada completada</strong> de la liga seleccionada</li>
          <li>No requiere acceso a datos en vivo (útil para planes gratuitos de API)</li>
          <li>Los datos se obtienen del backend que consulta la API de Football</li>
          <li>Se muestran solo partidos finalizados (status: FT)</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .latest-round-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 2rem;
    }

    .controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      flex-wrap: wrap;
    }

    label {
      font-weight: 600;
      color: #495057;
    }

    select {
      padding: 0.5rem 1rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    button {
      padding: 0.5rem 1.5rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }

    button:hover:not(:disabled) {
      background: #0056b3;
    }

    button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .error-message {
      padding: 1rem;
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      font-size: 1.2rem;
      color: #6c757d;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      background: #e7f3ff;
      border-radius: 8px;
      color: #004085;
    }

    .results h2 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .info {
      color: #6c757d;
      margin-bottom: 1.5rem;
    }

    .fixtures-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .fixture-card {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .fixture-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .fixture-header {
      background: #f8f9fa;
      padding: 0.75rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dee2e6;
    }

    .league-name {
      font-weight: 600;
      color: #495057;
    }

    .round {
      font-size: 0.85rem;
      color: #6c757d;
    }

    .match-info {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .team {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .team.home {
      justify-content: flex-start;
    }

    .team.away {
      justify-content: flex-end;
      flex-direction: row-reverse;
    }

    .team img {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .team span {
      font-weight: 500;
      color: #2c3e50;
    }

    .score {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .result {
      font-size: 1.5rem;
      font-weight: 700;
      color: #28a745;
    }

    .status {
      font-size: 0.75rem;
      color: #6c757d;
      background: #e9ecef;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .fixture-footer {
      padding: 0.75rem 1rem;
      background: #f8f9fa;
      border-top: 1px solid #dee2e6;
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #6c757d;
    }

    .info-section {
      margin-top: 3rem;
      padding: 1.5rem;
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      border-radius: 4px;
    }

    .info-section h3 {
      margin-top: 0;
      color: #856404;
    }

    .info-section ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #856404;
    }

    .info-section li {
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .fixtures-grid {
        grid-template-columns: 1fr;
      }

      .controls {
        flex-direction: column;
        align-items: stretch;
      }

      .controls label,
      .controls select,
      .controls button {
        width: 100%;
      }
    }
  `]
})
export class LatestRoundExampleComponent implements OnInit {
  private footballApi = inject(FootballApiService);

  // Signals para el estado
  loading = signal(false);
  error = signal<string | null>(null);
  fixtures = signal<FixtureData[]>([]);

  // Estado de selección
  selectedLeagueId = '140'; // La Liga por defecto
  selectedSeason = '2024';

  ngOnInit() {
    // Cargar automáticamente al iniciar
    this.loadLatestRound();
  }

  onLeagueChange() {
    // Limpiar datos al cambiar la selección
    this.fixtures.set([]);
    this.error.set(null);
  }

  loadLatestRound() {
    this.loading.set(true);
    this.error.set(null);
    this.fixtures.set([]);

    const leagueId = parseInt(this.selectedLeagueId);
    const season = parseInt(this.selectedSeason);

    console.log(`Cargando última jornada de la liga ${leagueId} temporada ${season}`);

    this.footballApi.getLatestRound(leagueId, season).subscribe({
      next: (response) => {
        console.log('Respuesta recibida:', response);
        this.fixtures.set(response.response || []);
        this.loading.set(false);
        
        if (response.response && response.response.length > 0) {
          console.log(`✅ Se cargaron ${response.response.length} partidos`);
        } else {
          this.error.set(`No se encontraron partidos para esta liga en la temporada ${season}. Prueba con otra temporada (2023, 2022, 2021).`);
        }
      },
      error: (err) => {
        console.error('Error al cargar la última jornada:', err);
        this.loading.set(false);
        
        let errorMsg = 'Error al cargar los datos.';
        
        if (err.message) {
          errorMsg = err.message;
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        } else if (err.status === 0) {
          errorMsg = '❌ No se puede conectar con el servidor. Verifica tu conexión a internet.';
        } else if (err.status === 500) {
          errorMsg = `No hay datos disponibles para la liga ${leagueId} en la temporada ${season}. Intenta con temporadas anteriores (2023, 2022, 2021).`;
        }
        
        this.error.set(errorMsg);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
