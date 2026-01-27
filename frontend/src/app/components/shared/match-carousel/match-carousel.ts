import { 
  Component, 
  Input, 
  signal, 
  computed, 
  HostListener, 
  ElementRef, 
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface CarouselMatch {
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

@Component({
  selector: 'app-match-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-carousel.html',
  styleUrl: './match-carousel.scss'
})
export class MatchCarousel implements AfterViewInit, OnDestroy {
  @Input() matches: CarouselMatch[] = [];
  @Input() title: string = 'Partidos principales';
  @Input() itemsPerView: number = 3;
  @Input() circular: boolean = true; // Navegación circular por defecto
  
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLElement>;
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLElement>;
  
  // Estado del carrusel
  currentIndex = signal(0);
  isAnimating = signal(false);
  isPaused = signal(false);
  
  // Auto-play interval
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private readonly autoPlayDelay = 5000; // 5 segundos
  
  // Computed values
  get totalSlides(): number {
    return Math.ceil(this.matches.length / this.itemsPerView);
  }
  
  get currentSlide(): number {
    return Math.floor(this.currentIndex() / this.itemsPerView);
  }
  
  maxIndex = computed(() => Math.max(0, this.matches.length - this.itemsPerView));
  
  // En modo circular, siempre se puede navegar si hay más de itemsPerView partidos
  canGoPrevious = computed(() => this.circular ? this.matches.length > this.itemsPerView : this.currentIndex() > 0);
  canGoNext = computed(() => this.circular ? this.matches.length > this.itemsPerView : this.currentIndex() < this.maxIndex());

  constructor(private router: Router) {}

  /**
   * Listener para navegación con teclado
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previous();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
    }
  }

  ngAfterViewInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  /**
   * Inicia el auto-play del carrusel
   */
  startAutoPlay(): void {
    if (this.autoPlayInterval) return;
    
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused()) {
        if (this.canGoNext()) {
          this.next();
        } else {
          // Volver al principio
          this.goToSlide(0);
        }
      }
    }, this.autoPlayDelay);
  }

  /**
   * Detiene el auto-play del carrusel
   */
  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  /**
   * Pausa/reanuda el auto-play cuando el usuario interactúa
   */
  pauseAutoPlay(): void {
    this.isPaused.set(true);
  }

  resumeAutoPlay(): void {
    this.isPaused.set(false);
  }

  /**
   * Ir al slide anterior (con soporte circular)
   */
  previous(): void {
    if (!this.canGoPrevious() || this.isAnimating()) return;
    
    this.isAnimating.set(true);
    
    if (this.circular && this.currentIndex() === 0) {
      // Si estamos en el primer elemento y es circular, ir al último
      this.currentIndex.set(this.maxIndex());
    } else {
      this.currentIndex.update(i => i - 1);
    }
    
    setTimeout(() => this.isAnimating.set(false), 300);
    
    // Anunciar para lectores de pantalla
    this.announceSlideChange();
  }

  /**
   * Ir al siguiente slide (con soporte circular)
   */
  next(): void {
    if (!this.canGoNext() || this.isAnimating()) return;
    
    this.isAnimating.set(true);
    
    if (this.circular && this.currentIndex() >= this.maxIndex()) {
      // Si estamos en el último elemento y es circular, volver al primero
      this.currentIndex.set(0);
    } else {
      this.currentIndex.update(i => i + 1);
    }
    
    setTimeout(() => this.isAnimating.set(false), 300);
    
    // Anunciar para lectores de pantalla
    this.announceSlideChange();
  }

  /**
   * Ir a un slide específico (funciona tanto para navegación como indicadores)
   */
  goToSlide(index: number): void {
    // Si es navegación directa de indicadores (por slides)
    if (index < this.totalSlides) {
      const newIndex = index * this.itemsPerView;
      if (newIndex !== this.currentIndex() && !this.isAnimating()) {
        this.isAnimating.set(true);
        this.currentIndex.set(newIndex);
        
        setTimeout(() => this.isAnimating.set(false), 300);
        this.announceSlideChange();
        this.startAutoPlay(); // Reiniciar autoplay
      }
      return;
    }
    
    // Si es navegación por índice de partidos
    if (index < 0 || index > this.maxIndex() || this.isAnimating()) return;
    
    this.isAnimating.set(true);
    this.currentIndex.set(index);
    
    setTimeout(() => this.isAnimating.set(false), 300);
    this.announceSlideChange();
  }

  /**
   * Calcula el desplazamiento del carrusel
   */
  getTranslateX(): string {
    const slideWidth = 100 / this.itemsPerView;
    return `translateX(-${this.currentIndex() * slideWidth}%)`;
  }

  /**
   * Manejo de navegación con teclado
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previous();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case 'Home':
        event.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        this.goToSlide(this.maxIndex());
        break;
    }
  }

  /**
   * Anuncia el cambio de slide para lectores de pantalla
   */
  private announceSlideChange(): void {
    const current = this.currentSlide + 1;
    const total = this.totalSlides;
    const announcement = `Mostrando grupo ${current} de ${total}`;
    
    // Crear elemento para anuncio ARIA
    const liveRegion = document.getElementById('carousel-live-region');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }

  /**
   * Navegar al detalle del partido
   */
  goToMatch(matchId: number): void {
    this.router.navigate(['/partido', matchId]);
  }

  /**
   * Obtener estado del partido para mostrar
   */
  getMatchStatus(match: CarouselMatch): string {
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

  /**
   * Formatea la fecha del partido
   */
  private formatMatchDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtener el marcador para mostrar
   */
  getScoreDisplay(match: CarouselMatch): string {
    if (match.homeScore === null || match.awayScore === null) {
      return 'vs';
    }
    return `${match.homeScore} - ${match.awayScore}`;
  }

  /**
   * Verificar si el partido está en vivo
   */
  isLive(match: CarouselMatch): boolean {
    return ['1H', '2H', 'HT', 'ET', 'P'].includes(match.status);
  }

  /**
   * Obtener array de indicadores para el template
   */
  getIndicators(): number[] {
    return Array(this.totalSlides).fill(0).map((_, i) => i);
  }

}
