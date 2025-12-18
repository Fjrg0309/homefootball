import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida NIF español con letra correcta
 * Formato: 12345678Z
 */
export function nif(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toUpperCase();
    if (!value) return null;

    const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    if (!nifRegex.test(value)) return { invalidNif: true };

    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const position = parseInt(value.substring(0, 8)) % 23;
    
    return letters[position] === value[8] ? null : { invalidNif: true };
  };
}

/**
 * Valida teléfono móvil español
 * Formato: 6XXXXXXXX o 7XXXXXXXX
 */
export function telefono(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return /^(6|7)[0-9]{8}$/.test(control.value) ? null : { invalidTelefono: true };
  };
}

/**
 * Valida código postal español
 * Formato: 5 dígitos (01000-52999)
 */
export function codigoPostal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const cp = parseInt(control.value);
    return /^\d{5}$/.test(control.value) && cp >= 1000 && cp <= 52999 
      ? null 
      : { invalidCP: true };
  };
}
