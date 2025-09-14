import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterEvent, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AutService } from 'src/app/services/authentification/aut.service';

@Component({
    selector: 'app-topstripClient.',
    imports: [TablerIconsModule, MatButtonModule, MatMenuModule,CommonModule,RouterModule],
    templateUrl: './topstripClient.component.html',
})
export class AppTopstripComponent {
     constructor(private authService : AutService , private router : Router) { }


        modifierProfil() {
      const user = this.authService.getUserConnecte();
      console.log('Données complètes du localStorage:');
      console.log('userId:', localStorage.getItem('userId'));
      console.log('nomUtilisateur:', localStorage.getItem('nomUtilisateur'));
      console.log('role:', localStorage.getItem('role'));
      console.log('Toutes les clés:', Object.keys(localStorage));

      if (!user.id) {
        return alert('Utilisateur non connecté');
      }

      this.router.navigate(['/client/utilisateurs/edit', user.id]);
    }
    }
