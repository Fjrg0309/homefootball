import { Component, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Tab {
  id: string;
  label: string;
  content: string;
  icon: string;
}

interface AccordionItem {
  id: string;
  title: string;
  content: string;
  expanded: boolean;
}

@Component({
  selector: 'app-interactive-components',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactive-components.html',
  styleUrl: './interactive-components.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        overflow: 'visible',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ])
  ]
})
export class InteractiveComponents implements AfterViewInit {
  // Menú Hamburguesa
  isMenuOpen = false;
  isMobile = false; // Detectar si es dispositivo móvil
  menuItems = [
    { label: 'Inicio', icon: '🏠', link: '#' },
    { label: 'Productos', icon: '📦', link: '#' },
    { label: 'Servicios', icon: '🛠️', link: '#' },
    { label: 'Acerca de', icon: 'ℹ️', link: '#' },
    { label: 'Contacto', icon: '📧', link: '#' }
  ];

  // Modal
  isModalOpen = false;
  modalTitle = 'Título del Modal';
  modalContent = 'Este es el contenido del modal. Puedes cerrarlo haciendo click fuera, en el botón de cerrar, o presionando la tecla ESC.';

  // Tabs
  tabs: Tab[] = [
    { 
      id: 'detalles', 
      label: 'Detalles', 
      icon: '📋',
      content: 'Esta es la pestaña de Detalles. Aquí puedes mostrar información detallada sobre un producto, servicio o cualquier contenido relevante.'
    },
    { 
      id: 'especificaciones', 
      label: 'Especificaciones', 
      icon: '⚙️',
      content: 'Esta es la pestaña de Especificaciones. Incluye aquí las características técnicas, medidas, materiales, o cualquier dato específico.'
    },
    { 
      id: 'opiniones', 
      label: 'Opiniones', 
      icon: '⭐',
      content: 'Esta es la pestaña de Opiniones. Aquí se mostrarían las reseñas y comentarios de usuarios o clientes sobre el producto o servicio.'
    },
    { 
      id: 'configuracion', 
      label: 'Configuración', 
      icon: '🔧',
      content: 'Esta es la pestaña de Configuración. Permite ajustar preferencias, opciones de visualización o cualquier parámetro personalizable.'
    }
  ];
  activeTab = 'detalles';

  // Accordion
  accordionItems: AccordionItem[] = [
    { 
      id: 'item1', 
      title: '¿Qué es Angular?', 
      content: 'Angular es un framework de desarrollo para crear aplicaciones web modernas y escalables. Utiliza TypeScript y proporciona herramientas completas para el desarrollo frontend.',
      expanded: false 
    },
    { 
      id: 'item2', 
      title: '¿Qué son los Standalone Components?', 
      content: 'Los Standalone Components son componentes que no necesitan estar declarados en un NgModule. Simplifican la arquitectura de Angular y facilitan el tree-shaking.',
      expanded: false 
    },
    { 
      id: 'item3', 
      title: '¿Qué es ViewChild?', 
      content: 'ViewChild es un decorador que permite acceder a elementos del DOM o componentes hijos desde el código TypeScript. Es esencial para manipulación directa del DOM.',
      expanded: false 
    },
    { 
      id: 'item4', 
      title: '¿Qué es Renderer2?', 
      content: 'Renderer2 es una API de Angular para manipular el DOM de forma segura y compatible con SSR (Server-Side Rendering). Evita el acceso directo al DOM que puede causar problemas.',
      expanded: false 
    }
  ];
  focusedAccordionIndex: number = -1;

  // Tooltips con delay configurable
  showTooltip1 = false;
  showTooltip2 = false;
  showTooltip3 = false;
  showTooltip4 = false;
  private tooltipDelays: Map<number, any> = new Map();
  tooltipDelay = 300; // ms

  // ViewChild para Tabs (navegación por teclado)
  @ViewChild('tabsContainer') tabsContainer!: ElementRef<HTMLElement>;
  @ViewChild('accordionContainer') accordionContainer!: ElementRef<HTMLElement>;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // Los elementos ViewChild están disponibles aquí
    console.log('Tabs container:', this.tabsContainer);
    console.log('Accordion container:', this.accordionContainer);
    
    // Detectar tamaño inicial
    this.checkScreenSize();
  }

  // ===== RESPONSIVE - DETECCIÓN DE TAMAÑO DE VENTANA =====
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    
    // Si cambiamos a desktop, cerrar menú automáticamente
    if (!this.isMobile && this.isMenuOpen) {
      this.closeMenu();
    }
    
    console.log('Screen size changed. Mobile:', this.isMobile, 'Width:', window.innerWidth);
  }

  // ===== MENÚ HAMBURGUESA =====
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  // Detectar click fuera del menú para cerrarlo
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const menuElement = this.elementRef.nativeElement.querySelector('.hamburger-menu');
    const buttonElement = this.elementRef.nativeElement.querySelector('.hamburger-button');
    
    // Si el menú está abierto y el click no fue en el menú ni en el botón
    if (this.isMenuOpen && menuElement && buttonElement) {
      if (!menuElement.contains(event.target as Node) && 
          !buttonElement.contains(event.target as Node)) {
        this.closeMenu();
      }
    }
  }

  // ===== MODAL =====
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // stopPropagation: Evitar que click en modal cierre el modal
  onModalContentClick(event: MouseEvent) {
    event.stopPropagation();
    console.log('Click dentro del modal - propagación detenida');
  }

  // Click en backdrop cierra el modal
  onModalBackdropClick(event: MouseEvent) {
    // Cerrar modal si se hace click en el backdrop (fondo oscuro)
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  // Cerrar modal con la tecla ESC
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isModalOpen) {
      this.closeModal();
    }
  }

  // ===== TABS =====
  selectTab(tabId: string) {
    this.activeTab = tabId;
  }

  getActiveTabContent(): string {
    const tab = this.tabs.find(t => t.id === this.activeTab);
    return tab ? tab.content : '';
  }

  /**
   * Navegación por teclado en Tabs
   * Arrow Left/Right, Home, End
   */
  onTabKeydown(event: KeyboardEvent, currentIndex: number) {
    let newIndex = currentIndex;

    switch(event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = this.tabs.length - 1;
        break;
      default:
        return;
    }

    this.selectTab(this.tabs[newIndex].id);
    // Enfocar el botón de la nueva tab
    setTimeout(() => {
      const buttons = this.tabsContainer?.nativeElement.querySelectorAll('button');
      if (buttons && buttons[newIndex]) {
        (buttons[newIndex] as HTMLElement).focus();
      }
    }, 0);
  }

  // ===== TOOLTIPS MEJORADOS =====
  /**
   * Mostrar tooltip con delay configurable
   */
  showTooltip(tooltipNumber: number) {
    // Limpiar delay anterior si existe
    this.clearTooltipDelay(tooltipNumber);

    // Configurar nuevo delay
    const delayId = setTimeout(() => {
      switch(tooltipNumber) {
        case 1:
          this.showTooltip1 = true;
          break;
        case 2:
          this.showTooltip2 = true;
          break;
        case 3:
          this.showTooltip3 = true;
          break;
        case 4:
          this.showTooltip4 = true;
          break;
      }
    }, this.tooltipDelay);

    this.tooltipDelays.set(tooltipNumber, delayId);
  }

  /**
   * Ocultar tooltip
   */
  hideTooltip(tooltipNumber: number) {
    this.clearTooltipDelay(tooltipNumber);

    switch(tooltipNumber) {
      case 1:
        this.showTooltip1 = false;
        break;
      case 2:
        this.showTooltip2 = false;
        break;
      case 3:
        this.showTooltip3 = false;
        break;
      case 4:
        this.showTooltip4 = false;
        break;
    }
  }

  /**
   * Limpiar delay de tooltip
   */
  private clearTooltipDelay(tooltipNumber: number) {
    const delayId = this.tooltipDelays.get(tooltipNumber);
    if (delayId) {
      clearTimeout(delayId);
      this.tooltipDelays.delete(tooltipNumber);
    }
  }

  // ===== ACCORDION =====
  /**
   * Toggle accordion item
   */
  toggleAccordion(index: number) {
    this.accordionItems[index].expanded = !this.accordionItems[index].expanded;
  }

  /**
   * Navegación por teclado en Accordion
   * Arrow Up/Down, Home, End, Enter, Space
   */
  onAccordionKeydown(event: KeyboardEvent, currentIndex: number) {
    let newIndex = currentIndex;

    switch(event.key) {
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : this.accordionItems.length - 1;
        break;
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < this.accordionItems.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = this.accordionItems.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleAccordion(currentIndex);
        return;
      default:
        return;
    }

    this.focusedAccordionIndex = newIndex;
    // Enfocar el botón del nuevo item
    setTimeout(() => {
      const buttons = this.accordionContainer?.nativeElement.querySelectorAll('button');
      if (buttons && buttons[newIndex]) {
        (buttons[newIndex] as HTMLElement).focus();
      }
    }, 0);
  }

  /**
   * Expandir todos los items del accordion
   */
  expandAll() {
    this.accordionItems.forEach(item => item.expanded = true);
  }

  /**
   * Colapsar todos los items del accordion
   */
  collapseAll() {
    this.accordionItems.forEach(item => item.expanded = false);
  }
}
