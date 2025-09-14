import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnaireCommandesComponent } from './gestionnaire-commandes.component';

describe('GestionnaireCommandesComponent', () => {
  let component: GestionnaireCommandesComponent;
  let fixture: ComponentFixture<GestionnaireCommandesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionnaireCommandesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionnaireCommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
