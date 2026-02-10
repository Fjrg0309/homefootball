import { Component } from '@angular/core';
import { Header } from "../../components/layout/header/header";
import { Footer } from "../../components/layout/footer/footer";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Header, Footer],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
})
export class Landing {

}
