import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categorie, CategorieService } from 'src/app/services/categorie/categorie.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-categorie-list',
  imports: [CommonModule, FormsModule, MaterialModule, RouterModule],
  templateUrl: './categorie-list.component.html',
  styleUrl: './categorie-list.component.scss',
  standalone: true,
})
export class CategorieListComponent   implements OnInit
{ categories: Categorie[] = [];
  constructor(private categorieService: CategorieService,private router: Router ) {}
   ngOnInit(): void
   { this.chargerCategories(); }
    chargerCategories()
     {
      this.categorieService.getCategories().subscribe(data => this.categories = data); }
       supprimerCategorie(id: number)
        { if (confirm('Voulez-vous vraiment supprimer cette catégorie ?'))
          { this.categorieService.deleteCategorie(id).subscribe(() => this.chargerCategories()); } }
           modifierCategorie(categorie: any)
           {
           this.router.navigate(['/admin/categories/edit', categorie.id]);
           }
          }
