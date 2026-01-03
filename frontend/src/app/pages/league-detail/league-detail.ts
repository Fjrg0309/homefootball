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
  
  // Información "Acerca de" de la liga
  aboutText = signal<string>(`
    Lorem ipsum dolor sit amet consectetur, 
    adipiscing elit imperdiet nam ultricies, 
    interdum orci enim habitant. 
    Tempus gravida ridiculus facilisis mauris 
    cubilia id porta conubia, ante ultricies 
    cum nisl imperdiet erat euismod fringilla, 
    a nostra tempor semper bibendum 
    accumsan est. Sapien lacinia conubia 
    condimentum fames tempor, dignissim 
    integer mi class ultrices, velit lectus 
    convallis posuere.
  `);

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
