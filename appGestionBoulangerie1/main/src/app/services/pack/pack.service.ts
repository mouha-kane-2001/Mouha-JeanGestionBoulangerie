import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../produit/produit.service';

export interface Pack {
  id?: number;
  nom: string;
  description?: string;
    produits: Produit[];
   prix: number;
   photo?: string;
   }


@Injectable({
  providedIn: 'root'
})
export class PackService{
 private apiUrl = 'http://localhost:8000/api/packs';

  constructor(private http: HttpClient) {}

  getPacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(this.apiUrl);
  }

  getPack(id: number): Observable<Pack> {
    return this.http.get<Pack>(`${this.apiUrl}/${id}`);
  }










createPack(data: any): Observable<Pack> {
  // Si c'est FormData, envoyer sans header spécifique
  if (data instanceof FormData) {
    return this.http.post<Pack>(this.apiUrl, data);
  } else {
    // Sinon, envoyer en JSON avec le header approprié
    return this.http.post<Pack>(this.apiUrl, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

updatePack(id: number, data: any): Observable<Pack> {
  // Si c'est FormData, utiliser la méthode POST avec _method=PUT
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    return this.http.post<Pack>(`${this.apiUrl}/${id}`, data);
  } else {
    // Sinon, utiliser PUT normal avec JSON
    return this.http.put<Pack>(`${this.apiUrl}/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}




  deletePack(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
