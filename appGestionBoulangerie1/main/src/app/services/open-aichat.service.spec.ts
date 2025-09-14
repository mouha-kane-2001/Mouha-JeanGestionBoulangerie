import { TestBed } from '@angular/core/testing';

import { OpenAIChatService } from './open-aichat.service';

describe('OpenAIChatService', () => {
  let service: OpenAIChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenAIChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
