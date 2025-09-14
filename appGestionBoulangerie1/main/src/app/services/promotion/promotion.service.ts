import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../produit/produit.service';

export interface Promotion {
  id?: number;
  nom: string;
  description?: string;
  date_debut: string; // format ISO
  date_fin: string;   // format ISO
   type_reduction: 'pourcentage' | 'montant';
  valeur_reduction: number;
  produits?: Produit[];
  produit_ids?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private apiUrl = 'http://localhost:8000/api/promotions';

  constructor(private http: HttpClient) {}

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
  }

  createPromotion(promo: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(this.apiUrl, promo);
  }

  updatePromotion(id: number, promo: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.apiUrl}/${id}`, promo);
  }

  deletePromotion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
