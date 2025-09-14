import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Pack, PackService } from 'src/app/services/pack/pack.service';
import { PanierClientService } from 'src/app/services/panier/panier-client.service';
import { Produit, ProduitService } from 'src/app/services/produit/produit.service';

@Component({
  selector: 'app-blog-cardClient',
  imports: [MatCardModule, TablerIconsModule, MatButtonModule ,CommonModule],
  templateUrl: './blog-cardClient.component.html',
})
export class AppBlogCardsClientComponent implements OnInit {
  produits: Produit[] = [];
  packs: Pack[] = [];
  itemsAffiches: any[] = []; // Combinaison de produits et packs
  loading = true;

  constructor(
    private produitService: ProduitService,
    private packService: PackService,
    private panierService: PanierClientService
  ) {}

  ngOnInit(): void {
    this.loadProduits();
    this.loadPacks();
  }
















getImageUrl(item: any): string {
    if (item.photo) {
      // Si c'est un pack, on ajoute le chemin complet
      if (item.type === 'pack') {
        return 'http://localhost:8000/storage/' + item.photo;
      }
      // Si c'est un produit, on utilise directement la photo
      return item.photo;
    }

    // Si c'est une image (pour les produits qui pourraient avoir ce champ)
    if (item.image) {
      return item.image;
    }

    // Image par défaut si aucune image n'est disponible
    return 'assets/images/placeholder-product.jpg';
  }

  // NOUVELLE MÉTHODE: Gérer les erreurs de chargement d'image
  handleImageError(event: any): void {
    event.target.src = 'assets/images/placeholder-product.jpg';
  }


  loadProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.combinerEtLimiterItems();
        this.checkLoading();
      },
      error: (error) => {
        console.error('Erreur chargement produits:', error);
        this.checkLoading();
      }
    });
  }

  loadPacks(): void {
    this.packService.getPacks().subscribe({
      next: (data) => {
        this.packs = data;
        this.combinerEtLimiterItems();
        this.checkLoading();
      },
      error: (error) => {
        console.error('Erreur chargement packs:', error);
        this.checkLoading();
      }
    });
  }

  combinerEtLimiterItems(): void {
    // Combiner produits et packs
    const tousLesItems = [
      ...this.produits.map(p => ({ ...p, type: 'produit' })),
      ...this.packs.map(p => ({ ...p, type: 'pack' }))
    ];

    // Mélanger et prendre seulement 4 éléments
    this.itemsAffiches = this.melangerTableau(tousLesItems).slice(0, 4);
  }

  melangerTableau(array: any[]): any[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  checkLoading(): void {
    if (this.produits.length > 0 || this.packs.length > 0) {
      this.loading = false;
    }
  }

  ajouterAuPanier(item: any): void {
    if (item.id === undefined) {
      console.error('L\'élément n\'a pas d\'ID !', item);
      return;
    }

    if (item.type === 'produit') {
      this.panierService.addProduit(item.id, 1).subscribe({
        next: (panier) => {
          console.log('Panier mis à jour:', panier);
          alert('Produit ajouté au panier !');
        },
        error: (err) => {
          console.error('Erreur ajout au panier:', err);
          alert('Impossible d\'ajouter le produit au panier');
        }
      });
    } else if (item.type === 'pack') {
      this.panierService.addPack(item.id, 1).subscribe({
        next: (panier) => {
          console.log('Panier mis à jour:', panier);
          alert('Pack ajouté au panier !');
        },
        error: (err) => {
          console.error('Erreur ajout au panier:', err);
          alert('Impossible d\'ajouter le pack au panier');
        }
      });
    }
  }

  // Méthode pour obtenir le prix affiché (avec promotion si applicable)
  getPrixAffichage(item: any): { prix: number, prixReduit?: number } {
    if (item.prix_promotionnel && item.prix_promotionnel < item.prix) {
      return { prix: item.prix_promotionnel, prixReduit: item.prix };
    }
    return { prix: item.prix };
  }
}
