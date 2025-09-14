import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./utilisateur-list/utilisateur-list.component').then(m => m. UtilisateurListComponent),
    data: { title: 'Liste des utilisateur' }
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./utilisateur-form/utilisateur-form.component').then(m => m. UtilisateurFormComponent),
    data: { title: 'Ajouter un utilisateur' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./utilisateur-form/utilisateur-form.component').then(m => m. UtilisateurFormComponent),
    data: { title: 'Modifier un utilisateur' }
  }
];
