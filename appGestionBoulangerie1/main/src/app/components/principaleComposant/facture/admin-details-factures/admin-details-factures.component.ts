import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/services/facture/facture.service';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-details-factures',
   imports: [ CommonModule,FormsModule],

  standalone:true,
  templateUrl: './admin-details-factures.component.html',
  styleUrls: ['./admin-details-factures.component.scss']
})
export class AdminDetailsFacturesComponent {

selectedFacture: any = null;
  detailsFacture: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private factureService: FactureService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const factureId = this.route.snapshot.paramMap.get('id');
    if (factureId) {
      this.loadFactureDetails(parseInt(factureId));
    }
  }

 loadFactureDetails(factureId: number): void {
  this.isLoading = true;
  this.factureService.getFactureDetailsAdmin(factureId).subscribe({
    next: (data) => {
      console.log('Détails facture reçus :', data); // <--- pour vérifier
      this.selectedFacture = data;  // <-- directement
      this.detailsFacture = data.details_facture || []; // <-- champ correct
      this.isLoading = false;
    },
    error: (error) => {
      this.errorMessage = 'Erreur lors du chargement des détails de la facture';
      this.isLoading = false;
      console.error('Erreur:', error);
    }
  });
}


  getStatusText(status: string): string {
    switch(status) {
      case 'payée': return 'Payée';
      case 'en_attente': return 'En attente';
      case 'annulée': return 'Annulée';
      default: return status;
    }
  }


  telechargerFacture(factureId: number): void {
    this.factureService.telechargerFactureAdmin(factureId).subscribe({
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


  goBack(): void {
    this.router.navigate(['/admin/factures']);
  }



  supprimerFacture(): void {
    if (!this.selectedFacture?.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      this.factureService.supprimerFacture(this.selectedFacture.id).subscribe({
        next: () => {
          alert('Facture supprimée avec succès !');
          const role = localStorage.getItem('role');
          if (role === 'ADMIN') this.router.navigate(['/admin/facture']);
          else if (role === 'GESTIONNAIRE') this.router.navigate(['/gestionnaire/facture']);
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la suppression de la facture.');
        }
      });
    }}


    marquerFacturePayee(id: number) {
  this.factureService.marquerCommePayee(id).subscribe({
    next: () => {
      alert('Facture marquée comme payée !');
      this.selectedFacture.statut = 'payée';
    },
    error: (err) => console.error(err)
  });
}
}
