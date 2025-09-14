import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Commande {
  id: number;
  statut: string;
  total: number;
  montant_total: number;
  adresse_livraison?: string;

  transporteur?: string;
  numero_suivi?: string;
  estimation_livraison?: string;
  date_livraison?: string;
  created_at: string;
  mode_paiement: string;
   updated_at?: string;

    statut_livraison?: string; // <-- AJOUTÉ

  facture?: {
    id: number;
    numero_facture: string;
    statut: string;
    montant_total: number;
  };
  detail_commandes ?: DetailCommande[];
  user?: any;
}

export interface DetailCommande {
  id: number;
  produit?: {
    id: number;
    nom: string;
    prix: number;
     photo?: string;

  };
  pack?: {
    id: number;
    nom: string;
    prix: number;
      photo?: string;
  };
   prix_unitaire: number;
  prix_total: number;
   quantite: number;
  promotion_appliquee?: boolean;

 }

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
private apiUrl = 'http://localhost:8000/api/commandes';

  constructor(private http: HttpClient) {}

  getCommandes(): Observable<any> {
  return this.http.get<any>(this.apiUrl);
}

  getCommande(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCommande(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateCommande(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteCommande(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

   getMesCommandes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes`);
  }

  telechargerFacture(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/facture`, { responseType: 'blob' });
  }
getCommandeDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/details`);
  }
   annulerCommande(id: number, raison: string = ''): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/annuler`, { raison });
  }





  // NOUVELLES MÉTHODES POUR LE GESTIONNAIRE
  marquerEnPreparation(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/en-preparation`, {});
  }

  marquerPrete(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/prete`, {});
  }

  marquerEnLivraison(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/en-livraison`, data);
  }

  marquerLivree(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/livree`, {});
  }

  genererFacture(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/generer-facture`, {});
  }

  downloadFacture(factureId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/factures/${factureId}/download`, {
      responseType: 'blob'
    });
  }

  // Méthodes supplémentaires si nécessaires
  getCommandesEnAttente(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/en-attente`);
  }

  getStatistiquesPreparation(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistiques`);
  }
supprimerCommande(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
