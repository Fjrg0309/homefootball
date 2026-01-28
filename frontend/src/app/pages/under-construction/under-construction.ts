import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-under-construction',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './under-construction.html',
  styleUrl: './under-construction.scss'
})
export class UnderConstruction {
  currentYear = new Date().getFullYear();
}
