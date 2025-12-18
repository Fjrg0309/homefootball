import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Cross-field validator que compara dos campos de contraseña
 * Se aplica a nivel FormGroup
 */
export function passwordMatch(controlName: string, matchControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const matchControl = group.get(matchControlName);

    if (!control || !matchControl) return null;
    
    // No validar si matchControl ya tiene errores y no ha sido tocado
    if (matchControl.errors && !matchControl.touched) return null;

    const mismatch = control.value !== matchControl.value;
    
    // Agregar o quitar error del control de confirmación
    if (mismatch) {
      matchControl.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      matchControl.setErrors(null);
      return null;
    }
  };
}
