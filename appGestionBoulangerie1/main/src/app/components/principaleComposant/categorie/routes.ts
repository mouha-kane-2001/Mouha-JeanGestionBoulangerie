import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./categorie-list/categorie-list.component').then(m => m.CategorieListComponent),
    data: { title: 'Liste des categories' }
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./categorie-form/categorie-form.component').then(m => m.CategorieFormComponent),
    data: { title: 'Ajouter un categories' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./categorie-form/categorie-form.component').then(m => m.CategorieFormComponent),
    data: { title: 'Modifier un categories' }
  }
];
