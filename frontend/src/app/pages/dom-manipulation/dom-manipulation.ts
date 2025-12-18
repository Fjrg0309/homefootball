import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dom-manipulation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dom-manipulation.html',
  styleUrl: './dom-manipulation.scss'
})
export class DomManipulation implements AfterViewInit {
  // Referencias a elementos del DOM
  @ViewChild('miDiv', { static: false }) miDiv!: ElementRef;
  @ViewChild('contenedor', { static: false }) contenedor!: ElementRef;
  
  // Para mostrar información en consola en la UI
  mensajeConsola: string = '';

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.mensajeConsola = 'Componente inicializado. Elemento miDiv accesible.';
  }

  // Sección 2: Modificar propiedades y estilos dinámicamente
  cambiarEstilo() {
    // Cambiar estilos con Renderer2
    this.renderer.setStyle(this.miDiv.nativeElement, 'color', 'red');
    this.renderer.setStyle(this.miDiv.nativeElement, 'fontSize', '24px');
    this.renderer.setStyle(this.miDiv.nativeElement, 'fontWeight', 'bold');
    this.renderer.setStyle(this.miDiv.nativeElement, 'transition', 'all 0.3s ease');
    this.mensajeConsola = 'Estilos cambiados: color rojo, tamaño 24px, negrita';
  }

  cambiarPropiedad() {
    // Cambiar propiedades con Renderer2
    this.renderer.setProperty(this.miDiv.nativeElement, 'innerText', '¡Texto modificado dinámicamente!');
    this.mensajeConsola = 'Propiedad innerText modificada';
  }

  agregarClase() {
    // Agregar clase CSS
    this.renderer.addClass(this.miDiv.nativeElement, 'destacado');
    this.mensajeConsola = 'Clase "destacado" agregada';
  }

  quitarClase() {
    // Quitar clase CSS
    this.renderer.removeClass(this.miDiv.nativeElement, 'destacado');
    this.mensajeConsola = 'Clase "destacado" removida';
  }

  resetearEstilos() {
    // Resetear estilos
    this.renderer.removeStyle(this.miDiv.nativeElement, 'color');
    this.renderer.removeStyle(this.miDiv.nativeElement, 'fontSize');
    this.renderer.removeStyle(this.miDiv.nativeElement, 'fontWeight');
    this.renderer.setProperty(this.miDiv.nativeElement, 'innerText', 'Contenido inicial');
    this.renderer.removeClass(this.miDiv.nativeElement, 'destacado');
    this.mensajeConsola = 'Estilos y texto reseteados';
  }

  // Sección 3: Crear y eliminar elementos del DOM programáticamente
  crearElemento() {
    // Crear nuevo elemento div
    const nuevoDiv = this.renderer.createElement('div');
    
    // Configurar contenido y estilos
    this.renderer.setProperty(nuevoDiv, 'innerText', `Elemento #${this.contenedor.nativeElement.children.length + 1} creado dinámicamente`);
    this.renderer.setStyle(nuevoDiv, 'backgroundColor', '#4CAF50');
    this.renderer.setStyle(nuevoDiv, 'color', 'white');
    this.renderer.setStyle(nuevoDiv, 'padding', '15px');
    this.renderer.setStyle(nuevoDiv, 'margin', '10px 0');
    this.renderer.setStyle(nuevoDiv, 'borderRadius', '8px');
    this.renderer.setStyle(nuevoDiv, 'boxShadow', '0 2px 4px rgba(0,0,0,0.1)');
    this.renderer.setStyle(nuevoDiv, 'animation', 'fadeIn 0.3s ease');
    
    // Agregar clase
    this.renderer.addClass(nuevoDiv, 'elemento-dinamico');
    
    // Insertar en el contenedor
    this.renderer.appendChild(this.contenedor.nativeElement, nuevoDiv);
    
    this.mensajeConsola = `Elemento creado. Total: ${this.contenedor.nativeElement.children.length} elementos`;
  }

  crearElementoComplejo() {
    // Crear un elemento más complejo con múltiples hijos
    const card = this.renderer.createElement('div');
    this.renderer.addClass(card, 'card-dinamica');
    this.renderer.setStyle(card, 'backgroundColor', '#2196F3');
    this.renderer.setStyle(card, 'color', 'white');
    this.renderer.setStyle(card, 'padding', '20px');
    this.renderer.setStyle(card, 'margin', '10px 0');
    this.renderer.setStyle(card, 'borderRadius', '12px');
    this.renderer.setStyle(card, 'boxShadow', '0 4px 8px rgba(0,0,0,0.2)');
    
    // Crear título
    const titulo = this.renderer.createElement('h3');
    this.renderer.setProperty(titulo, 'innerText', 'Card Dinámica');
    this.renderer.setStyle(titulo, 'margin', '0 0 10px 0');
    this.renderer.appendChild(card, titulo);
    
    // Crear párrafo
    const parrafo = this.renderer.createElement('p');
    this.renderer.setProperty(parrafo, 'innerText', 'Este es un elemento complejo creado con múltiples nodos hijos usando Renderer2.');
    this.renderer.setStyle(parrafo, 'margin', '0');
    this.renderer.setStyle(parrafo, 'fontSize', '14px');
    this.renderer.appendChild(card, parrafo);
    
    // Insertar card en el contenedor
    this.renderer.appendChild(this.contenedor.nativeElement, card);
    
    this.mensajeConsola = `Card compleja creada con título y párrafo. Total: ${this.contenedor.nativeElement.children.length} elementos`;
  }

  eliminarPrimerElemento() {
    // Eliminar primer elemento hijo
    const primerHijo = this.contenedor.nativeElement.firstChild;
    if (primerHijo) {
      this.renderer.removeChild(this.contenedor.nativeElement, primerHijo);
      this.mensajeConsola = `Primer elemento eliminado. Quedan: ${this.contenedor.nativeElement.children.length} elementos`;
    } else {
      this.mensajeConsola = 'No hay elementos para eliminar';
    }
  }

  eliminarUltimoElemento() {
    // Eliminar último elemento hijo
    const ultimoHijo = this.contenedor.nativeElement.lastChild;
    if (ultimoHijo) {
      this.renderer.removeChild(this.contenedor.nativeElement, ultimoHijo);
      this.mensajeConsola = `Último elemento eliminado. Quedan: ${this.contenedor.nativeElement.children.length} elementos`;
    } else {
      this.mensajeConsola = 'No hay elementos para eliminar';
    }
  }

  eliminarTodos() {
    // Eliminar todos los elementos hijos
    while (this.contenedor.nativeElement.firstChild) {
      this.renderer.removeChild(this.contenedor.nativeElement, this.contenedor.nativeElement.firstChild);
    }
    this.mensajeConsola = 'Todos los elementos eliminados';
  }

  contarElementos(): number {
    return this.contenedor.nativeElement.children.length;
  }
}
