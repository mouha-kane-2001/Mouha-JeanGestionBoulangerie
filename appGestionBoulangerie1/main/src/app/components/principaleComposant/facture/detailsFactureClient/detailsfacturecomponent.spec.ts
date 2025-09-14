import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaislFactureComponent } from './detailsfacture.component';

describe('FactureListComponent', () => {
  let component: DetaislFactureComponent;
  let fixture: ComponentFixture<DetaislFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetaislFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetaislFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
