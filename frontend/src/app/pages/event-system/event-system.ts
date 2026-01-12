import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EventLog {
  timestamp: Date;
  type: string;
  message: string;
}

@Component({
  selector: 'app-event-system',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-system.html',
  styleUrl: './event-system.scss'
})
export class EventSystem implements AfterViewInit {
  // ViewChild para manipular el área de logs
  @ViewChild('eventConsole') eventConsole!: ElementRef<HTMLDivElement>;
  @ViewChild('keyInput') keyInput!: ElementRef<HTMLInputElement>;

  // Logs de eventos
  eventLogs: EventLog[] = [];
  maxLogs = 10;

  // Para ejemplos de eventos
  clickCount = 0;
  doubleClickCount = 0;
  lastKeyPressed = '';
  inputValue = '';
  inputFocused = false;
  mousePosition = { x: 0, y: 0 };
  isMouseOver = false;

  // Para propagación de eventos
  parentClicked = false;
  childClicked = false;
  stopPropagation = false;

  // Para preventDefault
  formData = { nombre: '', email: '' };
  lastSubmit = '';
  linkClicks = 0;

  // SECCIÓN 1: Event Binding Básico
  onClick() {
    this.clickCount++;
    this.addLog('click', `Botón clickeado. Total: ${this.clickCount}`);
  }

  onDoubleClick() {
    this.doubleClickCount++;
    this.addLog('dblclick', `Doble click detectado. Total: ${this.doubleClickCount}`);
  }

  resetCounters() {
    this.clickCount = 0;
    this.doubleClickCount = 0;
    this.addLog('reset', 'Contadores reseteados');
  }

  // SECCIÓN 2: Eventos de Teclado
  onKeyUp(event: KeyboardEvent) {
    this.lastKeyPressed = event.key;
    this.addLog('keyup', `Tecla presionada: ${event.key} (código: ${event.code})`);
  }

  onKeyDown(event: KeyboardEvent) {
    this.addLog('keydown', `Tecla presionada (keydown): ${event.key}`);
  }

  onEnterKey() {
    this.addLog('keyup.enter', `¡Enter presionado! Valor del input: "${this.inputValue}"`);
  }

  onEscapeKey() {
    this.inputValue = '';
    this.addLog('keyup.escape', 'ESC presionado - Input limpiado');
  }

  onCtrlEnter() {
    this.addLog('keyup.enter', '¡Ctrl + Enter detectado!');
  }

  // SECCIÓN 3: Eventos de Mouse
  onMouseMove(event: MouseEvent) {
    this.mousePosition = { x: event.offsetX, y: event.offsetY };
  }

  onMouseEnter() {
    this.isMouseOver = true;
    this.addLog('mouseenter', 'Mouse entró al área');
  }

  onMouseLeave() {
    this.isMouseOver = false;
    this.addLog('mouseleave', 'Mouse salió del área');
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault(); // Previene menú contextual
    this.addLog('contextmenu', 'Click derecho detectado (menú contextual prevenido)');
  }

  // SECCIÓN 4: Eventos Focus y Blur
  onFocus() {
    this.inputFocused = true;
    this.addLog('focus', 'Input obtuvo el foco');
  }

  onBlur() {
    this.inputFocused = false;
    this.addLog('blur', 'Input perdió el foco');
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.addLog('input', `Valor cambiado: ${value}`);
  }

  // SECCIÓN 5: Prevenir Comportamientos por Defecto
  onSubmit(event: Event) {
    event.preventDefault(); // Previene recarga de página
    this.lastSubmit = `Nombre: ${this.formData.nombre}, Email: ${this.formData.email}`;
    this.addLog('submit', `Formulario enviado sin recarga - ${this.lastSubmit}`);
    
    // Resetear formulario
    this.formData = { nombre: '', email: '' };
  }

  onLinkClick(event: Event) {
    event.preventDefault(); // Previene navegación
    this.linkClicks++;
    this.addLog('click', `Click en enlace prevenido. Total: ${this.linkClicks}`);
  }

  // SECCIÓN 6: Propagación de Eventos
  onParentClick() {
    this.parentClicked = true;
    this.addLog('click', '🔵 Evento llegó al PADRE');
    
    setTimeout(() => {
      this.parentClicked = false;
    }, 500);
  }

  onChildClick(event: MouseEvent) {
    this.childClicked = true;
    
    if (this.stopPropagation) {
      event.stopPropagation(); // Detiene propagación al padre
      this.addLog('click', '🔴 Click en HIJO (propagación detenida)');
    } else {
      this.addLog('click', '🟢 Click en HIJO (propagación permitida)');
    }
    
    setTimeout(() => {
      this.childClicked = false;
    }, 500);
  }

  togglePropagation() {
    this.stopPropagation = !this.stopPropagation;
    this.addLog('toggle', `Propagación ${this.stopPropagation ? 'DETENIDA' : 'PERMITIDA'}`);
  }

  // SECCIÓN 7: Eventos Múltiples y Combinados
  onMultipleEvents(event: MouseEvent) {
    let message = 'Click ';
    if (event.shiftKey) message += '+ Shift ';
    if (event.ctrlKey) message += '+ Ctrl ';
    if (event.altKey) message += '+ Alt ';
    message += 'detectado';
    
    this.addLog('click', message);
  }

  // Utilidades
  addLog(type: string, message: string) {
    this.eventLogs.unshift({
      timestamp: new Date(),
      type,
      message
    });
    
    // Limitar cantidad de logs
    if (this.eventLogs.length > this.maxLogs) {
      this.eventLogs.pop();
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  }

  ngAfterViewInit() {
    // Los elementos ViewChild están disponibles aquí
    console.log('Event console:', this.eventConsole);
    console.log('Key input:', this.keyInput);
  }

  /**
   * Limpiar todos los logs y hacer scroll al tope
   */
  clearLogs() {
    this.eventLogs = [];
    if (this.eventConsole) {
      this.eventConsole.nativeElement.scrollTop = 0;
    }
  }

  /**
   * Auto-scroll al final del console cuando se añade un log
   */
  private scrollToBottom() {
    if (this.eventConsole) {
      setTimeout(() => {
        this.eventConsole.nativeElement.scrollTop = this.eventConsole.nativeElement.scrollHeight;
      }, 0);
    }
  }

  getEventTypeClass(type: string): string {
    const typeMap: { [key: string]: string } = {
      'click': 'event-click',
      'dblclick': 'event-dblclick',
      'keyup': 'event-keyboard',
      'keydown': 'event-keyboard',
      'keyup.enter': 'event-keyboard-special',
      'keyup.escape': 'event-keyboard-special',
      'mouseenter': 'event-mouse',
      'mouseleave': 'event-mouse',
      'contextmenu': 'event-mouse',
      'focus': 'event-focus',
      'blur': 'event-focus',
      'input': 'event-input',
      'submit': 'event-submit',
      'toggle': 'event-toggle',
      'reset': 'event-reset'
    };
    
    return typeMap[type] || 'event-default';
  }
}
