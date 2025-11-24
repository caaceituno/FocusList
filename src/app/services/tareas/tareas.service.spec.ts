import { TestBed } from '@angular/core/testing';
import { TareasService } from './tareas.service';
import { Dbservice } from '../SQLite/dbservice';

describe('ServicioTareas', () => {
  let servicio: TareasService;
  let servicioDbMock: any;
  let idUsuario: number = 1;

  beforeEach(async () => {
    servicioDbMock = {
      addTarea: jasmine.createSpy('addTarea').and.returnValue(Promise.resolve(true)),
      cargarTareas: jasmine.createSpy('cargarTareas').and.returnValue(Promise.resolve([])),
      actualizarTarea: jasmine.createSpy('actualizarTarea').and.returnValue(Promise.resolve(true)),
      eliminarTarea: jasmine.createSpy('eliminarTarea').and.returnValue(Promise.resolve(true))
    };

    TestBed.configureTestingModule({
      providers: [
        TareasService,
        { provide: Dbservice, useValue: servicioDbMock }
      ]
    });

    servicio = TestBed.inject(TareasService);
  });

  it('debe crearse', () => {
    expect(servicio).toBeTruthy();
  });

  it('guardarTarea debe guardar en SQLite y notificar', async () => {
    const tarea = {
      id: undefined,
      titulo: 'Tarea Prueba',
      descripcion: 'Descripción',
      importancia: 'media',
      fecha: new Date().toISOString(),
      usuario_id: 1
    };

    servicioDbMock.cargarTareas.and.returnValue(Promise.resolve([{ ...tarea, id: 123 }]));

    const resultado = await servicio.guardarTarea(tarea as any);

    expect(servicioDbMock.addTarea).toHaveBeenCalled();
    expect(servicioDbMock.cargarTareas).toHaveBeenCalledWith(1);
    expect(resultado).toBeTrue();
  });

  it('obtenerTareas carga desde SQLite y notifica', async () => {
    const idUsuario = 1;
    servicioDbMock.cargarTareas.and.returnValue(Promise.resolve([{ id: 6, titulo: 'S', descripcion: '', importancia: '', fecha: '', usuario_id: idUsuario }]));

    const tareas = await servicio.obtenerTareas(idUsuario);
    expect(servicioDbMock.cargarTareas).toHaveBeenCalledWith(idUsuario);
    expect(tareas.length).toBe(1);
    expect(tareas[0].id).toBe(6);
  });

  it('actualizarTarea delega en dbService y notifica', async () => {
    const tarea = { id: 10, titulo: 'Actualizar', descripcion: '', importancia: '', fecha: '', usuario_id: 1 } as any;
    servicioDbMock.cargarTareas.and.returnValue(Promise.resolve([tarea]));

    const resultado = await servicio.actualizarTarea(tarea, idUsuario);
    expect(servicioDbMock.actualizarTarea).toHaveBeenCalledWith(tarea, idUsuario);
    expect(resultado).toBeTrue();
  });

  it('eliminarTarea delega en dbService y notifica', async () => {
    const id = 10;
    const idUsuario = 1;
    servicioDbMock.cargarTareas.and.returnValue(Promise.resolve([]));

    const resultado = await servicio.eliminarTarea(id, idUsuario);
    expect(servicioDbMock.eliminarTarea).toHaveBeenCalledWith(id, idUsuario);
    expect(resultado).toBeTrue();
  });

});