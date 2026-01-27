import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CacheService } from './cache.service';

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

// Squad/Plantilla del primer equipo
export interface SquadData {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  players: SquadPlayer[];
}

export interface SquadPlayer {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
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
    number: number | null;
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

// Evento de partido (Goal, Card, Subst, VAR)
export interface FixtureEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number | null;
    name: string | null;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
  type: string;     // "Goal", "Card", "subst", "Var"
  detail: string;   // "Normal Goal", "Penalty", "Yellow Card", "Red Card", "Substitution 1", etc.
  comments: string | null;
}

// Estadísticas de equipo en un partido
export interface FixtureStatistics {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: {
    type: string;
    value: number | string | null;
  }[];
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
 * Incluye sistema de caché persistente (localStorage) para reducir peticiones
 * y permitir navegación offline cuando no hay peticiones disponibles
 */
@Injectable({
  providedIn: 'root'
})
export class FootballApiService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);
  private readonly baseUrl = `${environment.apiUrl}/football`;
  
  // ==================== CACHÉ ====================
  // Caché en memoria para observables activos (shareReplay)
  private memoryCache = new Map<string, Observable<any>>();
  
  // Tiempo de expiración de la caché en memoria - 5 minutos
  private readonly MEMORY_CACHE_DURATION = 5 * 60 * 1000;
  
  // Tiempo de expiración de la caché persistente - 30 minutos
  private readonly PERSISTENT_CACHE_DURATION = 30 * 60 * 1000;
  
  // Timestamps de cuando se guardó cada entrada en memoria
  private memoryCacheTimestamps = new Map<string, number>();
  
  constructor() {
    console.log('⚽ FootballApiService initialized with persistent caching');
    console.log('📍 API Base URL:', this.baseUrl);
    console.log('⏱️ Memory cache duration:', this.MEMORY_CACHE_DURATION / 1000, 'seconds');
    console.log('💾 Persistent cache duration:', this.PERSISTENT_CACHE_DURATION / 1000, 'seconds');
  }

  /**
   * Genera una clave única para la caché basada en la URL y parámetros
   */
  private getCacheKey(url: string, params?: Record<string, string>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}:${paramString}`;
  }

  /**
   * Verifica si una entrada de caché en memoria es válida (no expirada)
   */
  private isMemoryCacheValid(key: string): boolean {
    const timestamp = this.memoryCacheTimestamps.get(key);
    if (!timestamp) return false;
    return Date.now() - timestamp < this.MEMORY_CACHE_DURATION;
  }

  /**
   * Obtiene datos con caché persistente + memoria
   * 1. Primero busca en caché de memoria (más rápida)
   * 2. Si no hay, busca en caché persistente (localStorage)
   * 3. Si no hay, hace la petición HTTP y guarda en ambas cachés
   * 4. Si falla la petición, devuelve datos de caché persistente si existen
   */
  private getCached<T>(key: string, request: () => Observable<T>): Observable<T> {
    const persistentKey = this.cacheService.generateKey(key);
    
    // 1. Verificar caché de memoria
    if (this.memoryCache.has(key) && this.isMemoryCacheValid(key)) {
      console.log('⚡ Memory Cache HIT:', key.substring(0, 50) + '...');
      return this.memoryCache.get(key) as Observable<T>;
    }

    // 2. Verificar caché persistente
    const persistentData = this.cacheService.get<T>(persistentKey);
    if (persistentData) {
      console.log('💾 Persistent Cache HIT:', key.substring(0, 50) + '...');
      // Guardar también en memoria para acceso rápido
      const observable = of(persistentData).pipe(shareReplay(1));
      this.memoryCache.set(key, observable);
      this.memoryCacheTimestamps.set(key, Date.now());
      return observable;
    }

    // 3. Hacer petición HTTP y cachear en ambos niveles
    console.log('🌐 Cache MISS - Fetching:', key.substring(0, 50) + '...');
    const observable = request().pipe(
      tap(data => {
        // Guardar en caché persistente
        this.cacheService.set(persistentKey, data, this.PERSISTENT_CACHE_DURATION);
        this.memoryCacheTimestamps.set(key, Date.now());
      }),
      catchError(error => {
        // Si falla, intentar devolver datos de caché aunque estén expirados
        console.warn('❌ HTTP Error, trying to use expired cache...');
        const expiredData = localStorage.getItem('hf_cache_' + persistentKey);
        if (expiredData) {
          try {
            const parsed = JSON.parse(expiredData);
            console.log('📦 Using expired cache data as fallback');
            return of(parsed.data as T);
          } catch {
            throw error;
          }
        }
        throw error;
      }),
      shareReplay(1)
    );
    
    this.memoryCache.set(key, observable);
    return observable;
  }

  /**
   * Limpia toda la caché (memoria + persistente)
   */
  clearCache(): void {
    this.memoryCache.clear();
    this.memoryCacheTimestamps.clear();
    this.cacheService.clear();
    console.log('🗑️ All cache cleared (memory + persistent)');
  }

  /**
   * Limpia solo la caché de memoria
   */
  clearMemoryCache(): void {
    this.memoryCache.clear();
    this.memoryCacheTimestamps.clear();
    console.log('🗑️ Memory cache cleared');
  }

  /**
   * Obtiene estadísticas de la caché
   */
  getCacheStats() {
    return {
      memory: {
        entries: this.memoryCache.size
      },
      persistent: this.cacheService.getStats()
    };
  }

  /**
   * Limpia la caché de una clave específica
   */
  clearCacheKey(key: string): void {
    this.memoryCache.delete(key);
    this.memoryCacheTimestamps.delete(key);
    this.cacheService.remove(this.cacheService.generateKey(key));
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
   * Obtiene todas las ligas disponibles (con caché)
   */
  getLeagues(): Observable<ApiFootballResponse<LeagueData>> {
    const url = `${this.baseUrl}/leagues`;
    const key = this.getCacheKey(url);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<LeagueData>>(url)
    );
  }

  /**
   * Obtiene ligas por país (con caché)
   */
  getLeaguesByCountry(country: string): Observable<ApiFootballResponse<LeagueData>> {
    const url = `${this.baseUrl}/leagues/country/${country}`;
    const key = this.getCacheKey(url);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<LeagueData>>(url)
    );
  }

  /**
   * Obtiene una liga por su ID (con caché)
   */
  getLeagueById(id: number): Observable<ApiFootballResponse<LeagueData>> {
    const url = `${this.baseUrl}/leagues/${id}`;
    const key = this.getCacheKey(url);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<LeagueData>>(url)
    );
  }

  /**
   * Obtiene las ligas en las que participa un equipo (con caché)
   */
  getLeaguesByTeam(teamId: number, season: number = 2024): Observable<ApiFootballResponse<LeagueData>> {
    const url = `${this.baseUrl}/leagues/team/${teamId}`;
    const params = { season: season.toString() };
    const key = this.getCacheKey(url, params);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<LeagueData>>(url, { params })
    );
  }

  // ==================== EQUIPOS ====================

  /**
   * Obtiene equipos de una liga y temporada (con caché)
   */
  getTeamsByLeague(leagueId: number, season: number = 2022): Observable<ApiFootballResponse<TeamData>> {
    const url = `${this.baseUrl}/teams`;
    const params = { league: leagueId.toString(), season: season.toString() };
    const key = this.getCacheKey(url, params);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<TeamData>>(url, { params })
    );
  }

  /**
   * Obtiene un equipo por su ID (con caché)
   */
  getTeamById(id: number): Observable<ApiFootballResponse<TeamData>> {
    const url = `${this.baseUrl}/teams/${id}`;
    const key = this.getCacheKey(url);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<TeamData>>(url)
    );
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
   * Obtiene la plantilla oficial del primer equipo (con caché)
   * Usa el endpoint /players/squads que solo devuelve jugadores con ficha del primer equipo
   */
  getTeamSquad(teamId: number): Observable<ApiFootballResponse<SquadData>> {
    const url = `${this.baseUrl}/squads/${teamId}`;
    const key = this.getCacheKey(url);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<SquadData>>(url)
    );
  }

  /**
   * Obtiene jugadores de un equipo (con caché)
   */
  getPlayersByTeam(teamId: number, season: number = 2024): Observable<ApiFootballResponse<PlayerData>> {
    const url = `${this.baseUrl}/players`;
    const params = { team: teamId.toString(), season: season.toString() };
    const key = this.getCacheKey(url, params);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<PlayerData>>(url, { params })
    );
  }

  /**
   * Obtiene un jugador por su ID (con caché)
   */
  getPlayerById(id: number, season: number = 2024): Observable<ApiFootballResponse<PlayerData>> {
    const url = `${this.baseUrl}/players/${id}`;
    const params = { season: season.toString() };
    const key = this.getCacheKey(url, params);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<PlayerData>>(url, { params })
    );
  }

  /**
   * Busca jugadores por nombre (sin caché - búsquedas dinámicas)
   */
  searchPlayers(name: string, leagueId: number, season: number = 2024): Observable<ApiFootballResponse<PlayerData>> {
    return this.http.get<ApiFootballResponse<PlayerData>>(`${this.baseUrl}/players/search`, {
      params: { name, league: leagueId.toString(), season: season.toString() }
    });
  }

  /**
   * Obtiene los máximos goleadores de una liga (con caché)
   */
  getTopScorers(leagueId: number, season: number = 2024): Observable<ApiFootballResponse<PlayerData>> {
    const url = `${this.baseUrl}/players/topscorers`;
    const params = { league: leagueId.toString(), season: season.toString() };
    const key = this.getCacheKey(url, params);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<PlayerData>>(url, { params })
    );
  }

  // ==================== PARTIDOS ====================

  /**
   * Obtiene partidos de una liga (con caché)
   */
  getFixturesByLeague(leagueId: number, season: number = 2022): Observable<ApiFootballResponse<FixtureData>> {
    const url = `${this.baseUrl}/fixtures`;
    const params = { league: leagueId.toString(), season: season.toString() };
    const key = this.getCacheKey(url, params);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<FixtureData>>(url, { params })
    );
  }

  /**
   * Obtiene partidos en vivo (sin caché - datos en tiempo real)
   */
  getLiveFixtures(): Observable<ApiFootballResponse<FixtureData>> {
    return this.http.get<ApiFootballResponse<FixtureData>>(`${this.baseUrl}/fixtures/live`);
  }

  /**
   * Obtiene partidos por fecha (con caché corta)
   */
  getFixturesByDate(date: string): Observable<ApiFootballResponse<FixtureData>> {
    const url = `${this.baseUrl}/fixtures/date/${date}`;
    const key = this.getCacheKey(url);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<FixtureData>>(url)
    );
  }

  /**
   * Obtiene partidos de un equipo (con caché)
   */
  getFixturesByTeam(teamId: number, season: number = 2022): Observable<ApiFootballResponse<FixtureData>> {
    const url = `${this.baseUrl}/fixtures/team/${teamId}`;
    const params = { season: season.toString() };
    const key = this.getCacheKey(url, params);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<FixtureData>>(url, { params })
    );
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
   * Obtiene partidos de una jornada específica (con caché)
   */
  getFixturesByRound(leagueId: number, season: number, round: string): Observable<ApiFootballResponse<FixtureData>> {
    const url = `${this.baseUrl}/fixtures/round`;
    const params = { league: leagueId.toString(), season: season.toString(), round };
    const key = this.getCacheKey(url, params);
    console.log('getFixturesByRound - URL:', url);
    console.log('getFixturesByRound - Params:', params);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<FixtureData>>(url, { params })
    );
  }

  /**
   * Obtiene la última fecha con datos disponibles para una liga (sin caché - siempre fresco)
   */
  getLatestAvailableDate(leagueId: number, season: number = 2022): Observable<{ date: string }> {
    return this.http.get<{ date: string }>(`${this.baseUrl}/fixtures/latest-date`, {
      params: { league: leagueId.toString(), season: season.toString() }
    });
  }

  // ==================== CLASIFICACIÓN ====================

  /**
   * Obtiene la clasificación de una liga (con caché)
   */
  getStandings(leagueId: number, season: number = 2024): Observable<ApiFootballResponse<StandingsData>> {
    const url = `${this.baseUrl}/standings`;
    const params = { league: leagueId.toString(), season: season.toString() };
    const key = this.getCacheKey(url, params);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<StandingsData>>(url, { params })
    );
  }

  // ==================== DETALLE DE PARTIDO ====================

  /**
   * Obtiene un partido por su ID (con caché)
   */
  getFixtureById(fixtureId: number): Observable<ApiFootballResponse<FixtureData>> {
    const url = `${this.baseUrl}/fixture/${fixtureId}`;
    const key = this.getCacheKey(url);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<FixtureData>>(url)
    );
  }

  /**
   * Obtiene los eventos de un partido (con caché)
   */
  getFixtureEvents(fixtureId: number): Observable<ApiFootballResponse<FixtureEvent>> {
    const url = `${this.baseUrl}/fixture/${fixtureId}/events`;
    const key = this.getCacheKey(url);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<FixtureEvent>>(url)
    );
  }

  /**
   * Obtiene las estadísticas de un partido (con caché)
   */
  getFixtureStatistics(fixtureId: number): Observable<ApiFootballResponse<FixtureStatistics>> {
    const url = `${this.baseUrl}/fixture/${fixtureId}/statistics`;
    const key = this.getCacheKey(url);
    return this.getCached(key, () => 
      this.http.get<ApiFootballResponse<FixtureStatistics>>(url)
    );
  }
}
