import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Produit, ProduitService } from 'src/app/services/produit/produit.service';
import { PackService } from 'src/app/services/pack/pack.service';

@Component({
  selector: 'app-pack-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pack-form.component.html',
  styleUrls: ['./pack-form.component.scss']
})
export class PackFormComponent implements OnInit {

  packForm!: FormGroup;
  produits: Produit[] = [];
  selectedFile: File | null = null;
  selectedProduitsCount = 0;
  mode: 'ajout' | 'edit' = 'ajout';
  packToEdit: any;

  constructor(
    private fb: FormBuilder,
    private packService: PackService,
    private produitService: ProduitService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.packForm = this.fb.group({
      nom: ['', Validators.required],
      photo: [null, this.mode === 'ajout' ? Validators.required : []],
      description: [''],
      produits: [[]]
    });

    this.produitService.getProduits().subscribe((data) => {
      this.produits = data;
    });

    // Gestion du mode édition
    const packId = this.route.snapshot.params['id'];
    if (packId) {
      this.mode = 'edit';
      this.packService.getPack(packId).subscribe(pack => {
        this.packToEdit = pack;
        this.packForm.patchValue({
          nom: this.packToEdit.nom,
          description: this.packToEdit.description,
          produits: this.packToEdit.produits.map((p: any) => p.id)
        });
        this.selectedProduitsCount = this.packToEdit.produits.length;

        this.packForm.get('photo')?.clearValidators();
        this.packForm.get('photo')?.updateValueAndValidity();
      });
    }
  }

  // Méthode pour calculer le prix total
// Méthode pour calculer le prix total - VERSION CORRIGÉE
calculateTotalPrice(): number {
  if (!this.packForm || !this.produits.length) return 0;

  const selectedIds: number[] = this.packForm.get('produits')?.value || [];

  // S'assurer que tous les prix sont des nombres avant l'addition
  const total = this.produits
    .filter(p => selectedIds.includes(p.id))
    .reduce((sum, p) => {
      // Convertir le prix en nombre si ce n'est pas déjà le cas
      const prix = typeof p.prix === 'string' ? parseFloat(p.prix) : p.prix;
      return sum + prix;
    }, 0);

  // Retourner un nombre avec 2 décimales
  return parseFloat(total.toFixed(2));
}

  onProduitChange(event: any, produitId: number) {
    const produits: number[] = this.packForm.get('produits')?.value || [];

    if (event.target.checked) {
      if (!produits.includes(produitId)) produits.push(produitId);
    } else {
      const index = produits.indexOf(produitId);
      if (index > -1) produits.splice(index, 1);
    }

    this.packForm.get('produits')?.setValue(produits);
    this.selectedProduitsCount = produits.length;
  }

  isProduitSelected(produitId: number): boolean {
    const produits: number[] = this.packForm.get('produits')?.value || [];
    return produits.includes(produitId);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.packForm.patchValue({ photo: this.selectedFile });
      this.packForm.get('photo')?.updateValueAndValidity();
    }
  }

  getPhotoUrl(photo: string): string {
  if (!photo) return '';
  return `http://localhost:8000/storage/${photo}`;
}

  onSubmit(): void {
  if (this.packForm.valid) {
    const formValue = this.packForm.value;

    if (this.mode === 'ajout' && !this.selectedFile) {
      alert('Veuillez sélectionner une photo pour le pack !');
      return;
    }

    const prixTotal = this.calculateTotalPrice();

    const formData = new FormData();
    formData.append('nom', formValue.nom);
    formData.append('description', formValue.description || '');
    formData.append('prix', prixTotal.toString());

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    // ENVOYER LES PRODUITS EN JSON
    const produitsData = formValue.produits.map((id: number) => ({
  id: id,
  quantite: 1
}));

produitsData.forEach((p: { id: number, quantite: number }, index: number) => {
  formData.append(`produits[${index}][id]`, p.id.toString());
  formData.append(`produits[${index}][quantite]`, p.quantite.toString());
});
    console.log("Données envoyées:");
    for (let pair of (formData as any).entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    if (this.mode === 'ajout') {
      this.packService.createPack(formData).subscribe({
        next: () => this.router.navigate(['admin/pack']),
        error: (err) => {
          console.error('Erreur création pack', err);
          if (err.error) {
            console.error('Détails erreur:', err.error);
          }
        }
      });
    } else if (this.packToEdit?.id) {
      this.packService.updatePack(this.packToEdit.id, formData).subscribe({
        next: () => this.router.navigate(['admin/pack']),
        error: (err) => {
          console.error('Erreur mise à jour pack', err);
          if (err.error) {
            console.error('Détails erreur:', err.error);
          }
        }
      });
    }
  }
}
}
