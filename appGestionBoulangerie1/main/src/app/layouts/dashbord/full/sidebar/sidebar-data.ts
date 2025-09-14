import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/admin/dashboard',
  },
  {
    displayName: 'Gestion utilisateur',
    iconName: 'aperture',
    route: '/admin/utilisateurs',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',

  },
  {
    displayName: 'Gstion produit',
    iconName: 'shopping-cart',
    route: '/admin/produits',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',

  },

  {
    displayName: 'Gestion pack',
    iconName: 'message-dots',
    route: '/admin/pack',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',

  },
  {
    displayName: 'Gestion promotion',
    iconName: 'calendar',
    route: '/admin/promotions',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',

  },
  {
    displayName: 'Gestion factures',
    iconName: 'mail',
    route: '/admin/facture/adminFacture',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
   },
    {
    displayName: 'Gestion commande',
    iconName: 'mail',
    route: '/admin/commande/gestionnaire',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',

  },


];
