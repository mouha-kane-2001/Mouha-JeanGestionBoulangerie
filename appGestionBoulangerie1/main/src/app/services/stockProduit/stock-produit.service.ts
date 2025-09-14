import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produit } from '../produit/produit.service';

@Injectable({
  providedIn: 'root'
})
export class StockProduitService {
private apiUrl = 'http://localhost:8000/api/produits';

  constructor(private http: HttpClient) {}

  // Récupérer tous les produits (pour afficher stock)
  getProduit(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  // Récupérer un seul produit
  getStockByProduit(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }


updateStock(produitId: number, stock: number) {
  return this.http.put<Produit>(`${this.apiUrl}/${produitId}/stock`, { stock });
}
}
