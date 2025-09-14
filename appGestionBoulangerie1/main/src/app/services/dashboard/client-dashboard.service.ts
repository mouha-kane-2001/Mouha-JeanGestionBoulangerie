import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientDashboardService {
 private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/dashboard`);
  }

  downloadFacture(factureId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/facture/${factureId}/download`);
  }

  getCommandeDetails(commandeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/commandes/${commandeId}`);
  }



  }
