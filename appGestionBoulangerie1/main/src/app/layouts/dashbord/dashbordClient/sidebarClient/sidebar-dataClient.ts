import { NavItem } from './nav-itemClient/nav-itemClient';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Mon Dashboard  ',
    iconName: 'layout-grid-add',
    route: '/client/dashboard',
  },
  {
    displayName: 'Mon Panier',
    iconName: 'aperture',
    route: '/client/panier',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',

  },
  {
    displayName: 'commander',
    iconName: 'shopping-cart',
    route: '/client/commande',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
   },


  {
    displayName: 'Mes facture>',
    iconName: 'message-dots',
    route: '/client/facture',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
   },
     {
    displayName: 'Mes commande',
    iconName: 'message-dots',
    route: '/client/commande/clientCommander',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
   },
   {
    displayName: 'Envoyer message',
    iconName: 'message-dots',
    route: '/client/conversation',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
   },
   {
    displayName: 'Chat suggestion',
    iconName: 'message-dots',
    route: '/client/openAi',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
   },

];
