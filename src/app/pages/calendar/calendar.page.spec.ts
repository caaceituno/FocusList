import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarPage } from './calendar.page';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeriadosService } from '../../services/feriado/feriado.service';
import { ClimaService } from '../../services/clima/clima.service';
import { Dbservice } from '../../services/SQLite/dbservice';
import { TareasService } from '../../services/tareas/tareas.service';
import { UsuarioService } from '../../services/registro/usuario.service';
import { Storage } from '@ionic/storage-angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PáginaCalendario', () => {
  let componente: CalendarPage;
  let fixture: ComponentFixture<CalendarPage>;

  const sqliteMock = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ executeSql: () => Promise.resolve() }))
  };

  const almacenamientoMock = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
    get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
    set: jasmine.createSpy('set').and.returnValue(Promise.resolve())
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        FeriadosService,
        ClimaService,
        Dbservice,
        TareasService,
        UsuarioService,
        { provide: SQLite, useValue: sqliteMock },
        { provide: Storage, useValue: almacenamientoMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(CalendarPage);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(componente).toBeTruthy();
  });
});
