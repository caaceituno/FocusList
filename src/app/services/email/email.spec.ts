import { TestBed } from '@angular/core/testing';

export class Email {}

describe('Email', () => {
  let service: Email;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Email);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
