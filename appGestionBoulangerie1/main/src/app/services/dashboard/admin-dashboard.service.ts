import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

private apiUrl = 'http://localhost:8000/api/admin'; // adapte ton URL

  constructor(private http: HttpClient) {}

  getCommandesStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/commandes-stats`);
  }

  getRevenusStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenus-stats`);
  }

  getProduitsTop(): Observable<any> {
    return this.http.get(`${this.apiUrl}/produits-top`);
  }

  getPromotionsActives(): Observable<any> {
    return this.http.get(`${this.apiUrl}/promotions-actives`);
  }

  getClientsStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients-stats`);
  }

  getStockCritique(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stock-critique`);
  }
}
