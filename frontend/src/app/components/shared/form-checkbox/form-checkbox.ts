import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

let uniqueId = 0;

@Component({
  selector: 'app-form-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCheckbox),
      multi: true
    }
  ]
})
export class FormCheckbox implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() disabled: boolean = false;
  @Input() helpText: string = '';
  @Input() inputId: string = `form-checkbox-${++uniqueId}`;
  
  @Output() checkChange = new EventEmitter<boolean>();

  checked: boolean = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onCheckChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.onChange(this.checked);
    this.checkChange.emit(this.checked);
  }

  onBlur(): void {
    this.onTouched();
  }
}
