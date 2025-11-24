import { TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario.service';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { Dbservice } from '../SQLite/dbservice';

describe('ServicioUsuario', () => {
  let servicio: UsuarioService;
  let almacenamientoMock: any;
  let notificacionMock: any;
  let servicioDbMock: any;

  beforeEach(() => {
    almacenamientoMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
      remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
    };

    notificacionMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() }))
    };

    servicioDbMock = {
      addUsuario: jasmine.createSpy('addUsuario').and.returnValue(Promise.resolve(1)),
      obtenerUsuarios: jasmine.createSpy('obtenerUsuarios').and.returnValue(Promise.resolve([]))
    };

    TestBed.configureTestingModule({
      providers: [
        UsuarioService,
        { provide: Storage, useValue: almacenamientoMock },
        { provide: ToastController, useValue: notificacionMock },
        { provide: Dbservice, useValue: servicioDbMock }
      ]
    });
    servicio = TestBed.inject(UsuarioService);
  });

  it('debe crearse', () => {
    expect(servicio).toBeTruthy();
  });

  it('debe registrar usuario en la base de datos', async () => {
    const usuario = { id: 1, nombre: 'Prueba', apellido: 'Test', email: 'test@test.com', contrasena: '1234', fotoPerfil: undefined };
    const resultado = await servicio.registrarUsuario(usuario);

    expect(servicioDbMock.addUsuario).toHaveBeenCalledWith('Prueba', 'Test', 'test@test.com', '1234', null);
    expect(resultado).toBe(true);
  });
});
