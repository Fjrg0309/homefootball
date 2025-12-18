import { CanDeactivateFn } from '@angular/router';
import { FormGroup } from '@angular/forms';

// Interfaz para componentes con formularios
export interface FormComponent {
  form: FormGroup;
}

// Guard funcional para detectar cambios sin guardar
export const pendingChangesGuard: CanDeactivateFn<FormComponent> = 
  (component, currentRoute, currentState, nextState) => {
    // Si el formulario está "dirty" (tiene cambios sin guardar)
    if (component.form?.dirty) {
      return confirm(
        '⚠️ Hay cambios sin guardar.\n\n¿Seguro que quieres salir sin guardar?'
      );
    }
    
    // Si no hay cambios, permitir navegación
    return true;
  };
