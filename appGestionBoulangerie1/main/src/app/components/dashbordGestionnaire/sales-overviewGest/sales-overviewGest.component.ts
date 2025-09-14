import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from 'src/app/material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { EmployeDashboardService } from 'src/app/services/dashboard/employe-dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-sales-overviewGest',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    NgApexchartsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatTableModule
  ],
  templateUrl: './sales-overviewGest.component.html',
  styleUrls: ['./sales-overviewGest.component.scss']
})
export class AppSalesOverviewGestComponent implements OnInit {
  loading = true;
  error: string | null = null;

  // Indicateurs pour le dashboard employé de boulangerie
  indicateurs = {
    commandesAPreparer: 0,
    commandesEnPreparation: 0,
    commandesEnLivraison: 0,
    commandesLivreesAujourdhui: 0,
    commandesUrgentes: 0,
    produitsPopulaires: [] as Array<{ nom: string, total: number }>,
   };

  // Colonnes pour le tableau des commandes récentes
  colonnesAffichees: string[] = ['numero', 'client', 'statut', 'heure'];

  constructor(private http: HttpClient, private employeDash: EmployeDashboardService) {}

  ngOnInit(): void {
    this.chargerIndicateurs();
  }

  chargerIndicateurs(): void {
    this.loading = true;
    this.error = null;

    this.employeDash.getIndicateursEmploye().subscribe({
      next: (reponse) => {
         const donneesNormalisees = this.normaliserReponse(reponse);
        this.indicateurs = { ...this.indicateurs, ...donneesNormalisees };

        this.loading = false;
      },
      error: (erreur) => {
        console.error(erreur);
        this.error = 'Impossible de charger les indicateurs';
        this.loading = false;
      }
    });
  }

  // Normalise la réponse de l'API
  private normaliserReponse(reponse: any) {
    const produitsPopulaires = reponse.produits_populaires ?? [];
     ;

    return {
      commandesAPreparer: reponse.a_preparer ?? 0,
      commandesEnPreparation: reponse.en_preparation ?? 0,
      commandesEnLivraison: reponse.en_livraison ?? 0,
      commandesLivreesAujourdhui: reponse.livrees_aujourdhui ?? 0,
      commandesUrgentes: reponse.urgentes ?? 0,
      produitsPopulaires: Array.isArray(produitsPopulaires) ? produitsPopulaires : [],
     };
  }

  rafraichir(): void {
    this.chargerIndicateurs();
  }

  suivreParId(index: number, item: any) {
    return item.id ?? index;
  }

  // Méthode pour obtenir le nom du client depuis une commande
  obtenirNomClient(commande: any): string {
    if (commande.user && commande.user.prenom && commande.user.nom) {
      return `${commande.user.prenom} ${commande.user.nom}`;
    } else if (commande.user && commande.user.nom) {
      return commande.user.nom;
    } else if (commande.user && commande.user.prenom) {
      return commande.user.prenom;
    } else {
      return 'Client inconnu';
    }
  }
}
