import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UtilisateurFormComponent } from './components/principaleComposant/utilisateur/utilisateur-form/utilisateur-form.component';
import { UtilisateurListComponent } from './components/principaleComposant/utilisateur/utilisateur-list/utilisateur-list.component';
import { CategorieFormComponent } from './components/principaleComposant/categorie/categorie-form/categorie-form.component';
import { CategorieListComponent } from './components/principaleComposant/categorie/categorie-list/categorie-list.component';
import { ProduitListComponent } from './components/principaleComposant/produit/produit-list/produit-list.component';
import { ProduitFormComponent } from './components/principaleComposant/produit/produit-form/produit-form.component';
import { S } from '@angular/cdk/scrolling-module.d-ud2XrbF8';

import { StockProduitListComponent } from './components/principaleComposant/stockProduit/stock-produit-list/stock-produit-list.component';
import { PackFormComponent } from './components/principaleComposant/pack/pack-form/pack-form.component';
import { PackListComponent } from './components/principaleComposant/pack/pack-list/pack-list.component';

import { StockProduitFormComponent } from './components/principaleComposant/stockProduit/stock-produit-form/stock-produit-form.component';
import { DashboardWidgetsGestComponent } from './components/dashbordGestionnaire/dashboard-widgetsGest/dashboard-widgetsGest.component';
import { DashboardWidgetsAdmComponent } from './components/dashbord/dashboard-widgetsAdm/dashboard-widgetsAdm.component';
import { DashbordClientComponent } from './layouts/dashbord/dashbordClient/dashClient.component';
import { DashboardWidgetsClientComponent } from './components/dashbordClient/dashboard-widgetsClient/dashboard-widgetsClient.component';
import { DashboardWidgetsLivreurComponent } from './components/dashbordLivreur/dashboard-widgetsLivreur/dashboard-widgetsLivreur.component';
 import { CommandeProduitPackComponent } from './components/principaleComposant/commande/commanderProduitPack/commandeProduitPack.component';
 import { PanierClientComponent } from './components/principaleComposant/panier/panier-client/panier-client.component';
import { PaiementComponent } from './modals/paiement/paiement.component';
import { GestionnaireCommandesComponent } from './components/principaleComposant/commande/gestionnaire-commandes/gestionnaire-commandes.component';
import { AdminCommnandeComponent } from './components/principaleComposant/commande/admin-commnande/admin-commnande.component';
import { ClientCommandeComponent } from './components/principaleComposant/commande/client-commande/client-commande.component';
import { DetailsCommandeComponent } from './components/principaleComposant/commande/details-commande/details-commande.component';
import { FactureFormComponent } from './components/principaleComposant/facture/factureClient/facture-form.component';
import { DetaislFactureComponent } from './components/principaleComposant/facture/detailsFactureClient/detailsfacture.component';
import { AdminFacturesComponent } from './components/principaleComposant/facture/admin-factures/admin-factures.component';
import { AdminDetailsFacturesComponent } from './components/principaleComposant/facture/admin-details-factures/admin-details-factures.component';
import { ChatComponent } from './components/principaleComposant/support/chat/chat.component';
import { SupportListComponent } from './components/principaleComposant/support/support-list/support-list.component';
import { SupportEmployeComponent } from './components/principaleComposant/support-employe/support-employe.component';
import { DetailsFactureGestionnaireComponent } from './components/principaleComposant/facture/details-facture-gestionnaire/details-facture-gestionnaire.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet,UtilisateurFormComponent,UtilisateurListComponent,CategorieFormComponent,CategorieListComponent,ProduitFormComponent,ProduitListComponent,StockProduitFormComponent,StockProduitListComponent,PackFormComponent,PackListComponent,DashboardWidgetsGestComponent,DashboardWidgetsAdmComponent,DashbordClientComponent,DashboardWidgetsClientComponent,DashboardWidgetsLivreurComponent,CommandeProduitPackComponent,GestionnaireCommandesComponent,AdminCommnandeComponent,ClientCommandeComponent,PanierClientComponent,PaiementComponent,GestionnaireCommandesComponent,DetailsCommandeComponent,FactureFormComponent,DetaislFactureComponent,AdminFacturesComponent,AdminDetailsFacturesComponent,ChatComponent,SupportListComponent,SupportEmployeComponent,DetailsFactureGestionnaireComponent],
    templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Modernize Angular Admin Template';
}
