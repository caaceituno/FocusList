import { TestBed } from '@angular/core/testing';
import { Dbservice } from './dbservice';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Storage } from '@ionic/storage-angular';

describe('ServicioBD', () => {
  let servicio: Dbservice;
  let sqliteMock: any;
  let almacenamientoMock: any;

  beforeEach(() => {
    sqliteMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ executeSql: () => Promise.resolve() }))
    };

    almacenamientoMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve())
    };

    TestBed.configureTestingModule({
      providers: [
        Dbservice,
        { provide: SQLite, useValue: sqliteMock },
        { provide: Storage, useValue: almacenamientoMock }
      ]
    });
    servicio = TestBed.inject(Dbservice);
  });

  it('debe crearse', () => {
    expect(servicio).toBeTruthy();
  });
});
