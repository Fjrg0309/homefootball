import { Component } from '@angular/core';
import { Header } from '../../components/layout/header/header';
import { Main } from '../../components/layout/main/main';
import { Footer } from '../../components/layout/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header, Main, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {}
