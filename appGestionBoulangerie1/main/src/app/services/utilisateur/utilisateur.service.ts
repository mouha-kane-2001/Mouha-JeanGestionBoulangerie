import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private apiUrl = 'http://localhost:8000/api/utilisateurs';

  constructor(private http: HttpClient) {}

  // Ajouter un utilisateur
  createUser(utilisateur: any): Observable<any> {
    return this.http.post(this.apiUrl, utilisateur);
  }

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Récupérer un utilisateur par ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

 updateUser(id: number, data: FormData): Observable<any> {
  // Pour Laravel : POST avec _method=PUT pour gérer FormData
  return this.http.post(`${this.apiUrl}/${id}`, data);
}
  // Supprimer un utilisateur
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Changer le rôle d’un utilisateur
  changeUserRole(id: number, nouveauRole: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/changer-role`, { role: nouveauRole });
  }

  // Récupérer les managers
  getManagers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/managers`);
  }

  // Récupérer l'utilisateur connecté
  getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:8000/api/utilisateurs');
  }
}
