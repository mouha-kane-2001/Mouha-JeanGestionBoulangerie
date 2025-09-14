import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

 private baseUrl = 'http://localhost:8000/api/factures';
   private baseUrlAdmin = 'http://localhost:8000/api/admin/factures';



  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les factures du client
   */
  getFactures(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
 marquerCommePayee(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrlAdmin}/${id}/payee`, { statut: 'payee' });
  }
  /**
   * Récupérer les détails d'une facture spécifique
   * @param id ID de la facture
   */
  getFactureDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Télécharger la facture en PDF
   * @param id ID de la facture
   */
  telechargerFacture(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, { responseType: 'blob' });
  }

telechargerFactureAdmin(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrlAdmin}/${id}/download`, { responseType: 'blob' });
  }



    /**
   * Récupérer toutes les factures du client
   */
  getFacturesAdmin(): Observable<any> {
    return this.http.get<any>(this.baseUrlAdmin);
  }

  /**
   * Récupérer les détails d'une facture spécifique
   * @param id ID de la facture
   */
  getFactureDetailsAdmin(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrlAdmin}/${id}`);
  }

   supprimerFacture(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrlAdmin}/${id}`);
  }
}
