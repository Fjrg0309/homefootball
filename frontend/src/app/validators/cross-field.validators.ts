import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida que el total (price * quantity) sea >= mínimo
 */
export function totalMinimo(min: number): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const price = group.get('price')?.value || 0;
    const quantity = group.get('quantity')?.value || 0;
    const total = price * quantity;

    return total >= min ? null : { totalMinimo: { min, actual: total } };
  };
}

/**
 * Valida que un campo de edad sea mayor que otro
 */
export function edadMayor(controlName: string, minAgeControl: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const ageControl = group.get(minAgeControl);

    if (!control?.value || !ageControl?.value) return null;
    
    return parseInt(control.value) > parseInt(ageControl.value) 
      ? null 
      : { edadMenor: true };
  };
}

/**
 * Valida que al menos uno de los campos especificados tenga valor
 */
export function atLeastOneRequired(...fields: string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const hasOne = fields.some(field => {
      const value = group.get(field)?.value;
      return value !== null && value !== undefined && value !== '';
    });
    
    return hasOne ? null : { atLeastOneRequired: { fields } };
  };
}

/**
 * Valida que una fecha de fin sea posterior a la de inicio
 */
export function dateRange(startField: string, endField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startField)?.value;
    const end = group.get(endField)?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return endDate > startDate ? null : { invalidRange: true };
  };
}
