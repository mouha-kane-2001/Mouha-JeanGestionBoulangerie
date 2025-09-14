import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FactureService } from 'src/app/services/facture/facture.service';
declare var bootstrap: any;
@Component({
  selector: 'app-facture-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detailsfacture.component.html',
  styleUrls: ['./detailsfacture.component.scss'],
  standalone:true
})
export class DetaislFactureComponent {

facture: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private factureService: FactureService
  ) {}

  ngOnInit(): void {
    const factureId = this.route.snapshot.paramMap.get('id');
    if (factureId) {
      this.loadDetails(parseInt(factureId));
    }
  }

 loadDetails(id: number): void {
  this.factureService.getFactureDetails(id).subscribe({
    next: (res: any) => {
      console.log('Réponse API facture :', res); // 👈 Ajout
      this.facture = res;
      this.loading = false;
    },
    error: (err) => {
      console.error('Erreur chargement facture', err);
      this.loading = false;
    }
  });
}

  getTotalLigne(detail: any): number {
    return detail.quantite * detail.prix_unitaire;
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













































}
