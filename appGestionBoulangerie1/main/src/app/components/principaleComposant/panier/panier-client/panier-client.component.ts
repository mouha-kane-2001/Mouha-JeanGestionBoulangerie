import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaiementComponent } from 'src/app/modals/paiement/paiement.component';
import { Panier, PanierClientService, PanierItem } from 'src/app/services/panier/panier-client.service';


declare var bootstrap: any;
@Component({
  selector: 'app-panier-client',
  imports: [ CommonModule,
     FormsModule,
    PaiementComponent],
  templateUrl: './panier-client.component.html',
  styleUrls: ['./panier-client.component.scss'],
  standalone:true
})
 export class PanierClientComponent implements OnInit{

panier: Panier | null = null;
  loading = true;
  error: string | null = null;
  modePaiement: string = 'a_la_livraison';
  showModal: boolean = false;
  adresseLivraison: string = '';


  constructor(private panierService: PanierClientService) {}

  ngOnInit(): void {
    this.loadPanier();
  }

  loadPanier(): void {
    this.loading = true;
    this.panierService.getPanier().subscribe({
      next: (p) => {
        this.panier = p;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger le panier';
        this.loading = false;
      }
    });
  }

  // Méthode pour déterminer si un item est un produit
  isProduit(item: PanierItem): boolean {
    return !!item.produit;
  }

  // Méthode pour déterminer si un item est un pack
  isPack(item: PanierItem): boolean {
    return !!item.pack;
  }

  // Méthode pour obtenir le nom de l'élément
  getElementName(item: PanierItem): string {
    return item.produit?.nom || item.pack?.nom || 'Élément inconnu';
  }

  // Méthode pour obtenir la description de l'élément
  getElementDescription(item: PanierItem): string {
    return item.produit?.description || item.pack?.description || 'Description non disponible';
  }

  // Méthode pour obtenir le prix de l'élément
  getElementPrice(item: PanierItem): number {
    return item.produit?.prix || item.pack?.prix || 0;
  }

  // Méthode pour obtenir la photo de l'élément
  getElementPhoto(item: PanierItem): string {
    if (item.produit?.photo) {
      return item.produit.photo;
    } else if (item.pack?.photo) {
      return 'http://localhost:8000/storage/' + item.pack.photo;
    } else {
      return 'assets/images/default-product.jpg';
    }
  }


  // Méthode pour ajouter un élément (produit ou pack)
  ajouterElement(item: PanierItem): void {
    if (item.produit) {
      this.panierService.addProduit(item.produit.id, 1).subscribe({
        next: (p) => this.panier = p,
        error: (err) => this.error = 'Impossible d\'ajouter ce produit'
      });
    } else if (item.pack) {

if (item.pack?.id != null) {
  this.panierService.addPack(item.pack.id, 1).subscribe({
    next: (p) => this.panier = p,
    error: () => this.error = "Impossible d'ajouter ce pack"
  });
}

    }
  }

  // Méthode pour retirer un élément (produit ou pack)
  retirerElement(item: PanierItem): void {
    this.panierService.removeItem(item.id).subscribe({
      next: () => {
        if (this.panier) {
          this.panier.items = this.panier.items.filter(i => i.id !== item.id);
        }
      },
      error: (err) => this.error = 'Impossible de retirer cet élément'
    });
  }




 get total(): number {
  if (!this.panier) return 0;
  return this.panier.items.reduce((sum, item) => {
    const prix: number = (item.produit?.prix ?? item.pack?.prix ?? 0);
    const quantite: number = item.quantite ?? 0;
    return sum + (quantite * prix);
  }, 0);
}



diminuerQuantite(item: PanierItem): void {
  const nouvelleQuantite = item.quantite - 1;
  this.panierService.updateQuantity(item.id, nouvelleQuantite)
    .subscribe({
      next: p => this.panier = p,
      error: () => this.error = 'Impossible de diminuer la quantité'
    });
}

augmenterQuantite(item: PanierItem): void {
  const nouvelleQuantite = item.quantite + 1;
  this.panierService.updateQuantity(item.id, nouvelleQuantite)
    .subscribe({
      next: p => this.panier = p,
      error: () => this.error = 'Impossible d\'augmenter la quantité'
    });
}


viderPanier(): void {
  this.panierService.clearPanier().subscribe({
    next: p => this.panier = p,
    error: () => this.error = 'Impossible de vider le panier'
  });
}








// Modifier la méthode commander()
commander(): void {
  if (!this.modePaiement) {
    alert("Veuillez choisir un mode de paiement !");
    return;
  }

  if (!this.adresseLivraison) {
    alert("Veuillez saisir votre adresse de livraison !");
    return;
  }

  if (!this.panier || this.panier.items.length === 0) {
    this.error = 'Votre panier est vide.';
    return;
  }

  if (this.modePaiement === 'en_ligne') {
    this.openPaymentModal();

  } else {
    this.panierService.createCommande(this.modePaiement, this.adresseLivraison).subscribe({
      next: (res) => {
        // Vider le panier localement
        this.panier = { id: 0, user_id: 0, items: [] };
        alert('Commande passée avec succès ! Numéro de facture: ' + res.numero_facture);
       },
      error: (err) => {
        this.error = err.error?.message || 'Impossible de passer la commande';
      }
    });
  }
}
openPaymentModal(): void {
    this.showModal = true;
  }

  fermerModal(): void {
    this.showModal = false;
  }
 }








