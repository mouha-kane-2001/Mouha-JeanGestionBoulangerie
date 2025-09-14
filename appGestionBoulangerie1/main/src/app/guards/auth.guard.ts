import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AutService } from '../services/authentification/aut.service';

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && now < payload.exp;
  } catch {
    return false;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AutService);

  const token = localStorage.getItem('token');
  if (!token || !isTokenValid(token)) {
    router.navigate(['/login']);
    return false;
  }

  const userRole = (localStorage.getItem('role') || '').toUpperCase();
  console.log('Role from localStorage:', userRole); // Debug

  // Récupération du rôle attendu pour la route
  let expectedRoles: string[] = [];
  let currentRoute: ActivatedRouteSnapshot | null = route;

  while (currentRoute) {
    if (currentRoute.data && currentRoute.data['role']) {
      const roleData = currentRoute.data['role'];
      if (Array.isArray(roleData)) {
        expectedRoles = roleData.map(r => r.toUpperCase().trim());
      } else {
        expectedRoles = [roleData.toUpperCase().trim()];
      }
      break;
    }
    currentRoute = currentRoute.parent;
  }

  // Si pas de rôle requis, on autorise
  if (expectedRoles.length === 0) return true;

  // Vérifie si le rôle utilisateur est dans la liste
  if (!expectedRoles.includes(userRole)) {
    console.error(`Accès refusé : userRole=${userRole}, expectedRoles=${expectedRoles}`);
    alert('Vous n\'avez pas le droit d\'accéder à cette page !');

    // Redirection en fonction du rôle
    switch (userRole) {
      case 'ADMIN':
        router.navigate(['/admin/dashboard']);
        break;
      case 'CLIENT':
        router.navigate(['/client/dashboard']);
        break;
      case 'GESTIONNAIRE':
        router.navigate(['/gestionnaire/dashboard']);
        break;
      case 'LIVREUR':
        router.navigate(['/livreur/dashboard']);
        break;
      default:
        router.navigate(['/login']);
    }
    return false;
  }

  return true; // Accès autorisé
};

