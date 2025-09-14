import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeService } from 'src/app/services/commande/commande.service';
declare var bootstrap: any;
@Component({
  selector: 'app-details-commande',
imports: [CommonModule, FormsModule],
  templateUrl: './details-commande.component.html',
  styleUrls: ['./details-commande.component.scss']
})
export class DetailsCommandeComponent {

commande: any = null;
  detailsCommande: any[] = [];
  cancelReason: string = '';
errorMessage = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    const commandeId = this.route.snapshot.paramMap.get('id');
    if (commandeId) {
      this.loadCommandeDetails(parseInt(commandeId));
    }
   }





loadCommandeDetails(id: number): void {
  this.commandeService.getCommandeDetails(id).subscribe({
    next: (res: any) => {
      console.log('Réponse complète:', res); // ← Ajoutez cette ligne
      console.log('Détails commande:', res.detail_commandes ); // ← Et cette ligne
      this.commande = res;
      this.detailsCommande = res.detail_commandes  || [];
    },
    error: (err) => {
      console.error('Erreur lors du chargement des détails', err);
    }
  });
}

  getStatutText(statut: string): string {
    const statuts: { [key: string]: string } = {
      'en_attente': 'En attente',
      'en_preparation': 'En préparation',
      'prete': 'Prête',
      'en_livraison': 'En livraison',
      'livree': 'livree',
      'annulee': 'Annulée'
    };
    return statuts[statut] || statut;
  }

  getStatutIcon(statut: string): string {
    const icons: { [key: string]: string } = {
      'en_attente': 'fa-clock',
      'en_preparation': 'fa-utensils',
      'prete': 'fa-check-circle',
      'en_livraison': 'fa-truck',
      'livree': 'fa-box-open',
      'annulee': 'fa-ban'
    };
    return icons[statut] || 'fa-question-circle';
  }

  getModePaiementText(mode: string): string {
    const modes: { [key: string]: string } = {
      'en_ligne': 'En ligne',
      'a_la_livraison': 'À la livraison',
      'espece': 'Espèces'
    };
    return modes[mode] || mode;
  }

  canCancelOrder(): boolean {
    return this.commande?.statut === 'en_attente';
  }

  getCancelTooltip(): string {
    if (this.commande?.statut === 'annulee') {
      return 'Cette commande a déjà été annulée';
    } else {
      return 'L\'annulation n\'est possible que pour les commandes en attente';
    }
  }

  isStatusActive(status: string): boolean {
    const statusOrder = ['en_attente', 'en_preparation', 'prete', 'en_livraison', 'livree'];
    const currentStatusIndex = statusOrder.indexOf(this.commande?.statut);
    const checkStatusIndex = statusOrder.indexOf(status);

    return currentStatusIndex >= checkStatusIndex;
  }




  telechargerFacture(id: number): void {
    this.commandeService.telechargerFacture(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("Erreur téléchargement facture", err);
        alert('Impossible de télécharger la facture pour le moment');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/mes-commandes']);
  }









  showCancelConfirm = false;


openCancelConfirm(): void {
  this.showCancelConfirm = true;
}

closeCancelConfirm(): void {
  this.showCancelConfirm = false;
}

annulerCommande(): void {
    if (!this.commande?.id) {
      this.errorMessage = 'Impossible d\'annuler la commande: ID manquant';
      return;
    }

     this.commandeService.annulerCommande(this.commande.id, this.cancelReason).subscribe({
      next: (response) => {
        console.log('Commande annulée avec succès', response);
        // Recharger les détails pour mettre à jour le statut
        this.loadCommandeDetails(this.commande.id);
        this.showCancelConfirm = false;

        // Afficher un message de succès (vous pourriez utiliser un toast ou une alerte)
        alert('Votre commande a été annulée avec succès.');
      },
      error: (err) => {
        console.error('Erreur lors de l\'annulation de la commande', err);
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de l\'annulation';

      }
    });
  }
}

