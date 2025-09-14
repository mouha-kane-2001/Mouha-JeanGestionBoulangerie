import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetailsFacturesComponent } from './admin-details-factures.component';

describe('AdminDetailsFacturesComponent', () => {
  let component: AdminDetailsFacturesComponent;
  let fixture: ComponentFixture<AdminDetailsFacturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDetailsFacturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDetailsFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
