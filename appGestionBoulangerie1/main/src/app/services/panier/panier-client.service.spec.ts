import { TestBed } from '@angular/core/testing';

import { PanierClientService } from './panier-client.service';

describe('PanierClientService', () => {
  let service: PanierClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanierClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
