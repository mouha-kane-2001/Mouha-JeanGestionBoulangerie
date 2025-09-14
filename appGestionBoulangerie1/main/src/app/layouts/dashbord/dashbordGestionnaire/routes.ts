import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashGest.component').then(m => m.DashbordGestionnaire),
    data: { title: 'Dashbord gestionnaire' }
  },
];

