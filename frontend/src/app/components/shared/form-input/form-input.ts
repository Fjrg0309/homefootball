import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

let uniqueId = 0;

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true
    }
  ]
})
export class FormInput implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() helpText: string = '';
  @Input() errorMessage: string = '';
  @Input() inputId: string = `form-input-${++uniqueId}`;
  
  @Output() inputChange = new EventEmitter<string>();
  @Output() inputBlur = new EventEmitter<FocusEvent>();
  @Output() inputFocus = new EventEmitter<FocusEvent>();

  value: string = '';

  // ControlValueAccessor implementation
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }

  onInputBlur(event: FocusEvent): void {
    this.onTouched();
    this.inputBlur.emit(event);
  }

  onInputFocus(event: FocusEvent): void {
    this.inputFocus.emit(event);
  }
}
