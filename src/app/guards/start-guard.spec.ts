import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { startGuard } from './start-guard';

describe('startGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => startGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
