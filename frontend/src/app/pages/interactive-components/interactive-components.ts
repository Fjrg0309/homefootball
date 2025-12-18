import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tab {
  id: string;
  label: string;
  content: string;
  icon: string;
}

@Component({
  selector: 'app-interactive-components',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactive-components.html',
  styleUrl: './interactive-components.scss'
})
export class InteractiveComponents {
  // Menú Hamburguesa
  isMenuOpen = false;
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

  // Tooltips
  showTooltip1 = false;
  showTooltip2 = false;
  showTooltip3 = false;
  showTooltip4 = false;

  constructor(private elementRef: ElementRef) {}

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

  // ===== TOOLTIPS =====
  showTooltip(tooltipNumber: number) {
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
  }

  hideTooltip(tooltipNumber: number) {
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
}
