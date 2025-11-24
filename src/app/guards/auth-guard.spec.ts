import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth-guard';
import { UsuarioService } from '../services/registro/usuario.service';

describe('GuardiaAutenticación', () => {
  let guardia: AuthGuard;
  let servicioUsuarioMock: any;
  let enrutadorMock: any;

  beforeEach(() => {
    servicioUsuarioMock = {
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(Promise.resolve(true))
    };

    enrutadorMock = {
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue('/login')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: UsuarioService, useValue: servicioUsuarioMock },
        { provide: Router, useValue: enrutadorMock }
      ]
    });
    guardia = TestBed.inject(AuthGuard);
  });

  it('debe crearse', () => {
    expect(guardia).toBeTruthy();
  });

  it('debe permitir acceso si el usuario está autenticado', async () => {
    const resultado = await guardia.canActivate();
    expect(resultado).toBeTrue();
  });

  it('debe redirigir a inicio de sesión si el usuario no está autenticado', async () => {
    servicioUsuarioMock.isAuthenticated.and.returnValue(Promise.resolve(false));
    const resultado = await guardia.canActivate();
    expect(enrutadorMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
