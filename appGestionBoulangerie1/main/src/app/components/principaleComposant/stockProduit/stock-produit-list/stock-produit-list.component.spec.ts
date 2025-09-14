import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProduitListComponent } from './stock-produit-list.component';

describe('StockProduitListComponent', () => {
  let component: StockProduitListComponent;
  let fixture: ComponentFixture<StockProduitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockProduitListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockProduitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
