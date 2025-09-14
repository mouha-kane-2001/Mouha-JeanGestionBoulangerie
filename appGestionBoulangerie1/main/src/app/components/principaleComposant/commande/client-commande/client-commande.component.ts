import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommandeService } from 'src/app/services/commande/commande.service';

@Component({
  selector: 'app-client-commande',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './client-commande.component.html',
  styleUrls: ['./client-commande.component.scss'],
  standalone:true
})
export class ClientCommandeComponent implements OnInit {
   commandes: any[] = [];
  toastMessage: string = '';

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadMesCommandes();
  }

  loadMesCommandes() {
    this.commandeService.getMesCommandes().subscribe((res: any) => {
      this.commandes = res.data;
    });
  }

  getStatutText(statut: string): string {
    const statuts: { [key: string]: string } = {
      'en_attente': 'En attente',
      'en_preparation': 'En préparation',
      'prete': 'Prête',
      'en_livraison': 'En livraison',
      'livree': 'Livrée'
    };
    return statuts[statut] || statut;
  }

  getStatutIcon(statut: string): string {
    const icons: { [key: string]: string } = {
      'en_attente': 'fa-clock',
      'en_preparation': 'fa-utensils',
      'prete': 'fa-check-circle',
      'en_livraison': 'fa-truck',
      'livree': 'fa-box-open'
    };
    return icons[statut] || 'fa-question-circle';
  }

  getModePaiementText(mode: string): string {
    const modes: { [key: string]: string } = {
      'en_ligne': 'En ligne',
      'a_la_livraison': 'À la livraison',
      'espece': 'Espèce'
    };
    return modes[mode] || mode;
  }

  getPaymentIcon(mode: string): string {
    const icons: { [key: string]: string } = {
      'en_ligne': 'fa-credit-card',
      'a_la_livraison': 'fa-money-bill-wave',
      'espece': 'fa-money-bill'
    };
    return icons[mode] || 'fa-money-bill';
  }

  showAlert(message: string) {
    this.toastMessage = message;
    const toast = document.getElementById('liveToast');

  }

  telechargerFacture(id: number) {
    this.commandeService.telechargerFacture(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error("Erreur téléchargement facture", err)
    });
  }
}
