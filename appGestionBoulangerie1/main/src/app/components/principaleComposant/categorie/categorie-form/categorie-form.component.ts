import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categorie, CategorieService } from 'src/app/services/categorie/categorie.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-categorie-form',
 standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, RouterModule],
  templateUrl: './categorie-form.component.html',
  styleUrl: './categorie-form.component.scss'
})
export class CategorieFormComponent implements OnInit {
  mode: 'ajout' | 'modif' = 'ajout';

  categorie: Categorie = { id: 0, nom: '' };

  constructor(
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.mode = 'modif';
      this.categorieService.getCategorie(+id).subscribe({
        next: (data) => this.categorie = data,
        error: () => alert('Impossible de charger la catégorie')
      });
    }
  }

  submitCategorie() {
    if (!this.categorie.nom.trim()) return;

    if (this.mode === 'ajout') {
      this.categorieService.createCategorie(this.categorie).subscribe({
        next: () => {
          alert('Catégorie ajoutée avec succès !');
          this.categorie = { id: 0, nom: '' };
          this.router.navigate(['/categories']);
        },
        error: () => alert('Erreur lors de l’ajout de la catégorie')
      });
    } else {
      this.categorieService.updateCategorie(this.categorie.id, this.categorie).subscribe({
        next: () => {
          alert('Catégorie mise à jour avec succès !');
          this.router.navigate(['/categories']);
        },
        error: () => alert('Erreur lors de la mise à jour de la catégorie')
      });
    }
  }
}
