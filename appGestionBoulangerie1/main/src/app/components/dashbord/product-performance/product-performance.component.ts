import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { AdminDashboardService } from 'src/app/services/dashboard/admin-dashboard.service';
import { IconTruckDelivery } from 'angular-tabler-icons/icons';



@Component({
  selector: 'app-product-performance',
  imports: [
    NgApexchartsModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule,
  ],
  templateUrl: './product-performance.component.html',
    styleUrls: ['./product-performance.component.scss'],
    standalone:true

 })
export class AppProductPerformanceComponent {
  // Données statistiques
  commandesStats: any = {};
  revenusStats: any = {};
  produitsTop: any[] = [];
  promotionsActives: number = 0;
  clientsStats: any = {};
  stockCritique: any[] = [];

  // Chargement des données
  isLoading: boolean = true;
  hasError: boolean = false;

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.hasError = false;

    // Charger toutes les données en parallèle
    Promise.all([
      this.dashboardService.getCommandesStats().toPromise(),
      this.dashboardService.getRevenusStats().toPromise(),
      this.dashboardService.getProduitsTop().toPromise(),
      this.dashboardService.getPromotionsActives().toPromise(),
      this.dashboardService.getClientsStats().toPromise(),
      this.dashboardService.getStockCritique().toPromise()
    ]).then(([commandes, revenus, produits, promotions, clients, stock]) => {
      this.commandesStats = commandes;
      this.revenusStats = revenus;
      this.produitsTop = produits;
      this.promotionsActives = promotions.promotionsActives;
      this.clientsStats = clients;
      this.stockCritique = stock;

      this.isLoading = false;
    }).catch(error => {
      console.error('Erreur lors du chargement des données:', error);
      this.hasError = true;
      this.isLoading = false;
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'en_preparation': 'statut-warning',
      'en_livraison': 'statut-info',
      'livree': 'statut-success',
      'annulee': 'statut-danger'
    };
    return classes[statut] || 'statut-secondary';
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'en_preparation': 'En préparation',
      'en_livraison': 'En livraison',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return labels[statut] || statut;
  }
}
