import { Component } from '@angular/core';
import { FactureService } from 'src/app/services/facture/facture.service';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-factures',

  imports: [ CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './admin-factures.component.html',
  styleUrls: ['./admin-factures.component.scss']
})
export class AdminFacturesComponent {

factures: any[] = [];
  selectedFacture: any = null;
  detailsFacture: any[] = [];
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Filtres
  filterNumero = '';
  filterClient = '';
  filterDateDebut = '';
  filterDateFin = '';

  constructor(private factureService: FactureService) { }

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
    this.isLoading = true;
    this.factureService.getFacturesAdmin().subscribe({
      next: (data) => {

        this.factures = data;
        this.totalItems = this.factures.length;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des factures';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  selectFacture(facture: any): void {
    this.selectedFacture = facture;
    this.loadDetailsFacture(facture.id);
  }

  loadDetailsFacture(factureId: number): void {
    this.isLoading = true;
    this.factureService.getFactureDetailsAdmin(factureId).subscribe({
      next: (data) => {
        this.detailsFacture = data.details || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des détails';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

   telechargerFacture(factureId: number): void {
    this.factureService.telechargerFacture(factureId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${factureId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur téléchargement facture', err);
      }
    });
  }

  // Méthodes pour la pagination
  get paginatedFactures(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredFactures.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get filteredFactures(): any[] {
    return this.factures.filter(facture => {
      const matchesNumero = facture.numero_facture?.toLowerCase().includes(this.filterNumero.toLowerCase()) || true;
      const matchesClient = facture.commande?.user?.name?.toLowerCase().includes(this.filterClient.toLowerCase()) || true;

      let matchesDate = true;
      if (this.filterDateDebut && facture.date_emission) {
        matchesDate = new Date(facture.date_emission) >= new Date(this.filterDateDebut);
      }
      if (this.filterDateFin && facture.date_emission && matchesDate) {
        matchesDate = new Date(facture.date_emission) <= new Date(this.filterDateFin);
      }

      return matchesNumero && matchesClient && matchesDate;
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredFactures.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Calcul du total des factures filtrées
  get totalAmount(): number {
    return this.filteredFactures.reduce((total, facture) => total + (facture.montant_total || 0), 0);
  }
}
