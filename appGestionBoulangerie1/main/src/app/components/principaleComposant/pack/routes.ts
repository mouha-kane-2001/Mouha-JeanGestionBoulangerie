import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pack-list/pack-list.component').then(m => m.PackListComponent),
    data: { title: 'Liste des packs' }
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./pack-form/pack-form.component').then(m => m.PackFormComponent),
    data: { title: 'Ajouter une packs' },
   },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pack-form/pack-form.component').then(m => m.PackFormComponent),
    data: { title: 'Modifier une packs' }
  }
];
