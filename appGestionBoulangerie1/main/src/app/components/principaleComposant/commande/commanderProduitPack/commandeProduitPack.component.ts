import { CommonModule } from '@angular/common';
 import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
  import { Pack, PackService } from 'src/app/services/pack/pack.service';
import { PanierClientService } from 'src/app/services/panier/panier-client.service';
import { Produit, ProduitService } from 'src/app/services/produit/produit.service';

@Component({
  selector: 'app-commandeProduitPack',
  imports: [CommonModule,FormsModule],
  templateUrl: './commandeProduitPack.component.html',
  styleUrls: ['./commandeProduitPack.component.scss'],
  standalone:true
})
export class CommandeProduitPackComponent implements OnInit {

  produits: Produit[] = [];
  packs: Pack[] = [];
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

  loadProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
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
        this.checkLoading();
      },
      error: (error) => {
        console.error('Erreur chargement packs:', error);
        this.checkLoading();
      }
    });
  }

  checkLoading(): void {
    if (this.produits.length > 0 || this.packs.length > 0) {
      this.loading = false;
    }
  }

  ajouterProduitAuPanier(produit: Produit): void {
    if (produit.id === undefined) {
      console.error('Le produit n\'a pas d\'ID !', produit);
      return;
    }

    this.panierService.addProduit(produit.id, 1).subscribe({
      next: (panier) => {
        console.log('Panier mis à jour:', panier);
        alert('Produit ajouté au panier !');
      },
      error: (err) => {
        console.error('Erreur ajout au panier:', err);
        alert('Impossible d\'ajouter le produit au panier');
      }
    });
  }

  ajouterPackAuPanier(pack: Pack): void {
    if (pack.id === undefined) {
      console.error('Le pack n\'a pas d\'ID !', pack);
      return;
    }

    this.panierService.addPack(pack.id, 1).subscribe({
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
