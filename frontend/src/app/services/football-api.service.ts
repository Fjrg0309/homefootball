import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interfaces para las respuestas de API-Football
 */

// Respuesta genérica de la API
export interface ApiFootballResponse<T> {
  get: string;
  parameters: any;
  errors: any;
  results: number;
  paging: { current: number; total: number };
  response: T[];
}

// Liga
export interface LeagueData {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string;
    flag: string;
  };
  seasons: Season[];
}

export interface Season {
  year: number;
  start: string;
  end: string;
  current: boolean;
}

// Equipo
export interface TeamData {
  team: {
    id: number;
    name: string;
    code: string;
    country: string;
    founded: number;
    national: boolean;
    logo: string;
  };
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

// Jugador
export interface PlayerData {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: {
      date: string;
      place: string;
      country: string;
    };
    nationality: string;
    height: string;
    weight: string;
    injured: boolean;
    photo: string;
  };
  statistics: PlayerStatistics[];
}

export interface PlayerStatistics {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: string;
  };
  games: {
    appearances: number;
    lineups: number;
    minutes: number;
    position: string;
    rating: string;
    captain: boolean;
  };
  goals: {
    total: number;
    conceded: number;
    assists: number;
    saves: number;
  };
  passes: {
    total: number;
    key: number;
    accuracy: number;
  };
  cards: {
    yellow: number;
    yellowred: number;
    red: number;
  };
}

// Partido (Fixture)
export interface FixtureData {
  fixture: {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: TeamInfo;
    away: TeamInfo;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface TeamInfo {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

// Clasificación (Standings)
export interface StandingsData {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    standings: Standing[][];
  };
}

export interface Standing {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: MatchStats;
  home: MatchStats;
  away: MatchStats;
  update: string;
}

export interface MatchStats {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  };
}

/**
 * Servicio para consumir la API de Football a través del backend
 * El backend actúa como proxy para proteger la API key
 */
@Injectable({
  providedIn: 'root'
})
export class FootballApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/football`;
  
  constructor() {
    console.log('FootballApiService initialized');
    console.log('API Base URL:', this.baseUrl);
    console.log('Environment:', environment);
  }

  // ==================== STATUS ====================

  /**
   * Verifica si la API está configurada correctamente
   */
  getStatus(): Observable<{ configured: boolean; message: string }> {
    return this.http.get<{ configured: boolean; message: string }>(`${this.baseUrl}/status`);
  }

  // ==================== LIGAS ====================

  /**
   * Obtiene todas las ligas disponibles
   */
  getLeagues(): Observable<ApiFootballResponse<LeagueData>> {
    return this.http.get<ApiFootballResponse<LeagueData>>(`${this.baseUrl}/leagues`);
  }

  /**
   * Obtiene ligas por país
   */
  getLeaguesByCountry(country: string): Observable<ApiFootballResponse<LeagueData>> {
    return this.http.get<ApiFootballResponse<LeagueData>>(`${this.baseUrl}/leagues/country/${country}`);
  }

  /**
   * Obtiene una liga por su ID
   */
  getLeagueById(id: number): Observable<ApiFootballResponse<LeagueData>> {
    return this.http.get<ApiFootballResponse<LeagueData>>(`${this.baseUrl}/leagues/${id}`);
  }

  // ==================== EQUIPOS ====================

  /**
   * Obtiene equipos de una liga y temporada
   */
  getTeamsByLeague(leagueId: number, season: number = 2022): Observable<ApiFootballResponse<TeamData>> {
    return this.http.get<ApiFootballResponse<TeamData>>(`${this.baseUrl}/teams`, {
      params: { league: leagueId.toString(), season: season.toString() }
    });
  }

  /**
   * Obtiene un equipo por su ID
   */
  getTeamById(id: number): Observable<ApiFootballResponse<TeamData>> {
    return this.http.get<ApiFootballResponse<TeamData>>(`${this.baseUrl}/teams/${id}`);
  }

  /**
   * Busca equipos por nombre
   */
  searchTeams(name: string): Observable<ApiFootballResponse<TeamData>> {
    return this.http.get<ApiFootballResponse<TeamData>>(`${this.baseUrl}/teams/search`, {
      params: { name }
    });
  }

  // ==================== JUGADORES ====================

  /**
   * Obtiene jugadores de un equipo
   */
  getPlayersByTeam(teamId: number, season: number = 2022): Observable<ApiFootballResponse<PlayerData>> {
    return this.http.get<ApiFootballResponse<PlayerData>>(`${this.baseUrl}/players`, {
      params: { team: teamId.toString(), season: season.toString() }
    });
  }

  /**
   * Obtiene un jugador por su ID
   */
  getPlayerById(id: number, season: number = 2022): Observable<ApiFootballResponse<PlayerData>> {
    return this.http.get<ApiFootballResponse<PlayerData>>(`${this.baseUrl}/players/${id}`, {
      params: { season: season.toString() }
    });
  }

  /**
   * Busca jugadores por nombre
   */
  searchPlayers(name: string, leagueId: number, season: number = 2022): Observable<ApiFootballResponse<PlayerData>> {
    return this.http.get<ApiFootballResponse<PlayerData>>(`${this.baseUrl}/players/search`, {
      params: { name, league: leagueId.toString(), season: season.toString() }
    });
  }

  /**
   * Obtiene los máximos goleadores de una liga
   */
  getTopScorers(leagueId: number, season: number = 2022): Observable<ApiFootballResponse<PlayerData>> {
    return this.http.get<ApiFootballResponse<PlayerData>>(`${this.baseUrl}/players/topscorers`, {
      params: { league: leagueId.toString(), season: season.toString() }
    });
  }

  // ==================== PARTIDOS ====================

  /**
   * Obtiene partidos de una liga
   */
  getFixturesByLeague(leagueId: number, season: number = 2022): Observable<ApiFootballResponse<FixtureData>> {
    return this.http.get<ApiFootballResponse<FixtureData>>(`${this.baseUrl}/fixtures`, {
      params: { league: leagueId.toString(), season: season.toString() }
    });
  }

  /**
   * Obtiene partidos en vivo
   */
  getLiveFixtures(): Observable<ApiFootballResponse<FixtureData>> {
    return this.http.get<ApiFootballResponse<FixtureData>>(`${this.baseUrl}/fixtures/live`);
  }

  /**
   * Obtiene partidos por fecha (formato: YYYY-MM-DD)
   */
  getFixturesByDate(date: string): Observable<ApiFootballResponse<FixtureData>> {
    return this.http.get<ApiFootballResponse<FixtureData>>(`${this.baseUrl}/fixtures/date/${date}`);
  }

  /**
   * Obtiene partidos de un equipo
   */
  getFixturesByTeam(teamId: number, season: number = 2022): Observable<ApiFootballResponse<FixtureData>> {
    return this.http.get<ApiFootballResponse<FixtureData>>(`${this.baseUrl}/fixtures/team/${teamId}`, {
      params: { season: season.toString() }
    });
  }

  /**
   * Obtiene la última jornada completada de una liga
   * Devuelve los partidos más recientes finalizados
   */
  getLatestRound(leagueId: number, season: number = 2022): Observable<ApiFootballResponse<FixtureData>> {
    return this.http.get<ApiFootballResponse<FixtureData>>(`${this.baseUrl}/fixtures/latest-round`, {
      params: { league: leagueId.toString(), season: season.toString() }
    });
  }

  /**
   * Obtiene partidos de una jornada específica
   */
  getFixturesByRound(leagueId: number, season: number, round: string): Observable<ApiFootballResponse<FixtureData>> {
    const url = `${this.baseUrl}/fixtures/round`;
    const params = { league: leagueId.toString(), season: season.toString(), round };
    console.log('getFixturesByRound - URL:', url);
    console.log('getFixturesByRound - Params:', params);
    return this.http.get<ApiFootballResponse<FixtureData>>(url, { params });
  }

  /**
   * Obtiene la última fecha con datos disponibles para una liga
   */
  getLatestAvailableDate(leagueId: number, season: number = 2022): Observable<{ date: string }> {
    return this.http.get<{ date: string }>(`${this.baseUrl}/fixtures/latest-date`, {
      params: { league: leagueId.toString(), season: season.toString() }
    });
  }

  // ==================== CLASIFICACIÓN ====================

  /**
   * Obtiene la clasificación de una liga
   */
  getStandings(leagueId: number, season: number = 2022): Observable<ApiFootballResponse<StandingsData>> {
    return this.http.get<ApiFootballResponse<StandingsData>>(`${this.baseUrl}/standings`, {
      params: { league: leagueId.toString(), season: season.toString() }
    });
  }
}
