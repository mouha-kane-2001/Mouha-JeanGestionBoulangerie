import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  imports: [],
  template: `
  <a href="/" class="branding-logo">
      <img
        src="assets/images/isi.jpg"
        alt="Mouha et Jean"
      />
    </a>
  `,
  styles: [`
    .branding-logo img {
      height: 50px;       /* taille typique d'un logo dans la navbar */
      width: auto;        /* conserve les proportions */
      object-fit: contain;
      display: block;
    }
  `]
})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) {}
}
