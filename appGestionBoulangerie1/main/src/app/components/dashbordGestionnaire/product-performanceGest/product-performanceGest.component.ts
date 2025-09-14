import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Commande, CommandeService } from 'src/app/services/commande/commande.service';
import { HttpClient } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { EmployeDashboardService } from 'src/app/services/dashboard/employe-dashboard.service';
@Component({
  selector: 'app-product-performanceGest',
  imports: [
    CommonModule,MatCardModule ,     // ✅ écessaire pour [dataSource] et mat-table
    MatCardModule,MatFormFieldModule,
    MatSelectModule, MatTableModule
  ],
  templateUrl: './product-performanceGest.component.html',
  styleUrls:['./product-performanceGest.component.scss']
})
export class AppProductPerformanceGestComponent implements OnInit{

dernieres_commandes: Commande[] = [];

  constructor(private http: HttpClient,private employe: EmployeDashboardService) {}

ngOnInit(): void {
  this.employe.getCommandes().subscribe(res => {
    console.log('Données commande:', res);
    this.dernieres_commandes = res.dernieres_commandes || [];
  });
}



  getStatutClass(statut: string) {
    switch (statut) {
      case 'en_attente': return 'bg-warning text-dark';
      case 'en_preparation': return 'bg-primary text-white';
      case 'en_livraison': return 'bg-info text-white';
      case 'livree': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  }
}
