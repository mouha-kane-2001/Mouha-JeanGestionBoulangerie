import { TestBed } from '@angular/core/testing';

import { EmployeDashboardService } from './employe-dashboard.service';

describe('EmployeDashboardService', () => {
  let service: EmployeDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
