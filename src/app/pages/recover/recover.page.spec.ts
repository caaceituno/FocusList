import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RecoverPage } from './recover.page';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from '../../services/registro/usuario.service';
import { Dbservice } from '../../services/SQLite/dbservice';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PáginaRecuperación', () => {
  let componente: RecoverPage;
  let fixture: ComponentFixture<RecoverPage>;
  let almacenamientoMock: any;
  let toastMock: any;
  let servicioUsuarioMock: any;
  let servicioDbMock: any;

  beforeEach(async () => {
    almacenamientoMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve())
    };

    toastMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() }))
    };

    servicioUsuarioMock = {
      recuperarContraseña: jasmine.createSpy('recuperarContraseña').and.returnValue(Promise.resolve(true))
    };

    servicioDbMock = {
      obtenerUsuario: jasmine.createSpy('obtenerUsuario').and.returnValue(Promise.resolve(null))
    };

    await TestBed.configureTestingModule({
      declarations: [RecoverPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Storage, useValue: almacenamientoMock },
        { provide: ToastController, useValue: toastMock },
        { provide: UsuarioService, useValue: servicioUsuarioMock },
        { provide: Dbservice, useValue: servicioDbMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPage);
    componente = fixture.componentInstance;
  });

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
