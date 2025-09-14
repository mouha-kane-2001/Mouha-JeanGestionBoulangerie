import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Produit, ProduitService } from 'src/app/services/produit/produit.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produit-list',
  imports: [FormsModule, CommonModule,RouterModule],
  standalone: true,
  templateUrl: './produit-list.component.html',
  styleUrl: './produit-list.component.scss'
})
export class ProduitListComponent implements OnInit {
  produits: Produit[] = [];

  constructor(private produitService: ProduitService, private router: Router) {}

  ngOnInit(): void {
    this.chargerProduits();
  }

  chargerProduits() {
    this.produitService.getProduits().subscribe(data => {
      this.produits = data;
         console.log('Produits reçus:', this.produits);

        }

    )
  }

  modifierProduit(produit: Produit) {
    this.router.navigate(['/admin/produits/edit', produit.id]);
  }

 supprimerProduit(id: number) {
  if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
    this.produitService.deleteProduit(id).subscribe({
      next: () => {
        this.chargerProduits();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        alert('Erreur lors de la suppression du produit : ' + (err.error?.message || err.message));
      }
    });
  }
}

}
