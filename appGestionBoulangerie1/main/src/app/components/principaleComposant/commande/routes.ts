import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./commanderProduitPack/commandeProduitPack.component').then(m => m.CommandeProduitPackComponent),
    data: { title: '  commader  un prodit ou pack' }
  },

  {
    path: 'gestionnaire',
    loadComponent: () => import('./gestionnaire-commandes/gestionnaire-commandes.component').then(m => m.GestionnaireCommandesComponent),
    data: { title: 'commande pour gestionnaire OU admin' }
  },
  {
    path: 'clientCommander',
    loadComponent: () => import('./client-commande/client-commande.component').then(m => m.ClientCommandeComponent),
    data: { title: 'commande pour client' }
  },
   {
    path: 'detail/:id',
    loadComponent: () => import('./details-commande/details-commande.component').then(m => m.DetailsCommandeComponent),
    data: { title: 'details commande pour client' }
  },
   {
    path: 'detailGes/:id',
    loadComponent: () => import('./details-commande-gestionnaire/details-commande-gestionnaire.component').then(m => m.DetailsCommandeGestionnaireComponent),
    data: { title: 'details commande pour gestuionnaire ou admin' }
  },

];
