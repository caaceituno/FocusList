import { TestBed } from '@angular/core/testing';

import { Dblocal } from './dblocal';

describe('Dblocal', () => {
  let service: Dblocal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dblocal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
