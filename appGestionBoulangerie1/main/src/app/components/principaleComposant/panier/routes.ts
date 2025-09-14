import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./panier-client/panier-client.component').then(m => m.PanierClientComponent),
    data: { title: 'Mon panier' }
  },


];
