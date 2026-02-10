import { Component } from '@angular/core';
import { Header } from "../../components/layout/header/header";
import { Footer } from "../../components/layout/footer/footer";

@Component({
  selector: 'app-minilanding',
  standalone: true,
  imports: [Header, Footer],
  templateUrl: './minilanding.html',
  styleUrl: './minilanding.scss',
})
export class Minilanding {

}
