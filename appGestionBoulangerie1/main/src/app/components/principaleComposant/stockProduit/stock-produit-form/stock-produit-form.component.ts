import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Produit } from 'src/app/services/produit/produit.service';
import { StockProduitService } from 'src/app/services/stockProduit/stock-produit.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stock-produit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, RouterModule],
  templateUrl: './stock-produit-form.component.html',
  styleUrls: ['./stock-produit-form.component.scss']
})
export class StockProduitFormComponent implements OnInit {
  stockForm!: FormGroup;
  produits: Produit[] = [];
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private stockService: StockProduitService
  ) {}

  ngOnInit(): void {
    this.stockForm = this.fb.group({
      produitId: ['', Validators.required],
      stockActuel: [{ value: '', disabled: true }],
      operation: ['increase', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]]
    });

    // Charger les produits
    this.stockService.getProduit().subscribe(data => {
      this.produits = data;
    });

    // Afficher stock actuel quand produit sélectionné
    this.stockForm.get('produitId')?.valueChanges.subscribe(produitId => {
      const produit = this.produits.find(p => p.id == produitId);
      this.stockForm.patchValue({ stockActuel: produit ? produit.stock : '' });
    });
  }

  onSubmit(): void {
    if (this.stockForm.valid) {
      const { produitId, operation, quantite } = this.stockForm.getRawValue();
      const delta = operation === 'increase' ? quantite : -quantite;

      this.stockService.updateStock(produitId, delta).subscribe({
        next: (res) => {
          this.message = `Stock du produit "${res.nom}" mis à jour avec succès !`;
          // Mettre à jour le champ stockActuel pour refléter le nouveau stock
          this.stockForm.patchValue({ stockActuel: res.stock, quantite: 1 });
        },
        error: () => {
          this.message = "Erreur lors de la mise à jour du stock.";
        }
      });
    }
  }
}
