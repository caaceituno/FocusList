import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';

import { Dblocal } from './dblocal';

describe('ServicioBDLocal', () => {
  let servicio: Dblocal;
  let almacenamientoMock: any;
  let notificacionMock: any;

  beforeEach(() => {
    almacenamientoMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
      remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve()),
      ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve())
    };

    notificacionMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() }))
    };

    TestBed.configureTestingModule({
      providers: [
        Dblocal,
        { provide: Storage, useValue: almacenamientoMock },
        { provide: ToastController, useValue: notificacionMock }
      ]
    });
    servicio = TestBed.inject(Dblocal);
  });

  it('debe crearse', () => {
    expect(servicio).toBeTruthy();
  });
});
