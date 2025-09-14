import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardWidgetsClientComponent } from './dashboard-widgetsClient.component';


describe('DashboardWidgetsComponent', () => {
  let component: DashboardWidgetsClientComponent;
  let fixture: ComponentFixture<DashboardWidgetsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardWidgetsClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardWidgetsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
