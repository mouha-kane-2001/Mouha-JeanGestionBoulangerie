import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashClient.component').then(m => m.DashbordClientComponent),
    data: { title: 'Dashbord Client' }
  },
];

