import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardWidgetsLivreurComponent } from './dashboard-widgetsLivreur.component';


describe('DashboardWidgetsComponent', () => {
  let component: DashboardWidgetsLivreurComponent;
  let fixture: ComponentFixture<DashboardWidgetsLivreurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardWidgetsLivreurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardWidgetsLivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
