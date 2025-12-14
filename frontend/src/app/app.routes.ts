import { Routes } from '@angular/router';
import { StyleGuide } from './pages/style-guide/style-guide';

export const routes: Routes = [
  { path: 'style-guide', component: StyleGuide },
  { path: '', redirectTo: '/style-guide', pathMatch: 'full' }
];
