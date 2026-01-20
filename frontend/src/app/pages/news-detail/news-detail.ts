import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';

interface NewsArticle {
  id: number;
  title: string;
  content: string[];
  image: string;
  date: string;
  category: string;
  author: string;
  teamId?: number;
  leagueId?: number;
}

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss'
})
export class NewsDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Estado
  news = signal<NewsArticle | null>(null);
  
  // Estados de carga
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadNewsDetail(parseInt(id, 10));
      }
    });
  }

  /**
   * Cargar detalle de la noticia
   */
  loadNewsDetail(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    // Noticias simuladas con contenido completo
    const mockNewsDetails: Record<number, NewsArticle> = {
      1: {
        id: 1,
        title: 'Real Madrid prepara una revolución en el mercado invernal',
        content: [
          'El Real Madrid está preparando una revolución en el mercado de invierno según informan diversas fuentes cercanas al club. La entidad blanca busca reforzar varias posiciones clave para afrontar la segunda parte de la temporada con garantías.',
          'Entre los objetivos principales se encuentra un centrocampista de corte defensivo que pueda dar descanso a los habituales y aportar solidez en partidos de alta exigencia. El club ha estado siguiendo varios perfiles del mercado europeo.',
          'Además, la dirección deportiva está evaluando la posibilidad de incorporar un extremo que aporte velocidad y desborde por las bandas, una característica que el cuerpo técnico considera fundamental para el esquema de juego actual.',
          'Las negociaciones se encuentran en fase avanzada con varios jugadores, aunque desde el club prefieren mantener la discreción hasta que los acuerdos estén completamente cerrados. Se espera que en las próximas semanas se anuncien las primeras incorporaciones.'
        ],
        image: 'https://media.api-sports.io/football/teams/541.png',
        date: '2024-01-15',
        category: 'Fichajes',
        author: 'Redacción HomeFootball',
        teamId: 541
      },
      2: {
        id: 2,
        title: 'Barcelona cierra la renovación de su joven estrella',
        content: [
          'El FC Barcelona ha llegado a un acuerdo para la renovación de contrato de una de sus mayores promesas del fútbol base. El jugador, que ha destacado en las categorías inferiores y ya ha debutado con el primer equipo, firmará un nuevo contrato a largo plazo.',
          'La renovación incluye una cláusula de rescisión acorde a la confianza que el club deposita en el jugador, quien ha sido descrito por los técnicos como "el futuro del Barcelona". Su progresión en los últimos meses ha sido notable.',
          'El presidente del club ha expresado su satisfacción por el acuerdo: "Es fundamental asegurar el talento de La Masía. Este jugador representa los valores del club y tiene un futuro brillante por delante".',
          'Se espera que la presentación oficial del nuevo contrato tenga lugar en los próximos días en las instalaciones del club, donde el jugador estará acompañado por su familia y representantes.'
        ],
        image: 'https://media.api-sports.io/football/teams/529.png',
        date: '2024-01-14',
        category: 'Fichajes',
        author: 'Redacción HomeFootball',
        teamId: 529
      },
      3: {
        id: 3,
        title: 'Premier League: La carrera por el título se intensifica',
        content: [
          'La Premier League vive una de sus temporadas más emocionantes en años recientes. Con tres equipos separados por apenas dos puntos en las primeras posiciones de la tabla, la lucha por el título promete mantenerse hasta las últimas jornadas.',
          'El actual líder ha mostrado una solidez defensiva impresionante, mientras que sus perseguidores compensan con un poder ofensivo demoledor. Los analistas coinciden en que cualquier error puede resultar decisivo.',
          'Los próximos encuentros directos entre los aspirantes serán claves para definir el rumbo del campeonato. El calendario presenta varios duelos directos en las próximas semanas que podrían decantar la balanza.',
          'Los aficionados de todo el mundo están pendientes de lo que promete ser un final de temporada histórico en la liga más competitiva del mundo.'
        ],
        image: 'https://media.api-sports.io/football/leagues/39.png',
        date: '2024-01-13',
        category: 'Liga',
        author: 'Análisis HomeFootball',
        leagueId: 39
      },
      4: {
        id: 4,
        title: 'Manchester City sufre nueva baja por lesión',
        content: [
          'El Manchester City ha recibido un nuevo golpe con la lesión de uno de sus jugadores clave. El parte médico confirma que estará ausente durante varias semanas, complicando la planificación de Pep Guardiola.',
          'Esta baja se suma a la lista de lesionados que el equipo ha acumulado en los últimos meses. El cuerpo técnico deberá buscar alternativas en la plantilla para cubrir esta ausencia.',
          'Guardiola ha comentado en rueda de prensa: "Es una situación difícil, pero tenemos jugadores capaces de dar un paso adelante. Confío plenamente en el equipo".',
          'Se espera que el jugador comience su proceso de recuperación de inmediato con el objetivo de volver lo antes posible a los terrenos de juego.'
        ],
        image: 'https://media.api-sports.io/football/teams/50.png',
        date: '2024-01-12',
        category: 'Lesiones',
        author: 'Redacción HomeFootball',
        teamId: 50
      },
      5: {
        id: 5,
        title: 'Champions League: Sorteo de octavos de final',
        content: [
          'La UEFA ha celebrado el sorteo de los octavos de final de la Champions League, definiendo los emparejamientos que determinarán qué equipos continuarán en la máxima competición europea de clubes.',
          'Entre los cruces más destacados se encuentran varios duelos de alto voltaje entre clubes históricos. Los aficionados ya anticipan partidos espectaculares en febrero y marzo.',
          'Los clubes españoles han quedado emparejados con rivales de gran nivel, lo que garantiza eliminatorias competidas. La representación europea promete ofrecer fútbol de primer nivel.',
          'Las fechas de los partidos ya han sido confirmadas, con las primeras eliminatorias programadas para mediados de febrero. Los equipos comenzarán a preparar sus estrategias para estos encuentros cruciales.'
        ],
        image: 'https://media.api-sports.io/football/leagues/2.png',
        date: '2024-01-11',
        category: 'Champions',
        author: 'Redacción HomeFootball',
        leagueId: 2
      },
      6: {
        id: 6,
        title: 'Bayern Munich anuncia nuevo fichaje estrella',
        content: [
          'El Bayern Munich ha anunciado oficialmente la incorporación de un jugador de nivel mundial a su plantilla. El fichaje representa una de las operaciones más importantes del mercado invernal.',
          'El nuevo refuerzo ha firmado un contrato de larga duración y vestirá el dorsal que dejó vacante una de las leyendas del club. La presentación oficial se realizará en los próximos días.',
          'El director deportivo ha declarado: "Estamos muy contentos con esta incorporación. Es un jugador que nos aportará calidad y experiencia en momentos decisivos".',
          'Los aficionados del Bayern han recibido la noticia con entusiasmo, expresando su apoyo en redes sociales y esperando con ansias la primera aparición del jugador con la camiseta del club.'
        ],
        image: 'https://media.api-sports.io/football/teams/157.png',
        date: '2024-01-10',
        category: 'Fichajes',
        author: 'Redacción HomeFootball',
        teamId: 157
      },
      7: {
        id: 7,
        title: 'PSG busca competir en todas las competiciones',
        content: [
          'El Paris Saint-Germain mantiene sus aspiraciones en todas las competiciones que disputa esta temporada. El club parisino busca lograr un triplete que incluya la Liga, la Copa y la ansiada Champions League.',
          'El entrenador ha realizado una gestión inteligente de la plantilla, rotando jugadores para mantener a todos en óptimas condiciones. La profundidad del equipo está siendo clave.',
          'Con la fase decisiva de la temporada aproximándose, el PSG se encuentra en una posición privilegiada. Lidera su liga doméstica y está bien posicionado en Europa.',
          'La afición parisina sueña con una temporada histórica que culmine con títulos en las tres competiciones. El ambiente en el Parque de los Príncipes es de máxima ilusión.'
        ],
        image: 'https://media.api-sports.io/football/teams/85.png',
        date: '2024-01-09',
        category: 'General',
        author: 'Análisis HomeFootball',
        teamId: 85
      },
      8: {
        id: 8,
        title: 'El derbi de Manchester promete emociones fuertes',
        content: [
          'El derbi de Manchester se acerca y ambos equipos llegan en un momento crucial de la temporada. United y City se preparan para un clásico que podría definir aspiraciones de ambos clubes.',
          'El historial reciente favorece al City, pero el United ha mostrado una mejoría notable en los últimos encuentros. El factor Old Trafford podría ser determinante.',
          'Ambos técnicos han confirmado que contarán con sus mejores efectivos disponibles. Las alineaciones prometen estrellas en cada posición del campo.',
          'La ciudad de Manchester vivirá una jornada de máxima tensión deportiva. Los aficionados de ambos equipos preparan un ambiente espectacular para recibir a los jugadores.'
        ],
        image: 'https://media.api-sports.io/football/teams/33.png',
        date: '2024-01-08',
        category: 'Partidos',
        author: 'Redacción HomeFootball',
        teamId: 33
      }
    };

    setTimeout(() => {
      const newsDetail = mockNewsDetails[id];
      if (newsDetail) {
        this.news.set(newsDetail);
      } else {
        this.error.set('Noticia no encontrada');
      }
      this.loading.set(false);
    }, 300);
  }

  /**
   * Formatear fecha
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  /**
   * Volver
   */
  goBack(): void {
    this.router.navigate(['/noticias']);
  }
}
