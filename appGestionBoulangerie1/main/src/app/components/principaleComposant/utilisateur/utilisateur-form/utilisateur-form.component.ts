import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
 import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { UtilisateurService } from 'src/app/services/utilisateur/utilisateur.service';

@Component({
  selector: 'app-utilisateur-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, RouterModule],
  templateUrl: './utilisateur-form.component.html',
  styleUrls: ['./utilisateur-form.component.scss']
})
export class UtilisateurFormComponent implements OnInit {
  selectedFile: File | null = null;

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0] ?? null;
}
  mode: 'ajout' | 'modif' = 'ajout';
  motDePasse: string = '';
  confirmerMotDePasse: string = '';

  utilisateur = {
    id: null,
   prenom:'',
   nom: '',
    email: '',
    motDePasseHash: '',
    role: 'CLIENT',
    telephone: '',
    adresse: '',
    photo: '',
    sexe: ''
  };

  constructor(
    private http: HttpClient,
    private userService: UtilisateurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}













  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'modif';
      this.userService.getUserById(+id).subscribe({
        next: (data: any) => {
          this.utilisateur = { ...data, motDePasseHash: '' };
        },
        error: () => alert('Erreur lors du chargement de l’utilisateur')
      });
    }
  }






  viderFormulaire() {
    // Réinitialiser l'objet utilisateur
    this.utilisateur = {
      id: null,
      nom: '',
      prenom: '',
      email: '',
      motDePasseHash: '',
      role: 'CLIENT',
      telephone: '',
      adresse: '',
      photo: '',
      sexe: ''
    };
  }





soumettreFormulaire() {
  const formData = new FormData();

  // Champs obligatoires ou semi-obligatoires
  formData.append('prenom', this.utilisateur.prenom);
  formData.append('nom', this.utilisateur.nom);
  formData.append('email', this.utilisateur.email);
  formData.append('role', this.utilisateur.role);

  // Mot de passe uniquement s'il est rempli
  if (this.motDePasse) {
    formData.append('password', this.motDePasse);
  }

  // Champs optionnels seulement si remplis
  if (this.utilisateur.telephone) formData.append('telephone', this.utilisateur.telephone);
  if (this.utilisateur.adresse) formData.append('adresse', this.utilisateur.adresse);
   if (this.utilisateur.sexe) formData.append('sexe', this.utilisateur.sexe);

  // Photo uniquement si un fichier est sélectionné
  if (this.selectedFile) {
    formData.append('photo', this.selectedFile);
  }

  // Création
  if (this.mode === 'ajout') {
    for (let pair of (formData as any).entries()) {
  console.log(pair[0], pair[1]);
}
    this.userService.createUser(formData).subscribe({
      next: (res) => {
        alert('Inscription reussi créé !');
        this.router.navigate(['/login']);

         this.viderFormulaire();
       },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la création de l’utilisateur');
      }
    });
  }
  // Mise à jour
  else if (this.utilisateur.id) {
    // Important : Laravel attend PUT mais avec FormData on envoie POST + _method=PUT
    formData.append('_method', 'PUT');

    this.userService.updateUser(this.utilisateur.id, formData).subscribe({
      next: (res) => {
    const role = this.utilisateur.role || localStorage.getItem('role');
    this.viderFormulaire();
      alert('Utilisateur mis à jour avec succès !');

      if (role) {
        switch (role.toUpperCase()) {
          case 'ADMIN':
            this.router.navigate(['/admin/utilisateurs']);
            break;
          case 'GESTIONNAIRE':
            this.router.navigate(['/gestionnaire/dashboard']);
            break;
          case 'CLIENT':
            this.router.navigate(['/client/dashboard']);
            break;

          default:
            this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    },
    error: (err) => {
      console.error(err);
      alert('Erreur lors de la mise à jour de l’utilisateur');
    }
  });
}
}




  // Charger un utilisateur dans le formulaire pour modification
  editerUtilisateur(user: any) {
    this.utilisateur = { ...user, motDePasseHash: '' };
    this.mode = 'modif';
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.utilisateur = {
      id: null,
      nom: '',
      prenom: '',
      email: '',
      motDePasseHash: '',
      role: 'CLIENT',
      telephone: '',
      adresse: '',
      photo: '',
      sexe: ''
    };
    this.motDePasse = '';
    this.confirmerMotDePasse = '';
    this.mode = 'ajout';
  }
}
