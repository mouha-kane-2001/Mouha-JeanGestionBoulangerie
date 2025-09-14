import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./full.component').then(m => m.DashbordAdminComponent),
    data: { title: 'Dashbord admin' }
  },
];

