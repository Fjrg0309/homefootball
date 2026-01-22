import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

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
  'brasileirao': 'El Campeonato Brasileiro Série A, conocido como Brasileirão, es la liga de fútbol más importante de Brasil y una de las más competitivas del mundo. Clubes legendarios como Flamengo, Palmeiras, São Paulo, Corinthians y Santos luchan por el título cada temporada. Es conocida por su alto nivel técnico y por ser la cuna de grandes estrellas del fútbol mundial.',
  'championship': 'El Championship es la segunda división del fútbol inglés y es considerada una de las ligas más competitivas del mundo por nivel. Con 24 equipos luchando por el ascenso a la Premier League, cada temporada ofrece drama e intensidad. Muchos clubes históricos como Leeds United y Nottingham Forest han pasado por esta categoría.',
  'ligue-2': 'La Ligue 2 es la segunda división del fútbol francés. Sirve como escalón hacia la Ligue 1 y es conocida por su competitividad. Muchos clubes históricos franceses han pasado por esta categoría en su camino de vuelta a la élite.',
  // Ligas europeas adicionales
  'scottish-premiership': 'La Scottish Premiership es la máxima categoría del fútbol escocés. Dominada históricamente por Celtic y Rangers, conocidos como el "Old Firm", es una de las rivalidades más intensas del fútbol mundial. Equipos como Aberdeen y Hibernian también han dejado huella en la historia del fútbol escocés.',
  'belgian-pro-league': 'La Belgian Pro League (Jupiler Pro League) es la primera división del fútbol belga. Club Brugge, Anderlecht y Genk son los equipos más exitosos. Bélgica se ha convertido en una potencia futbolística gracias a su generación dorada con jugadores como De Bruyne, Hazard y Lukaku.',
  'austrian-bundesliga': 'La Bundesliga austriaca es la máxima competición de Austria. Red Bull Salzburg ha dominado en los últimos años, convirtiéndose en un trampolín para jóvenes talentos hacia las grandes ligas europeas. Jugadores como Haaland y Mané pasaron por Salzburg antes de triunfar en Europa.',
  'swiss-super-league': 'La Swiss Super League es la primera división del fútbol suizo. Equipos como Basel, Young Boys y Zürich son los más laureados. La liga es conocida por su organización y por ser el punto de partida de muchos talentos que luego brillan en las principales ligas europeas.',
  'russian-premier-league': 'La Premier League rusa es la máxima categoría del fútbol en Rusia. Zenit San Petersburgo, Spartak Moscú y CSKA Moscú son los clubes más importantes. A pesar de su clima extremo, la liga ha atraído a jugadores internacionales de renombre.',
  'ukrainian-premier-league': 'La Premier League ucraniana fue una de las ligas emergentes más interesantes de Europa del Este. Shakhtar Donetsk y Dynamo Kiev han sido los equipos dominantes, produciendo talentos que han brillado en las mejores ligas del continente.',
  'greek-super-league': 'La Super League griega es la primera división del fútbol griego. Olympiacos, Panathinaikos y AEK Atenas son los clubes más importantes, con rivalidades que datan de más de un siglo. El fútbol griego es conocido por su pasión y atmósfera en los estadios.',
  'danish-superliga': 'La Superliga danesa es la máxima competición de Dinamarca. FC Copenhagen y FC Midtjylland son los equipos más exitosos actualmente. Dinamarca ha producido talentos de clase mundial como Michael Laudrup, Peter Schmeichel y Christian Eriksen.',
  'swedish-allsvenskan': 'La Allsvenskan es la primera división del fútbol sueco. Malmö FF, AIK y Djurgårdens IF son clubes históricos. Suecia ha sido cuna de grandes jugadores como Zlatan Ibrahimović, Henrik Larsson y actualmente Alexander Isak.',
  'norwegian-eliteserien': 'La Eliteserien es la máxima liga noruega. Rosenborg BK dominó durante décadas, aunque recientemente equipos como Bodø/Glimt y Molde han emergido. Noruega produce talentos jóvenes que rápidamente saltan a las grandes ligas, como Erling Haaland y Martin Ødegaard.',
  'czech-first-league': 'La Primera Liga checa es la máxima competición de la República Checa. Sparta Praha, Slavia Praha y Viktoria Plzeň son los clubes más importantes. Praga es una ciudad con una rica tradición futbolística y rivalidades históricas.',
  'polish-ekstraklasa': 'La Ekstraklasa es la primera división del fútbol polaco. Legia Varsovia, Lech Poznań y Wisła Kraków son los equipos más laureados. Polonia ha producido grandes talentos como Robert Lewandowski, Zbigniew Boniek y Grzegorz Lato.',
  'croatian-prva-hnl': 'La Prva HNL es la máxima liga croata. Dinamo Zagreb domina la competición, sirviendo como cantera de talentos que luego triunfan en Europa. Croacia, a pesar de su pequeño tamaño, ha producido jugadores de clase mundial como Modrić, Rakitić y Mandžukić.',
  'serbian-superliga': 'La SuperLiga serbia es la primera división de Serbia. Estrella Roja y Partizan de Belgrado protagonizan uno de los derbis más intensos del mundo, conocido como el "Derbi Eterno". Serbia tiene una gran tradición futbolística en los Balcanes.',
  'romanian-liga-1': 'La Liga 1 rumana es la máxima categoría del fútbol rumano. FCSB (anteriormente Steaua Bucarest), Dinamo București y CFR Cluj son los clubes más importantes. Rumania vivió su época dorada en los años 90 con la generación de Hagi.',
  'champions-league': 'La UEFA Champions League es la máxima competición de clubes en Europa y el torneo de clubes más prestigioso del mundo. Fundada en 1955 como Copa de Europa, reúne a los mejores equipos del continente. Real Madrid es el club más laureado con 15 títulos, seguido de AC Milan con 7.',
  'europa-league': 'La UEFA Europa League es la segunda competición de clubes más importante de Europa. Ofrece una vía alternativa a equipos que no clasifican a la Champions League. Sevilla FC es el máximo ganador con 7 títulos, siendo conocido como el "Rey de la Europa League".',
  'conference-league': 'La UEFA Conference League es la tercera competición de clubes de la UEFA, creada en 2021. Ofrece a equipos de ligas menores la oportunidad de competir a nivel europeo. Es una competición inclusiva que ha dado grandes momentos a clubes modestos.'
};

// Mapeo de IDs de API a IDs de URL
const LEAGUE_API_IDS: Record<string, number> = {
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
  'brasileirao': 71,
  'championship': 40,
  'scottish-premiership': 179,
  'belgian-pro-league': 144,
  'austrian-bundesliga': 218,
  'swiss-super-league': 207,
  'russian-premier-league': 235,
  'ukrainian-premier-league': 333,
  'greek-super-league': 197,
  'danish-superliga': 119,
  'swedish-allsvenskan': 113,
  'norwegian-eliteserien': 103,
  'czech-first-league': 345,
  'polish-ekstraklasa': 106,
  'croatian-prva-hnl': 210,
  'serbian-superliga': 286,
  'romanian-liga-1': 283,
  'champions-league': 2,
  'europa-league': 3,
  'conference-league': 848
};

@Component({
  selector: 'app-league-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './league-detail.html',
  styleUrl: './league-detail.scss'
})
export class LeagueDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private favoritoService = inject(FavoritoService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  // Signal para la liga actual
  league = signal<League | null>(null);
  
  // Signal para estado de favorito
  isFavorite = signal<boolean>(false);
  
  // Computed para el nombre de la liga
  leagueName = computed(() => this.league()?.name || 'Liga seleccionada');
  
  // Información "Acerca de" de la liga - ahora dinámico
  aboutText = signal<string>('');

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
      'brasileirao': { id: 'brasileirao', name: 'Brasileirão', country: 'Brasil' },
      'championship': { id: 'championship', name: 'Championship', country: 'Inglaterra' },
      // Ligas europeas adicionales
      'scottish-premiership': { id: 'scottish-premiership', name: 'Scottish Premiership', country: 'Escocia' },
      'belgian-pro-league': { id: 'belgian-pro-league', name: 'Belgian Pro League', country: 'Bélgica' },
      'austrian-bundesliga': { id: 'austrian-bundesliga', name: 'Austrian Bundesliga', country: 'Austria' },
      'swiss-super-league': { id: 'swiss-super-league', name: 'Swiss Super League', country: 'Suiza' },
      'russian-premier-league': { id: 'russian-premier-league', name: 'Russian Premier League', country: 'Rusia' },
      'ukrainian-premier-league': { id: 'ukrainian-premier-league', name: 'Ukrainian Premier League', country: 'Ucrania' },
      'greek-super-league': { id: 'greek-super-league', name: 'Super League Greece', country: 'Grecia' },
      'danish-superliga': { id: 'danish-superliga', name: 'Danish Superliga', country: 'Dinamarca' },
      'swedish-allsvenskan': { id: 'swedish-allsvenskan', name: 'Allsvenskan', country: 'Suecia' },
      'norwegian-eliteserien': { id: 'norwegian-eliteserien', name: 'Eliteserien', country: 'Noruega' },
      'czech-first-league': { id: 'czech-first-league', name: 'Czech First League', country: 'República Checa' },
      'polish-ekstraklasa': { id: 'polish-ekstraklasa', name: 'Ekstraklasa', country: 'Polonia' },
      'croatian-prva-hnl': { id: 'croatian-prva-hnl', name: 'Prva HNL', country: 'Croacia' },
      'serbian-superliga': { id: 'serbian-superliga', name: 'Serbian SuperLiga', country: 'Serbia' },
      'romanian-liga-1': { id: 'romanian-liga-1', name: 'Liga 1', country: 'Rumanía' },
      // Competiciones europeas
      'champions-league': { id: 'champions-league', name: 'UEFA Champions League', country: 'Europa' },
      'europa-league': { id: 'europa-league', name: 'UEFA Europa League', country: 'Europa' },
      'conference-league': { id: 'conference-league', name: 'UEFA Conference League', country: 'Europa' }
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
    if (!this.authService.isLoggedIn()) {
      this.isFavorite.set(false);
      return;
    }

    const apiId = LEAGUE_API_IDS[leagueId];
    if (!apiId) {
      this.isFavorite.set(false);
      return;
    }

    this.favoritoService.isFavorito('LIGA', apiId).subscribe({
      next: (isFav) => {
        console.log('League favorite status:', isFav);
        this.isFavorite.set(isFav);
      },
      error: (err) => {
        console.error('Error checking favorite:', err);
        this.isFavorite.set(false);
      }
    });
  }

  /**
   * Toggle favorito - añadir o quitar liga de favoritos
   */
  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.error('Inicia sesión para guardar favoritos');
      return;
    }

    const league = this.league();
    if (!league) return;

    const apiId = LEAGUE_API_IDS[league.id];
    if (!apiId) {
      this.toastService.error('Error: Liga no válida');
      return;
    }

    const request = {
      tipo: 'LIGA',
      itemId: apiId,
      nombre: league.name,
      imagen: `/assets/images/leagues/${league.id}.png`
    };

    this.favoritoService.toggleFavorito(request).subscribe({
      next: (response) => {
        console.log('Toggle response:', response);
        const nowIsFavorite = response.isFavorito;
        this.isFavorite.set(nowIsFavorite);
        
        if (nowIsFavorite) {
          this.toastService.success(`${league.name} añadida a favoritos`);
        } else {
          this.toastService.info(`${league.name} eliminada de favoritos`);
        }
      },
      error: (err) => {
        console.error('Error toggle favorito:', err);
        this.toastService.error('Error al actualizar favoritos');
      }
    });
  }

  // Navegación a secciones
  navigateTo(section: string): void {
    console.log(`Navegando a: ${section} de ${this.leagueName()}`);
    // Aquí se implementaría la navegación real
  }
}
