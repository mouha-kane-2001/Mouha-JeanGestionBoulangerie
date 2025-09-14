import { NavItem } from './nav-itemGest/nav-itemGest';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Mon Dashboard',
    iconName: 'layout-grid-add',
    route: '/gestionnaire/dashboard',
  },
  {
    displayName: 'Gestion Commande',
    iconName: 'aperture',
    route: '/gestionnaire/commande/gestionnaire',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
   },
     {
    displayName: 'Gestion Conversation',
    iconName: 'aperture',
    route: '/gestionnaire/conversation',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
   },


];
