import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PromotionService, Promotion } from 'src/app/services/promotion/promotion.service';
import { ProduitService, Produit } from 'src/app/services/produit/produit.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.scss']
})
export class PromotionFormComponent implements OnInit {

  promoForm!: FormGroup;
  mode: 'ajout' | 'modif' = 'ajout';
  promoId?: number;
  produits: Produit[] = [];
  selectedProduitsCount = 0;

  constructor(
    private fb: FormBuilder,
    private promoService: PromotionService,
    private produitService: ProduitService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Charger les produits
    this.produitService.getProduits().subscribe({
      next: (data) => this.produits = data,
      error: () => console.error('Erreur chargement produits')
    });

    // Initialiser le formulaire
    this.promoForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      type_reduction: ['pourcentage', Validators.required],
      valeur_reduction: [0, [Validators.required, Validators.min(0)]],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      produits: [[]] // tableau d'IDs de produits
    });

    // Vérifier si on est en mode modification
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'modif';
      this.promoId = +id;
      this.promoService.getPromotion(this.promoId).subscribe(p => {
        const produitsIds = p.produits?.map((prod: any) => prod.id) || [];
        this.promoForm.patchValue({
          ...p,
          produits: produitsIds
        });
        this.selectedProduitsCount = produitsIds.length;
      });
    }
  }

  // Gestion des checkbox pour les produits
  onProduitChange(event: any, produitId: number) {
    const produits: number[] = this.promoForm.get('produits')?.value || [];

    if (event.target.checked) {
      if (!produits.includes(produitId)) produits.push(produitId);
    } else {
      const index = produits.indexOf(produitId);
      if (index > -1) produits.splice(index, 1);
    }

    this.promoForm.get('produits')?.setValue(produits);
    this.selectedProduitsCount = produits.length;
  }

  isProduitSelected(produitId: number): boolean {
    const produits: number[] = this.promoForm.get('produits')?.value || [];
    return produits.includes(produitId);
  }

  // Soumission du formulaire
  onSubmit() {
    if (this.promoForm.invalid) return;

    const formValue = this.promoForm.value;
    const data: Promotion = {
      nom: formValue.nom,
      description: formValue.description,
      type_reduction: formValue.type_reduction,
      valeur_reduction: formValue.valeur_reduction,
      date_debut: formValue.date_debut,
      date_fin: formValue.date_fin,
      produit_ids: formValue.produits // tableau d'IDs
    };

    if (this.mode === 'ajout') {
      this.promoService.createPromotion(data).subscribe({
        next: () => this.router.navigate(['/admin/promotions']),
        error: (err) => console.error('Erreur création promotion', err)
      });
    } else if (this.promoId) {
      this.promoService.updatePromotion(this.promoId, data).subscribe({
        next: () => this.router.navigate(['/admin/promotions']),
        error: (err) => console.error('Erreur mise à jour promotion', err)
      });
    }
  }
}
