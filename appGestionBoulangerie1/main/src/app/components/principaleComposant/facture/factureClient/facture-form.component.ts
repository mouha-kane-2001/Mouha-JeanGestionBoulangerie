import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FactureService } from 'src/app/services/facture/facture.service';

@Component({
  selector: 'app-facture-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './facture-form.component.html',
  styleUrls: ['./facture-form.component.scss']
})
export class FactureFormComponent {factures: any[] = [];
  loading = true;

  constructor(
    private factureService: FactureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
    this.factureService.getFactures().subscribe({
      next: (res: any) => {
        this.factures = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des factures', err);
        this.loading = false;
      }
    });
  }

  voirDetails(factureId: number): void {
    this.router.navigate(['/client/facture/detail', factureId]);
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
