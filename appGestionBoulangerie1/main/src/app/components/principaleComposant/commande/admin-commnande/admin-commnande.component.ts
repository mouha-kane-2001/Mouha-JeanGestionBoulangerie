import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommandeService } from 'src/app/services/commande/commande.service';

@Component({
  selector: 'app-admin-commnande',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-commnande.component.html',
  styleUrls: ['./admin-commnande.component.scss'],
  standalone:true
})
export class AdminCommnandeComponent implements OnInit{

   commandes: any[] = [];
  searchTerm: string = '';
  filtreStatut: string = 'tous';

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes() {
    this.commandeService.getCommandes().subscribe({
      next: (data) => this.commandes = data,
      error: (err) => console.error(err)
    });
  }

  rechercher() {
    this.commandes = this.commandes.filter(c =>
      c.client.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.id.toString().includes(this.searchTerm)
    );
  }

  filtrerParStatut() {
    if (this.filtreStatut === 'tous') {
      this.loadCommandes();
    } else {
      this.commandes = this.commandes.filter(c => c.status === this.filtreStatut);
    }
  }

  annulerCommande(id: number) {
    if (confirm("Voulez-vous vraiment annuler cette commande ?")) {
      this.commandeService.updateCommande(id, { status: 'annulée' }).subscribe({
        next: () => this.loadCommandes()
      });
    }
  }
}

