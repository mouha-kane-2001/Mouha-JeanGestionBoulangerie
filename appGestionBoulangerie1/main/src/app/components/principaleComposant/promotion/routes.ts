import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./promotion-list/promotion-list.component').then(m => m. PromotionListComponent),
    data: { title: 'Liste des promotions' }
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./promotion-form/promotion-form.component').then(m => m. PromotionFormComponent),
    data: { title: 'Ajouter une promotion' },
   },
  {
    path: 'edit/:id',
    loadComponent: () => import('./promotion-form/promotion-form.component').then(m => m. PromotionFormComponent),
    data: { title: 'Modifier une promotion' }
  }
];
