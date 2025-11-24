import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TareasComponent } from './tareas.component';
import { TareasService } from '../../services/tareas/tareas.service';
import { Dbservice } from '../../services/SQLite/dbservice';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

describe('ComponenteTareas', () => {
  let componente: TareasComponent;
  let fixture: ComponentFixture<TareasComponent>;
  let servicioTareasMock: any;
  let servicioDbMock: any;
  let almacenamientoMock: any;

  beforeEach(waitForAsync(() => {
    servicioTareasMock = {
      getTareasObservable: jasmine.createSpy('getTareasObservable').and.returnValue(new BehaviorSubject([]).asObservable()),
      eliminarTarea: jasmine.createSpy('eliminarTarea').and.returnValue(Promise.resolve(true))
    };

    servicioDbMock = {
      eliminarTarea: jasmine.createSpy('eliminarTarea').and.returnValue(Promise.resolve(true))
    };

    almacenamientoMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
      remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      declarations: [ TareasComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: TareasService, useValue: servicioTareasMock },
        { provide: Dbservice, useValue: servicioDbMock },
        { provide: Storage, useValue: almacenamientoMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TareasComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
