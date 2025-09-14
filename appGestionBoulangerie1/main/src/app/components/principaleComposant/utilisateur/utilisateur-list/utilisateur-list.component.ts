import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurService } from 'src/app/services/utilisateur/utilisateur.service';
import { BrowserModule } from '@angular/platform-browser';
 import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrls: ['./utilisateur-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, RouterModule],

})
export class UtilisateurListComponent implements OnInit {

  utilisateurs: any[] = [];
  allUtilisateurs: any[] = [];
  selectedRole: string = 'ALL';

  constructor(private userService: UtilisateurService, private router: Router) {}

  ngOnInit(): void {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs() {
    this.userService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.utilisateurs = data;
        this.allUtilisateurs = [...data];
      },
      error: err => {
        console.error(err);
        alert('Erreur lors du chargement des utilisateurs');
      }
    });
  }

  modifierUtilisateur(u: any) {
    this.router.navigate(['/admin/utilisateurs/edit', u.id]);
  }

  supprimerUtilisateur(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(() => {
        alert('Utilisateur supprimé !');
        this.chargerUtilisateurs();
      });
    }
  }

changeUserRole(u: any, nouveauRole: string) {
  if (confirm(`Voulez-vous vraiment changer le rôle de ${u.prenom} ${u.nom} en ${nouveauRole} ?`)) {
    this.userService.changeUserRole(u.id, nouveauRole).subscribe({
      next: () => {
        alert('Rôle mis à jour avec succès !');
        this.chargerUtilisateurs(); // Recharger la liste
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la mise à jour du rôle');
      }
    });
  }
}

  filtrerParRole() {
    if (!this.selectedRole || this.selectedRole === 'ALL') {
      this.utilisateurs = [...this.allUtilisateurs];
    } else {
      this.utilisateurs = this.allUtilisateurs.filter(u =>
        u.role?.toUpperCase() === this.selectedRole.toUpperCase()
      );
    }
  }


}
