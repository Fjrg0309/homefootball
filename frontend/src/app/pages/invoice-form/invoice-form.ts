import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  FormArray, 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.scss'
})
export class InvoiceForm {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      customer: ['', Validators.required],
      phones: this.fb.array([]),
      addresses: this.fb.array([]),
      items: this.fb.array([])
    });

    // Inicializar con un elemento de cada tipo
    this.addPhone();
    this.addAddress();
    this.addItem();
  }

  // Getters para acceder a FormArrays
  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  get addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  // Teléfonos
  newPhone(): FormGroup {
    return this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^(6|7)[0-9]{8}$/)]]
    });
  }

  addPhone() {
    this.phones.push(this.newPhone());
    this.toastService.info('Teléfono añadido');
  }

  removePhone(index: number) {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
      this.toastService.warning('Teléfono eliminado');
    } else {
      this.toastService.error('Debe tener al menos un teléfono');
    }
  }

  // Direcciones
  newAddress(): FormGroup {
    return this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
    });
  }

  addAddress() {
    this.addresses.push(this.newAddress());
    this.toastService.info('Dirección añadida');
  }

  removeAddress(index: number) {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(index);
      this.toastService.warning('Dirección eliminada');
    } else {
      this.toastService.error('Debe tener al menos una dirección');
    }
  }

  // Items de factura
  newItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem() {
    this.items.push(this.newItem());
    this.toastService.info('Item añadido');
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.toastService.warning('Item eliminado');
    } else {
      this.toastService.error('Debe tener al menos un item');
    }
  }

  // Cálculos
  getItemTotal(index: number): number {
    const item = this.items.at(index).value;
    return (item.quantity || 0) * (item.price || 0);
  }

  getTotal(): number {
    return this.items.value
      .reduce((acc: number, item: any) => acc + (item.quantity || 0) * (item.price || 0), 0);
  }

  // Helpers de validación
  isPhoneInvalid(index: number): boolean {
    const phone = this.phones.at(index);
    return !!(phone && phone.invalid && phone.touched);
  }

  isAddressInvalid(index: number): boolean {
    const address = this.addresses.at(index);
    return !!(address && address.invalid && address.touched);
  }

  isItemInvalid(index: number): boolean {
    const item = this.items.at(index);
    return !!(item && item.invalid && item.touched);
  }

  // Submit
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Por favor, corrija los errores del formulario');
      return;
    }

    this.toastService.success('Factura guardada correctamente');
  }

  onReset() {
    this.form.reset();
    
    // Limpiar arrays
    while (this.phones.length > 1) this.phones.removeAt(1);
    while (this.addresses.length > 1) this.addresses.removeAt(1);
    while (this.items.length > 1) this.items.removeAt(1);

    this.toastService.info('Formulario reiniciado');
  }
}
