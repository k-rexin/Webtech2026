import { TestBed } from '@angular/core/testing';

import { Memebers } from './memebers';

describe('Memebers', () => {
  let service: Memebers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Memebers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
