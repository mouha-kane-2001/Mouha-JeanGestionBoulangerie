import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PanierClientService } from 'src/app/services/panier/panier-client.service';

@Component({
  selector: 'app-paiement',
  imports: [FormsModule, CommonModule],
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.scss'],
  standalone: true
})
export class PaiementComponent {
  @Input() modePaiement: string = '';
  @Input() adresseLivraison: string = '';

  constructor(private panierService:PanierClientService) {}
  @Input() showModal: boolean = false; // Changé ici
  @Output() paiementTermine = new EventEmitter<void>();

  numeroCarte: string = '';
  dateExpiration: string = '';
  cvv: string = '';

  fermer() {
    this.paiementTermine.emit();
  }

payerEnLigne() {
  if (!this.modePaiement || !this.adresseLivraison) {
    alert('Mode de paiement ou adresse manquant !');
    return;
  }

  if (!this.numeroCarte || !this.dateExpiration || !this.cvv) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  this.panierService.createCommande(this.modePaiement, this.adresseLivraison)
    .subscribe({
      next: (res) => {
        console.log('Commande enregistrée ✅', res);
        alert('Paiement réussi et commande enregistrée !');
        this.fermer();
        window.location.reload();
      },
      error: (err) => {
        console.error('Erreur lors de la commande ❌', err);
        alert('Erreur lors du paiement.');
      }
    });


}

}
