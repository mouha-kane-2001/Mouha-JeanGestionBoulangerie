import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFactureGestionnaireComponent } from './details-facture-gestionnaire.component';

describe('DetailsFactureGestionnaireComponent', () => {
  let component: DetailsFactureGestionnaireComponent;
  let fixture: ComponentFixture<DetailsFactureGestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsFactureGestionnaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsFactureGestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
