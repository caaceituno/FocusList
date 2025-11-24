import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule, ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Dbservice } from '../../services/SQLite/dbservice';
import { UsuarioService } from '../../services/registro/usuario.service';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PáginaLogin', () => {
  let componente: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  const almacenamientoMock = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
    get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
    set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
    ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve())
  };

  const notificacionMock = {
    create: jasmine.createSpy('create').and.returnValue(
      Promise.resolve({ present: () => Promise.resolve() })
    )
  };

  const plataformaMock = {
    is: jasmine.createSpy('is').and.returnValue(false)
  };

  const servicioDbMock = {
    cargarUsuarios: jasmine.createSpy('cargarUsuarios').and.returnValue(Promise.resolve([]))
  };

  const servicioUsuarioMock = {
    mostrarUsuarios: jasmine.createSpy('mostrarUsuarios').and.returnValue(Promise.resolve([])),
    setUsuarioActivo: jasmine.createSpy('setUsuarioActivo').and.returnValue(Promise.resolve())
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Storage, useValue: almacenamientoMock },
        { provide: ToastController, useValue: notificacionMock },
        { provide: Platform, useValue: plataformaMock },
        { provide: Dbservice, useValue: servicioDbMock },
        { provide: UsuarioService, useValue: servicioUsuarioMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(LoginPage);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
