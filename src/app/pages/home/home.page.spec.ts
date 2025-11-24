import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HomePage } from './home.page';
import { TareasService } from 'src/app/services/tareas/tareas.service';
import { UsuarioService } from 'src/app/services/registro/usuario.service';
import { Storage } from '@ionic/storage-angular';
import { Dbservice } from 'src/app/services/SQLite/dbservice';
import { BehaviorSubject } from 'rxjs';

describe('PáginaInicio', () => {
  let componente: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let servicioTareasMock: any;
  let servicioUsuarioMock: any;
  let almacenamientoMock: any;
  let servicioDbMock: any;

  beforeEach(async () => {
    servicioTareasMock = {
      guardarTarea: jasmine.createSpy('guardarTarea').and.returnValue(Promise.resolve(true)),
      obtenerTareas: jasmine.createSpy('obtenerTareas').and.returnValue(Promise.resolve([])),
      getTareasObservable: jasmine.createSpy('getTareasObservable').and.returnValue(new BehaviorSubject([]).asObservable())
    };

    servicioUsuarioMock = {
      obtenerUsuario: jasmine.createSpy('obtenerUsuario').and.returnValue(Promise.resolve({ id: 1, nombre: 'Prueba' }))
    };

    almacenamientoMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve())
    };

    servicioDbMock = {
      addTarea: jasmine.createSpy('addTarea').and.returnValue(Promise.resolve(true)),
      cargarTareas: jasmine.createSpy('cargarTareas').and.returnValue(Promise.resolve([]))
    };

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: TareasService, useValue: servicioTareasMock },
        { provide: UsuarioService, useValue: servicioUsuarioMock },
        { provide: Storage, useValue: almacenamientoMock },
        { provide: Dbservice, useValue: servicioDbMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    componente = fixture.componentInstance;
  });

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });

  it('debe llamar a guardarTarea en el servicio y cerrar modal', async () => {
    componente.usuario = { id: 1, nombre: 'Prueba', apellido: '', email: '', contrasena: '' } as any;
    componente.nuevaTarea = { titulo: 'X', fecha: new Date().toISOString() } as any;
    componente.mostrarFormulario = true;

    await componente.guardarTarea();

    expect(servicioTareasMock.guardarTarea).toHaveBeenCalled();
    expect(componente.mostrarFormulario).toBeFalse();
  });
});
