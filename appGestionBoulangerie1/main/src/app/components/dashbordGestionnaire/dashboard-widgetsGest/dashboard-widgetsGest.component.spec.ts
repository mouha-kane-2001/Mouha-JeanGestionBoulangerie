import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardWidgetsGestComponent } from './dashboard-widgetsGest.component';


describe('DashboardWidgetsComponent', () => {
  let component: DashboardWidgetsGestComponent;
  let fixture: ComponentFixture<DashboardWidgetsGestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardWidgetsGestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardWidgetsGestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
