import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ClimaComponent } from './clima.component';
import { ClimaService } from '../../services/clima/clima.service';

describe('ComponenteClima', () => {
  let componente: ClimaComponent;
  let fixture: ComponentFixture<ClimaComponent>;
  let servicioClimaMock: any;

  beforeEach(waitForAsync(() => {
    servicioClimaMock = {
      obtenerClima: jasmine.createSpy('obtenerClima').and.returnValue(Promise.resolve({}))
    };

    TestBed.configureTestingModule({
      declarations: [ ClimaComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: ClimaService, useValue: servicioClimaMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ClimaComponent);
    componente = fixture.componentInstance;
  }));

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
