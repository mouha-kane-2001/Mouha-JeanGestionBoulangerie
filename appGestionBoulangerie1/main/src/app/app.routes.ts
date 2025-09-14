// app.routes.ts
import { Routes } from '@angular/router';
 import { DashbordAdminComponent } from './layouts/dashbord/full/full.component';
import { authGuard } from './guards/auth.guard';
import { DashbordGestionnaire } from './layouts/dashbord/dashbordGestionnaire/dashGest.component';
import { DashboardWidgetsGestComponent } from './components/dashbordGestionnaire/dashboard-widgetsGest/dashboard-widgetsGest.component';
import { DashboardWidgetsAdmComponent } from './components/dashbord/dashboard-widgetsAdm/dashboard-widgetsAdm.component';
import { DashboardWidgetsClientComponent } from './components/dashbordClient/dashboard-widgetsClient/dashboard-widgetsClient.component';
import { DashbordClientComponent } from './layouts/dashbord/dashbordClient/dashClient.component';
import { DashboardWidgetsLivreurComponent } from './components/dashbordLivreur/dashboard-widgetsLivreur/dashboard-widgetsLivreur.component';
 import { CommandeProduitPackComponent } from './components/principaleComposant/commande/commanderProduitPack/commandeProduitPack.component';
import { PanierClientComponent } from './components/principaleComposant/panier/panier-client/panier-client.component';

export const routes: Routes = [
  {

    path: 'admin',
    component: DashbordAdminComponent,
     canActivate: [authGuard],

      data: { role: ['ADMIN' ] },

    children: [
          { path: 'dashboard', component: DashboardWidgetsAdmComponent },
          {
        path: 'facture',
        loadChildren: () =>
          import('./components/principaleComposant/facture/routes').then(m => m.routes),
      },
        {
        path: 'commande',
        loadChildren: () =>
          import('./components/principaleComposant/commande/routes').then(m => m.routes),
      },

       {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },

      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
      {
        path: 'utilisateurs',
        loadChildren: () =>
          import('./components/principaleComposant/utilisateur/routes').then(m => m.routes),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./components/principaleComposant/categorie/routes').then(m => m.routes),
      },
      {
        path: 'stock-produits',
        loadChildren: () =>
          import('./components/principaleComposant/stockProduit/routes').then(m => m.routes),
      },
      {
        path: 'produits',
        loadChildren: () =>
          import('./components/principaleComposant/produit/routes').then(m => m.routes),
      },
      {
        path: 'promotions',
        loadChildren: () =>
          import('./components/principaleComposant/promotion/routes').then(m => m.routes),
      },
       {
        path: 'pack',
        loadChildren: () =>
          import('./components/principaleComposant/pack/routes').then(m => m.routes),
      },
      {
        path: 'commande',
        loadChildren: () =>
          import('./components/principaleComposant/commande/routes').then(m => m.routes),
      },

    ]
  },


{
    path: 'gestionnaire',
    component: DashbordGestionnaire,
     canActivate: [authGuard],
  data: { role: ['ADMIN', 'GESTIONNAIRE'] },
    children: [
          { path: 'dashboard', component: DashboardWidgetsGestComponent }, // ⚠️
           {
        path: 'facture',
        loadChildren: () =>
          import('./components/principaleComposant/facture/routes').then(m => m.routes),
      },
             {
        path: 'utilisateurs',
        loadChildren: () =>
          import('./components/principaleComposant/utilisateur/routes').then(m => m.routes),
      },

 {
        path: 'commande',
        loadChildren: () =>
          import('./components/principaleComposant/commande/routes').then(m => m.routes),
      },
      {
        path: 'conversation',
        loadChildren: () =>
          import('./components/principaleComposant/support-employe/routes').then(m => m.routes),
      },

    ]
  },

  {
    path: 'client',
    component: DashbordClientComponent,
     canActivate: [authGuard],
       data: { role: ['CLIENT' ] },

    children: [

          { path: 'dashboard', component: DashboardWidgetsClientComponent },
          {
        path: 'utilisateurs',
        loadChildren: () =>
          import('./components/principaleComposant/utilisateur/routes').then(m => m.routes),
      },
         {
        path: 'commande',
        loadChildren: () =>
          import('./components/principaleComposant/commande/routes').then(m => m.routes),
      },

       {
        path: 'panier',
        loadChildren: () =>
          import('./components/principaleComposant/panier/routes').then(m => m.routes),
      },
      {
        path: 'facture',
        loadChildren: () =>
          import('./components/principaleComposant/facture/routes').then(m => m.routes),
      },
        {
        path: 'conversation',
        loadChildren: () =>
          import('./components/principaleComposant/support/routes').then(m => m.routes),
      },  {
        path: 'openAi',
        loadChildren: () =>
          import('./components/principaleComposant/support/chat/routes').then(m => m.routes),
      },





    ]
  },



      {
        path: 'login',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(m => m.AuthenticationRoutes),
      },


    {
  path: 'inscription',
  loadComponent: () =>
    import('./components/principaleComposant/utilisateur/utilisateur-form/utilisateur-form.component')
      .then(c => c.UtilisateurFormComponent)
}



,
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
