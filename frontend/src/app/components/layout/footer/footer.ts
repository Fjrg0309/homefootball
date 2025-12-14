import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  encapsulation: ViewEncapsulation.None
})
export class Footer {
  currentYear = new Date().getFullYear();
}
