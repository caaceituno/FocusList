import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TareasPage } from './tareas.page';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { TareasService } from '../../services/tareas/tareas.service';
import { Dbservice } from '../../services/SQLite/dbservice';
import { BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PáginaTareas', () => {
  let componente: TareasPage;
  let fixture: ComponentFixture<TareasPage>;

  const almacenamientoMock = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
    get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
    set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
    ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve())
  };

  const servicioTareasMock = {
    obtenerTareas: jasmine.createSpy('obtenerTareas').and.returnValue(Promise.resolve([])),
    guardarTarea: jasmine.createSpy('guardarTarea').and.returnValue(Promise.resolve(true)),
    eliminarTarea: jasmine.createSpy('eliminarTarea').and.returnValue(Promise.resolve(true)),
    getTareasObservable: jasmine.createSpy('getTareasObservable').and.returnValue(new BehaviorSubject([]).asObservable())
  };

  const servicioDbMock = {
    cargarTareas: jasmine.createSpy('cargarTareas').and.returnValue(Promise.resolve([]))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TareasPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Storage, useValue: almacenamientoMock },
        { provide: TareasService, useValue: servicioTareasMock },
        { provide: Dbservice, useValue: servicioDbMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(TareasPage);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
