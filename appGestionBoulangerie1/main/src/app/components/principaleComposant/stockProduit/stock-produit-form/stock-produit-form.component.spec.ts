import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProduitFormComponent } from './stock-produit-form.component';

describe('StockProduitFormComponent', () => {
  let component: StockProduitFormComponent;
  let fixture: ComponentFixture<StockProduitFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockProduitFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockProduitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
