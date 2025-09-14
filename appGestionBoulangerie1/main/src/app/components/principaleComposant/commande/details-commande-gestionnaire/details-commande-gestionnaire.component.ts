import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
 import { Commande, CommandeService, DetailCommande } from 'src/app/services/commande/commande.service';
import { FactureService } from 'src/app/services/facture/facture.service';

@Component({
  selector: 'app-details-commande-gestionnaire',
  imports: [CommonModule,FormsModule],
  templateUrl: './details-commande-gestionnaire.component.html',
  styleUrls: ['./details-commande-gestionnaire.component.scss'],
  standalone:true
})
export class DetailsCommandeGestionnaireComponent {
  showLivraisonInfo: boolean = false;

livraison = {
  transporteur: '',
  numero_suivi: '',
  estimation_livraison: ''
};

ouvrirLivraisonInfo() {
  if (this.commande) {
    // Pré-remplir si déjà présent
    this.livraison.transporteur = this.commande.transporteur || '';
    this.livraison.numero_suivi = this.commande.numero_suivi || '';
    this.livraison.estimation_livraison = this.commande.estimation_livraison || '';
  }
  this.showLivraisonInfo = true;
}

confirmerLivraison() {
  if (!this.commande) return;

  // Mettre à jour les infos de livraison dans la commande
  const updatedCommande = {
    ...this.commande,
    transporteur: this.livraison.transporteur,
    numero_suivi: this.livraison.numero_suivi,
    estimation_livraison: this.livraison.estimation_livraison,
    statut: 'en_livraison' // passer le statut
  };

  this.commandeService.marquerEnLivraison(this.commande.id, updatedCommande).subscribe({
    next: () => {
      this.loadCommandeDetails(this.commande!.id);
      alert('Commande marquée comme en livraison');
      this.fermerLivraisonInfo();
    },
    error: (err) => {
      console.error('Erreur lors de la mise à jour de la livraison', err);
      alert('Erreur lors de la mise à jour de la livraison');
    }
  });
}

fermerLivraisonInfo() {
  this.showLivraisonInfo = false;
}






commande: Commande | null = null;
  detailsCommande: DetailCommande[] = [];
  cancelReason: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commandeService: CommandeService,
    private factureService: FactureService
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
        this.commande = res;
        this.detailsCommande = res.detail_commandes || [];
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails', err);
      }
    });
  }

  // Corriger l'incohérence des statuts
  estEtapeCompletee(etape: string): boolean {
    // Mapper les statuts entre le template et le code
    const statutMapping: {[key: string]: string} = {
      'en_attente': 'en_attente',
      'en_preparation': 'en_preparation',
      'prête': 'prete',
      'en_livraison': 'en_livraison',
      'livrée': 'livree'
    };

    const statutOrdre = ['en_attente', 'en_preparation', 'prete', 'en_livraison', 'livree'];
    const statutActuel = this.commande?.statut || '';
    const indexEtape = statutOrdre.indexOf(statutMapping[etape] || etape);
    const indexStatut = statutOrdre.indexOf(statutActuel);

    return indexStatut > indexEtape;
  }

  // Méthodes pour changer le statut
  marquerEnPreparation(): void {
    if (!this.commande) return;

    this.commandeService.marquerEnPreparation(this.commande.id).subscribe({
      next: (res) => {
        this.loadCommandeDetails(this.commande!.id);
        alert('Commande marquée comme en préparation');
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
  }

  marquerPrete(): void {
    if (!this.commande) return;

    this.commandeService.marquerPrete(this.commande.id).subscribe({
      next: (res) => {
        this.loadCommandeDetails(this.commande!.id);
        alert('Commande marquée comme prête');
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
}
  marquerEnLivraison(): void {
    if (!this.commande) return;

    // Implémenter cette méthode dans votre service
    this.commandeService.marquerEnLivraison(this.commande.id,this.commande).subscribe({
      next: (res) => {
        this.loadCommandeDetails(this.commande!.id);
        alert('Commande marquée comme en livraison');
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
  }

  marquerLivree(): void {
    if (!this.commande) return;

    this.commandeService.marquerLivree(this.commande.id).subscribe({
      next: (res) => {
        this.loadCommandeDetails(this.commande!.id);
        alert('Commande marquée comme livrée');
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
  }

  // Méthode unifiée pour changer le statut
  changerStatut(commande: Commande | null, nouveauStatut: string): void {
    if (!commande) return;

    switch(nouveauStatut) {
      case 'en_preparation':
        this.marquerEnPreparation();
        break;
      case 'prete':
        this.marquerPrete();
        break;
      case 'en_livraison':
        this.marquerEnLivraison();
        break;
      case 'livree':
        this.marquerLivree();
        break;
    }
  }

  // Autres méthodes...
  imprimerDetails(): void {
    window.print();
  }

  contacterClient(user: any): void {
    if (user && user.phone) {
      window.open(`tel:${user.phone}`, '_self');
    } else if (user && user.email) {
      window.open(`mailto:${user.email}`, '_self');
    }
  }

  genererFacture(commandeId: number): void {
    if (!commandeId) return;
    this.commandeService.genererFacture(commandeId).subscribe({
      next: (res) => {
        this.loadCommandeDetails(commandeId);
        alert('Facture générée avec succès');
      },
      error: (err) => {
        console.error('Erreur', err);
        alert('Erreur lors de la génération de la facture');
      }
    });
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
        alert('Impossible de télécharger la facture');
      }
    });
  }

  goBack(): void {

 console.log("chdhd  dd jjd "); }






 supprimerCommande(): void {
  if (!this.commande?.id) return; // si commande ou id undefined, on quitte

  if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
    this.commandeService.supprimerCommande(this.commande.id).subscribe({
      next: () => {
        alert('Commande supprimée avec succès !');
        // Redirection selon rôle
        const role = localStorage.getItem('role');
        if (role === 'ADMIN') {
          this.router.navigate(['/admin/commande/gestionnaire']);
        } else if (role === 'GESTIONNAIRE') {
          this.router.navigate(['/gestionnaire/commande/gestionnaire']);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la suppression de la commande.');
      }
    });
  }
}

voirFacture(): void {
  const factureId = this.commande?.facture?.id; // <-- l'id direct de la facture
  if (factureId) {
    this.router.navigate(['/gestionnaire/facture/gestDetail', factureId]);
  } else {
    alert("Cette commande n'a pas encore de facture.");
  }
}




}
