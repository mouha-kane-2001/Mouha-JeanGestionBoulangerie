import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackFormComponent } from './pack-form.component';

describe('PackFormComponent', () => {
  let component: PackFormComponent;
  let fixture: ComponentFixture<PackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
