import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';

interface League {
  id: string;
  name: string;
  country: string;
  logo?: string;
}

// Descripciones de las principales ligas
const LEAGUE_DESCRIPTIONS: Record<string, string> = {
  'laliga': 'LaLiga es la máxima competición de fútbol en España y una de las ligas más prestigiosas del mundo. Fundada en 1929, cuenta con 20 equipos que compiten cada temporada. Ha sido el hogar de leyendas como Messi, Cristiano Ronaldo, Di Stéfano y Cruyff. Los clubes más laureados son Real Madrid y FC Barcelona, protagonistas del clásico más famoso del fútbol mundial.',
  'premier-league': 'La Premier League es la máxima categoría del fútbol inglés y la liga más vista del mundo. Fundada en 1992, es conocida por su intensidad, competitividad y ritmo de juego. Equipos históricos como Manchester United, Liverpool, Arsenal y Chelsea han forjado su leyenda aquí. Actualmente es considerada una de las ligas más competitivas y atractivas del planeta.',
  'serie-a': 'La Serie A es la máxima división del fútbol italiano, conocida por su tradición táctica y defensiva. Fundada en 1898, es una de las ligas más antiguas del mundo. Juventus, AC Milan e Inter de Milán son los clubes más exitosos. Italia ha producido algunos de los mejores defensores y porteros de la historia del fútbol.',
  'bundesliga': 'La Bundesliga es la primera división del fútbol alemán, famosa por sus estadios llenos y su modelo de propiedad que prioriza a los aficionados. Fundada en 1963, destaca por su organización, infraestructura y cantera de jóvenes talentos. El Bayern de Múnich domina la competición, mientras que el Borussia Dortmund es reconocido por su apasionada afición.',
  'ligue-1': 'La Ligue 1 es la máxima categoría del fútbol francés. Fundada en 1932, ha ganado relevancia internacional en los últimos años gracias a la llegada de grandes estrellas al Paris Saint-Germain. Históricamente, clubes como Olympique de Marsella, AS Monaco y Olympique de Lyon han sido protagonistas. Francia es conocida por producir talento joven de clase mundial.',
  'primeira-liga': 'La Primeira Liga es la máxima división del fútbol portugués. Dominada históricamente por los "tres grandes" (Benfica, Porto y Sporting CP), es reconocida mundialmente como una excelente cantera de talentos. Jugadores como Cristiano Ronaldo, Eusébio y Luis Figo comenzaron sus carreras aquí antes de brillar en las mejores ligas del mundo.',
  'eredivisie': 'La Eredivisie es la primera división del fútbol neerlandés, famosa por su filosofía de fútbol ofensivo y atractivo. Ajax de Ámsterdam, PSV Eindhoven y Feyenoord son los clubes más importantes. Holanda ha sido pionera en el "fútbol total" y ha producido leyendas como Cruyff, Van Basten, Bergkamp y actualmente sigue exportando grandes talentos.',
  'super-lig': 'La Süper Lig es la máxima categoría del fútbol turco, conocida por la pasión de sus aficionados. Galatasaray, Fenerbahçe y Beşiktaş, los tres grandes de Estambul, dominan la competición. En los últimos años ha atraído a estrellas internacionales veteranas buscando nuevos desafíos.',
  'mls': 'La Major League Soccer (MLS) es la máxima liga de fútbol en Estados Unidos y Canadá. Fundada en 1996, ha experimentado un crecimiento exponencial, atrayendo tanto a estrellas veteranas como a jóvenes promesas. Equipos como LA Galaxy, Inter Miami y Atlanta United lideran la expansión del fútbol en Norteamérica.',
  'liga-mx': 'La Liga MX es la primera división del fútbol mexicano y una de las más competitivas de América. Clubes históricos como Club América, Chivas de Guadalajara, Cruz Azul y Pumas UNAM protagonizan intensas rivalidades. Es conocida por su formato de liguilla y por ser el destino de muchos jugadores sudamericanos.',
  'championship': 'El Championship es la segunda división del fútbol inglés y es considerada una de las ligas más competitivas del mundo por nivel. Con 24 equipos luchando por el ascenso a la Premier League, cada temporada ofrece drama e intensidad. Muchos clubes históricos como Leeds United y Nottingham Forest han pasado por esta categoría.',
  'ligue-2': 'La Ligue 2 es la segunda división del fútbol francés. Sirve como escalón hacia la Ligue 1 y es conocida por su competitividad. Muchos clubes históricos franceses han pasado por esta categoría en su camino de vuelta a la élite.'
};

@Component({
  selector: 'app-league-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './league-detail.html',
  styleUrl: './league-detail.scss'
})
export class LeagueDetail implements OnInit {
  
  // Signal para la liga actual
  league = signal<League | null>(null);
  
  // Signal para estado de favorito
  isFavorite = signal<boolean>(false);
  
  // Computed para el nombre de la liga
  leagueName = computed(() => this.league()?.name || 'Liga seleccionada');
  
  // Información "Acerca de" de la liga - ahora dinámico
  aboutText = signal<string>('');

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener el ID de la liga desde la URL
    this.route.paramMap.subscribe(params => {
      const leagueId = params.get('id');
      if (leagueId) {
        this.loadLeague(leagueId);
      }
    });
  }

  private loadLeague(id: string): void {
    // Simular carga de datos de la liga
    const leagues: Record<string, League> = {
      'laliga': { id: 'laliga', name: 'LaLiga', country: 'España' },
      'premier-league': { id: 'premier-league', name: 'Premier League', country: 'Inglaterra' },
      'serie-a': { id: 'serie-a', name: 'Serie A', country: 'Italia' },
      'bundesliga': { id: 'bundesliga', name: 'Bundesliga', country: 'Alemania' },
      'ligue-1': { id: 'ligue-1', name: 'Ligue 1', country: 'Francia' },
      'ligue-2': { id: 'ligue-2', name: 'Ligue 2', country: 'Francia' },
      'primeira-liga': { id: 'primeira-liga', name: 'Primeira Liga', country: 'Portugal' },
      'eredivisie': { id: 'eredivisie', name: 'Eredivisie', country: 'Países Bajos' },
      'super-lig': { id: 'super-lig', name: 'Süper Lig', country: 'Turquía' },
      'mls': { id: 'mls', name: 'MLS', country: 'Estados Unidos' },
      'liga-mx': { id: 'liga-mx', name: 'Liga MX', country: 'México' },
      'championship': { id: 'championship', name: 'Championship', country: 'Inglaterra' }
    };

    this.league.set(leagues[id] || { id, name: id, country: 'Desconocido' });
    
    // Cargar descripción de la liga
    const description = LEAGUE_DESCRIPTIONS[id] || 
      `Información sobre ${leagues[id]?.name || id}. Esta es una de las competiciones de fútbol más importantes de ${leagues[id]?.country || 'su país'}.`;
    this.aboutText.set(description);
    
    // Verificar si la liga está en favoritos
    this.checkFavoriteStatus(id);
  }

  /**
   * Verificar si la liga actual está en favoritos
   */
  private checkFavoriteStatus(leagueId: string): void {
    const favorites = this.getFavorites();
    this.isFavorite.set(favorites.includes(leagueId));
  }

  /**
   * Obtener lista de favoritos desde localStorage
   */
  private getFavorites(): string[] {
    try {
      const favoritesJson = localStorage.getItem('favorite-leagues');
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error al leer favoritos:', error);
      return [];
    }
  }

  /**
   * Guardar lista de favoritos en localStorage
   */
  private saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem('favorite-leagues', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  }

  /**
   * Toggle favorito - añadir o quitar liga de favoritos
   */
  toggleFavorite(): void {
    const league = this.league();
    if (!league) return;

    const favorites = this.getFavorites();
    const index = favorites.indexOf(league.id);

    if (index > -1) {
      // Quitar de favoritos
      favorites.splice(index, 1);
      this.isFavorite.set(false);
      console.log(`${league.name} quitada de favoritos`);
    } else {
      // Añadir a favoritos
      favorites.push(league.id);
      this.isFavorite.set(true);
      console.log(`${league.name} añadida a favoritos`);
    }

    this.saveFavorites(favorites);
  }

  // Navegación a secciones
  navigateTo(section: string): void {
    console.log(`Navegando a: ${section} de ${this.leagueName()}`);
    // Aquí se implementaría la navegación real
  }
}
