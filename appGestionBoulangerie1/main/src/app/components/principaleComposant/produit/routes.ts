import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./produit-list/produit-list.component').then(m => m.ProduitListComponent),
    data: { title: 'Liste des départements' }
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./produit-form/produit-form.component').then(m => m.ProduitFormComponent),
    data: { title: 'Ajouter un département' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./produit-form/produit-form.component').then(m => m.ProduitFormComponent),
    data: { title: 'Modifier un département' }
  }
];
