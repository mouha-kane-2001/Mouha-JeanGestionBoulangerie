import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutService {
private baseUrl =  '';
// adapte l’URL selon ton backend .NET Core
private tokenKey = 'token';

  constructor(private http: HttpClient,private router:Router) {}



 login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  saveUserInfo(id:number,nomUtilisateur: string, role: string) {

    console.log('Sauvegarde des infos utilisateur:', { id, nomUtilisateur, role });


    localStorage.removeItem('userId');
  localStorage.removeItem('nomUtilisateur');
  localStorage.removeItem('role');

    localStorage.setItem('userId', id.toString());
    localStorage.setItem('nomUtilisateur', nomUtilisateur);
    localStorage.setItem('role', role);
  }

  getUserInfo() {
    return {
      nomUtilisateur: localStorage.getItem('nomUtilisateur'),
      role: localStorage.getItem('role')
    };
  }


  getDepartementConnecte(): number | null {
  // On récupère l'ID de l'utilisateur connecté
  const userId = this.getUserId();
  if (!userId) return null;

  // On suppose que tu as stocké le departementId lors du login
  const departementIdStr = localStorage.getItem('departementId');
  return departementIdStr ? parseInt(departementIdStr) : null;
}

// Et une fonction pour le stocker facilement après login
saveUserDepartement(departementId: number) {
  localStorage.setItem('departementId', departementId.toString());
}


getUserId(): number | null {
  // Essayez d'abord de lire depuis 'user' (JSON complet)
  const userJson = localStorage.getItem('user');
  if (userJson) {
    const user = JSON.parse(userJson);
    return user.id ? parseInt(user.id) : null;
  }

  // Fallback sur l'ancienne méthode
  const id = localStorage.getItem('userId');
  return id ? parseInt(id) : null;
}

getUserConnecte() {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    const user = JSON.parse(userJson);
    return {
      id: user.id,
      nomUtilisateur: user.nomUtilisateur || user.username, // adaptez selon votre structure
      role: user.role
    };
  }

  // Ancienne méthode
  return {
    id: this.getUserId(),
    nomUtilisateur: localStorage.getItem('nomUtilisateur'),
    role: localStorage.getItem('role')
  };
}

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('nomUtilisateur');
    localStorage.removeItem('role');
      this.router.navigate(['/login']); // ← redirection vers /login

  }

  estConnecte(): boolean {
    return !!this.getToken();
  }
}
