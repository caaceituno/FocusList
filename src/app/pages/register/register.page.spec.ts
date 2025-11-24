import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { IonicModule, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Dbservice } from '../../services/SQLite/dbservice';
import { UsuarioService } from '../../services/registro/usuario.service';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PáginaRegistro', () => {
  let componente: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

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

  const servicioDbMock = {
    addUsuario: jasmine.createSpy('addUsuario').and.returnValue(Promise.resolve(1)),
    cargarUsuarios: jasmine.createSpy('cargarUsuarios').and.returnValue(Promise.resolve([]))
  };

  const servicioUsuarioMock = {
    guardarUsuario: jasmine.createSpy('guardarUsuario').and.returnValue(Promise.resolve(true)),
    mostrarUsuarios: jasmine.createSpy('mostrarUsuarios').and.returnValue(Promise.resolve([]))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Storage, useValue: almacenamientoMock },
        { provide: ToastController, useValue: notificacionMock },
        { provide: Dbservice, useValue: servicioDbMock },
        { provide: UsuarioService, useValue: servicioUsuarioMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(RegisterPage);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
