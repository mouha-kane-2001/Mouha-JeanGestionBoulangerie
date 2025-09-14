import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Produit } from 'src/app/services/produit/produit.service';
import { StockProduitService } from 'src/app/services/stockProduit/stock-produit.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stock-produit-list',
standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, RouterModule],
  templateUrl: './stock-produit-list.component.html',
  styleUrl: './stock-produit-list.component.scss'

})
export class StockProduitListComponent implements OnInit {
  produits: Produit[] = [];
  loading = true;
  errorMessage = '';

  constructor(private stockService: StockProduitService) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.stockService.getProduit().subscribe({
      next: (data) => {
        this.produits = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = "Erreur lors du chargement des stocks.";
        this.loading = false;
      }
    });
  }
}
