import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardWidgetsAdmComponent } from './dashboard-widgetsAdm.component';


describe('DashboardWidgetsComponent', () => {
  let component: DashboardWidgetsAdmComponent;
  let fixture: ComponentFixture<DashboardWidgetsAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardWidgetsAdmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardWidgetsAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
