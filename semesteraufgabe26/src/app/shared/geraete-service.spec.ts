import { TestBed } from '@angular/core/testing';

import { GeraeteService } from './geraete-service';

describe('GeraeteService', () => {
  let service: GeraeteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeraeteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
