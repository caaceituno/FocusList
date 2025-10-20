import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { StartGuard } from './start-guard';

describe('StartGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => StartGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
