import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommnandeComponent } from './admin-commnande.component';

describe('AdminCommnandeComponent', () => {
  let component: AdminCommnandeComponent;
  let fixture: ComponentFixture<AdminCommnandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCommnandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCommnandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
