import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormInput } from '../form-input/form-input';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FormInput],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm {
  @Output() loginSuccess = new EventEmitter<{username: string, password: string}>();

  formData = {
    username: '',
    password: ''
  };

  submitted = false;

  onSubmit(): void {
    this.submitted = true;

    if (this.formData.username && this.formData.password) {
      // Emitir evento de login exitoso
      this.loginSuccess.emit({
        username: this.formData.username,
        password: this.formData.password
      });
      
      // Resetear formulario
      this.formData = {
        username: '',
        password: ''
      };
      this.submitted = false;
    }
  }
}
