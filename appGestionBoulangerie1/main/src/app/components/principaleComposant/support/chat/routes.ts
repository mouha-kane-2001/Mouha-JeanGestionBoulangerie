import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./chat.component').then(m => m.ChatComponent),
    data: { title: 'Suport open ai' }
  },

];
