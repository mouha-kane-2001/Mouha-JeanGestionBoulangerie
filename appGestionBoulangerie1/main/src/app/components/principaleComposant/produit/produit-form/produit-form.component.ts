import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorieService } from 'src/app/services/categorie/categorie.service';
import { Produit, ProduitService } from 'src/app/services/produit/produit.service';

@Component({
  selector: 'app-produit-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produit-form.component.html',
  styleUrls: ['./produit-form.component.scss']
})
export class ProduitFormComponent implements OnInit {
  categories: any[] = [];
  selectedFile: File | null = null;
  mode: 'ajout' | 'modif' = 'ajout';

  produit: Produit = {
    id: 0,
    nom: '',
    description: '',
    prix: 0,
    stock: 0,
 categorie: {
    id: 0,
    nom: '',
  },
    photo: '',
    allergenes: []
  };

  allergenesInput: string = '';

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categorieService.getCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: () => alert("Erreur chargement catégories")
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'modif';
      this.produitService.getProduitById(+id).subscribe({
        next: (data) => {
          this.produit = data;
          this.allergenesInput = data.allergenes?.join(', ') || '';
        },
        error: () => alert('Erreur chargement produit')
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  soumettreFormulaire() {
    // Convertir les allergènes en tableau
    this.produit.allergenes = this.allergenesInput
      .split(',')
      .map((a: string) => a.trim())
      .filter((a: string) => a.length > 0);

    const formData = new FormData();
    formData.append('nom', this.produit.nom);
    formData.append('description', this.produit.description || '');

    formData.append('prix', this.produit.prix.toString());
    formData.append('stock', this.produit.stock.toString());
this.produit.allergenes.forEach(allergene => formData.append('allergenes[]', allergene));

 if (this.produit.categorie_id) {
  formData.append('categorie_id', this.produit.categorie_id.toString());
} else {
  alert('Veuillez sélectionner une catégorie !');
  return;
}

    // Ajouter chaque allergène séparément

   if (this.mode === 'ajout' && !this.selectedFile) {
  alert('Veuillez sélectionner une photo pour le produit !');
  return; // stop le submit si pas de photo à l'ajout
}

// À la modification, on ajoute la photo seulement si l'utilisateur en choisit une nouvelle
if (this.selectedFile) {
  formData.append('photo', this.selectedFile, this.selectedFile.name);
}

    if (this.mode === 'ajout') {
      this.produitService.createProduit(formData).subscribe({

        next: () => this.router.navigate(['/admin/produits']),
        error: (err) => console.error('Erreur création produit', err)
      });
    } else {
      this.produitService.updateProduit(this.produit.id, formData).subscribe({
        next: () => this.router.navigate(['/admin/produits']),
        error: (err) => console.error('Erreur mise à jour produit', err)
      });
    }
  }
}
