import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCommandeGestionnaireComponent } from './details-commande-gestionnaire.component';

describe('DetailsCommandeGestionnaireComponent', () => {
  let component: DetailsCommandeGestionnaireComponent;
  let fixture: ComponentFixture<DetailsCommandeGestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCommandeGestionnaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsCommandeGestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
