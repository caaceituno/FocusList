import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ClimaService } from './clima.service';

describe('ServicioClima', () => {
  let servicio: ClimaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClimaService]
    });
    servicio = TestBed.inject(ClimaService);
  });

  it('debe crearse', () => {
    expect(servicio).toBeTruthy();
  });
});
