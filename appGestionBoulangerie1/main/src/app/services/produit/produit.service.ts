import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Produit {
  id: number;
  nom: string;
  description?: string;
  prix: number;
  prix_promotion?: number | null;
  promotion_id?: number | null;
  stock: number;
  categorie_id?: number;
  categorie?: {
    id: number;
    nom: string;
  };
  photo?: string;
  allergenes?: string[];
}
@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8000/api/produits';

  constructor(private http: HttpClient) {}

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  getProduitById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

 createProduit(produit: Produit | FormData): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

updateProduit(id: number, produit: Produit | FormData): Observable<Produit> {
  return this.http.post<Produit>(`${this.apiUrl}/${id}?_method=PUT`, produit);
}

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}




