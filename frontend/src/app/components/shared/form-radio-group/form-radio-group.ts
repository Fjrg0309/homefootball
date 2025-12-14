import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

let uniqueId = 0;

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-radio-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-radio-group.html',
  styleUrl: './form-radio-group.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormRadioGroup),
      multi: true
    }
  ]
})
export class FormRadioGroup implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() name: string = `radio-group-${++uniqueId}`;
  @Input() options: RadioOption[] = [];
  @Input() disabled: boolean = false;
  @Input() helpText: string = '';
  @Input() errorMessage: string = '';
  @Input() inline: boolean = false;
  
  @Output() selectionChange = new EventEmitter<string | number>();

  value: string | number = '';

  private onChange: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | number): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(value: string | number): void {
    this.value = value;
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  getRadioId(index: number): string {
    return `${this.name}-option-${index}`;
  }
}
