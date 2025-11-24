import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FeriadosService } from './feriado.service';

describe('ServicioFeriados', () => {
  let servicio: FeriadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FeriadosService]
    });
    servicio = TestBed.inject(FeriadosService);
  });

  it('debe crearse', () => {
    expect(servicio).toBeTruthy();
  });
});
