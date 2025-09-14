import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./stock-produit-list/stock-produit-list.component').then(m => m.  StockProduitListComponent),
    data: { title: 'Liste des  produits' }
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./stock-produit-form/stock-produit-form.component').then(m => m.  StockProduitFormComponent),
    data: { title: 'Ajouter un utilisateur' }
  },
  {
    path: 'edit/:id',
loadComponent: () => import('./stock-produit-form/stock-produit-form.component').then(m => m.  StockProduitFormComponent),    data: { title: 'Modifier un utilisateur' }
  }
];
