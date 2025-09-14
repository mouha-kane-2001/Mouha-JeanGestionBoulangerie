import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Promotion, PromotionService } from 'src/app/services/promotion/promotion.service';

@Component({
  selector: 'app-promotion-list',
  imports: [FormsModule, CommonModule,RouterModule],
  standalone: true,
  templateUrl: './promotion-list.component.html',
  styleUrl: './promotion-list.component.scss'
})
export class PromotionListComponent implements OnInit {
  promotions: Promotion[] = [];
  loading = true;
  errorMessage = '';

  constructor(private promoService: PromotionService, private router: Router) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.promoService.getPromotions().subscribe({
      next: (data) => {
      this.promotions = data;
      console.log('Promotions chargées :', this.promotions); // <-- ajoute ce log
      this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des promotions';
        this.loading = false;
      }
    });
  }

  editPromotion(promo: Promotion) {
    this.router.navigate(['/admin/promotions/edit', promo.id]);
  }

  deletePromotion(id?: number) {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer cette promotion ?')) {
      this.promoService.deletePromotion(id).subscribe(() => this.loadPromotions());
    }
  }
}
