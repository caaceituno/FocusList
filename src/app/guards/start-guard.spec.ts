import { TestBed } from '@angular/core/testing';
import { StartGuard } from './start-guard';
import { UsuarioService } from '../services/registro/usuario.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

describe('GuardiaInicio', () => {
  let servicioUsuarioMock: any;
  let enrutadorMock: any;
  let almacenamientoMock: any;

  beforeEach(() => {
    servicioUsuarioMock = {
      obtenerUsuarioActivo: jasmine.createSpy('obtenerUsuarioActivo').and.returnValue(Promise.resolve(null)),
      hasWelcomeShown: jasmine.createSpy('hasWelcomeShown').and.returnValue(Promise.resolve(true)),
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(Promise.resolve(false))
    };

    enrutadorMock = {
      navigate: jasmine.createSpy('navigate'),
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({})
    };

    almacenamientoMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: UsuarioService, useValue: servicioUsuarioMock },
        { provide: Router, useValue: enrutadorMock },
        { provide: Storage, useValue: almacenamientoMock }
      ]
    });
  });

  it('debe estar definida', () => {
    expect(StartGuard).toBeDefined();
  });
});
