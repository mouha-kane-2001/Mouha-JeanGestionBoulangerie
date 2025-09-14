import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Commande } from 'src/app/services/commande/commande.service';
import { ClientDashboardService } from 'src/app/services/dashboard/client-dashboard.service';
import { PanierItem } from 'src/app/services/panier/panier-client.service';
import { Produit } from 'src/app/services/produit/produit.service';

@Component({
  selector: 'app-sales-overviewClient',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './sales-overviewClient.component.html',
  styleUrls: ['./sales-overviewClient.component.scss']
})
export class AppSalesOverviewClientComponent implements OnInit {

  commandes: Commande[] = [];
  suggestions: Produit[] = [];
  panierItems: PanierItem[] = [];
  isLoading: boolean = true;

  constructor(private dashboardService: ClientDashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.commandes = data.commandes;
        this.suggestions = data.suggestions_produits;
        this.panierItems = data.panier_items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'en_attente': 'status-pending',
      'en_preparation': 'status-preparation',
      'prete': 'status-ready',
      'livree': 'status-delivered',
      'annulee': 'status-cancelled'
    };
    return classes[statut] || 'status-default';
  }

  getStatusLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'en_attente': 'En attente',
      'en_preparation': 'En préparation',
      'prete': 'Prête à être récupérée',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return labels[statut] || statut;
  }

  voirDetails(commandeId: number): void {
    console.log('Voir détails commande:', commandeId);
  }

  telechargerFacture(factureId: number): void {
    this.dashboardService.downloadFacture(factureId).subscribe({
      next: (response) => {
        window.open(response.pdf_url, '_blank');
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement:', error);
      }
    });
  }

  calculerTotalPanier(): number {
    return this.panierItems.reduce((total, item) => {
      return total + (item.prix_unitaire * item.quantite);
    }, 0);
  }
}
