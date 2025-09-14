import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./support-employe.component').then(m => m.SupportEmployeComponent),
    data: { title: 'Suport employe' }
  },

];
