import { Injectable } from '@angular/core';
import { Produit } from '../produit/produit.service';
import { Pack } from '../pack/pack.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PanierItem {
  id: number;
  produit?: Produit;  // Optionnel - présent seulement si c'est un produit
  pack?: Pack;        // Optionnel - présent seulement si c'est un pack
  quantite: number;
  prix_unitaire: number;
}
export interface CommandeResponse {
  user_id: number;
  // Ajoutez d'autres propriétés si nécessaire
  message?: string;
  commande_id?: number;
}

export interface Panier {
  id: number;
  user_id: number;
  items: PanierItem[];
}

@Injectable({
  providedIn: 'root'
})
export class PanierClientService {

  private apiUrl = 'http://localhost:8000/api/panier';

  constructor(private http: HttpClient) {}

  // Récupérer le panier
  getPanier(): Observable<Panier> {
    return this.http.get<Panier>(this.apiUrl);
  }

  // Ajouter un produit au panier
  addProduit(produitId: number, quantite: number = 1): Observable<Panier> {
    return this.http.post<Panier>(`${this.apiUrl}/add`, {
      produit_id: produitId,
      quantite: quantite
    });
  }

  // Ajouter un pack au panier
  addPack(packId: number, quantite: number = 1): Observable<Panier> {
    return this.http.post<Panier>(`${this.apiUrl}/add`, {
      pack_id: packId,
      quantite: quantite
    });
  }

  // Supprimer un élément du panier
  removeItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${itemId}`);
  }

  clearPanier(): Observable<Panier> {
  return this.http.delete<Panier>(`${this.apiUrl}/clear`);
}

// Modifier la quantité d'un produit ou pack
updateQuantity(itemId: number, quantite: number): Observable<Panier> {
  return this.http.patch<Panier>(`${this.apiUrl}/update/${itemId}`, { quantite });
}

createCommande(modePaiement: string, adresseLivraison: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/commande`, {
    mode_paiement: modePaiement,
    adresse_livraison: adresseLivraison
  });
}


}
