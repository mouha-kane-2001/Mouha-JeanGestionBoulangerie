import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Produit, ProduitService } from 'src/app/services/produit/produit.service';
import { Pack, PackService } from 'src/app/services/pack/pack.service';
import { MaterialModule } from 'src/app/material.module';


@Component({
  selector: 'app-pack-list',
  imports: [CommonModule, FormsModule, MaterialModule, RouterModule, ReactiveFormsModule],
  templateUrl: './pack-list.component.html',
  styleUrl: './pack-list.component.scss',
  standalone: true
})
export class PackListComponent implements OnInit {
  packs: Pack[] = [];

  constructor(private packService: PackService, private router: Router) {}

  ngOnInit(): void {
    this.loadPacks();
  }

  loadPacks() {
    this.packService.getPacks().subscribe({
      next: data => this.packs = data,
      error: err => console.error('Erreur chargement packs', err)
    });
  }

  edit(pack: Pack) {
    this.router.navigate(['/admin/pack/edit', pack.id]);
  }

  delete(pack: Pack) {
    if (confirm(`Supprimer le pack "${pack.nom}" ?`)) {
      this.packService.deletePack(pack.id!).subscribe({
        next: () => this.loadPacks(),
        error: err => console.error('Erreur suppression pack', err)
      });
    }
  }
}
