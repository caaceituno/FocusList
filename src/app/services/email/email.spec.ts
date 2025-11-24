import { TestBed } from '@angular/core/testing';
import { EmailService } from './email';

describe('ServicioCorreo', () => {
  let servicio: EmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailService]
    });
    servicio = TestBed.inject(EmailService);
  });

  it('debe crearse', () => {
    expect(servicio).toBeTruthy();
  });
});
