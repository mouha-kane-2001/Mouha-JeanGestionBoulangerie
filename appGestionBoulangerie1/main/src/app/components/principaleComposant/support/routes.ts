import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./support-list/support-list.component').then(m => m.SupportListComponent),
    data: { title: 'Suport clien' }
  },
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent),
    data: { title: 'Ajouter un utilisateur' }
  }
];
