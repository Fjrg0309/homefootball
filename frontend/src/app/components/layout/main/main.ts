import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  encapsulation: ViewEncapsulation.None
})
export class Main {

}
