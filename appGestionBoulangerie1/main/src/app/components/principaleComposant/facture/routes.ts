import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./factureClient/facture-form.component').then(m => m.FactureFormComponent),
    data: { title: 'Liste des packs' }
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./detailsFactureClient/detailsfacture.component').then(m => m.DetaislFactureComponent),
    data: { title: 'Ajouter une packs' },
   },
   {
    path: 'adminFacture',
    loadComponent: () => import('./admin-factures/admin-factures.component').then(m => m.AdminFacturesComponent),
    data: { title: 'Ajouter une packs' },
   },
    {
    path: 'adminDetail/:id',
    loadComponent: () => import('./admin-details-factures/admin-details-factures.component').then(m => m.AdminDetailsFacturesComponent),
    data: { title: 'Ajouter une packs' },
   },

    {
    path: 'gestDetail/:id',
    loadComponent: () => import('./details-facture-gestionnaire/details-facture-gestionnaire.component').then(m => m. DetailsFactureGestionnaireComponent),
    data: { title: 'Ajouter une packs' },
   },

];
