import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeDashboardService {

private apiUrl = 'http://localhost:8000/api/employe/dashboard'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  // Récupère les KPI du backend
  getIndicateursEmploye(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

   getCommandes(): Observable<any> {
 return  this.http.get<any>(`${this.apiUrl}/commandes`);
}


}
