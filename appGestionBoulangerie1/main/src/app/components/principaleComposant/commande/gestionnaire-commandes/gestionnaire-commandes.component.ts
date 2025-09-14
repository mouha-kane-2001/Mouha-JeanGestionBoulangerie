import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutService } from 'src/app/services/authentification/aut.service';
import { CommandeService } from 'src/app/services/commande/commande.service';

@Component({
  selector: 'app-gestionnaire-commandes',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gestionnaire-commandes.component.html',
  styleUrls: ['./gestionnaire-commandes.component.scss']
})
export class GestionnaireCommandesComponent  {
  commandes: any[] = [];
  commandesFiltrees: any[] = [];
  filtreStatus: string = 'toutes';
  filtreStatutLivraison: string = 'tous';
  recherche: string = '';
  triColonne: string = 'created_at';
  triAscendant: boolean = false;
  pagination: any = null;

  constructor(private commandeService: CommandeService, private router:Router,private authService :AutService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(page: number = 1) {
    const params: any = {
      page: page,
      per_page: 20
    };

    if (this.filtreStatus !== 'toutes') {
      params.statut = this.filtreStatus;
    }

    if (this.filtreStatutLivraison !== 'tous') {
      params.statut_livraison = this.filtreStatutLivraison;
    }

    this.commandeService.getCommandes().subscribe({
      next: (data) => {
        this.commandes = data.data ?? [];
        this.pagination = data;
        this.filtrerCommandes();
      },
      error: (err) => console.error('Erreur chargement commandes:', err)
    });
  }

  filtrerCommandes() {
    if (this.recherche) {
      const term = this.recherche.toLowerCase();
      this.commandesFiltrees = this.commandes.filter(c =>
        c.id.toString().includes(term) ||
        c.user?.name?.toLowerCase().includes(term) ||
        c.user?.phone?.includes(term)
      );
    } else {
      this.commandesFiltrees = [...this.commandes];
    }
    this.trierCommandes();
  }

  trierCommandes() {
    if (!this.triColonne) return;

    this.commandesFiltrees.sort((a, b) => {
      let valueA = this.getNestedValue(a, this.triColonne);
      let valueB = this.getNestedValue(b, this.triColonne);

      if (valueA < valueB) return this.triAscendant ? -1 : 1;
      if (valueA > valueB) return this.triAscendant ? 1 : -1;
      return 0;
    });
  }

  getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  changerTri(colonne: string) {
    if (this.triColonne === colonne) {
      this.triAscendant = !this.triAscendant;
    } else {
      this.triColonne = colonne;
      this.triAscendant = true;
    }
    this.trierCommandes();
  }

  changerStatut(commande: any, nouveauStatut: string) {
    let action;

    switch(nouveauStatut) {
      case 'en_preparation':
        action = this.commandeService.marquerEnPreparation(commande.id);
        break;
      case 'prete':
        action = this.commandeService.marquerPrete(commande.id);
        break;
      case 'en_livraison':
        action = this.commandeService.marquerEnLivraison(commande.id, {
          numero_suivi: 'SUIVI' + Date.now(),
          transporteur: 'Livraison Express',
          estimation_livraison: new Date(Date.now() + 2*24*60*60*1000)
        });
        break;
      case 'livree':
        action = this.commandeService.marquerLivree(commande.id);
        break;
      default:
        return;
    }

    action.subscribe({
      next: () => {
        console.log(`Commande ${commande.id} marquée comme ${nouveauStatut}`);
        this.loadCommandes(this.pagination.current_page);
      },
      error: (err) => console.error('Erreur changement statut:', err)
    });
  }

voirDetails(commande: any) {
  const userInfo = this.authService.getUserInfo();
  const role = userInfo.role; 

  const prefix = role === 'ADMIN' ? 'admin' : 'gestionnaire';
  this.router.navigate([`/${prefix}/commande/detailGes`, commande.id]);
}


  genererFacture(commandeId: number) {
    this.commandeService.genererFacture(commandeId).subscribe({
      next: (response) => {
        console.log('Facture générée:', response);
        alert('Facture générée avec succès!');
        this.loadCommandes(this.pagination.current_page);
      },
      error: (err) => console.error('Erreur génération facture:', err)
    });
  }

  chargerPage(page: number) {
    this.loadCommandes(page);
  }

  getPages(): number[] {
    if (!this.pagination) return [];

    const pages = [];
    const maxPages = 5;
    const startPage = Math.max(1, this.pagination.current_page - Math.floor(maxPages / 2));
    const endPage = Math.min(this.pagination.last_page, startPage + maxPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
